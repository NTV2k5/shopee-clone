# 📚 Hướng Dẫn Chuyên Sâu: next-intl/routing

> **Mục đích**: Tài liệu tổng hợp chuyên sâu về hệ thống routing của `next-intl` — thư viện i18n phổ biến nhất cho Next.js App Router. Bao gồm kiến trúc, cơ chế hoạt động nội bộ, cấu hình, so sánh, và cách áp dụng vào Shopee Clone.
>
> **Nguồn tham khảo chính**:
> - https://next-intl.dev/docs/routing
> - https://next-intl.dev/docs/routing/configuration
> - https://next-intl.dev/docs/routing/middleware
> - https://next-intl.dev/docs/routing/navigation
> - https://github.com/amannn/next-intl

---

## 📖 Mục Lục

1. [next-intl là gì?](#1-next-intl-là-gì)
2. [Tổng quan kiến trúc Routing](#2-tổng-quan-kiến-trúc-routing)
3. [defineRouting — Trung tâm cấu hình](#3-definerouting--trung-tâm-cấu-hình)
4. [Locale Prefix — Chiến lược hiển thị ngôn ngữ trên URL](#4-locale-prefix--chiến-lược-hiển-thị-ngôn-ngữ-trên-url)
5. [Pathnames — Dịch đường dẫn theo ngôn ngữ](#5-pathnames--dịch-đường-dẫn-theo-ngôn-ngữ)
6. [Proxy / Middleware — Xử lý request trên server](#6-proxy--middleware--xử-lý-request-trên-server)
7. [Navigation APIs — Link, useRouter, usePathname](#7-navigation-apis--link-userouter-usepathname)
8. [Domain Routing — Routing theo tên miền](#8-domain-routing--routing-theo-tên-miền)
9. [Cơ chế hoạt động nội bộ (Internal Mechanics)](#9-cơ-chế-hoạt-động-nội-bộ-internal-mechanics)
10. [Cấu trúc thư mục chuẩn](#10-cấu-trúc-thư-mục-chuẩn)
11. [So sánh next-intl vs i18next (Shopee Clone)](#11-so-sánh-next-intl-vs-i18next-shopee-clone)
12. [Shopee Clone đã áp dụng gì từ next-intl?](#12-shopee-clone-đã-áp-dụng-gì-từ-next-intl)
13. [Tài liệu tham khảo](#13-tài-liệu-tham-khảo)

---

## 1. next-intl là gì?

**next-intl** là thư viện internationalization (i18n) được thiết kế **riêng cho Next.js App Router**. Nó cung cấp:

- Dịch nội dung (translations) cho cả Server và Client Components
- Hệ thống routing đa ngôn ngữ tích hợp sẵn
- Type-safe navigation APIs
- Hỗ trợ pathnames bản địa hóa (localized pathnames)
- Format ngày tháng, số, danh sách theo locale

```
Tác giả: Jan Amann (@amannn)
GitHub Stars: 3.5k+
NPM Weekly Downloads: 1M+
Phiên bản stable: 4.x
```

### Tại sao next-intl quan trọng?

Next.js **App Router không có built-in i18n** (khác với Pages Router). `next-intl` lấp đầy khoảng trống đó bằng cách cung cấp một giải pháp toàn diện, bao gồm cả routing.

---

## 2. Tổng quan kiến trúc Routing

`next-intl` tích hợp vào hệ thống routing của Next.js ở **2 điểm chính**:

```
┌──────────────────────────────────────────────────────────────────┐
│                     Browser Request                              │
│                  /de/ueber-uns/team                               │
└──────────────┬───────────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────────┐
│  1. PROXY / MIDDLEWARE                                           │
│  ─────────────────────────────────────────────────────────────── │
│  • Negotiate locale từ URL, cookie, Accept-Language header       │
│  • Redirect: / → /en (nếu cần prefix)                           │
│  • Rewrite: /de/ueber-uns → /de/about (internal path)           │
│  • Set cookie: NEXT_LOCALE=de                                    │
└──────────────┬───────────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────────┐
│  Next.js App Router                                              │
│  app/[locale]/about/page.tsx                                     │
│  ─────────────────────────────────────────────────────────────── │
│  • Server Component nhận locale từ params                        │
│  • Render nội dung theo ngôn ngữ                                 │
└──────────────┬───────────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────────┐
│  2. NAVIGATION APIs (Client-side)                                │
│  ─────────────────────────────────────────────────────────────── │
│  • <Link href="/about"> → tự động thành /de/ueber-uns           │
│  • useRouter().push("/about") → /de/ueber-uns                   │
│  • usePathname() → trả về "/about" (internal, không có locale)   │
└──────────────────────────────────────────────────────────────────┘
```

**Ý tưởng cốt lõi**: Developer viết code với **đường dẫn nội bộ** (internal paths) như `/about`, còn `next-intl` tự động xử lý việc chuyển đổi sang **đường dẫn hiển thị** (user-facing paths) như `/de/ueber-uns`.

---

## 3. defineRouting — Trung tâm cấu hình

### Khái niệm

`defineRouting()` là hàm tạo ra **một object cấu hình trung tâm** (single source of truth) cho toàn bộ hệ thống routing. Object này được chia sẻ giữa **middleware** và **navigation APIs**.

### Cú pháp đầy đủ

```typescript
// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // ───────────────────────────────────────────────────────
  // 1. LOCALES — Danh sách ngôn ngữ hỗ trợ
  // ───────────────────────────────────────────────────────
  locales: ['en', 'vi', 'de', 'ja'],

  // ───────────────────────────────────────────────────────
  // 2. DEFAULT LOCALE — Ngôn ngữ mặc định khi không xác định được
  // ───────────────────────────────────────────────────────
  defaultLocale: 'en',

  // ───────────────────────────────────────────────────────
  // 3. LOCALE PREFIX — Cách hiển thị mã ngôn ngữ trên URL
  // ───────────────────────────────────────────────────────
  localePrefix: 'as-needed', // 'always' | 'as-needed' | 'never'

  // ───────────────────────────────────────────────────────
  // 4. LOCALE DETECTION — Tự động phát hiện ngôn ngữ
  // ───────────────────────────────────────────────────────
  localeDetection: true, // true (mặc định) | false

  // ───────────────────────────────────────────────────────
  // 5. PATHNAMES — Bản đồ đường dẫn bản địa hóa
  // ───────────────────────────────────────────────────────
  pathnames: {
    '/': '/',
    '/about': {
      en: '/about',
      vi: '/gioi-thieu',
      de: '/ueber-uns',
      ja: '/about',
    },
    '/products': {
      en: '/products',
      vi: '/san-pham',
      de: '/produkte',
      ja: '/seihin',
    },
    '/products/[slug]': {
      en: '/products/[slug]',
      vi: '/san-pham/[slug]',
      de: '/produkte/[slug]',
      ja: '/seihin/[slug]',
    },
    '/about-us/[slug]': {
      en: '/about-us/[slug]',
      vi: '/ve-chung-toi/[slug]',
    },
  },
});
```

### Giải thích từng thuộc tính

| Thuộc tính | Bắt buộc | Mô tả |
|---|---|---|
| `locales` | ✅ | Mảng các mã ngôn ngữ được hỗ trợ (ISO 639-1) |
| `defaultLocale` | ✅ | Ngôn ngữ fallback khi không xác định được locale |
| `localePrefix` | ❌ | Chiến lược hiển thị prefix ngôn ngữ trên URL |
| `localeDetection` | ❌ | Tự động phát hiện ngôn ngữ từ Accept-Language header |
| `pathnames` | ❌ | Bản đồ ánh xạ đường dẫn nội bộ → đường dẫn bản địa hóa |

---

## 4. Locale Prefix — Chiến lược hiển thị ngôn ngữ trên URL

### 4.1. `'always'` (Mặc định)

Mọi URL đều có prefix ngôn ngữ, kể cả ngôn ngữ mặc định:

```
/en/about     → English
/vi/gioi-thieu → Tiếng Việt
/de/ueber-uns → Deutsch
```

```typescript
localePrefix: 'always'
```

**Ưu điểm**: Rõ ràng, mỗi URL xác định chính xác ngôn ngữ.
**Nhược điểm**: URL dài hơn, ngôn ngữ mặc định cũng bị prefix.

### 4.2. `'as-needed'`

Chỉ thêm prefix cho các ngôn ngữ **không phải mặc định**:

```
/about        → English (default, không prefix)
/vi/gioi-thieu → Tiếng Việt
/de/ueber-uns → Deutsch
```

```typescript
localePrefix: 'as-needed'
```

**Ưu điểm**: URL sạch hơn cho ngôn ngữ chính.
**Nhược điểm**: Phức tạp hơn khi xử lý, cần middleware thông minh hơn.

### 4.3. `'never'`

Không bao giờ thêm prefix ngôn ngữ vào URL:

```
/about        → Ngôn ngữ xác định từ domain hoặc cookie
/gioi-thieu   → Ngôn ngữ xác định từ domain hoặc cookie
```

```typescript
localePrefix: 'never'
```

**Ưu điểm**: URL hoàn toàn sạch, thường dùng với **domain routing**.
**Nhược điểm**: Cần cơ chế khác để xác định ngôn ngữ (cookie, domain).

### So sánh trực quan

| URL Pattern | `always` | `as-needed` | `never` |
|---|---|---|---|
| Trang chủ (EN) | `/en` | `/` | `/` |
| Trang chủ (VI) | `/vi` | `/vi` | `/` |
| About (EN) | `/en/about` | `/about` | `/about` |
| About (VI) | `/vi/gioi-thieu` | `/vi/gioi-thieu` | `/gioi-thieu` |

---

## 5. Pathnames — Dịch đường dẫn theo ngôn ngữ

### 5.1. Tại sao cần localized pathnames?

Khi một website phục vụ đa quốc gia, URL bằng ngôn ngữ bản địa mang lại:
- **SEO tốt hơn**: Google ưu tiên URL có từ khóa ngôn ngữ bản địa
- **UX tốt hơn**: Người dùng Việt Nam thấy `/san-pham/iphone-15` thay vì `/products/iphone-15`
- **Chuyên nghiệp hơn**: Thể hiện sự quan tâm đến thị trường bản địa

### 5.2. Cách khai báo pathnames

```typescript
pathnames: {
  // ─── Đường dẫn tĩnh (Static paths) ────────────────────
  '/': '/',                    // Giống nhau ở mọi ngôn ngữ

  '/about': {
    en: '/about',
    vi: '/gioi-thieu',
    de: '/ueber-uns',
  },

  '/contact': {
    en: '/contact',
    vi: '/lien-he',
  },

  // ─── Đường dẫn động (Dynamic segments) ────────────────
  '/products/[slug]': {
    en: '/products/[slug]',
    vi: '/san-pham/[slug]',
    de: '/produkte/[slug]',
  },

  // ─── Catch-all segments ────────────────────────────────
  '/categories/[...slug]': {
    en: '/categories/[...slug]',
    vi: '/danh-muc/[...slug]',
  },
}
```

### 5.3. Key rules (Quy tắc quan trọng)

| Quy tắc | Mô tả | Ví dụ |
|---|---|---|
| Key = Internal path | Key của object là đường dẫn mà developer sử dụng trong code | `'/about'` |
| Value = User-facing path | Value là đường dẫn người dùng thấy trên trình duyệt | `'/gioi-thieu'` |
| Dynamic segments giữ nguyên | `[slug]`, `[id]`, `[...path]` phải giống nhau ở mọi locale | `'/products/[slug]'` |
| String shorthand | Nếu path giống nhau ở mọi locale, dùng string thay vì object | `'/': '/'` |

### 5.4. Luồng hoạt động khi có pathnames

```
Developer viết:    <Link href="/products/iphone-15">
                            │
                            ▼
next-intl kiểm tra: locale hiện tại = 'vi'
                    pathnames['/products/[slug]'].vi = '/san-pham/[slug]'
                            │
                            ▼
URL trên trình duyệt: /vi/san-pham/iphone-15
                            │
                            ▼
Middleware nhận request: /vi/san-pham/iphone-15
                            │
                            ▼
Middleware rewrite về:  /vi/products/iphone-15 (internal path)
                            │
                            ▼
Next.js render:         app/[locale]/products/[slug]/page.tsx
```

---

## 6. Proxy / Middleware — Xử lý request trên server

### 6.1. Vai trò

Middleware (hoặc proxy trong Next.js 16) là **tuyến phòng thủ đầu tiên** xử lý mọi incoming request. Nó thực hiện:

1. **Locale Negotiation**: Xác định ngôn ngữ từ URL → cookie → Accept-Language header
2. **Redirect**: Chuyển hướng request không có locale prefix (`/about` → `/en/about`)
3. **Rewrite**: Chuyển đổi localized paths về internal paths (`/vi/san-pham/...` → `/vi/products/...`)
4. **Cookie Setting**: Lưu ngôn ngữ đã chọn vào cookie `NEXT_LOCALE`

### 6.2. Cách thiết lập

```typescript
// src/middleware.ts (hoặc src/proxy.ts cho Next.js 16)
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Chỉ chạy middleware trên page routes
  // Bỏ qua: API routes, static files, hình ảnh, favicon...
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)',]
};
```

### 6.3. Quy trình xử lý nội bộ của Middleware

```
Incoming Request: GET /vi/san-pham/iphone-15
                        │
                        ▼
            ┌─── Extract locale từ URL ───┐
            │   pathname = /vi/san-pham/.. │
            │   locale = 'vi'              │
            └──────────┬───────────────────┘
                       │
                       ▼
         ┌─── Kiểm tra pathnames config ───┐
         │  '/products/[slug]':              │
         │    vi: '/san-pham/[slug]'         │
         │  Match! Cần rewrite.              │
         └──────────┬────────────────────────┘
                    │
                    ▼
         ┌─── Rewrite URL ─────────────────┐
         │  /vi/san-pham/iphone-15           │
         │          ↓                        │
         │  /vi/products/iphone-15           │
         │  (internal path cho Next.js)      │
         └──────────┬────────────────────────┘
                    │
                    ▼
         ┌─── Set response headers ────────┐
         │  Set-Cookie: NEXT_LOCALE=vi      │
         │  x-next-intl-locale: vi          │
         └─────────────────────────────────┘
                    │
                    ▼
          Next.js render: app/[locale]/products/[slug]/page.tsx
          với params = { locale: 'vi', slug: 'iphone-15' }
```

### 6.4. Locale Negotiation Algorithm (Thuật toán xác định ngôn ngữ)

Middleware xác định ngôn ngữ theo **thứ tự ưu tiên** sau:

```
1. URL Prefix      → /vi/about        → locale = 'vi'     ✅ Ưu tiên cao nhất
2. Cookie          → NEXT_LOCALE=vi    → locale = 'vi'     ✅ 
3. Accept-Language → vi-VN,vi;q=0.9   → locale = 'vi'     ✅
4. defaultLocale   → 'en'             → locale = 'en'     ✅ Fallback cuối cùng
```

> **Lưu ý**: Có thể tắt bước 3 (Accept-Language detection) bằng `localeDetection: false`.

---

## 7. Navigation APIs — Link, useRouter, usePathname

### 7.1. Tạo Navigation APIs

```typescript
// src/i18n/navigation.ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

`createNavigation()` nhận vào `routing` config và trả về **các wrapper xung quanh Next.js navigation APIs**, tự động xử lý locale và pathname translation.

### 7.2. `<Link>` Component

```tsx
import { Link } from '@/i18n/navigation';

// Developer viết internal path:
<Link href="/about">About Us</Link>

// next-intl tự động render:
// Nếu locale = 'en': <a href="/en/about">About Us</a>
// Nếu locale = 'vi': <a href="/vi/gioi-thieu">About Us</a>
// Nếu locale = 'de': <a href="/de/ueber-uns">About Us</a>
```

**Với dynamic segments:**

```tsx
// Internal path — viết giống như Next.js file-based routing:
<Link href="/products/iphone-15">iPhone 15</Link>

// Kết quả:
// locale = 'vi': <a href="/vi/san-pham/iphone-15">iPhone 15</a>
// locale = 'en': <a href="/en/products/iphone-15">iPhone 15</a>
```

**Chuyển locale:**

```tsx
// Force chuyển sang ngôn ngữ cụ thể:
<Link href="/about" locale="de">Über uns</Link>
// → <a href="/de/ueber-uns">Über uns</a>
```

### 7.3. `useRouter()` Hook

```tsx
import { useRouter } from '@/i18n/navigation';

function MyComponent() {
  const router = useRouter();

  const handleClick = () => {
    // Tự động thêm locale prefix + pathname translation:
    router.push('/about');
    // locale = 'vi' → navigate to /vi/gioi-thieu

    // Chuyển locale:
    router.push('/about', { locale: 'de' });
    // → navigate to /de/ueber-uns

    // Các method khác cũng hoạt động:
    router.replace('/products');
    router.prefetch('/about');
    router.back();
    router.forward();
  };

  return <button onClick={handleClick}>Go</button>;
}
```

### 7.4. `usePathname()` Hook

```tsx
import { usePathname } from '@/i18n/navigation';

function ActiveLink() {
  const pathname = usePathname();
  // Luôn trả về INTERNAL path, không có locale prefix
  // URL trên trình duyệt: /vi/san-pham/iphone-15
  // usePathname() trả về: /products/iphone-15

  return (
    <nav>
      <Link
        href="/products"
        className={pathname.startsWith('/products') ? 'active' : ''}
      >
        Products
      </Link>
    </nav>
  );
}
```

> **Điểm quan trọng**: `usePathname()` của `next-intl` trả về **internal path** (không có locale prefix và đã reverse localized pathname). Điều này cho phép viết logic routing mà không cần quan tâm đến ngôn ngữ hiện tại.

### 7.5. `redirect()` Function

```typescript
import { redirect } from '@/i18n/navigation';

// Trong Server Component hoặc Server Action:
redirect('/about');
// locale = 'vi' → redirect to /vi/gioi-thieu

redirect('/about', 'de');
// → redirect to /de/ueber-uns
```

### 7.6. `getPathname()` Function

```typescript
import { getPathname } from '@/i18n/navigation';

// Tạo URL đầy đủ (hữu ích cho metadata, sitemap):
const url = getPathname({
  href: '/products/iphone-15',
  locale: 'vi'
});
// → '/vi/san-pham/iphone-15'
```

---

## 8. Domain Routing — Routing theo tên miền

### 8.1. Khi nào cần domain routing?

Khi muốn mỗi ngôn ngữ có tên miền riêng:

```
shopee.vn      → Tiếng Việt
shopee.com     → English
shopee.co.th   → ภาษาไทย
```

### 8.2. Cách cấu hình

```typescript
export const routing = defineRouting({
  locales: ['en', 'vi', 'th'],
  defaultLocale: 'en',
  localePrefix: 'never', // Không cần prefix vì domain xác định locale

  domains: [
    {
      domain: 'shopee.com',
      defaultLocale: 'en',
    },
    {
      domain: 'shopee.vn',
      defaultLocale: 'vi',
    },
    {
      domain: 'shopee.co.th',
      defaultLocale: 'th',
    },
  ],
});
```

### 8.3. Luồng hoạt động

```
Request: https://shopee.vn/san-pham/iphone
                    │
                    ▼
Middleware kiểm tra domain: shopee.vn → locale = 'vi'
                    │
                    ▼
Rewrite: /san-pham/iphone → /products/iphone (internal)
                    │
                    ▼
Render: app/[locale]/products/[slug]/page.tsx
        params = { locale: 'vi', slug: 'iphone' }
```

---

## 9. Cơ chế hoạt động nội bộ (Internal Mechanics)

### 9.1. Chuỗi xử lý tổng quan

```
┌─────────────────────────────────────────────────────────────────────┐
│                      defineRouting()                                 │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ locales  │  │ localePrefix │  │ pathnames│  │ defaultLocale │  │
│  └────┬─────┘  └──────┬───────┘  └────┬─────┘  └───────┬───────┘  │
│       │               │               │                │           │
│       └───────────┬────┴───────────────┴────────────────┘           │
│                   │                                                 │
│                   ▼                                                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              routing (config object)                         │   │
│  └────────────────────────┬────────────────────────────────────┘   │
└───────────────────────────┼─────────────────────────────────────────┘
                            │
               ┌────────────┴────────────┐
               │                         │
               ▼                         ▼
    ┌─────────────────────┐   ┌─────────────────────┐
    │  createMiddleware()  │   │ createNavigation()   │
    │  ─────────────────── │   │ ─────────────────── │
    │  Server-side:        │   │  Client-side:        │
    │  • Locale negotiation│   │  • Link component    │
    │  • URL rewriting     │   │  • useRouter()       │
    │  • Cookie setting    │   │  • usePathname()     │
    │  • Redirects         │   │  • redirect()        │
    └─────────────────────┘   └─────────────────────┘
```

### 9.2. Pathname Resolution (Phân giải đường dẫn)

Khi `<Link href="/products/iphone-15">` được render, `next-intl` thực hiện:

```
Bước 1: Nhận href = "/products/iphone-15"
                │
Bước 2: Tách dynamic segments
         pattern = "/products/[slug]"
         params = { slug: "iphone-15" }
                │
Bước 3: Tra cứu pathnames config
         pathnames["/products/[slug]"][currentLocale]
         → nếu locale = 'vi': "/san-pham/[slug]"
                │
Bước 4: Inject dynamic params
         "/san-pham/[slug]" → "/san-pham/iphone-15"
                │
Bước 5: Thêm locale prefix (tùy localePrefix strategy)
         → "/vi/san-pham/iphone-15"
                │
Bước 6: Render <a href="/vi/san-pham/iphone-15">
```

### 9.3. Middleware Rewrite (Quá trình rewrite ngược)

Khi server nhận request `/vi/san-pham/iphone-15`, middleware thực hiện:

```
Bước 1: Extract locale prefix
         pathname = "/vi/san-pham/iphone-15"
         locale = "vi"
         remainingPath = "/san-pham/iphone-15"
                │
Bước 2: Reverse lookup trong pathnames
         Tìm pattern có vi: "/san-pham/[slug]"
         → canonical pattern = "/products/[slug]"
                │
Bước 3: Extract params từ localized path
         "/san-pham/iphone-15" match "/san-pham/[slug]"
         → params = { slug: "iphone-15" }
                │
Bước 4: Reconstruct internal path
         "/products/[slug]" + params → "/products/iphone-15"
                │
Bước 5: Rewrite request
         NextResponse.rewrite("/vi/products/iphone-15")
         (URL trên trình duyệt vẫn giữ nguyên /vi/san-pham/iphone-15)
                │
Bước 6: Next.js match route
         app/[locale]/products/[slug]/page.tsx
         params = { locale: "vi", slug: "iphone-15" }
```

### 9.4. Type Safety — Kiểm tra kiểu tĩnh

Khi bạn khai báo `pathnames` trong `defineRouting()`, TypeScript sẽ:

```typescript
// ✅ Hợp lệ — path tồn tại trong pathnames config
<Link href="/about">About</Link>
<Link href="/products/iphone-15">iPhone 15</Link>

// ❌ Lỗi TypeScript — path KHÔNG tồn tại trong pathnames config
<Link href="/blog">Blog</Link>
// Type error: Type '"/blog"' is not assignable to type 
//   '"/about" | "/products/[slug]" | ...'
```

**Cách hoạt động**: `createNavigation(routing)` sử dụng TypeScript generics để infer kiểu từ `routing.pathnames` keys, tạo ra union type cho prop `href`.

---

## 10. Cấu trúc thư mục chuẩn

### Cấu trúc với next-intl (full setup)

```
src/
├── app/
│   └── [locale]/                  ← Dynamic segment cho locale
│       ├── layout.tsx             ← Root layout, nhận locale param
│       ├── page.tsx               ← Trang chủ
│       ├── about/
│       │   └── page.tsx           ← /en/about hoặc /vi/gioi-thieu
│       └── products/
│           ├── page.tsx           ← /en/products hoặc /vi/san-pham
│           └── [slug]/
│               └── page.tsx       ← /en/products/xyz hoặc /vi/san-pham/xyz
│
├── i18n/
│   ├── routing.ts                 ← defineRouting() — source of truth
│   ├── navigation.ts             ← createNavigation() — Link, useRouter
│   ├── request.ts                ← getRequestConfig() — server config
│   └── messages/
│       ├── en.json               ← Bản dịch English
│       └── vi.json               ← Bản dịch Tiếng Việt
│
├── middleware.ts                  ← createMiddleware(routing)
│   (hoặc proxy.ts cho Next.js 16)
│
└── components/
    ├── Header.tsx                ← Dùng <Link> từ @/i18n/navigation
    └── LanguageSwitcher.tsx      ← Dùng useRouter từ @/i18n/navigation
```

### So sánh với Shopee Clone hiện tại

```
src/
├── app/
│   ├── products/                  ← KHÔNG có [locale] wrapper
│   │   ├── [slug]/page.tsx
│   │   └── create/page.tsx
│   └── profile/page.tsx
│
├── lib/
│   └── i18n/
│       ├── routeMap.ts            ← Tương đương defineRouting() 
│       ├── I18nProvider.tsx       ← Client-side provider (i18next)
│       ├── index.ts              ← i18next init
│       └── locales/
│           ├── vi.ts
│           └── en.ts
│
├── proxy.ts                       ← Tương đương createMiddleware()
│
└── components/
    ├── Header.tsx                 ← Dùng getLocalizedPathFor()
    └── LanguageSwitcher.tsx       ← Dùng translatePath()
```

---

## 11. So sánh next-intl vs i18next (Shopee Clone)

| Tiêu chí | next-intl | i18next + routeMap (Shopee Clone) |
|---|---|---|
| **Thiết kế cho** | Next.js App Router | Framework-agnostic |
| **Server Components** | ✅ Native support | ❌ Client-only |
| **Cấu trúc thư mục** | Yêu cầu `app/[locale]/` | Không thay đổi cấu trúc |
| **Routing tích hợp** | ✅ Middleware + Navigation APIs | ⚡ Tự build (rewrites + proxy) |
| **Type-safe navigation** | ✅ Tự động từ pathnames | ❌ Manual |
| **Locale Prefix** | `always` / `as-needed` / `never` | `never` (tự quản lý) |
| **Pathnames config** | Built-in `defineRouting()` | Tự tạo `localizedRouting` |
| **Link component** | Auto-translate href | Manual `getLocalizedPathFor()` |
| **URL update khi đổi ngôn ngữ** | `router.push()` auto-handle | `window.history.replaceState()` |
| **Refactor effort** | Lớn (cần `[locale]` folder) | Nhỏ (giữ nguyên cấu trúc) |
| **Chuyển đổi tức thì** | Cần page navigation | ✅ Instant (client-side) |
| **Bundle size** | ~5KB | ~15KB (i18next) |
| **Mở rộng locale mới** | Thêm vào `locales` array | Thêm vào `pathnames` object |

### Khi nào chọn cái nào?

```
📌 Chọn next-intl khi:
   → Dự án mới, bắt đầu từ đầu với App Router
   → Cần SEO đa ngôn ngữ chuẩn chỉ (Server-side rendering)
   → Cần type-safe navigation
   → Team quen với Next.js ecosystem

📌 Chọn i18next + routeMap (như Shopee Clone) khi:
   → Dự án đã có sẵn, không muốn restructure folders
   → Chuyển đổi ngôn ngữ tức thì (không reload) là ưu tiên
   → Codebase chủ yếu là Client Components
   → Cần linh hoạt, không phụ thuộc framework cụ thể
```

---

## 12. Shopee Clone đã áp dụng gì từ next-intl?

Shopee Clone **không sử dụng trực tiếp** `next-intl`, nhưng đã **lấy cảm hứng từ kiến trúc của nó** để xây dựng hệ thống routing riêng:

### Những gì đã áp dụng

| Concept từ next-intl | Triển khai trong Shopee Clone |
|---|---|
| `defineRouting()` | `localizedRouting` trong `routeMap.ts` |
| `pathnames` config | `localizedRouting.pathnames` object |
| `createMiddleware()` | `proxy.ts` với `getLocaleFromPath()` |
| Navigation API `Link` | `getLocalizedPathFor()` helper |
| `usePathname()` reverse lookup | `getLocaleFromPath()` trong `I18nProvider.tsx` |
| `localePrefix: 'never'` | Không dùng prefix, chỉ thay đổi path segment |
| `rewrites` tự động | `next.config.ts` loop qua `pathnames` |

### Ví dụ so sánh cụ thể

**next-intl (nếu dùng):**
```typescript
// routing.ts
export const routing = defineRouting({
  locales: ['en', 'vi'],
  defaultLocale: 'en',
  pathnames: {
    '/products/[slug]': {
      en: '/products/[slug]',
      vi: '/san-pham/[slug]',
    },
  },
});

// Component:
import { Link } from '@/i18n/navigation';
<Link href="/products/iphone-15">iPhone 15</Link>
// → tự động thành /vi/san-pham/iphone-15
```

**Shopee Clone (hiện tại):**
```typescript
// routeMap.ts
export const localizedRouting = {
  locales: ['en', 'vi'],
  defaultLocale: 'en',
  pathnames: {
    '/products': {
      en: '/products',
      vi: '/san-pham',
    },
  },
};

// Component:
import { getLocalizedPathFor } from '@/lib/i18n/routeMap';
<Link href={getLocalizedPathFor(`/products/${slug}`, i18n.language)}>
  iPhone 15
</Link>
// → /san-pham/iphone-15 (khi language = 'vi')
```

**Khác biệt chính**: Shopee Clone không dùng `[locale]` folder nên **không có locale prefix** trên URL (`/san-pham/...` thay vì `/vi/san-pham/...`). Đây là trade-off có chủ đích để giữ URL sạch và chuyển đổi ngôn ngữ tức thì.

---

## 13. Tài liệu tham khảo

| Tài liệu | Link |
|---|---|
| next-intl Official Docs | https://next-intl.dev |
| Routing Overview | https://next-intl.dev/docs/routing |
| Routing Configuration | https://next-intl.dev/docs/routing/configuration |
| Proxy / Middleware | https://next-intl.dev/docs/routing/middleware |
| Navigation APIs | https://next-intl.dev/docs/routing/navigation |
| GitHub Repository | https://github.com/amannn/next-intl |
| Video Course (Learn) | https://learn.next-intl.dev |
| Next.js App Router i18n | https://nextjs.org/docs/app/guides/internationalization |

---

> **Ghi chú**: Tài liệu này được viết để tìm hiểu chuyên sâu về `next-intl/routing`. Shopee Clone hiện tại sử dụng `i18next` kết hợp với cấu hình `localizedRouting` tự xây dựng — lấy cảm hứng từ cấu trúc `defineRouting()` của `next-intl`, nhưng **không cài đặt** package `next-intl`.
