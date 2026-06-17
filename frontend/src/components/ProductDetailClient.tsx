'use client';

import React, { useState } from 'react';
import { ShoppingCart, Star, ShieldCheck, X, Maximize2 } from 'lucide-react';
import { getImageUrl } from '@/lib/strapi';
import { useCartStore } from '@/lib/store';
import { auth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface ProductDetailProps {
  product: any;
}

export default function ProductDetailClient({ product }: ProductDetailProps) {
  const { t } = useTranslation();
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const imageUrl = getImageUrl(product.image?.url);
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const handleAddToCart = () => {
    if (!auth.getToken()) {
      router.push('/login');
      return;
    }
    const variant = selectedVariant !== null ? product.variants[selectedVariant] : null;
    addItem(product, variant, quantity);
    alert(t('product.addedToCart'));
  };

  const handleBuyNow = () => {
    if (!auth.getToken()) {
      router.push('/login');
      return;
    }
    const variant = selectedVariant !== null ? product.variants[selectedVariant] : null;
    addItem(product, variant, quantity);
    router.push('/cart');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="bg-white rounded-sm shadow-sm flex flex-col md:flex-row p-4 gap-8">
        {/* Left: Images */}
        <div className="w-full md:w-[450px] space-y-4">
          <div 
            className="aspect-square relative overflow-hidden bg-gray-50 border cursor-zoom-in group"
            onClick={() => setIsLightboxOpen(true)}
          >
            {imageUrl ? (
              <>
                <img 
                  src={imageUrl} 
                  alt={product.productName} 
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-4 right-4 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition">
                  <Maximize2 size={20} />
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-200">
                <Star size={120} />
              </div>
            )}
          </div>
          <div className="flex gap-2">
             {[1,2,3,4,5].map(i => (
                <div key={i} className="w-20 h-20 border hover:border-shopee-primary cursor-pointer transition">
                   <img src={imageUrl} alt="" className="w-full h-full object-cover opacity-60 hover:opacity-100" />
                </div>
             ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex-1 space-y-6">
          <h1 className="text-xl font-medium text-gray-800 leading-relaxed">
            <span className="bg-shopee-primary text-white text-[10px] px-1 py-0.5 rounded-sm mr-2 align-middle">Mall</span>
            {product.productName}
          </h1>

          <div className="flex items-center gap-4 text-sm divide-x divide-gray-200">
            <div className="flex items-center gap-1 text-shopee-primary pr-4">
              <span className="underline font-medium">5.0</span>
              <div className="flex">
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
              </div>
            </div>
            <div className="px-4">
              <span className="underline font-medium">12.4k</span> <span className="text-gray-500">{t('product.reviews')}</span>
            </div>
            <div className="pl-4">
              <span className="font-medium">45.2k</span> <span className="text-gray-500">{t('product.sold')}</span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-sm flex items-center gap-4">
              {(() => {
                const currentVariant = selectedVariant !== null ? product.variants[selectedVariant] : null;
                const unitPrice = product.basePrice + (currentVariant?.extraPrice || 0);
                const currentPrice = unitPrice * quantity;
                const oldPrice = currentPrice * 1.2; // just for display

                return (
                  <>
                    <div className="text-gray-400 line-through text-sm">₫{oldPrice.toLocaleString()}</div>
                    <div className="text-3xl font-medium text-shopee-primary">
                      ₫{currentPrice.toLocaleString()}
                    </div>
                    <div className="bg-shopee-primary text-white text-[10px] font-bold px-1 rounded-sm uppercase">{t('product.discount')}</div>
                  </>
                );
              })()}
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-gray-500 w-24 pt-1 text-sm">{t('product.variant')}</span>
                <div className="flex-1 flex flex-wrap gap-2">
                  {product.variants.map((v: any, i: number) => {
                    const isOutOfStock = v.stock === 0;
                    const isSelected = selectedVariant === i;

                    return (
                      <button 
                        key={i}
                        onClick={() => !isOutOfStock && setSelectedVariant(i)}
                        disabled={isOutOfStock}
                        className={`relative px-4 py-1.5 border rounded-sm text-sm transition overflow-hidden ${
                          isSelected 
                          ? 'border-shopee-primary text-shopee-primary bg-white' 
                          : isOutOfStock
                            ? 'border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed opacity-60'
                            : 'border-gray-200 hover:border-shopee-primary hover:text-shopee-primary bg-white'
                        }`}
                      >
                        {v.variantName}
                        {isOutOfStock && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-[1px] bg-gray-300 rotate-[-15deg] absolute"></div>
                          </div>
                        )}
                        {isSelected && !isOutOfStock && (
                           <div className="absolute bottom-0 right-0 w-3 h-3 bg-shopee-primary">
                             <div className="absolute right-0 bottom-0 text-white" style={{ fontSize: '8px', transform: 'translate(-2px, -2px)' }}>✓</div>
                           </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 pt-4">
            <span className="text-gray-500 w-24 text-sm">{t('product.quantity')}</span>
            <div className="flex items-center">
               {(() => {
                 const maxStock = product.variants && product.variants.length > 0
                   ? (selectedVariant !== null ? (product.variants[selectedVariant]?.stock || 0) : 0)
                   : 9999;
                 
                 const handleSetQuantity = (val: number) => {
                   let q = Math.max(1, val);
                   if (maxStock > 0 && q > maxStock) q = maxStock;
                   setQuantity(q);
                 };

                 return (
                   <>
                     <button 
                       onClick={() => handleSetQuantity(quantity - 1)}
                       className="w-10 h-8 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors rounded-l-sm disabled:opacity-30 disabled:cursor-not-allowed"
                       disabled={quantity <= 1 || (product.variants?.length > 0 && selectedVariant === null)}
                     >-</button>
                     <input 
                       type="number" 
                       value={quantity} 
                       onChange={(e) => handleSetQuantity(parseInt(e.target.value) || 1)}
                       disabled={product.variants?.length > 0 && selectedVariant === null}
                       className="w-14 h-8 border-t border-b border-gray-200 text-center outline-none text-sm font-medium disabled:opacity-50" 
                     />
                     <button 
                       onClick={() => handleSetQuantity(quantity + 1)}
                       className="w-10 h-8 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors rounded-r-sm disabled:opacity-30 disabled:cursor-not-allowed"
                       disabled={quantity >= maxStock || (product.variants?.length > 0 && selectedVariant === null)}
                     >+</button>
                   </>
                 );
               })()}
            </div>
            <span className="text-xs text-gray-500 pl-4">
              {product.variants && product.variants.length > 0
                ? selectedVariant !== null 
                  ? t('product.available', { count: product.variants[selectedVariant]?.stock || 0 })
                  : t('product.selectVariant')
                : t('product.productAvailable')}
            </span>
          </div>

          <div className="flex gap-4 pt-6">
            <button 
              onClick={handleAddToCart}
              disabled={product.variants?.length > 0 && selectedVariant === null}
              className="flex-1 h-12 border border-shopee-primary text-shopee-primary bg-orange-50 hover:bg-orange-100 flex items-center justify-center gap-2 rounded-sm transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={20} /> {t('product.addToCart')}
            </button>
            <button 
              onClick={handleBuyNow}
              disabled={product.variants?.length > 0 && selectedVariant === null}
              className="flex-1 h-12 bg-shopee-primary text-white hover:bg-shopee-secondary flex items-center justify-center rounded-sm transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('product.buyNow')}
            </button>
          </div>

          <div className="pt-6 border-t flex items-center gap-8 text-sm text-gray-600">
             <div className="flex items-center gap-2">
               <ShieldCheck className="text-shopee-primary" size={18} />
               {t('product.guarantee')}
             </div>
             <span>{t('product.returnPolicy')}</span>
             <span>{t('product.genuine')}</span>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-6 bg-white p-6 rounded-sm shadow-sm space-y-6">
         <h2 className="bg-gray-50 p-4 text-sm font-medium text-gray-800 -mx-6 -mt-6 rounded-t-sm uppercase tracking-wider">
           {t('product.productDetails')}
         </h2>
         <div className="space-y-4 text-sm leading-loose whitespace-pre-wrap text-gray-700">
           {product.description || t('product.noDescription')}
         </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-shopee-primary transition"
          >
            <X size={32} />
          </button>
          <div className="max-w-4xl max-h-full">
            <img 
              src={imageUrl} 
              alt={product.productName} 
              className="w-full h-full object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
