import type { Metadata } from "next";

// ─── BASE URL ────────────────────────────────────────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";

// ─── ROOT METADATA ────────────────────────────────────────────────────────────
export const metadata: Metadata = {
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
  authors: [{ name: "Shopee Clone Team" }],
  creator: "Shopee Clone",
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
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Shopee Clone - Mua Sắm Trực Tuyến",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopee Clone - Mua Sắm Trực Tuyến Giá Tốt",
    description: "Hàng ngàn sản phẩm chính hãng, giá tốt nhất, giao hàng nhanh.",
    images: [`${BASE_URL}/og-image.jpg`],
  },
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
  alternates: {
    canonical: BASE_URL,
    languages: {
      "vi-VN": BASE_URL,
    },
  },
  category: "ecommerce",
};

// Root layout — minimal wrapper, does NOT render <html> or <body>.
// The locale layout handles those with the correct lang attribute.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
