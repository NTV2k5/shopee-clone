'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, Upload, Loader2 } from 'lucide-react';
import { strapi } from '@/lib/strapi';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface VariantValues {
  variantName: string;
  extraPrice: number;
  stock: number;
}

interface ProductFormValues {
  productName: string;
  description?: string;
  basePrice: number;
  variants?: VariantValues[];
}

interface ProductFormProps {
  initialData?: any;
  productId?: string;
}

export default function ProductForm({ initialData, productId }: ProductFormProps) {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image?.url || '');
  const router = useRouter();

  const variantSchema = useMemo(() => z.object({
    variantName: z.string().min(1, t('productForm.variantNameRequired')),
    extraPrice: z.number().min(0).default(0),
    stock: z.number().int().min(0).default(0),
  }), [t]);

  const productSchema = useMemo(() => z.object({
    productName: z.string().min(1, t('productForm.productNameRequired')).max(100),
    description: z.string().optional(),
    basePrice: z.number().min(0, t('productForm.basePriceRequired')),
    variants: z.array(variantSchema).optional(),
  }), [t, variantSchema]);

  useEffect(() => {
    const user = auth.getUser();
    
    const isSeller = (u?: any) => {
      if (!u) return false;
      const role = u.role;
      const roleName = (typeof role === 'object' ? role?.name : '')?.toLowerCase()?.trim() || '';
      const roleType = (typeof role === 'object' ? role?.type : role)?.toString()?.toLowerCase()?.trim() || '';
      const username = u.username?.toLowerCase()?.trim() || '';
      
      return roleName === 'seller' || 
             roleType === 'seller' || 
             roleName === 'manager' || 
             roleType === 'manager' ||
             roleName === 'admin' ||
             roleType === 'admin' ||
             username === 'admin';
    };

    if (!user) {
      const callbackPath = i18n.language === 'vi' ? '/san-pham/create' : '/products/create';
      router.push(`/login?callback=${callbackPath}`);
    } else if (!isSeller(user)) {
      alert(t('productForm.alertSellerAccess'));
      router.push('/');
    }
  }, [router, i18n.language, t]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      productName: '',
      description: '',
      basePrice: 0,
      variants: [{ variantName: '', extraPrice: 0, stock: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onRemoveImage = () => {
    setImage(null);
    setImagePreview(initialData?.image?.url || '');
    // Reset file input if needed
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const onSubmit = async (data: ProductFormValues) => {
    console.log('Form Submitted Data:', data);
    setLoading(true);
    try {
      let imageId = initialData?.image?.id;

      // 1. Upload image if changed
      if (image) {
        const formData = new FormData();
        formData.append('files', image);
        const uploadRes = await strapi.post('/upload', formData);
        imageId = uploadRes.data[0].id;
      }

      // 2. Create/Update product
      const slug = data.productName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/([^0-9a-z-\s])/g, '')
        .replace(/(\s+)/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

      const payload = {
        data: {
          ...data,
          slug: slug,
          image: imageId,
        },
      };

      if (productId) {
        await strapi.put(`/products/${productId}`, payload);
      } else {
        await strapi.post('/products', payload);
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error saving product:', error);
      alert(t('productForm.alertSaveFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-4">
          {productId ? t('productForm.editTitle') : t('productForm.createTitle')}
        </h2>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t('productForm.productNameLabel')}</label>
            <input
              {...register('productName')}
              className={`shopee-input ${errors.productName ? 'border-red-500' : ''}`}
              placeholder={t('productForm.productNamePlaceholder')}
            />
            {errors.productName && <p className="text-red-500 text-xs">{errors.productName.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t('productForm.basePriceLabel')}</label>
            <input
              type="number"
              {...register('basePrice', { valueAsNumber: true })}
              className={`shopee-input ${errors.basePrice ? 'border-red-500' : ''}`}
              placeholder={t('productForm.basePricePlaceholder')}
            />
            {errors.basePrice && <p className="text-red-500 text-xs">{errors.basePrice.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">{t('productForm.descriptionLabel')}</label>
          <textarea
            {...register('description')}
            rows={4}
            className="shopee-input"
            placeholder={t('productForm.descriptionPlaceholder')}
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">{t('productForm.productImageLabel')}</label>
          <div className="flex items-center gap-4">
            <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 group">
              {imagePreview ? (
                <div className="relative w-full h-full">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemoveImage();
                      }}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg z-50 cursor-pointer"
                      title={i18n.language === 'vi' ? 'Xóa ảnh' : 'Remove image'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400" />
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {t('productForm.imageHelpText')}
            </p>
          </div>
        </div>

        {/* Variants */}
        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-800">{t('productForm.variantsTitle')}</h3>
            <button
              type="button"
              onClick={() => append({ variantName: '', extraPrice: 0, stock: 0 })}
              className="flex items-center gap-2 text-sm text-shopee-primary hover:text-shopee-secondary font-medium"
            >
              <Plus size={16} /> {t('productForm.addVariantButton')}
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-gray-50 p-4 rounded-md border border-gray-100">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">{t('productForm.variantNameLabel')}</label>
                  <input
                    {...register(`variants.${index}.variantName` as const)}
                    className="shopee-input text-sm"
                    placeholder={t('productForm.variantNamePlaceholder')}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">{t('productForm.variantPriceLabel')}</label>
                  <input
                    type="number"
                    {...register(`variants.${index}.extraPrice` as const, { valueAsNumber: true })}
                    className="shopee-input text-sm"
                    placeholder={t('productForm.variantPricePlaceholder')}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">{t('productForm.variantStockLabel')}</label>
                  <input
                    type="number"
                    {...register(`variants.${index}.stock` as const, { valueAsNumber: true })}
                    className="shopee-input text-sm"
                    placeholder={t('productForm.variantStockPlaceholder')}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={fields.length <= 1}
                  className="p-2 text-gray-400 hover:text-red-500 self-center disabled:opacity-30 disabled:cursor-not-allowed"
                  title={fields.length <= 1 ? t('productForm.cantDeleteLastVariant') : t('productForm.deleteVariantTitle')}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Realtime Summary */}
          <VariantSummary control={control} />
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition"
        >
          {t('productForm.cancelButton')}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="shopee-button px-10 flex items-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          {productId ? t('productForm.submitUpdate') : t('productForm.submitCreate')}
        </button>
      </div>
    </form>
  );
}
function VariantSummary({ control }: { control: any }) {
  const { t } = useTranslation();
  const variants = useWatch({
    control,
    name: "variants",
  });

  const totalVariants = variants?.length || 0;
  const totalStock = variants?.reduce((acc: number, curr: any) => acc + (Number(curr?.stock) || 0), 0) || 0;

  return (
    <div className="flex gap-6 p-4 bg-orange-50 border border-orange-100 rounded-md text-sm">
      <div className="flex items-center gap-2">
        <span className="text-gray-500 text-xs uppercase font-semibold">{t('productForm.totalVariantsLabel')}</span>
        <span className="text-shopee-primary font-bold text-base">{totalVariants}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-500 text-xs uppercase font-semibold">{t('productForm.totalStockLabel')}</span>
        <span className="text-shopee-primary font-bold text-base">{totalStock.toLocaleString()}</span>
      </div>
    </div>
  );
}
