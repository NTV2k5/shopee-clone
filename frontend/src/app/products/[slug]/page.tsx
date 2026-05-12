import { strapi, getImageUrl } from '@/lib/strapi';
import Link from 'next/link';
import { ShoppingCart, Star, Share2, Heart, ShieldCheck, ChevronLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

async function getProductBySlug(slug: string) {
  try {
    const res = await strapi.get(`/products?filters[slug][$eq]=${slug}&populate=*`);
    return res.data.data[0];
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const attrs = product.attributes;
  const imageUrl = getImageUrl(attrs.image?.data?.attributes?.url);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Mini Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-gray-600 flex items-center gap-1 hover:text-shopee-primary">
            <ChevronLeft size={20} /> Quay lại
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <span className="cursor-pointer hover:text-shopee-primary">Chia sẻ</span>
            <span className="cursor-pointer hover:text-shopee-primary flex items-center gap-1">
              <Heart size={16} /> Thích (0)
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-sm shadow-sm flex flex-col md:flex-row p-4 gap-8">
          {/* Left: Images */}
          <div className="w-full md:w-[450px] space-y-4">
            <div className="aspect-square relative overflow-hidden bg-gray-50 border">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={attrs.productName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-200">
                  <Star size={120} />
                </div>
              )}
            </div>
            <div className="flex gap-2">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className="w-20 h-20 border hover:border-shopee-primary cursor-pointer opacity-50 hover:opacity-100">
                    <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                 </div>
               ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex-1 space-y-6">
            <h1 className="text-xl font-medium text-gray-800 leading-relaxed">
              <span className="bg-shopee-primary text-white text-[10px] px-1 py-0.5 rounded-sm mr-2 align-middle">Mall</span>
              {attrs.productName}
            </h1>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-shopee-primary border-r pr-4">
                <span className="underline font-medium">5.0</span>
                <div className="flex">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                </div>
              </div>
              <div className="border-r pr-4">
                <span className="underline">0</span> <span className="text-gray-500">Đánh giá</span>
              </div>
              <div>
                <span>0</span> <span className="text-gray-500">Đã bán</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-sm">
               <div className="text-3xl font-medium text-shopee-primary">
                 ₫{attrs.basePrice.toLocaleString()}
               </div>
            </div>

            {/* Variants */}
            {attrs.variants && attrs.variants.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-gray-500 w-24 pt-1">Phân loại</span>
                  <div className="flex-1 flex flex-wrap gap-2">
                    {attrs.variants.map((v: any, i: number) => (
                      <button 
                        key={i}
                        className="px-4 py-1.5 border hover:border-shopee-primary hover:text-shopee-primary rounded-sm text-sm bg-white transition"
                      >
                        {v.variantName}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 pt-4">
              <span className="text-gray-500 w-24">Số lượng</span>
              <div className="flex items-center">
                 <button className="w-8 h-8 border flex items-center justify-center text-gray-600 hover:bg-gray-50">-</button>
                 <input type="number" defaultValue={1} className="w-12 h-8 border-t border-b text-center outline-none" />
                 <button className="w-8 h-8 border flex items-center justify-center text-gray-600 hover:bg-gray-50">+</button>
              </div>
              <span className="text-sm text-gray-500">Còn {attrs.variants?.reduce((acc: number, v: any) => acc + (v.stock || 0), 0) || 0} sản phẩm</span>
            </div>

            <div className="flex gap-4 pt-6">
              <button className="flex-1 h-12 border border-shopee-primary text-shopee-primary bg-orange-50 hover:bg-orange-100 flex items-center justify-center gap-2 rounded-sm transition">
                <ShoppingCart size={20} /> Thêm Vào Giỏ Hàng
              </button>
              <button className="flex-1 h-12 bg-shopee-primary text-white hover:bg-shopee-secondary flex items-center justify-center rounded-sm transition">
                Mua Ngay
              </button>
            </div>

            <div className="pt-6 border-t flex items-center gap-8 text-sm text-gray-600">
               <div className="flex items-center gap-2">
                 <ShieldCheck className="text-shopee-primary" size={18} />
                 Shopee Đảm Bảo
               </div>
               <span>7 Ngày Trả Hàng</span>
               <span>Hàng Chính Hãng</span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-6 bg-white p-6 rounded-sm shadow-sm space-y-6">
           <h2 className="bg-gray-50 p-4 text-lg font-medium text-gray-800 -mx-6 -mt-6 rounded-t-sm">
             CHI TIẾT SẢN PHẨM
           </h2>
           <div className="space-y-4 text-sm leading-loose whitespace-pre-wrap text-gray-700">
             {attrs.description || "Không có mô tả sản phẩm."}
           </div>
        </div>
      </main>
    </div>
  );
}
