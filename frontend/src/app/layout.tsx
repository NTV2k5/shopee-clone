import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import I18nProvider from "@/lib/i18n/I18nProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ─── BASE URL ────────────────────────────────────────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";

// ─── ROOT METADATA ────────────────────────────────────────────────────────────
// Metadata này được dùng mặc định cho toàn site.
// Các trang con có thể override bằng cách export `metadata` hoặc `generateMetadata`.
export const metadata: Metadata = {
  // Title template: các trang con sẽ dùng "%s | Shopee Clone"
  // Ví dụ: "iPhone 15 Pro Max | Shopee Clone"
  title: {
    template: "%s | Shopee Clone",
    default: "Shopee Clone - Mua Sắm Trực Tuyến Giá Tốt",
  },

  description:
    "Shopee Clone - Mua sắm trực tuyến với hàng ngàn sản phẩm chính hãng. Điện thoại, thời trang, mỹ phẩm, gia dụng giá tốt nhất. Giao hàng nhanh toàn quốc.",

  keywords: [
    "mua sắm online",
    "thương mại điện tử",
    "shopee",
    "giá rẻ",
    "hàng chính hãng",
    "mua hàng trực tuyến Việt Nam",
  ],

  // ─── Authors & Creator ────────────────────────────────────────────────────
  authors: [{ name: "Shopee Clone Team" }],
  creator: "Shopee Clone",

  // ─── Open Graph (cho Facebook, Zalo, LinkedIn khi share link) ────────────
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: BASE_URL,
    siteName: "Shopee Clone",
    title: "Shopee Clone - Mua Sắm Trực Tuyến Giá Tốt",
    description:
      "Mua sắm trực tuyến với hàng ngàn sản phẩm chính hãng. Điện thoại, thời trang, mỹ phẩm giá tốt nhất.",
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,   // Tạo ảnh 1200x630px đặt vào /public/og-image.jpg
        width: 1200,
        height: 630,
        alt: "Shopee Clone - Mua Sắm Trực Tuyến",
      },
    ],
  },

  // ─── Twitter Card (cho Twitter/X khi share link) ──────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Shopee Clone - Mua Sắm Trực Tuyến Giá Tốt",
    description: "Hàng ngàn sản phẩm chính hãng, giá tốt nhất, giao hàng nhanh.",
    images: [`${BASE_URL}/og-image.jpg`],
  },

  // ─── Robots ───────────────────────────────────────────────────────────────
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

  // ─── Canonical URL ────────────────────────────────────────────────────────
  alternates: {
    canonical: BASE_URL,
    languages: {
      "vi-VN": BASE_URL,
    },
  },

  // ─── Google Search Console Verification ──────────────────────────────────
  // Thay bằng code verify thực tế từ GSC của bạn
  // verification: {
  //   google: "your-google-search-console-verification-code",
  // },

  // ─── Other ────────────────────────────────────────────────────────────────
  category: "ecommerce",
};

// ─── WEBSITE STRUCTURED DATA (JSON-LD) ───────────────────────────────────────
// Giúp Google hiểu đây là website gì và hỗ trợ Search Box trong kết quả tìm kiếm
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Shopee Clone",
  url: BASE_URL,
  description: "Website mua sắm trực tuyến với hàng ngàn sản phẩm chính hãng",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// ─── ORGANIZATION STRUCTURED DATA ────────────────────────────────────────────
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Shopee Clone",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // lang="vi" quan trọng! Cho Google biết website ngôn ngữ tiếng Việt
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* ─── Structured Data: WebSite + Organization ─────────────────── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50">
        <I18nProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
