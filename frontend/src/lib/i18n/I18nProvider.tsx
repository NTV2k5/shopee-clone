'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from './index';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/san-pham/')) {
      if (i18n.language !== 'vi') {
        i18n.changeLanguage('vi');
        document.documentElement.lang = 'vi';
      }
    } else if (pathname.startsWith('/products/')) {
      if (i18n.language !== 'en') {
        i18n.changeLanguage('en');
        document.documentElement.lang = 'en';
      }
    }
  }, [pathname]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
