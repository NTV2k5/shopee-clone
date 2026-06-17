# 🔍 SEO - Tối Ưu Website Toàn Diện
### Áp dụng thực tế cho Shopee Clone (Next.js 16 + Strapi)

> **Tác giả:** Senior Software Engineer  
> **Stack:** Next.js 16 App Router · Strapi CMS · TypeScript · TailwindCSS  
> **Mục tiêu:** Đưa website lên top Google, tăng organic traffic

---

## 📑 Mục Lục

1. [SEO là gì? Tại sao quan trọng?](#1-seo-là-gì)
2. [Cách Google Bot hoạt động](#2-cách-google-bot-hoạt-động)
3. [3 Trụ Cột Chính của SEO](#3-ba-trụ-cột)
4. [Technical SEO - Nền Tảng Kỹ Thuật](#4-technical-seo)
5. [On-Page SEO - Tối Ưu Nội Dung](#5-on-page-seo)
6. [Performance & Core Web Vitals](#6-core-web-vitals)
7. [Structured Data (Schema.org)](#7-structured-data)
8. [Next.js SEO - Áp Dụng Thực Tế](#8-nextjs-seo)
9. [Các Lỗi SEO Thường Gặp](#9-lỗi-thường-gặp)
10. [Checklist Kiểm Tra SEO](#10-checklist)
11. [Tools Đo Lường](#11-tools)

---

## 1. SEO Là Gì?

**SEO (Search Engine Optimization)** = Tối ưu hóa công cụ tìm kiếm  

> Nói đơn giản: SEO là tập hợp kỹ thuật giúp website của bạn **xuất hiện cao hơn** trên trang kết quả của Google (SERP) khi người dùng tìm kiếm từ khóa liên quan.

### Tại sao SEO quan trọng?

| Vị trí Google | Tỉ lệ Click (CTR) |
|---------------|-------------------|
| #1            | ~27.6%            |
| #2            | ~15.8%            |
| #3            | ~11.0%            |
| #4–#10        | < 6%              |
| Trang 2+      | < 1%              |

**→ Nếu không lên top 3, gần như không có traffic organic.**

### SEO vs Paid Ads

```
SEO (Organic)          vs      Google Ads (Paid)
─────────────────────────────────────────────────
✅ Miễn phí lâu dài           ❌ Tốn tiền liên tục
✅ Tin cậy hơn (users trust)  ✅ Kết quả ngay lập tức
✅ Traffic bền vững            ❌ Dừng tiền = dừng traffic
❌ Cần 3–6 tháng thấy kết quả ✅ Kiểm soát được
```

---

## 2. Cách Google Bot Hoạt Động

Google sử dụng **Googlebot** (web crawler) để thu thập và lập chỉ mục website.

```
┌─────────────────────────────────────────────────────┐
│                  VÒNG ĐỜI INDEX GOOGLE               │
│                                                       │
│  1. CRAWLING         2. INDEXING        3. RANKING    │
│  ┌──────────┐       ┌──────────┐       ┌──────────┐  │
│  │Googlebot │  →    │ Phân tích│  →    │ Xếp hạng │  │
│  │đọc HTML  │       │& lưu trữ │       │theo 200+ │  │
│  │theo links│       │ vào DB   │       │ yếu tố   │  │
│  └──────────┘       └──────────┘       └──────────┘  │
│                                                       │
│  robots.txt          sitemap.xml        PageRank      │
│  (Cho phép/chặn)     (Hướng dẫn)        (Thuật toán) │
└─────────────────────────────────────────────────────┘
```

### Googlebot đọc gì?

```html
<!-- ✅ Bot đọc được -->
<h1>iPhone 15 Pro Max 256GB</h1>
<p>Sản phẩm chính hãng Apple, bảo hành 12 tháng</p>
<img src="iphone.jpg" alt="iPhone 15 Pro Max màu titan tự nhiên">

<!-- ❌ Bot KHÔNG đọc được (client-side only) -->
<div id="product-name"></div>
<script>
  document.getElementById('product-name').textContent = 'iPhone 15'; // Bot không chạy JS này
</script>
```

> **⚠️ Quan trọng:** Đây là lý do dùng **Next.js Server Components (SSR/SSG)** thay vì React thuần. Server render HTML đầy đủ trước khi gửi → Bot đọc được nội dung.

---

## 3. Ba Trụ Cột Chính của SEO

```
         ┌─────────────────────────────────┐
         │           SEO TỔNG QUAN          │
         └─────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
   ┌────────────┐ ┌────────────┐ ┌────────────┐
   │ TECHNICAL  │ │  ON-PAGE   │ │ OFF-PAGE   │
   │    SEO     │ │    SEO     │ │    SEO     │
   ├────────────┤ ├────────────┤ ├────────────┤
   │• Tốc độ   │ │• Từ khóa  │ │• Backlinks │
   │• Mobile   │ │• Title tag │ │• Social    │
   │• HTTPS    │ │• Meta desc │ │• Brand     │
   │• Sitemap  │ │• Heading   │ │• PR online │
   │• robots   │ │• Content   │ │• Reviews   │
   │• Schema   │ │• Images    │ │            │
   └────────────┘ └────────────┘ └────────────┘
      Nền tảng      Nội dung       Uy tín
```

---

## 4. Technical SEO - Nền Tảng Kỹ Thuật

### 4.1 robots.txt

File đặt ở `/public/robots.txt`, cho phép/chặn Googlebot:

```txt
# public/robots.txt - Shopee Clone

User-agent: *
Allow: /
Allow: /products/
Allow: /products/*

# Chặn các trang không cần index
Disallow: /api/
Disallow: /cart
Disallow: /checkout
Disallow: /orders
Disallow: /profile
Disallow: /login
Disallow: /signup
Disallow: /forgot-password
Disallow: /reset-password
Disallow: /change-password
Disallow: /products/create

# Đường dẫn đến sitemap
Sitemap: https://your-domain.com/sitemap.xml
```

**Giải thích logic:**
- Cho phép: Trang chủ, danh sách sản phẩm, chi tiết sản phẩm → **cần indexing**
- Chặn: Trang người dùng, giỏ hàng, API → **không nên indexing** (riêng tư, không có giá trị SEO)

### 4.2 sitemap.xml

Hướng dẫn Google biết tất cả các trang cần crawl:

```typescript
// app/sitemap.ts - Dynamic Sitemap trong Next.js
import { MetadataRoute } from 'next';
import { strapi } from '@/lib/strapi';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://your-domain.com';
  
  // Lấy tất cả products từ Strapi
  const res = await strapi.get('/products?fields=slug,updatedAt&pagination[pageSize]=1000');
  const products = res.data.data;
  
  const productUrls = products.map((product: any) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,   // Trang chủ quan trọng nhất
    },
    ...productUrls,
  ];
}
```

**Priority guidelines:**
| Trang           | Priority | changeFrequency |
|-----------------|----------|-----------------|
| Trang chủ       | 1.0      | daily           |
| Danh mục        | 0.9      | daily           |
| Chi tiết SP     | 0.8      | weekly          |
| Blog/Tin tức    | 0.7      | weekly          |
| About/Contact   | 0.5      | monthly         |

### 4.3 Canonical URL

Tránh duplicate content khi cùng nội dung có nhiều URL:

```typescript
// Ví dụ: page.tsx sản phẩm
export async function generateMetadata({ params }) {
  return {
    alternates: {
      canonical: `https://your-domain.com/products/${params.slug}`,
    },
  };
}
```

### 4.4 HTTPS & Bảo Mật

```
✅ HTTPS (SSL Certificate) - Google ưu tiên HTTPS
✅ HTTP/2 hoặc HTTP/3 - Tăng tốc load
✅ Security Headers (X-Frame-Options, CSP...)
```

### 4.5 Mobile-First Indexing

> Google index phiên bản **mobile** trước từ 2019. Website không mobile-friendly = mất điểm SEO nghiêm trọng.

```css
/* Luôn dùng responsive design - TailwindCSS đã hỗ trợ */
.grid {
  grid-template-columns: repeat(2, 1fr);   /* mobile: 2 cột */
}
@media (min-width: 640px) {
  .grid { grid-template-columns: repeat(3, 1fr); }  /* tablet: 3 cột */
}
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(6, 1fr); }  /* desktop: 6 cột */
}
```

---

## 5. On-Page SEO - Tối Ưu Nội Dung

### 5.1 Title Tag - Thẻ Tiêu Đề

Thẻ quan trọng nhất, xuất hiện trên tab browser và kết quả Google.

```
┌─────────────────────────────────────────────────────┐
│ Kết quả Google                                       │
│ ──────────────────────────────────────────────────  │
│ iPhone 15 Pro Max 256GB | Shopee Clone              │
│ ↑ Từ khóa chính   ↑ Brand                          │
│ https://shopee-clone.com/products/iphone-15-pro...  │
│ Mua iPhone 15 Pro Max 256GB chính hãng, giá tốt,   │
│ giao hàng nhanh. Bảo hành 12 tháng Apple...        │
└─────────────────────────────────────────────────────┘
```

**Quy tắc viết Title:**
- ✅ Độ dài: **50–60 ký tự** (không bị cắt trên Google)
- ✅ Chứa **từ khóa chính** ở đầu
- ✅ Có **brand name** ở cuối
- ✅ Unique cho mỗi trang
- ❌ Không nhồi nhét từ khóa

```typescript
// ✅ Tốt
title: "iPhone 15 Pro Max 256GB - Giá Tốt | Shopee Clone"

// ❌ Xấu  
title: "mua iphone 15 pro max iphone 15 pro max giá rẻ iphone 15"
```

### 5.2 Meta Description

Đoạn mô tả xuất hiện dưới title trên Google (không ảnh hưởng ranking trực tiếp nhưng ảnh hưởng CTR):

```typescript
// ✅ Tốt - 150-160 ký tự, có call-to-action
description: "Mua iPhone 15 Pro Max 256GB chính hãng Apple tại Shopee Clone. Giá tốt nhất, giao hàng nhanh, bảo hành 12 tháng. Đặt hàng ngay!"

// ❌ Xấu - quá ngắn, thiếu thông tin
description: "iPhone 15 Pro Max"
```

### 5.3 Cấu Trúc Heading (H1–H6)

```html
<!-- ✅ Cấu trúc đúng - Mỗi trang chỉ có 1 thẻ H1 -->
<h1>iPhone 15 Pro Max 256GB - Titan Tự Nhiên</h1>   <!-- 1 thẻ duy nhất -->
  <h2>Thông Số Kỹ Thuật</h2>                          <!-- Các section -->
    <h3>Màn Hình</h3>
    <h3>Camera</h3>
  <h2>Đánh Giá Khách Hàng</h2>
  <h2>Sản Phẩm Tương Tự</h2>

<!-- ❌ Sai - Bỏ qua cấp bậc, dùng H3 mà không có H2 -->
<h1>Tiêu đề</h1>
<h3>Mục này bỏ qua H2</h3>
```

### 5.4 Image Optimization

```html
<!-- ✅ Đầy đủ thuộc tính SEO -->
<img 
  src="/products/iphone-15-pro-max.jpg"
  alt="iPhone 15 Pro Max 256GB màu titan tự nhiên - nhìn nghiêng"
  title="iPhone 15 Pro Max"
  width="800"
  height="800"
  loading="lazy"
/>

<!-- ❌ Thiếu alt text - Bot không hiểu hình ảnh -->
<img src="/products/img001.jpg" />
```

**Quy tắc đặt tên file ảnh:**
```
❌ img001.jpg
❌ DSC_20240101_123456.jpg
✅ iphone-15-pro-max-256gb-titan.jpg   (dùng dấu gạch ngang, mô tả rõ)
```

### 5.5 URL Structure

```
✅ Đẹp, thân thiện SEO:
/products/iphone-15-pro-max-256gb

❌ Xấu, khó đọc:
/products?id=12345&category=phone&ref=xyz
/products/p/12345
```

**Quy tắc URL SEO:**
- Dùng **dấu gạch ngang** `-` thay gạch dưới `_`
- **Chữ thường** hoàn toàn
- **Ngắn gọn**, chứa từ khóa
- Không có ký tự đặc biệt

### 5.6 Nội Dung (Content Quality)

Google E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness):

```
📝 Content checklist cho trang sản phẩm:
✅ Mô tả sản phẩm chi tiết (ít nhất 300 từ)
✅ Thông số kỹ thuật đầy đủ
✅ Ảnh chất lượng cao, nhiều góc
✅ Đánh giá/Review của khách hàng
✅ FAQ về sản phẩm
✅ Chính sách bảo hành, đổi trả rõ ràng
```

---

## 6. Core Web Vitals - Hiệu Năng

Google đo 3 chỉ số quan trọng (tính từ 2021):

```
┌────────────────────────────────────────────────────────┐
│                    CORE WEB VITALS                      │
├──────────────┬──────────────────┬──────────────────────┤
│     LCP      │       INP        │        CLS           │
│ Largest      │ Interaction to   │  Cumulative          │
│ Contentful   │ Next Paint       │  Layout Shift        │
│ Paint        │                  │                      │
├──────────────┼──────────────────┼──────────────────────┤
│ Tốt: < 2.5s │ Tốt: < 200ms    │ Tốt: < 0.1           │
│ TB: 2.5–4s  │ TB: 200–500ms   │ TB: 0.1–0.25         │
│ Xấu: > 4s   │ Xấu: > 500ms    │ Xấu: > 0.25          │
├──────────────┼──────────────────┼──────────────────────┤
│ Tốc độ hiển │ Phản hồi tương  │ Ổn định layout       │
│ thị nội dung│ tác người dùng  │ (tránh nhảy layout)  │
│ chính        │                  │                      │
└──────────────┴──────────────────┴──────────────────────┘
```

### Tối ưu LCP (Largest Contentful Paint)

```typescript
// Next.js - Ưu tiên load ảnh đầu tiên trong viewport
<Image 
  src={productImage}
  alt={productName}
  priority={true}        // ← Thêm priority cho ảnh hero
  width={800}
  height={800}
/>

// Không dùng priority cho ảnh ngoài viewport (lazy load)
<Image 
  src={otherImage}
  alt="..."
  // priority={false}   // Mặc định = lazy load
/>
```

### Tối ưu CLS (Cumulative Layout Shift)

```tsx
// ❌ Gây CLS - ảnh không có kích thước cố định
<img src={url} className="w-full" />

// ✅ Tránh CLS - luôn khai báo width/height hoặc aspect-ratio
<div className="aspect-square relative">      {/* Giữ tỉ lệ */}
  <Image fill src={url} alt="..." />
</div>

// ❌ Gây CLS - Font chữ FOUT (Flash of Unstyled Text)
<link href="https://fonts.googleapis.com/..." rel="stylesheet">

// ✅ Dùng next/font - tự động tối ưu, không gây CLS
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
```

### Code Splitting & Lazy Loading

```typescript
// ❌ Import toàn bộ - bundle lớn
import HeavyComponent from '@/components/HeavyComponent';

// ✅ Dynamic import - chỉ load khi cần
import dynamic from 'next/dynamic';
const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <div className="skeleton animate-pulse h-40 bg-gray-200" />,
  ssr: false,  // Chỉ render client-side nếu không cần SSR
});
```

---

## 7. Structured Data (Schema.org)

**Structured Data** = Dữ liệu có cấu trúc giúp Google hiểu nội dung tốt hơn và hiển thị **Rich Snippets** (kết quả nổi bật).

```
Kết quả bình thường:           Kết quả có Rich Snippet:
─────────────────              ──────────────────────────
iPhone 15 Pro Max              ⭐⭐⭐⭐⭐ 4.8 (1,234 đánh giá)
shopee-clone.com               iPhone 15 Pro Max
Mô tả sản phẩm...             ₫29,990,000  Còn hàng
                               shopee-clone.com
```

### Schema cho Sản Phẩm (Product Schema)

```typescript
// Trong ProductDetailPage
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.productName,
  "description": product.description,
  "image": product.image?.url,
  "sku": product.sku || product.id,
  "brand": {
    "@type": "Brand",
    "name": product.brand || "Shopee Clone"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "VND",
    "price": product.basePrice,
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Shopee Clone"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": product.rating || 4.5,
    "reviewCount": product.reviewCount || 0
  }
};

// Inject vào trang
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
/>
```

### Schema cho Trang Chủ (WebSite + SearchAction)

```typescript
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Shopee Clone",
  "url": "https://your-domain.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://your-domain.com/?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};
```

### Schema cho Breadcrumb

```typescript
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Trang Chủ",
      "item": "https://your-domain.com"
    },
    {
      "@type": "ListItem", 
      "position": 2,
      "name": "Điện Thoại",
      "item": "https://your-domain.com/category/dien-thoai"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "iPhone 15 Pro Max",
      "item": "https://your-domain.com/products/iphone-15-pro-max"
    }
  ]
};
```

---

## 8. Next.js SEO - Áp Dụng Thực Tế Shopee Clone

### 8.1 Root Layout Metadata (layout.tsx)

```typescript
// src/app/layout.tsx - Metadata mặc định toàn site
import type { Metadata } from "next";

export const metadata: Metadata = {
  // ─── Title Template ───────────────────────────────────
  title: {
    template: "%s | Shopee Clone",      // %s = title của từng trang
    default: "Shopee Clone - Mua Sắm Trực Tuyến Giá Tốt",
  },
  
  // ─── Description ──────────────────────────────────────
  description: "Shopee Clone - Website mua sắm trực tuyến với hàng ngàn sản phẩm chính hãng. Điện thoại, thời trang, mỹ phẩm giá tốt nhất Việt Nam.",
  
  // ─── Keywords ─────────────────────────────────────────
  keywords: ["mua sắm online", "shopee", "thương mại điện tử", "giá rẻ", "hàng chính hãng"],
  
  // ─── Open Graph (Facebook, Zalo share) ────────────────
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://your-domain.com",
    siteName: "Shopee Clone",
    title: "Shopee Clone - Mua Sắm Trực Tuyến Giá Tốt",
    description: "Website mua sắm trực tuyến với hàng ngàn sản phẩm chính hãng.",
    images: [
      {
        url: "https://your-domain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Shopee Clone Banner",
      },
    ],
  },
  
  // ─── Twitter Card ──────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Shopee Clone",
    description: "Mua sắm trực tuyến giá tốt",
    images: ["https://your-domain.com/og-image.jpg"],
  },
  
  // ─── Robots ───────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // ─── Verification ─────────────────────────────────────
  verification: {
    google: "your-google-search-console-verification-code",
  },
  
  // ─── Canonical ────────────────────────────────────────
  alternates: {
    canonical: "https://your-domain.com",
    languages: {
      "vi-VN": "https://your-domain.com",
    },
  },
};
```

### 8.2 Dynamic Metadata cho Product Page

```typescript
// src/app/products/[slug]/page.tsx
import type { Metadata } from 'next';
import { strapi, getImageUrl } from '@/lib/strapi';

// generateMetadata chạy trên SERVER - tạo metadata động
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Sản phẩm không tìm thấy",
      description: "Sản phẩm này không tồn tại hoặc đã bị xóa.",
    };
  }

  const productName = product.productName;
  const price = product.basePrice?.toLocaleString('vi-VN');
  const imageUrl = getImageUrl(product.image?.url);
  const description = product.description?.slice(0, 155) || 
    `Mua ${productName} giá ₫${price}. Hàng chính hãng, giao hàng nhanh, bảo hành uy tín tại Shopee Clone.`;

  return {
    title: `${productName} - Giá ₫${price}`,   // Tự động: "iPhone 15... | Shopee Clone"
    description,
    keywords: [productName, product.category, "mua online", "giá tốt"],
    
    openGraph: {
      title: productName,
      description,
      url: `https://your-domain.com/products/${slug}`,
      images: imageUrl ? [{ url: imageUrl, width: 800, height: 800, alt: productName }] : [],
      type: "website",
    },
    
    alternates: {
      canonical: `https://your-domain.com/products/${slug}`,
    },
  };
}
```

### 8.3 generateStaticParams - Pre-render sản phẩm

```typescript
// Next.js pre-render tất cả trang sản phẩm lúc build
// → Googlebot gặp HTML sẵn, không cần chờ JS
export async function generateStaticParams() {
  const res = await strapi.get('/products?fields=slug&pagination[pageSize]=1000');
  const products = res.data.data;
  
  return products.map((product: any) => ({
    slug: product.slug,
  }));
}
```

### 8.4 Breadcrumb Component

```tsx
// src/components/Breadcrumb.tsx
interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href && { item: `https://your-domain.com${item.href}` }),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="breadcrumb" className="text-sm text-gray-500 mb-4">
        <ol className="flex items-center gap-2" itemScope itemType="https://schema.org/BreadcrumbList">
          {items.map((item, index) => (
            <li key={index} itemScope itemType="https://schema.org/ListItem" itemProp="itemListElement">
              {item.href ? (
                <a href={item.href} itemProp="item" className="hover:text-orange-500">
                  <span itemProp="name">{item.label}</span>
                </a>
              ) : (
                <span itemProp="name" className="text-gray-800 font-medium">{item.label}</span>
              )}
              <meta itemProp="position" content={String(index + 1)} />
              {index < items.length - 1 && <span className="mx-1">/</span>}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
```

---

## 9. Các Lỗi SEO Thường Gặp

### ❌ Lỗi 1: `lang` sai trong HTML

```tsx
// ❌ Hiện tại trong layout.tsx
<html lang="en">     // Nội dung tiếng Việt nhưng khai báo tiếng Anh

// ✅ Sửa lại
<html lang="vi">    // Google hiểu đây là website tiếng Việt
```

### ❌ Lỗi 2: Dùng `<img>` thay `<Image>` của Next.js

```tsx
// ❌ Trong page.tsx đang dùng
<img src={imageUrl} alt={product.productName} />

// ✅ Nên dùng
import Image from 'next/image';
<Image 
  src={imageUrl} 
  alt={product.productName}
  width={300} 
  height={300}
  // Next.js tự động: WebP format, lazy load, srcset cho responsive
/>
```

### ❌ Lỗi 3: Thiếu Canonical URL

Nếu website có thể truy cập bằng nhiều URL:
```
https://shopee-clone.com/products/iphone-15
https://www.shopee-clone.com/products/iphone-15
https://shopee-clone.com/products/iphone-15?ref=home

→ Google xem là 3 trang khác nhau → duplicate content → penalty!
```

### ❌ Lỗi 4: H1 không có hoặc có nhiều H1

```tsx
// ❌ Trang sản phẩm dùng H3 cho tên sản phẩm
<h3 className="text-xl">{product.productName}</h3>  // ← Sai!

// ✅ Phải là H1
<h1 className="text-xl font-bold">{product.productName}</h1>
```

### ❌ Lỗi 5: Không có Open Graph tags

Khi share link lên Facebook/Zalo mà không có OG tags → link xấu, không có ảnh thumbnail → CTR thấp.

### ❌ Lỗi 6: Tốc độ chậm do ảnh không tối ưu

```
Ảnh PNG 5MB → tải 10s → Google penalty
Ảnh WebP 200KB → tải 0.3s → Google happy ✅
```

---

## 10. Checklist Kiểm Tra SEO

### Technical SEO ✅

- [ ] `robots.txt` có và cấu hình đúng
- [ ] `sitemap.xml` có, cập nhật tự động
- [ ] HTTPS đang hoạt động
- [ ] Mobile-friendly (test: search.google.com/test/mobile-friendly)
- [ ] Không có lỗi 404, redirect đúng
- [ ] Tốc độ tải < 3s (test: pagespeed.web.dev)
- [ ] Canonical URL trên mỗi trang

### On-Page SEO ✅

- [ ] Mỗi trang có title unique (50-60 ký tự)
- [ ] Mỗi trang có meta description (150-160 ký tự)  
- [ ] Mỗi trang có đúng 1 thẻ H1
- [ ] Heading hierarchy đúng (H1 → H2 → H3)
- [ ] Tất cả ảnh có `alt` text mô tả
- [ ] URL thân thiện, chứa từ khóa
- [ ] `lang` attribute đúng ngôn ngữ
- [ ] Open Graph tags đầy đủ

### Structured Data ✅

- [ ] Product Schema cho trang sản phẩm
- [ ] WebSite Schema + SearchAction cho trang chủ
- [ ] BreadcrumbList Schema

### Performance ✅

- [ ] LCP < 2.5s
- [ ] INP < 200ms  
- [ ] CLS < 0.1
- [ ] Images dùng `next/image` với width/height
- [ ] Priority cho ảnh LCP (hero image)
- [ ] Font từ `next/font` (tránh FOUT)

---

## 11. Tools Đo Lường

### Free Tools

| Tool | Dùng để | Link |
|------|---------|------|
| **Google Search Console** | Xem từ khóa, ranking, lỗi index | search.google.com/search-console |
| **Google PageSpeed Insights** | Đo Core Web Vitals | pagespeed.web.dev |
| **Google Rich Results Test** | Test Structured Data | search.google.com/test/rich-results |
| **Mobile-Friendly Test** | Kiểm tra mobile | search.google.com/test/mobile-friendly |
| **Screaming Frog** (free 500 URLs) | Crawl toàn bộ site, tìm lỗi | screamingfrog.co.uk |

### Chrome Extensions

- **SEO Meta in 1 Click** – Xem nhanh meta tags của bất kỳ trang nào
- **Lighthouse** – Đo performance, SEO, accessibility (built-in Chrome DevTools)
- **Web Vitals** – Hiển thị Core Web Vitals real-time

### Cách sử dụng Google Search Console

```
1. Thêm domain/URL prefix vào GSC
2. Verify ownership (thêm meta tag vào layout.tsx)
3. Submit sitemap.xml
4. Chờ 1-7 ngày để Google index
5. Xem báo cáo:
   - Performance → từ khóa đang rank
   - URL Inspection → trạng thái index của URL cụ thể
   - Coverage → các lỗi crawling/indexing
   - Core Web Vitals → hiệu năng theo Google
```

---

## 📊 Tóm Tắt Áp Dụng Cho Shopee Clone

### Những gì đã có ✅
- Next.js App Router (SSR by default) → Bot đọc được content
- Slug-based URLs cho sản phẩm (`/products/[slug]`)
- Metadata cơ bản trong `layout.tsx`
- TailwindCSS responsive grid

### Cần bổ sung 🔧

| Priority | Task | File cần sửa |
|----------|------|-------------|
| 🔴 Cao | Đổi `lang="en"` → `lang="vi"` | `layout.tsx` |
| 🔴 Cao | Dynamic metadata cho product page | `products/[slug]/page.tsx` |
| 🔴 Cao | Tạo `robots.txt` | `public/robots.txt` |
| 🔴 Cao | Tạo `sitemap.ts` | `app/sitemap.ts` |
| 🟡 TB | Thêm Product Schema (JSON-LD) | `ProductDetailClient.tsx` |
| 🟡 TB | Đổi `<img>` → `<Image>` Next.js | `page.tsx`, components |
| 🟡 TB | Thêm Open Graph tags đầy đủ | `layout.tsx` |
| 🟢 Thấp | Breadcrumb component + Schema | Component mới |
| 🟢 Thấp | WebSite SearchAction Schema | `layout.tsx` |

---

> **💡 Lời khuyên thực tế:**  
> SEO là quá trình dài hạn. Bắt đầu với Technical SEO (robots, sitemap, metadata) rồi mới làm Content SEO.  
> Đối với website e-commerce như Shopee Clone, **Product Schema + nội dung mô tả sản phẩm chi tiết** là hai yếu tố quan trọng nhất.

---

*Tài liệu được tạo dựa trên Google Search Central Documentation, Web.dev, và kinh nghiệm thực chiến 12+ năm.*
