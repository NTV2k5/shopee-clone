import Link from 'next/link';
import { Plus, ShoppingBag } from 'lucide-react';
import { strapi, getImageUrl } from '@/lib/strapi';

async function getProducts() {
  try {
    const res = await strapi.get('/products?populate=*');
    return res.data.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-shopee-primary text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
            <ShoppingBag /> Shopee Clone
          </Link>
          <Link 
            href="/products/create" 
            className="bg-white text-shopee-primary px-4 py-2 rounded font-medium flex items-center gap-2 hover:bg-orange-50 transition"
          >
            <Plus size={20} /> Seller Centre
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-xl font-medium text-gray-800 mb-6 flex items-center gap-2">
          GỢI Ý HÔM NAY
        </h1>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <div className="text-gray-400 mb-4 flex justify-center">
              <ShoppingBag size={64} />
            </div>
            <p className="text-gray-600">No products found. Start by adding one!</p>
            <Link href="/products/create" className="text-shopee-primary hover:underline mt-2 inline-block">
              Add your first product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {products.map((product: any) => {
              const attrs = product.attributes;
              const imageUrl = getImageUrl(attrs.image?.data?.attributes?.url);
              
              return (
                <Link 
                  key={product.id} 
                  href={`/products/${attrs.slug}`}
                  className="shopee-card block bg-white"
                >
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={attrs.productName} 
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
                      {attrs.productName}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-shopee-primary text-base font-medium">
                        ₫{attrs.basePrice.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-400">Đã bán 0</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
