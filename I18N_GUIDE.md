# 📚 Hướng Dẫn Tìm Hiểu i18next & Internationalization (i18n)

> **Mục đích**: Tài liệu tổng hợp để hiểu rõ về i18next, các approach i18n trong Next.js, và cách áp dụng vào dự án Shopee Clone.
>
> **Nguồn tham khảo chính**:
> - https://nextjs.org/docs/pages/guides/internationalization (Pages Router)
> - https://nextjs.org/docs/app/guides/internationalization (App Router)
> - https://www.i18next.com/overview/getting-started
> - https://react.i18next.com/getting-started

---

## 📖 Mục Lục

1. [Internationalization (i18n) là gì?](#1-internationalization-i18n-là-gì)
2. [Các thuật ngữ quan trọng](#2-các-thuật-ngữ-quan-trọng)
3. [Tổng quan về i18next](#3-tổng-quan-về-i18next)
4. [react-i18next - Tích hợp với React](#4-react-i18next---tích-hợp-với-react)
5. [Next.js Internationalization - Pages Router](#5-nextjs-internationalization---pages-router)
6. [Next.js Internationalization - App Router](#6-nextjs-internationalization---app-router)
7. [So sánh các approach i18n cho Next.js](#7-so-sánh-các-approach-i18n-cho-nextjs)
8. [Approach đã chọn cho Shopee Clone](#8-approach-đã-chọn-cho-shopee-clone)
9. [Best Practices](#9-best-practices)

---

## 1. Internationalization (i18n) là gì?

**Internationalization** (viết tắt **i18n** - vì có 18 ký tự giữa chữ "i" và "n") là quá trình thiết kế và phát triển phần mềm để có thể **dễ dàng hỗ trợ nhiều ngôn ngữ và vùng miền** mà không cần thay đổi mã nguồn.

**Localization** (viết tắt **l10n**) là quá trình **dịch nội dung** và điều chỉnh giao diện cho từng ngôn ngữ/vùng miền cụ thể.

```
i18n = Xây dựng nền tảng (code, cấu trúc)
l10n = Dịch nội dung thực tế (text, ngày tháng, tiền tệ)
```

### Tại sao cần i18n?

- **Mở rộng thị trường**: Website có thể tiếp cận người dùng toàn cầu
- **Trải nghiệm người dùng tốt hơn**: Người dùng thấy nội dung bằng ngôn ngữ của họ
- **SEO quốc tế**: Google hiểu website hỗ trợ nhiều ngôn ngữ → rank tốt hơn ở nhiều quốc gia
- **Yêu cầu pháp lý**: Một số thị trường yêu cầu website phải có ngôn ngữ bản địa

---

## 2. Các Thuật Ngữ Quan Trọng

| Thuật ngữ | Giải thích | Ví dụ |
|-----------|-----------|-------|
| **Locale** | Mã định danh ngôn ngữ + vùng miền | `vi-VN`, `en-US`, `ja-JP` |
| **Language** | Mã ngôn ngữ (ISO 639-1) | `vi`, `en`, `ja` |
| **Region** | Mã vùng (ISO 3166-1) | `VN`, `US`, `JP` |
| **Translation key** | Khóa dùng để tra cứu text đã dịch | `header.login`, `cart.empty` |
| **Namespace** | Nhóm các translation key theo module | `common`, `header`, `cart` |
| **Fallback** | Ngôn ngữ dự phòng khi không tìm thấy bản dịch | Nếu `vi` thiếu key → dùng `en` |
| **Interpolation** | Chèn biến động vào text dịch | `"Xin chào {{name}}"` → `"Xin chào Minh"` |
| **Pluralization** | Xử lý số nhiều/ít | `"1 item"` vs `"5 items"` |

### Locale Identifier (UTS)

Locale thường có dạng: `language-region-script`

```
vi-VN     = Tiếng Việt tại Việt Nam
en-US     = English tại Mỹ  
en-GB     = English tại Anh
zh-Hans   = Tiếng Trung giản thể
zh-Hant   = Tiếng Trung phồn thể
pt-BR     = Tiếng Bồ Đào Nha tại Brazil
```

---

## 3. Tổng Quan Về i18next

### i18next là gì?

**i18next** là một **framework internationalization** được viết bằng JavaScript. Nó KHÔNG phải chỉ là một thư viện dịch thuần túy — mà là một hệ sinh thái đầy đủ bao gồm:

- Core library (`i18next`)
- React binding (`react-i18next`)
- Language detector (`i18next-browser-languagedetector`)
- Backend loader (`i18next-http-backend`)
- Nhiều plugin khác

### Tại sao chọn i18next?

| Ưu điểm | Chi tiết |
|---------|---------|
| **Phổ biến nhất** | 7.7M+ weekly downloads trên npm |
| **Framework agnostic** | Dùng được với React, Vue, Angular, Node.js, vanilla JS |
| **Hệ sinh thái lớn** | 50+ plugins chính thức |
| **Feature-rich** | Pluralization, nesting, context, interpolation, formatting |
| **Stable** | Tồn tại từ 2011, API ổn định |

### Kiến trúc i18next

```
┌─────────────────────────────────────────┐
│             Application                  │
├─────────────────────────────────────────┤
│         react-i18next                    │  ← React hooks/components
│     (useTranslation, Trans, etc.)        │
├─────────────────────────────────────────┤
│              i18next                     │  ← Core engine
│  (init, t(), changeLanguage, events)     │
├─────────────────────────────────────────┤
│            Plugins                       │
│  ┌──────────┐ ┌───────────┐ ┌────────┐  │
│  │ Language  │ │  Backend  │ │ Cache  │  │
│  │ Detector  │ │  Loader   │ │ Layer  │  │
│  └──────────┘ └───────────┘ └────────┘  │
├─────────────────────────────────────────┤
│         Translation Resources            │
│    { vi: {...}, en: {...} }              │
└─────────────────────────────────────────┘
```

### Cách hoạt động cơ bản

#### Bước 1: Khởi tạo i18next

```javascript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next) // Plugin để tích hợp với React
  .init({
    resources: {
      en: {
        translation: {
          "welcome": "Welcome to React",
          "hello": "Hello {{name}}"
        }
      },
      vi: {
        translation: {
          "welcome": "Chào mừng đến với React",
          "hello": "Xin chào {{name}}"
        }
      }
    },
    lng: "vi",           // Ngôn ngữ mặc định
    fallbackLng: "en",   // Ngôn ngữ dự phòng
    interpolation: {
      escapeValue: false  // React đã escape XSS sẵn
    }
  });

export default i18n;
```

#### Bước 2: Sử dụng trong Component

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t('welcome')}</h1>         {/* "Chào mừng đến với React" */}
      <p>{t('hello', { name: 'Minh' })}</p>  {/* "Xin chào Minh" */}

      {/* Chuyển ngôn ngữ */}
      <button onClick={() => i18n.changeLanguage('en')}>English</button>
      <button onClick={() => i18n.changeLanguage('vi')}>Tiếng Việt</button>
    </div>
  );
}
```

### Các Feature Nâng Cao của i18next

#### a) Interpolation (Chèn biến)

```json
{
  "greeting": "Xin chào {{name}}, bạn có {{count}} tin nhắn mới"
}
```

```jsx
t('greeting', { name: 'Minh', count: 5 })
// → "Xin chào Minh, bạn có 5 tin nhắn mới"
```

#### b) Pluralization (Số nhiều)

```json
{
  "item": "{{count}} sản phẩm",
  "item_plural": "{{count}} sản phẩm"
}
```

> **Lưu ý**: Tiếng Việt không phân biệt số ít/nhiều nên 2 key giống nhau. Nhưng tiếng Anh thì khác:

```json
{
  "item_one": "{{count}} item",
  "item_other": "{{count}} items"
}
```

#### c) Nesting (Lồng nhau)

```json
{
  "header": {
    "title": "Shopee Clone",
    "nav": {
      "home": "Trang chủ",
      "cart": "Giỏ hàng"
    }
  }
}
```

```jsx
t('header.nav.home')  // → "Trang chủ"
```

#### d) Context (Ngữ cảnh)

```json
{
  "friend": "A friend",
  "friend_male": "A boyfriend",
  "friend_female": "A girlfriend"
}
```

```jsx
t('friend', { context: 'male' })  // → "A boyfriend"
```

#### e) Namespace (Phân chia module)

```javascript
// Thay vì 1 file khổng lồ, chia thành nhiều namespace:
resources: {
  vi: {
    header: { ... },     // src/locales/vi/header.json
    footer: { ... },     // src/locales/vi/footer.json  
    cart: { ... },       // src/locales/vi/cart.json
    common: { ... }      // src/locales/vi/common.json
  }
}
```

```jsx
// Sử dụng namespace cụ thể
const { t } = useTranslation('header');
t('login')  // Tra trong namespace "header"
```

---

## 4. react-i18next - Tích Hợp Với React

### Các Hook chính

#### `useTranslation()` - Hook phổ biến nhất

```jsx
import { useTranslation } from 'react-i18next';

function Header() {
  const { t, i18n } = useTranslation();
  
  // t(key) - Hàm dịch
  // i18n.language - Ngôn ngữ hiện tại
  // i18n.changeLanguage(lng) - Đổi ngôn ngữ
  
  return <h1>{t('header.title')}</h1>;
}
```

#### `Trans` Component - Cho text phức tạp

Khi text có chứa **HTML tag** hoặc **React component**:

```jsx
import { Trans } from 'react-i18next';

// Translation: "Đọc <strong>điều khoản</strong> và <a>chính sách</a>"
<Trans i18nKey="terms">
  Đọc <strong>điều khoản</strong> và <a href="/policy">chính sách</a>
</Trans>
```

#### `withTranslation()` - HOC (cho Class Component)

```jsx
import { withTranslation } from 'react-i18next';

class MyComponent extends React.Component {
  render() {
    const { t } = this.props;
    return <p>{t('message')}</p>;
  }
}

export default withTranslation()(MyComponent);
```

### Language Detection

Plugin `i18next-browser-languagedetector` tự động detect ngôn ngữ:

```javascript
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .init({
    detection: {
      // Thứ tự ưu tiên khi detect ngôn ngữ:
      order: ['localStorage', 'cookie', 'navigator', 'htmlTag'],
      
      // Lưu ngôn ngữ đã chọn vào:
      caches: ['localStorage', 'cookie'],
      
      // Key trong localStorage
      lookupLocalStorage: 'i18nextLng',
    }
  });
```

**Luồng hoạt động:**

```
User mở web lần đầu
  → Kiểm tra localStorage ('i18nextLng') → không có
  → Kiểm tra cookie → không có
  → Kiểm tra navigator.language → 'vi-VN'
  → Dùng 'vi' làm ngôn ngữ

User đổi sang English
  → Gọi i18n.changeLanguage('en')
  → Lưu 'en' vào localStorage
  → Re-render tất cả component dùng useTranslation

User reload trang
  → Kiểm tra localStorage → tìm thấy 'en'
  → Dùng 'en' → Giữ nguyên ngôn ngữ đã chọn ✅
```

---

## 5. Next.js Internationalization - Pages Router

> **Link**: https://nextjs.org/docs/pages/guides/internationalization

Next.js (Pages Router) có **built-in i18n routing** từ v10.0.0.

### Cách cấu hình

```js
// next.config.js
module.exports = {
  i18n: {
    locales: ['en-US', 'vi-VN', 'fr'],
    defaultLocale: 'vi-VN',
  },
}
```

### 2 chiến lược routing

#### a) Sub-path Routing

URL có prefix ngôn ngữ:

```
/blog          → vi-VN (default, không prefix)
/en-US/blog    → en-US
/fr/blog       → fr
```

#### b) Domain Routing

Mỗi ngôn ngữ dùng domain riêng:

```
shopee.vn/blog    → vi-VN
shopee.com/blog   → en-US
shopee.fr/blog    → fr
```

### Tự động detect ngôn ngữ

- Next.js tự đọc header `Accept-Language` của trình duyệt
- Redirect về đúng locale
- Có thể disable bằng `localeDetection: false`

### Cookie `NEXT_LOCALE`

- Có thể set cookie `NEXT_LOCALE=en` để override detect tự động
- Phù hợp cho language switcher

### Truy cập locale info

```jsx
import { useRouter } from 'next/router'

function MyPage() {
  const { locale, locales, defaultLocale } = useRouter();
  
  return (
    <div>
      <p>Current: {locale}</p>         {/* 'vi-VN' */}
      <p>Available: {locales}</p>       {/* ['en-US', 'vi-VN', 'fr'] */}
      <p>Default: {defaultLocale}</p>   {/* 'vi-VN' */}
    </div>
  );
}
```

### Chuyển đổi ngôn ngữ

```jsx
import Link from 'next/link';
import { useRouter } from 'next/router';

function LanguageSwitcher() {
  const router = useRouter();
  
  return (
    <>
      {/* Cách 1: Dùng Link */}
      <Link href="/blog" locale="en-US">English</Link>
      <Link href="/blog" locale="vi-VN">Tiếng Việt</Link>
      
      {/* Cách 2: Dùng router.push */}
      <button onClick={() => {
        const { pathname, asPath, query } = router;
        router.push({ pathname, query }, asPath, { locale: 'en-US' });
      }}>
        English
      </button>
    </>
  );
}
```

### SEO

- Next.js tự thêm `lang` attribute vào `<html>`
- Bạn cần tự thêm `hreflang` meta tags:

```jsx
import Head from 'next/head';

<Head>
  <link rel="alternate" hrefLang="en-US" href="https://example.com/en-US/blog" />
  <link rel="alternate" hrefLang="vi-VN" href="https://example.com/blog" />
</Head>
```

### Lưu ý quan trọng

> ⚠️ **Pages Router i18n routing KHÔNG hoạt động với `output: 'export'`** (Static Export).
> Nó cần Next.js routing layer chạy trên server.

---

## 6. Next.js Internationalization - App Router

> **Link**: https://nextjs.org/docs/app/guides/internationalization

App Router **KHÔNG có built-in i18n config** như Pages Router. Thay vào đó, bạn tự implement.

### Approach chính thức từ Next.js

#### a) Routing dựa trên `[lang]` dynamic segment

```
app/
  [lang]/
    layout.tsx       ← Root layout với lang param
    page.tsx         ← Trang chủ
    products/
      page.tsx
    dictionaries/
      en.json        ← Bản dịch English
      vi.json        ← Bản dịch Tiếng Việt
    dictionaries.ts  ← Helper function
```

#### b) Middleware detect locale

```js
// middleware.js
import { NextResponse } from "next/server";

const locales = ['en', 'vi'];

function getLocale(request) {
  // Detect từ Accept-Language header
  const acceptLang = request.headers.get('accept-language');
  // Logic detect...
  return 'vi'; // default
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Kiểm tra URL đã có locale chưa
  const hasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (hasLocale) return;
  
  // Redirect nếu chưa có locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}
```

#### c) Dictionary pattern (Server Components)

```typescript
// app/[lang]/dictionaries.ts
import 'server-only'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((m) => m.default),
  vi: () => import('./dictionaries/vi.json').then((m) => m.default),
}

export const getDictionary = async (locale: keyof typeof dictionaries) =>
  dictionaries[locale]();
```

```tsx
// app/[lang]/page.tsx
export default async function Page({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  return <button>{dict.products.cart}</button>;
  // → "Thêm Vào Giỏ Hàng" (vi) hoặc "Add to Cart" (en)
}
```

### Ưu điểm của Dictionary Pattern

| Điểm | Chi tiết |
|------|---------|
| **Zero client JS** | Translation files chỉ chạy trên server → bundle size = 0 |
| **Type-safe** | Có thể dùng TypeScript để type-check translation keys |
| **Simple** | Không cần thư viện bên ngoài |

### Nhược điểm

| Điểm | Chi tiết |
|------|---------|
| **Client Components** | Cần truyền dict qua props hoặc context → cumbersome |
| **URL thay đổi** | URL sẽ có prefix `/vi/`, `/en/` |
| **Refactor lớn** | Cần move tất cả files vào `[lang]/` folder |

---

## 7. So Sánh Các Approach i18n Cho Next.js

### Bảng so sánh

| Criteria | Pages Router built-in | App Router `[lang]` | i18next (client-side) | next-intl |
|----------|----------------------|--------------------|-----------------------|-----------|
| **Setup** | Đơn giản (config) | Trung bình | Đơn giản | Trung bình |
| **URL thay đổi** | Có (`/en/page`) | Có (`/en/page`) | **Không** | Có |
| **SEO** | Tốt | Tốt | Trung bình* | Tốt |
| **Server Components** | N/A | ✅ Hoàn toàn | ❌ Client only | ✅ |
| **Client Components** | ✅ | Cần pass props | ✅ Hook dễ dùng | ✅ |
| **Bundle size** | 0 (server) | 0 (server) | ~15KB | ~5KB |
| **Refactor effort** | Nhỏ | **Lớn** (restructure) | **Nhỏ** | Lớn |
| **Real-time switch** | Page reload | Page reload | **Instant** ✨ | Depends |

> *SEO "Trung bình" vì Google crawl HTML ban đầu (server-rendered) sẽ luôn thấy ngôn ngữ mặc định. Nhưng vì đây là dự án học tập nên chấp nhận được.

### Khi nào dùng approach nào?

```
📌 Dùng Pages Router built-in i18n khi:
   → Dùng Pages Router + cần SEO tốt nhất

📌 Dùng App Router [lang] + Dictionary khi:
   → Dùng App Router + SEO quan trọng + chấp nhận refactor lớn

📌 Dùng i18next client-side khi:
   → Chuyển đổi ngôn ngữ tức thì (không reload)
   → Refactor effort nhỏ nhất
   → Hầu hết UI là Client Components
   → Đang học / prototype

📌 Dùng next-intl khi:
   → Production app + App Router + cần full SEO + server components
```

---

## 8. Approach Đã Chọn Cho Shopee Clone

### ✅ Chọn: **i18next + react-i18next (Client-side)**

### Lý do:

1. **Refactor nhỏ nhất**: Không cần restructure folders, không cần thêm `[lang]` segment
2. **Phù hợp codebase**: Shopee Clone dùng App Router nhưng **hầu hết components là Client Components** (`'use client'`)
3. **Chuyển đổi tức thì**: User click `VI | EN` → toàn bộ UI đổi ngay, không cần reload trang
4. **URL không đổi**: Không có prefix `/vi/`, `/en/` trong URL → UX sạch hơn
5. **Dễ học**: `useTranslation()` hook rất intuitive

### Packages cần cài:

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

| Package | Mục đích | Size |
|---------|---------|------|
| `i18next` | Core engine | ~40KB |
| `react-i18next` | React hooks & components | ~15KB |
| `i18next-browser-languagedetector` | Tự detect ngôn ngữ trình duyệt | ~5KB |

### Cách triển khai:

```
src/
  lib/
    i18n/
      index.ts              ← Khởi tạo i18next
      I18nProvider.tsx       ← React Provider (Client Component)
      locales/
        vi.ts               ← Bản dịch Tiếng Việt
        en.ts               ← Bản dịch English
  components/
    LanguageSwitcher.tsx     ← Dropdown chọn VI | EN
    Header.tsx               ← Thêm useTranslation + LanguageSwitcher
    Footer.tsx               ← Thêm useTranslation
    CartClient.tsx           ← Thêm useTranslation
    ...
  app/
    layout.tsx               ← Wrap với I18nProvider
```

### Flow hoạt động:

```
1. User mở website lần đầu
   → LanguageDetector kiểm tra localStorage → không có
   → Kiểm tra navigator.language → 'vi'
   → Hiển thị tiếng Việt

2. User click "EN" trong Header
   → i18n.changeLanguage('en')
   → Lưu 'en' vào localStorage
   → Tất cả component có useTranslation() tự re-render
   → UI đổi sang English NGAY LẬP TỨC (không reload)

3. User reload hoặc quay lại sau
   → LanguageDetector kiểm tra localStorage → tìm thấy 'en'
   → Hiển thị English
```

---

## 9. Best Practices

### 📝 Đặt tên Translation Key

```javascript
// ❌ Không nên - key quá chung chung
"button1": "Đăng nhập"
"text1": "Giỏ hàng trống"

// ✅ Nên - key có cấu trúc rõ ràng
"header.login": "Đăng nhập"
"cart.empty_message": "Giỏ hàng của bạn còn trống"
```

### 📁 Tổ chức Translation Files

```javascript
// ✅ Tổ chức theo component/feature
{
  header: { login, signup, search, ... },
  footer: { copyright, policies, ... },
  cart: { empty, checkout, total, ... },
  common: { loading, save, cancel, ... }
}
```

### 🔤 Interpolation thay vì string concatenation

```javascript
// ❌ Không nên
t('total') + ': ₫' + price.toLocaleString()

// ✅ Nên
t('cart.total', { price: price.toLocaleString() })
// key: "Tổng thanh toán: ₫{{price}}"
```

### 🚫 Đừng dịch dữ liệu từ database

```javascript
// ❌ Không nên dịch tên sản phẩm bằng i18next
t(product.productName)  // Sai! Đây là dữ liệu động

// ✅ Chỉ dịch text UI tĩnh
t('product.add_to_cart')  // "Thêm Vào Giỏ Hàng" / "Add to Cart"
```

### 🔄 Luôn có fallback language

```javascript
i18n.init({
  fallbackLng: 'vi',  // Nếu key không tìm thấy trong 'en' → dùng 'vi'
});
```

### 📊 Giữ cả 2 file dịch đồng bộ

```
Khi thêm key mới vào vi.ts → PHẢI thêm vào en.ts luôn
Khi xóa key ở vi.ts → PHẢI xóa ở en.ts luôn
```

---

## 📚 Tài Liệu Tham Khảo Thêm

| Tài liệu | Link |
|----------|------|
| i18next Documentation | https://www.i18next.com |
| react-i18next Documentation | https://react.i18next.com |
| Next.js i18n (Pages Router) | https://nextjs.org/docs/pages/guides/internationalization |
| Next.js i18n (App Router) | https://nextjs.org/docs/app/guides/internationalization |
| i18next Crash Course (Video) | https://youtu.be/SA_9i4TtxLQ?t=705 |
| i18next GitHub | https://github.com/i18next/i18next |
| Example: i18n routing (Next.js) | https://github.com/vercel/next.js/tree/canary/examples/i18n-routing |
| next-intl (alternative library) | https://next-intl.dev |

---

> **Ghi chú**: Tài liệu này tập trung vào việc tìm hiểu lý thuyết. Để xem cách triển khai thực tế vào Shopee Clone, tham khảo file `implementation_plan.md`.
