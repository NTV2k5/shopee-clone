'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Loader2, Lock, KeyRound, AlertCircle } from 'lucide-react';
import { strapi } from '@/lib/strapi';

export default function ChangePasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!auth.getUser()) {
      router.push('/login?callback=/change-password');
    }
  }, [router]);

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get('currentPassword') as string;
    const password = formData.get('password') as string;
    const passwordConfirmation = formData.get('passwordConfirmation') as string;

    if (password !== passwordConfirmation) {
      setError('Mật khẩu mới không khớp.');
      setLoading(false);
      return;
    }

    try {
      await strapi.post('/auth/change-password', {
        currentPassword,
        password,
        passwordConfirmation,
      });
      setSuccess(true);
      setTimeout(() => router.push('/'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-md space-y-6">
        <h2 className="text-xl font-medium text-gray-800 border-b pb-4">Đổi mật khẩu</h2>
        
        {success ? (
          <div className="bg-green-50 text-green-600 p-4 rounded-sm text-sm flex items-center gap-2">
            <AlertCircle size={18} />
            Đổi mật khẩu thành công! Đang quay lại trang chủ...
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleChangePassword}>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 font-medium uppercase">Mật khẩu hiện tại</label>
              <div className="relative">
                <input
                  name="currentPassword"
                  type="password"
                  required
                  className="shopee-input pl-10 h-10 text-sm"
                  placeholder="Nhập mật khẩu hiện tại"
                />
                <Lock className="absolute left-3 top-2.5 text-gray-400" size={16} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-500 font-medium uppercase">Mật khẩu mới</label>
              <div className="relative">
                <input
                  name="password"
                  type="password"
                  required
                  className="shopee-input pl-10 h-10 text-sm"
                  placeholder="Nhập mật khẩu mới"
                />
                <KeyRound className="absolute left-3 top-2.5 text-gray-400" size={16} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-500 font-medium uppercase">Xác nhận mật khẩu mới</label>
              <div className="relative">
                <input
                  name="passwordConfirmation"
                  type="password"
                  required
                  className="shopee-input pl-10 h-10 text-sm"
                  placeholder="Xác nhận mật khẩu mới"
                />
                <KeyRound className="absolute left-3 top-2.5 text-gray-400" size={16} />
              </div>
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-shopee-primary text-white font-medium rounded-sm hover:bg-shopee-secondary transition flex items-center justify-center uppercase shadow-sm mt-4"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Xác nhận'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
