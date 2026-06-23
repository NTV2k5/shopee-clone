'use client';

import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-gray-200">
          {/* Customer Support */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">{t('customerSupport')}</h4>
            <ul className="text-xs text-gray-500 space-y-3">
              <li className="hover:text-shopee-primary cursor-pointer transition">{t('helpCenter')}</li>
              <li className="hover:text-shopee-primary cursor-pointer transition">{t('blog')}</li>
              <li className="hover:text-shopee-primary cursor-pointer transition">{t('mall')}</li>
              <li className="hover:text-shopee-primary cursor-pointer transition">{t('buyGuide')}</li>
              <li className="hover:text-shopee-primary cursor-pointer transition">{t('payment')}</li>
              <li className="hover:text-shopee-primary cursor-pointer transition">{t('shipping')}</li>
            </ul>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">{t('aboutShopee')}</h4>
            <ul className="text-xs text-gray-500 space-y-3">
              <li className="hover:text-shopee-primary cursor-pointer transition">{t('aboutIntro')}</li>
              <li className="hover:text-shopee-primary cursor-pointer transition">{t('careers')}</li>
              <li className="hover:text-shopee-primary cursor-pointer transition">{t('terms')}</li>
              <li className="hover:text-shopee-primary cursor-pointer transition">{t('privacyPolicy')}</li>
              <li className="hover:text-shopee-primary cursor-pointer transition">{t('mediaContact')}</li>
            </ul>
          </div>

          {/* Payments */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">{t('paymentMethods')}</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white p-2 border rounded shadow-sm flex items-center justify-center hover:shadow-md transition cursor-pointer">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
              </div>
              <div className="bg-white p-2 border rounded shadow-sm flex items-center justify-center hover:shadow-md transition cursor-pointer">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
              </div>
              <div className="bg-white p-2 border rounded shadow-sm flex items-center justify-center hover:shadow-md transition cursor-pointer">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-4" />
              </div>
              <div className="bg-white p-1 border rounded shadow-sm flex items-center justify-center hover:shadow-md transition cursor-pointer">
                <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" className="h-6" />
              </div>
              <div className="bg-white p-1 border rounded shadow-sm flex items-center justify-center hover:shadow-md transition cursor-pointer">
                <img src="https://upload.wikimedia.org/wikipedia/vi/2/2e/ZaloPay_Logo.png" alt="ZaloPay" className="h-6" />
              </div>
              <div className="bg-white p-1 border rounded shadow-sm flex items-center justify-center hover:shadow-md transition cursor-pointer text-[10px] font-bold text-gray-400">COD</div>
            </div>
          </div>

          {/* Follow Us */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">{t('followUs')}</h4>
            <ul className="text-xs text-gray-500 space-y-3">
              <li className="flex items-center gap-2 hover:text-shopee-primary cursor-pointer transition">
                <Facebook size={16} /> Facebook
              </li>
              <li className="flex items-center gap-2 hover:text-shopee-primary cursor-pointer transition">
                <Instagram size={16} /> Instagram
              </li>
              <li className="flex items-center gap-2 hover:text-shopee-primary cursor-pointer transition">
                <Twitter size={16} /> Twitter
              </li>
            </ul>
          </div>

          {/* App Download */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">{t('downloadApp')}</h4>
            <div className="flex gap-3">
              <div className="bg-white p-1 border rounded shadow-sm w-20 h-20 flex items-center justify-center hover:shadow-md transition cursor-pointer">
                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QR Code" className="w-16 h-16" />
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <div className="bg-white p-1 border rounded shadow-sm w-24 h-8 flex items-center justify-center hover:shadow-md transition cursor-pointer">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-6" />
                </div>
                <div className="bg-white p-1 border rounded shadow-sm w-24 h-8 flex items-center justify-center hover:shadow-md transition cursor-pointer">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center space-y-4">
          <p className="text-xs text-gray-400">{t('copyright')}</p>
          <div className="flex justify-center gap-8 text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
            <span>{t('privacyPolicyFooter')}</span>
            <span>{t('operatingRules')}</span>
            <span>{t('shippingPolicy')}</span>
            <span>{t('returnPolicy')}</span>
          </div>
          <div className="pt-8 text-xs text-gray-500 space-y-2">
            <p>{t('address')}</p>
            <p>{t('hotline')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
