'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, Upload, Loader2 } from 'lucide-react';
import { strapi } from '@/lib/strapi';
import { useRouter } from 'next/navigation';

const variantSchema = z.object({
  variantName: z.string().min(1, 'Variant name is required'),
  extraPrice: z.number().min(0).default(0),
  stock: z.number().int().min(0).default(0),
});

const productSchema = z.object({
  productName: z.string().min(1, 'Product name is required').max(100),
  description: z.string().optional(),
  basePrice: z.number().min(0, 'Base price must be at least 0'),
  variants: z.array(variantSchema).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: any;
  productId?: string;
}

export default function ProductForm({ initialData, productId }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image?.url || '');
  const router = useRouter();

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

  const onSubmit = async (data: ProductFormValues) => {
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
      const payload = {
        data: {
          ...data,
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
      alert('Failed to save product. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-4">
          {productId ? 'Edit Product' : 'Create New Product'}
        </h2>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Product Name</label>
            <input
              {...register('productName')}
              className={`shopee-input ${errors.productName ? 'border-red-500' : ''}`}
              placeholder="Enter product name"
            />
            {errors.productName && <p className="text-red-500 text-xs">{errors.productName.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Base Price (₫)</label>
            <input
              type="number"
              {...register('basePrice', { valueAsNumber: true })}
              className={`shopee-input ${errors.basePrice ? 'border-red-500' : ''}`}
              placeholder="0"
            />
            {errors.basePrice && <p className="text-red-500 text-xs">{errors.basePrice.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register('description')}
            rows={4}
            className="shopee-input"
            placeholder="Describe your product..."
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Product Image</label>
          <div className="flex items-center gap-4">
            <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Upload className="w-8 h-8 text-gray-400" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <p className="text-xs text-gray-500">
              Accepted formats: JPG, PNG, WEBP. Max size: 2MB.
            </p>
          </div>
        </div>

        {/* Variants */}
        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-800">Variants</h3>
            <button
              type="button"
              onClick={() => append({ variantName: '', extraPrice: 0, stock: 0 })}
              className="flex items-center gap-2 text-sm text-shopee-primary hover:text-shopee-secondary font-medium"
            >
              <Plus size={16} /> Add Variant
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-gray-50 p-4 rounded-md border border-gray-100">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">Name</label>
                  <input
                    {...register(`variants.${index}.variantName` as const)}
                    className="shopee-input text-sm"
                    placeholder="e.g. Red, XL"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">Extra Price (₫)</label>
                  <input
                    type="number"
                    {...register(`variants.${index}.extraPrice` as const, { valueAsNumber: true })}
                    className="shopee-input text-sm"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">Stock</label>
                  <input
                    type="number"
                    {...register(`variants.${index}.stock` as const, { valueAsNumber: true })}
                    className="shopee-input text-sm"
                    placeholder="0"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-gray-400 hover:text-red-500 self-center"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="shopee-button px-10 flex items-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          {productId ? 'Update Product' : 'Publish Product'}
        </button>
      </div>
    </form>
  );
}
