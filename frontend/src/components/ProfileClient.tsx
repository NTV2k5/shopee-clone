'use client';

import React, { useEffect, useState, useRef } from 'react';
import { auth } from '@/lib/auth';
import { strapi, getImageUrl } from '@/lib/strapi';
import { useRouter } from 'next/navigation';
import { User, FileText, Bell, Loader2 } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function ProfileClient() {
  const t = useTranslations();
  const [user, setUser] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const currentUser = auth.getUser();
    if (!currentUser) {
      router.push('/login');
    } else {
      setUser(currentUser);
      setName(currentUser.username || '');
      if (currentUser.avatar) {
        setAvatarPreview(getImageUrl(currentUser.avatar.url));
      }
    }
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = auth.getToken();
      let avatarId = null;

      // Upload file first if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append('files', selectedFile);
        const uploadRes = await strapi.post('/upload', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        if (uploadRes.data && uploadRes.data.length > 0) {
          avatarId = uploadRes.data[0].id;
        }
      }

      // Prepare payload
      const payload: any = { username: name };
      if (avatarId) {
        payload.avatar = avatarId;
      }

      // Update user
      await strapi.put(`/users/${user.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refetch user to get updated relations (avatar)
      const userRes = await strapi.get('/users/me?populate=*', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(userRes.data);
      localStorage.setItem('shopee_user', JSON.stringify(userRes.data));
      window.dispatchEvent(new Event('auth-change'));
      alert(t('profile.updateSuccess'));
    } catch (err: any) {
      console.error(err);
      alert(t('profile.updateFailed') + (err.response?.data?.error?.message || t('profile.errorOccurred')));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert(t('profile.fileTooLarge'));
        return;
      }
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
      setSelectedFile(file);
    }
  };

  const handleNotImplemented = () => {
    alert(t('profile.featureInDev'));
  };

  if (!isMounted || !user) return <div className="p-8 text-center text-gray-500">{t('profile.loading')}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex gap-6">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <div className="flex items-center gap-4 py-4 border-b border-gray-100">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 uppercase font-bold text-xl">
            {user.username?.[0] || 'U'}
          </div>
          <div>
            <div className="font-semibold text-gray-800">{user.username}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1 cursor-pointer hover:text-shopee-primary">
              <User size={12} /> {t('profile.editProfile')}
            </div>
          </div>
        </div>
        
        <div className="py-4 space-y-4">
          <Link href="/profile" className="flex items-center gap-2 text-shopee-primary font-medium text-sm">
            <User size={18} className="text-blue-500" /> {t('profile.myAccount')}
          </Link>
          <div className="pl-7 space-y-3 text-sm text-gray-600">
            <div className="text-shopee-primary cursor-pointer">{t('profile.profile')}</div>
            <div onClick={handleNotImplemented} className="hover:text-shopee-primary cursor-pointer transition">{t('profile.bank')}</div>
            <div onClick={handleNotImplemented} className="hover:text-shopee-primary cursor-pointer transition">{t('profile.address')}</div>
            <Link href="/change-password" className="block hover:text-shopee-primary cursor-pointer transition">{t('profile.changePassword')}</Link>
          </div>

          <Link href="/cart" className="flex items-center gap-2 text-gray-700 hover:text-shopee-primary transition font-medium text-sm">
            <FileText size={18} className="text-blue-400" /> {t('profile.purchases')}
          </Link>
          
          <div onClick={handleNotImplemented} className="flex items-center gap-2 text-gray-700 hover:text-shopee-primary transition font-medium text-sm cursor-pointer">
            <Bell size={18} className="text-orange-500" /> {t('profile.notifications')}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white p-6 rounded-sm shadow-sm">
        <div className="border-b border-gray-100 pb-4 mb-6">
          <h1 className="text-lg font-medium text-gray-800">{t('profile.myProfile')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('profile.profileDesc')}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <form className="flex-1 space-y-6" onSubmit={handleSave}>
            <div className="flex items-center text-sm">
              <label className="w-1/4 text-gray-500 text-right pr-6">{t('profile.username')}</label>
              <div className="flex-1 text-gray-800 font-medium">{user.username}</div>
            </div>

            <div className="flex items-center text-sm">
              <label className="w-1/4 text-gray-500 text-right pr-6">{t('profile.name')}</label>
              <div className="flex-1">
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-sm focus:border-gray-400 outline-none transition" 
                />
              </div>
            </div>

            <div className="flex items-center text-sm">
              <label className="w-1/4 text-gray-500 text-right pr-6">{t('profile.email')}</label>
              <div className="flex-1 flex items-center gap-2">
                <span className="text-gray-800">{user.email?.replace(/(.{2})(.*)(?=@)/, '$1***')}</span>
                <button type="button" onClick={handleNotImplemented} className="text-blue-500 hover:underline">{t('profile.change')}</button>
              </div>
            </div>

            <div className="flex items-center text-sm">
              <label className="w-1/4 text-gray-500 text-right pr-6">{t('profile.phoneNumber')}</label>
              <div className="flex-1 flex items-center gap-2">
                <span className="text-gray-800">*********89</span>
                <button type="button" onClick={handleNotImplemented} className="text-blue-500 hover:underline">{t('profile.change')}</button>
              </div>
            </div>

            <div className="flex items-center text-sm">
              <label className="w-1/4 text-gray-500 text-right pr-6">{t('profile.gender')}</label>
              <div className="flex-1 flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" className="accent-shopee-primary w-4 h-4" defaultChecked /> {t('profile.male')}
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" className="accent-shopee-primary w-4 h-4" /> {t('profile.female')}
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" className="accent-shopee-primary w-4 h-4" /> {t('profile.other')}
                </label>
              </div>
            </div>

            <div className="flex items-center text-sm pt-4">
              <label className="w-1/4 pr-6"></label>
              <button 
                type="submit" 
                disabled={isLoading}
                className="bg-shopee-primary flex items-center justify-center gap-2 text-white px-8 py-2 rounded-sm hover:bg-shopee-secondary transition font-medium disabled:opacity-50"
              >
                {isLoading && <Loader2 size={16} className="animate-spin" />}
                {t('profile.save')}
              </button>
            </div>
          </form>

          {/* Avatar Section */}
          <div className="w-64 border-l border-gray-100 pl-8 flex flex-col items-center justify-start pt-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-400 overflow-hidden">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={48} />
              )}
            </div>
            <input 
              type="file" 
              accept=".jpg,.jpeg,.png" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleAvatarChange}
            />
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="border border-gray-300 px-4 py-2 rounded-sm text-sm text-gray-600 hover:bg-gray-50 transition mb-3"
            >
              {t('profile.choosePhoto')}
            </button>
            <div className="text-gray-400 text-xs text-center space-y-1">
              <p>{t('profile.maxFileSize')}</p>
              <p>{t('profile.fileFormat')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
