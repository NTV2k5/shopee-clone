'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { getImageUrl } from '@/lib/strapi';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface HomeClientProps {
  products: any[];
  searchQuery?: string;
}

export default function HomeClient({ products, searchQuery }: HomeClientProps) {
  const { t, i18n } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* H1 important for SEO - only one H1 tag per page */}
      <h1 className="text-xl font-medium text-gray-800 mb-6 flex items-center gap-2 uppercase tracking-tight">
        {searchQuery
          ? t('home.searchResult', { query: searchQuery })
          : t('home.todaySuggestions')}
      </h1>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
          <div className="text-gray-400 mb-4 flex justify-center">
            <ShoppingBag size={64} />
          </div>
          <p className="text-gray-600">{t('home.noProducts')}</p>
          <Link href="/products/create" className="text-shopee-primary hover:underline mt-2 inline-block">
            {t('home.addFirstProduct')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {products.map((product: any) => {
            const imageUrl = getImageUrl(product.image?.url);
            const productLink = i18n.language === 'vi' ? `/san-pham/${product.slug}` : `/products/${product.slug}`;
            
            return (
              <Link 
                key={product.id} 
                href={productLink}
                className="shopee-card block bg-white"
              >
                <div className="aspect-square relative overflow-hidden bg-gray-100">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={product.productName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ShoppingBag size={48} />
                    </div>
                  )}
                </div>
                <div className="p-2 space-y-1">
                  <h3 className="text-sm text-gray-800 line-clamp-2 h-10">
                    {product.productName}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-shopee-primary text-base font-medium">
                      ₫{product.basePrice.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-400">{t('home.soldCount')}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
