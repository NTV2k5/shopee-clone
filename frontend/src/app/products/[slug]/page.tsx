// src/app/products/[slug]/page.tsx
import type { Metadata } from 'next';
import { strapi, getImageUrl } from '@/lib/strapi';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/ProductDetailClient';
import { headers } from 'next/headers';
import vi from '@/lib/i18n/locales/vi';
import en from '@/lib/i18n/locales/en';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';

// ─── DATA FETCHING ────────────────────────────────────────────────────────────
async function getProductBySlug(slug: string) {
  try {
    const res = await strapi.get(`/products?filters[slug][$eq]=${slug}&populate=*`);
    return res.data.data[0] || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// ─── STATIC PARAMS (SSG Pre-rendering) ───────────────────────────────────────
// Next.js sẽ pre-render TẤT CẢ trang sản phẩm lúc build.
// Googlebot gặp HTML đầy đủ ngay → không cần chờ JS → tốt cho SEO
export async function generateStaticParams() {
  try {
    const res = await strapi.get('/products?fields=slug&pagination[pageSize]=1000');
    const products = res.data.data;
    return products.map((product: any) => ({ slug: product.slug }));
  } catch {
    return [];
  }
}

// ─── DYNAMIC METADATA ─────────────────────────────────────────────────────────
// Mỗi trang sản phẩm có title/description/OG riêng → quan trọng cho SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const headersList = await headers();
  const locale = headersList.get('x-locale') || 'en';

  // Trả về metadata mặc định nếu không tìm thấy sản phẩm
  if (!product) {
    return {
      title: locale === 'vi' ? 'Sản phẩm không tìm thấy' : 'Product Not Found',
      description: locale === 'vi' ? 'Sản phẩm này không tồn tại hoặc đã bị xóa.' : 'This product does not exist or has been deleted.',
      robots: { index: false, follow: false }, // Không index trang 404
    };
  }

  const productName = product.productName;
  const price = product.basePrice?.toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US');
  const imageUrl = getImageUrl(product.image?.url);

  // Description: dùng description từ Strapi, fallback về template
  const description =
    (product.description?.replace(/<[^>]*>/g, '')?.slice(0, 155)) ||
    (locale === 'vi'
      ? `Mua ${productName} giá ₫${price}. Hàng chính hãng, giao hàng nhanh, bảo hành uy tín tại Shopee Clone.`
      : `Buy ${productName} for ₫${price}. Authentic product, fast delivery, trusted warranty at Shopee Clone.`);

  const routePrefix = locale === 'vi' ? '/san-pham' : '/products';
  const productUrl = `${BASE_URL}${routePrefix}/${slug}`;

  return {
    // Title: "iPhone 15 Pro Max 256GB - ₫29.990.000 | Shopee Clone"
    title: `${productName} - ₫${price}`,

    description,

    keywords: locale === 'vi' ? [
      productName,
      `mua ${productName}`,
      `${productName} giá rẻ`,
      `${productName} chính hãng`,
      'mua sắm online',
    ] : [
      productName,
      `buy ${productName}`,
      `cheap ${productName}`,
      `genuine ${productName}`,
      'online shopping',
    ],

    // ─── Open Graph (Facebook, Zalo share) ──────────────────────────
    openGraph: {
      type: 'website',
      url: productUrl,
      title: `${productName} - ₫${price}`,
      description,
      images: imageUrl
        ? [{ url: imageUrl, width: 800, height: 800, alt: productName }]
        : [],
      siteName: 'Shopee Clone',
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
    },

    // ─── Twitter Card ────────────────────────────────────────────────
    twitter: {
      card: 'summary_large_image',
      title: `${productName} - ₫${price}`,
      description,
      images: imageUrl ? [imageUrl] : [],
    },

    // ─── Canonical URL ───────────────────────────────────────────────
    // Tránh duplicate content từ các URL khác nhau của cùng sản phẩm
    alternates: {
      canonical: productUrl,
      languages: {
        'vi-VN': `${BASE_URL}/san-pham/${slug}`,
        'en-US': `${BASE_URL}/products/${slug}`,
      },
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

// ─── PAGE COMPONENT ───────────────────────────────────────────────────────────
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const headersList = await headers();
  const locale = headersList.get('x-locale') || 'en';
  const routePrefix = locale === 'vi' ? '/san-pham' : '/products';
  const productUrl = `${BASE_URL}${routePrefix}/${slug}`;

  const imageUrl = getImageUrl(product.image?.url);

  // ─── PRODUCT STRUCTURED DATA (JSON-LD) ──────────────────────────────────
  // Hiển thị Rich Snippet trên Google: giá, đánh giá, tình trạng hàng
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.productName,
    description: product.description?.replace(/<[^>]*>/g, '') || product.productName,
    url: productUrl,
    image: imageUrl || `${BASE_URL}/og-image.jpg`,
    sku: product.sku || String(product.id),
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Shopee Clone',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'VND',
      price: product.basePrice,
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: productUrl,
      seller: {
        '@type': 'Organization',
        name: 'Shopee Clone',
      },
    },
  };

  // ─── BREADCRUMB STRUCTURED DATA ───────────────────────────────────────────
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'vi' ? 'Trang Chủ' : 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: product.productName,
        item: productUrl,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ─── Structured Data ────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <ProductDetailClient product={product} />
    </div>
  );
}
