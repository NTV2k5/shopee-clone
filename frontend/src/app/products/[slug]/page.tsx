// src/app/products/[slug]/page.tsx
import type { Metadata } from 'next';
import { strapi, getImageUrl } from '@/lib/strapi';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/ProductDetailClient';

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

  // Trả về metadata mặc định nếu không tìm thấy sản phẩm
  if (!product) {
    return {
      title: 'Sản phẩm không tìm thấy',
      description: 'Sản phẩm này không tồn tại hoặc đã bị xóa.',
      robots: { index: false, follow: false }, // Không index trang 404
    };
  }

  const productName = product.productName;
  const price = product.basePrice?.toLocaleString('vi-VN');
  const imageUrl = getImageUrl(product.image?.url);

  // Description: dùng description từ Strapi, fallback về template
  const description =
    (product.description?.replace(/<[^>]*>/g, '')?.slice(0, 155)) ||
    `Mua ${productName} giá ₫${price}. Hàng chính hãng, giao hàng nhanh, bảo hành uy tín tại Shopee Clone.`;

  const productUrl = `${BASE_URL}/products/${slug}`;

  return {
    // Title: "iPhone 15 Pro Max 256GB - ₫29.990.000 | Shopee Clone"
    title: `${productName} - ₫${price}`,

    description,

    keywords: [
      productName,
      `mua ${productName}`,
      `${productName} giá rẻ`,
      `${productName} chính hãng`,
      'mua sắm online',
    ].filter(Boolean),

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
      locale: 'vi_VN',
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

  const imageUrl = getImageUrl(product.image?.url);
  const productUrl = `${BASE_URL}/products/${slug}`;

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
    // Thêm aggregateRating khi có dữ liệu review thực tế
    // aggregateRating: {
    //   '@type': 'AggregateRating',
    //   ratingValue: product.rating || 4.5,
    //   reviewCount: product.reviewCount || 0,
    //   bestRating: 5,
    //   worstRating: 1,
    // },
  };

  // ─── BREADCRUMB STRUCTURED DATA ───────────────────────────────────────────
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang Chủ',
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
