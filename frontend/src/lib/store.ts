import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { strapi } from './strapi';
import { auth } from './auth';

export interface CartItem {
  id: string; // unique ID for the cart item (usually productId + variantId)
  product: any; // full product data
  variant: any | null; // selected variant data
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: any, variant: any | null, quantity: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  fetchFromDB: () => Promise<void>;
  syncToDB: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, variant, quantity) => {
        set((state) => {
          const uniqueId = variant ? `${product.documentId || product.id}-${variant.variantName}` : `${product.documentId || product.id}`;
          const existingItemIndex = state.items.findIndex(item => item.id === uniqueId);
          
          let updatedItems;
          if (existingItemIndex >= 0) {
            updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += quantity;
          } else {
            updatedItems = [...state.items, { id: uniqueId, product, variant, quantity }];
          }
          return { items: updatedItems };
        });
        get().syncToDB();
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
        get().syncToDB();
      },
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
        get().syncToDB();
      },
      clearCart: () => {
        set({ items: [] });
        get().syncToDB();
      },
      fetchFromDB: async () => {
        const token = auth.getToken();
        if (!token) return;
        try {
          const res = await strapi.get('/cart-items/my', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const dbItems = res.data.data || [];
          
          // Map DB items to Local State format
          const mappedItems: CartItem[] = dbItems.map((dbItem: any) => {
             const product = dbItem.product;
             let variant = null;
             if (dbItem.variantName && product.variants) {
               variant = product.variants.find((v: any) => v.variantName === dbItem.variantName);
             }
             const uniqueId = variant ? `${product.documentId || product.id}-${variant.variantName}` : `${product.documentId || product.id}`;
             return {
               id: uniqueId,
               product,
               variant,
               quantity: dbItem.quantity
             };
          });
          set({ items: mappedItems });
        } catch (err) {
          console.error("Failed to fetch cart from DB:", err);
        }
      },
      syncToDB: async () => {
        const token = auth.getToken();
        if (!token) return; // Only sync if logged in
        
        const items = get().items;
        const payload = items.map(item => ({
          product: item.product.documentId || item.product.id,
          variantName: item.variant?.variantName || null,
          quantity: item.quantity
        }));

        try {
          await strapi.post('/cart-items/sync', { items: payload }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (err) {
          console.error("Failed to sync cart to DB:", err);
        }
      }
    }),
    {
      name: 'shopee-cart-storage',
    }
  )
);
