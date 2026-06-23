'use client';

import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store';
import { getImageUrl } from '@/lib/strapi';
import { Link, useRouter } from '@/i18n/navigation';
import { Trash2, Store, ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';
export default function CartClient() {
  const t = useTranslations();
  const { items, updateQuantity, removeItem } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Selected items state for checkout
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="p-8 text-center text-gray-500">{t('cart.loading')}</div>;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(items.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    }
  };

  // Calculate totals for selected items only
  const selectedCartItems = items.filter(item => selectedItems.includes(item.id));
  
  const totalPrice = selectedCartItems.reduce((sum, item) => {
    const price = item.product.basePrice + (item.variant?.extraPrice || 0);
    return sum + (price * item.quantity);
  }, 0);

  const totalQuantity = selectedCartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center bg-white mt-6 rounded-sm shadow-sm min-h-[50vh]">
        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
           <ShoppingCart className="text-gray-300 w-16 h-16" />
        </div>
        <p className="text-gray-500 font-medium mb-6">{t('cart.emptyCart')}</p>
        <Link href="/" className="bg-shopee-primary text-white px-8 py-2.5 rounded-sm hover:bg-shopee-secondary transition font-medium">
          {t('cart.shopNow')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
      {/* Table Header */}
      <div className="bg-white p-4 rounded-sm shadow-sm flex items-center text-sm text-gray-500 font-medium text-center">
        <div className="w-10">
           <input 
             type="checkbox" 
             className="w-4 h-4 cursor-pointer accent-shopee-primary"
             checked={selectedItems.length === items.length && items.length > 0}
             onChange={handleSelectAll}
           />
        </div>
        <div className="flex-1 text-left px-4">{t('cart.product')}</div>
        <div className="w-32">{t('cart.unitPrice')}</div>
        <div className="w-32">{t('cart.quantity')}</div>
        <div className="w-32">{t('cart.amount')}</div>
        <div className="w-20">{t('cart.action')}</div>
      </div>

      {/* Cart Items */}
      <div className="bg-white rounded-sm shadow-sm p-4">
         {/* Simulated Shop Header */}
         <div className="flex items-center gap-2 pb-4 border-b text-sm font-medium">
            <Store size={16} /> Shopee Mall
         </div>

         {items.map((item) => {
           const unitPrice = item.product.basePrice + (item.variant?.extraPrice || 0);
           const maxStock = item.variant ? item.variant.stock : 9999;

           const handleQuantityChange = (newQ: number) => {
             if (newQ < 1) newQ = 1;
             if (maxStock > 0 && newQ > maxStock) newQ = maxStock;
             updateQuantity(item.id, newQ);
           };

           return (
             <div key={item.id} className="flex items-center py-4 border-b border-gray-100 last:border-0 text-sm">
                <div className="w-10 flex justify-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 cursor-pointer accent-shopee-primary"
                    checked={selectedItems.includes(item.id)}
                    onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                  />
                </div>
                
                <div className="flex-1 px-4 flex gap-4">
                  <img 
                    src={getImageUrl(item.product.image?.url) || '/placeholder.png'} 
                    alt={item.product.productName} 
                    className="w-20 h-20 object-cover border"
                  />
                  <div className="flex flex-col justify-between">
                    <Link 
                      href={{
                        pathname: '/products/[slug]',
                        params: { slug: item.product.slug }
                      }}
                      className="text-gray-800 font-medium hover:text-shopee-primary line-clamp-2"
                    >
                      {item.product.productName}
                    </Link>
                    {item.variant && (
                      <span className="text-gray-500 text-xs">
                        {t('cart.variant')}: {item.variant.variantName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-32 text-center text-gray-600">
                   ₫{unitPrice.toLocaleString()}
                </div>

                <div className="w-32 flex justify-center">
                   <div className="flex items-center border border-gray-200 rounded-sm">
                     <button 
                       onClick={() => handleQuantityChange(item.quantity - 1)}
                       className="w-8 h-8 text-gray-500 hover:bg-gray-50 transition border-r border-gray-200 disabled:opacity-30"
                       disabled={item.quantity <= 1}
                     >-</button>
                     <input 
                       type="number" 
                       value={item.quantity} 
                       onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                       className="w-12 h-8 text-center text-sm outline-none"
                     />
                     <button 
                       onClick={() => handleQuantityChange(item.quantity + 1)}
                       className="w-8 h-8 text-gray-500 hover:bg-gray-50 transition border-l border-gray-200 disabled:opacity-30"
                       disabled={item.quantity >= maxStock}
                     >+</button>
                   </div>
                </div>

                <div className="w-32 text-center text-shopee-primary font-medium">
                   ₫{(unitPrice * item.quantity).toLocaleString()}
                </div>

                <div className="w-20 text-center">
                   <button 
                     onClick={() => removeItem(item.id)}
                     className="text-gray-500 hover:text-shopee-primary transition"
                     title={t('cart.delete')}
                   >
                     <Trash2 size={18} className="mx-auto" />
                   </button>
                </div>
             </div>
           );
         })}
      </div>

      {/* Checkout Footer */}
      <div className="sticky bottom-0 bg-white p-4 rounded-sm shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex items-center justify-between text-sm mt-4 z-10 border-t border-gray-100">
         <div className="flex items-center gap-4">
           <label className="flex items-center gap-2 cursor-pointer text-gray-600">
             <input 
               type="checkbox" 
               className="w-4 h-4 accent-shopee-primary"
               checked={selectedItems.length === items.length && items.length > 0}
               onChange={handleSelectAll}
             />
             {t('cart.selectAll')} ({items.length})
           </label>
           <button 
             onClick={() => {
               if (confirm(t('cart.confirmDelete'))) {
                 selectedItems.forEach(id => removeItem(id));
                 setSelectedItems([]);
               }
             }}
             className="text-gray-600 hover:text-shopee-primary transition disabled:opacity-50"
             disabled={selectedItems.length === 0}
           >
             {t('cart.delete')}
           </button>
         </div>

         <div className="flex items-center gap-6">
           <div className="text-right">
             <span className="text-gray-600 mr-2">
               {t('cart.totalPayment')} ({totalQuantity} {t('cart.items')}):
             </span>
             <span className="text-2xl text-shopee-primary font-medium">
               ₫{totalPrice.toLocaleString()}
             </span>
           </div>
           <button 
             onClick={() => {
               if (selectedItems.length === 0) {
                 alert(t('cart.selectProductToBuy'));
                 return;
               }
               // Proceed to checkout
               const queryParams = new URLSearchParams();
               queryParams.set('items', selectedItems.join(','));
               router.push(`/checkout?${queryParams.toString()}` as any);
             }}
             className={`w-52 h-10 flex items-center justify-center text-white font-medium rounded-sm transition ${
               selectedItems.length > 0 
                 ? 'bg-shopee-primary hover:opacity-90 cursor-pointer' 
                 : 'bg-gray-300 cursor-not-allowed'
             }`}
           >
             {t('cart.buy')}
           </button>
         </div>
      </div>
    </div>
  );
}
