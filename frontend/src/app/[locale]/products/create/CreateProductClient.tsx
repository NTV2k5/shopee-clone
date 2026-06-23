'use client';

import ProductForm from '@/components/ProductForm';
import { Link } from '@/i18n/navigation';
import { ChevronLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function CreateProductClient() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1 text-gray-600 hover:text-shopee-primary transition"
        >
          <ChevronLeft size={20} /> {t('productForm.backToMall')}
        </Link>
      </div>
      <ProductForm />
    </div>
  );
}
