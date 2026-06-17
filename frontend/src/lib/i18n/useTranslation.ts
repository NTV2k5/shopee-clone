'use client';

import { useState, useEffect } from 'react';
import { useTranslation as useReactI18nTranslation } from 'react-i18next';

export function useTranslation(ns?: string | string[], options?: any) {
  const { t, i18n, ready } = useReactI18nTranslation(ns, options);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const safeT = (key: string, tOptions?: any): string => {
    if (!isMounted) {
      // Force English during server rendering and initial client render to match SSR HTML
      return i18n.t(key, { ...tOptions, lng: 'en' }) as string;
    }
    return t(key, tOptions) as any as string;
  };

  return { t: safeT, i18n, ready };
}
