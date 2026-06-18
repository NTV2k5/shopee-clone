'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Globe, Check } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const LANGUAGES = [
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    if (i18n.language) {
      document.documentElement.lang = i18n.language;
    }
  }, [i18n.language]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChangeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    document.documentElement.lang = code;
    
    // Smoothly replace URL pathname when switching languages on product detail page
    if (code === 'vi' && pathname.startsWith('/products/') && pathname !== '/products/create') {
      const newPath = pathname.replace('/products/', '/san-pham/');
      window.history.replaceState(null, '', newPath);
      router.refresh();
    } else if (code === 'en' && pathname.startsWith('/san-pham/')) {
      const newPath = pathname.replace('/san-pham/', '/products/');
      window.history.replaceState(null, '', newPath);
      router.refresh();
    }
    
    setIsOpen(false);
  };

  const currentLang = isMounted
    ? (LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0])
    : LANGUAGES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 hover:text-white/80 cursor-pointer transition"
      >
        <Globe size={14} />
        <span>{currentLang.label}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-40 bg-white text-gray-800 shadow-2xl rounded-sm py-1 z-50 border border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleChangeLanguage(lang.code)}
                className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 text-xs transition"
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm">{lang.flag}</span>
                  {lang.label}
                </span>
                {isMounted && i18n.language === lang.code && (
                  <Check size={14} className="text-shopee-primary" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
