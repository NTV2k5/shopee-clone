'use client';

import React, { useState, useRef, useEffect, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Globe, Check } from 'lucide-react';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useParams } from 'next/navigation';

const LANGUAGES = [
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    startTransition(() => {
      router.replace({ pathname, params: params as any }, { locale: code });
    });
    setIsOpen(false);
  };

  const currentLang = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 hover:text-white/80 cursor-pointer transition ${isPending ? 'opacity-60' : ''}`}
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
                {locale === lang.code && (
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
