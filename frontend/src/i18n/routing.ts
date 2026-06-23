import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'vi', 'zh', 'ja'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/products': {
      en: '/products',
      vi: '/san-pham',
      zh: '/products',
      ja: '/products',
    },
    '/products/[slug]': {
      en: '/products/[slug]',
      vi: '/san-pham/[slug]',
      zh: '/products/[slug]',
      ja: '/products/[slug]',
    },
    '/products/create': {
      en: '/products/create',
      vi: '/san-pham/tao-moi',
      zh: '/products/create',
      ja: '/products/create',
    },
    '/profile': {
      en: '/profile',
      vi: '/ho-so',
      zh: '/profile',
      ja: '/profile',
    },
    '/users': {
      en: '/users',
      vi: '/nguoi-dung',
      zh: '/users',
      ja: '/users',
    },
    '/cart': '/cart',
    '/checkout': '/checkout',
    '/orders': '/orders',
    '/login': '/login',
    '/signup': '/signup',
    '/forgot-password': '/forgot-password',
    '/change-password': '/change-password',
    '/reset-password': '/reset-password',
  },
});

export type AppPathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];
