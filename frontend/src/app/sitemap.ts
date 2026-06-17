// src/app/sitemap.ts
// Dynamic sitemap - tự động cập nhật khi có sản phẩm mới
// Google sẽ đọc file này để biết cần crawl những URL nào

import { MetadataRoute } from 'next';
import { strapi } from '@/lib/strapi';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Các trang tĩnh
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,   // Trang chủ - quan trọng nhất
    },
  ];

  // Các trang sản phẩm (động - lấy từ Strapi)
  let productRoutes: MetadataRoute.Sitemap = [];
  
  try {
    const res = await strapi.get('/products?fields=slug,updatedAt&pagination[pageSize]=1000');
    const products = res.data.data;

    productRoutes = products.map((product: any) => ({
      url: `${BASE_URL}/products/${product.slug}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Sitemap: Error fetching products:', error);
  }

  return [...staticRoutes, ...productRoutes];
}
