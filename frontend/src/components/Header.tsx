'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Bell, HelpCircle, LogOut, ShoppingBag } from 'lucide-react';
import { auth } from '@/lib/auth';
import { strapi, getImageUrl } from '@/lib/strapi';
import { useRouter, usePathname } from 'next/navigation';
import { useCartStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/useTranslation';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { items, fetchFromDB, clearCart } = useCartStore();

  const isAuthPage = ['/login', '/signup', '/forgot-password', '/change-password'].includes(pathname);
  
  const isSeller = (u?: any) => {
    if (!u) {
      console.log('RBAC - No User');
      return false;
    }
    
    // In Strapi 5, role might be inside an object or flat
    const role = u.role;
    const roleName = (typeof role === 'object' ? role?.name : '')?.toLowerCase()?.trim() || '';
    const roleType = (typeof role === 'object' ? role?.type : role)?.toString()?.toLowerCase()?.trim() || '';
    const username = u.username?.toLowerCase()?.trim() || '';
    const email = u.email?.toLowerCase()?.trim() || '';
    
    const result = roleName === 'seller' || 
                   roleType === 'seller' || 
                   roleName === 'manager' || 
                   roleType === 'manager' ||
                   roleName === 'admin' ||
                   roleType === 'admin' ||
                   username === 'admin' ||
                   email.includes('admin') ||
                   email.includes('seller');
    
    console.log('RBAC - Check:', { username, roleName, roleType, result });
    return result;
  };

  const hasSellerAccess = isSeller(user);

  useEffect(() => {
    const syncUser = async () => {
      const u = auth.getUser();
      const token = auth.getToken();
      console.log('Header - syncUser check:', { hasToken: !!token, user: u });
      
      if (token && (!u || !u.role)) {
        try {
          console.log('Header - Fetching profile...');
          const userRes = await strapi.get('/users/me?populate=*', {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('Header - API Response:', userRes.data);
          localStorage.setItem('shopee_user', JSON.stringify(userRes.data));
          setUser(userRes.data);
        } catch (err) {
          console.error('Header - Sync Error:', err);
        }
      } else {
        setUser(u);
      }
      
      // Fetch remote cart after identifying the user token
      if (token) {
        fetchFromDB();
      }
    };

    syncUser();
    window.addEventListener('auth-change', syncUser);
    return () => window.removeEventListener('auth-change', syncUser);
  }, []);

  const handleLogout = () => {
    auth.logout();
    setUser(null);
    clearCart();
    window.dispatchEvent(new Event('auth-change'));
    router.push('/');
    router.refresh();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/');
    }
  };

  const getAuthPageTitle = () => {
    if (pathname === '/login') return t('header.loginTitle');
    if (pathname === '/signup') return t('header.signupTitle');
    return t('header.resetPasswordTitle');
  };

  if (isAuthPage) {
    return (
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="text-shopee-primary" size={32} />
            <span className="text-2xl font-black text-shopee-primary tracking-tighter">Shopee Clone</span>
            <span className="text-xl text-gray-800 ml-4 border-l pl-4 border-gray-200">
              {getAuthPageTitle()}
            </span>
          </Link>
          <Link href="/help" className="text-shopee-primary text-sm">{t('header.needHelp')}</Link>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-gradient-to-b from-shopee-primary to-shopee-secondary text-white sticky top-0 z-50">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 h-8 flex items-center justify-between text-xs font-light border-b border-white/10">
        <div className="flex items-center gap-4">
          {hasSellerAccess && (
            <Link href="/products/create" className="hover:text-white/80 transition flex items-center gap-1.5 font-medium">
              <ShoppingBag size={12} /> {t('header.sellerChannel')}
            </Link>
          )}
          <Link href="/download" className="hover:text-white/80 transition border-l border-white/20 pl-4">{t('header.downloadApp')}</Link>
          <div className="flex items-center gap-2 border-l border-white/20 pl-4">
            {t('header.connect')} 
            <span className="hover:text-white/80 cursor-pointer">FB</span>
            <span className="hover:text-white/80 cursor-pointer">IG</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 hover:text-white/80 cursor-pointer">
            <Bell size={14} /> {t('header.notification')}
          </div>
          <div className="flex items-center gap-1 hover:text-white/80 cursor-pointer">
            <HelpCircle size={14} /> {t('header.support')}
          </div>
          <LanguageSwitcher />
          {user ? (
            <div className="flex items-center gap-4 relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 hover:text-white/80 cursor-pointer"
              >
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img src={getImageUrl(user.avatar.url)} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={12} />
                  )}
                </div>
                <span className="max-w-[100px] truncate">{user.username}</span>
              </button>
              
              {/* Dropdown Menu */}
              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
                  <div className="absolute top-full right-0 mt-2 w-44 bg-white text-gray-800 shadow-2xl rounded-sm py-2 z-50 border border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200">
                     <Link 
                       href="/profile" 
                       onClick={() => setIsMenuOpen(false)}
                       className="block px-4 py-2 hover:bg-gray-50 text-xs transition"
                     >
                       {t('header.myAccount')}
                     </Link>
                     <Link 
                       href="/orders" 
                       onClick={() => setIsMenuOpen(false)}
                       className="block px-4 py-2 hover:bg-gray-50 text-xs transition"
                     >
                       {t('header.myOrders')}
                     </Link>
                     {hasSellerAccess && (
                       <Link 
                         href="/products/create" 
                         onClick={() => setIsMenuOpen(false)}
                         className="block px-4 py-2 hover:bg-gray-50 text-xs transition border-t border-gray-100 mt-1 font-medium text-shopee-primary"
                       >
                         {t('header.sellerChannelAdd')}
                       </Link>
                     )}
                     <Link 
                       href="/change-password" 
                       onClick={() => setIsMenuOpen(false)}
                       className="block px-4 py-2 hover:bg-gray-50 text-xs transition"
                     >
                       {t('header.changePassword')}
                     </Link>
                     <button 
                       onClick={() => {
                         handleLogout();
                         setIsMenuOpen(false);
                       }} 
                       className="w-full text-left px-4 py-2 hover:bg-gray-50 text-xs flex items-center gap-2 text-red-500 border-t mt-1 pt-2 transition font-medium"
                     >
                       <LogOut size={12} /> {t('header.logout')}
                     </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link href="/signup" className="font-semibold hover:text-white/80 transition">{t('header.signup')}</Link>
              <Link href="/login" className="font-semibold border-l border-white/20 pl-4 hover:text-white/80 transition">{t('header.login')}</Link>
            </>
          )}
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
          <div className="bg-white p-1 rounded-sm shadow-inner group-hover:scale-105 transition">
            <ShoppingBag className="text-shopee-primary" size={28} />
          </div>
          <span className="text-2xl font-black tracking-tighter">Shopee Clone</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1">
          <form onSubmit={handleSearch} className="bg-white p-1 rounded-sm flex items-center shadow-sm">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('header.searchPlaceholder')} 
              className="flex-1 px-4 py-2 text-shopee-text outline-none text-sm"
            />
            <button type="submit" className="bg-shopee-primary px-6 py-2 rounded-sm hover:opacity-90 transition">
              <Search size={18} />
            </button>
          </form>
          <div className="flex gap-4 mt-1 text-xs font-light text-white/90">
            <span>{t('header.suggestedKeywords.jacket')}</span>
            <span>{t('header.suggestedKeywords.bag')}</span>
            <span>{t('header.suggestedKeywords.sandal')}</span>
            <span>{t('header.suggestedKeywords.dress')}</span>
            <span>{t('header.suggestedKeywords.phoneCase')}</span>
          </div>
        </div>

        {/* Cart */}
        <Link href="/cart" className="relative group cursor-pointer hover:text-white/90 transition">
          <ShoppingCart size={32} />
          {(() => {
            const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
            if (totalItems === 0) return null;
            return (
              <span className="absolute -top-1 -right-2 bg-white text-shopee-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-shopee-primary">
                {totalItems}
              </span>
            );
          })()}
        </Link>
      </div>
    </header>
  );
}
