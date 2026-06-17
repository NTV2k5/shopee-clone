import type { Metadata } from 'next';
import { strapi } from '@/lib/strapi';
import HomeClient from '@/components/HomeClient';

// ─── PAGE METADATA ───────────────────────────────────────────────────────────
// Override metadata từ layout.tsx cho riêng trang chủ
export const metadata: Metadata = {
  title: 'Shopee Clone - Mua Sắm Trực Tuyến Giá Tốt',  // Không dùng template cho trang chủ
  description:
    'Khám phá hàng ngàn sản phẩm chính hãng với giá tốt nhất. Điện thoại, thời trang, mỹ phẩm, gia dụng. Giao hàng nhanh, bảo hành uy tín.',
  keywords: [
    'mua sắm online',
    'shopee clone',
    'thương mại điện tử',
    'điện thoại giá rẻ',
    'thời trang online',
  ],
  openGraph: {
    title: 'Shopee Clone - Mua Sắm Trực Tuyến Giá Tốt',
    description: 'Hàng ngàn sản phẩm chính hãng, giá tốt nhất, giao hàng nhanh toàn quốc.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com',
  },
};

async function getProducts(searchQuery?: string) {
  try {
    let url = '/products?populate=*';
    if (searchQuery) {
      url += `&filters[productName][$contains]=${encodeURIComponent(searchQuery)}`;
    }
    const res = await strapi.get(url);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function Home({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const { search } = await searchParams;
  const products = await getProducts(search);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <HomeClient products={products} searchQuery={search} />
    </div>
  );
}
