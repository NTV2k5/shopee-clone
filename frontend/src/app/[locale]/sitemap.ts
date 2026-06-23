import { MetadataRoute } from 'next';
import { strapi } from '@/lib/strapi';
import { getPathname } from '@/i18n/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages for all supported locales
  const staticRoutes: MetadataRoute.Sitemap = ['en', 'vi', 'zh', 'ja'].map((locale) => ({
    url: `${BASE_URL}${getPathname({ href: '/', locale: locale as any })}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1.0,
  }));

  // Dynamic product pages for all supported locales
  let productRoutes: MetadataRoute.Sitemap = [];
  
  try {
    const res = await strapi.get('/products?fields=slug,updatedAt&pagination[pageSize]=1000');
    const products = res.data.data;

    productRoutes = products.flatMap((product: any) => {
      const lastMod = product.updatedAt ? new Date(product.updatedAt) : new Date();
      return ['en', 'vi', 'zh', 'ja'].map((locale) => ({
        url: `${BASE_URL}${getPathname({
          href: {
            pathname: '/products/[slug]',
            params: { slug: product.slug }
          },
          locale: locale as any
        })}`,
        lastModified: lastMod,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    });
  } catch (error) {
    console.error('Sitemap: Error fetching products:', error);
  }

  return [...staticRoutes, ...productRoutes];
}
