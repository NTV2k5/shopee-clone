'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { strapi } from '@/lib/strapi';
import { Loader2, Lock, KeyRound, CheckCircle2 } from 'lucide-react';

function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!code) {
      setError('Mã xác thực không hợp lệ hoặc đã hết hạn.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const passwordConfirmation = formData.get('passwordConfirmation') as string;

    if (password !== passwordConfirmation) {
      setError('Mật khẩu xác nhận không khớp.');
      setLoading(false);
      return;
    }

    try {
      await strapi.post('/auth/reset-password', {
        code,
        password,
        passwordConfirmation,
      });
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-md space-y-6">
      <h2 className="text-xl font-medium text-gray-800 border-b pb-4 text-center uppercase tracking-tight">Đặt lại mật khẩu</h2>
      
      {success ? (
        <div className="text-center space-y-4 py-4">
          <div className="flex justify-center">
            <CheckCircle2 size={48} className="text-green-500" />
          </div>
          <p className="text-gray-600">Mật khẩu đã được cập nhật thành công!</p>
          <p className="text-xs text-gray-400">Đang chuyển hướng về trang đăng nhập...</p>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleReset}>
          {!code && (
            <div className="bg-red-50 text-red-500 p-3 rounded-sm text-xs border border-red-100">
              Cảnh báo: Không tìm thấy mã xác thực từ email của bạn.
            </div>
          )}
          
          <div className="space-y-1">
            <label className="text-xs text-gray-500 font-bold uppercase">Mật khẩu mới</label>
            <div className="relative">
              <input
                name="password"
                type="password"
                required
                className="shopee-input pl-10 h-11 text-sm focus:border-shopee-primary transition-colors"
                placeholder="Nhập mật khẩu mới"
              />
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={16} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-500 font-bold uppercase">Xác nhận mật khẩu mới</label>
            <div className="relative">
              <input
                name="passwordConfirmation"
                type="password"
                required
                className="shopee-input pl-10 h-11 text-sm focus:border-shopee-primary transition-colors"
                placeholder="Xác nhận lại mật khẩu mới"
              />
              <KeyRound className="absolute left-3 top-3.5 text-gray-400" size={16} />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs bg-red-50 p-2 rounded border border-red-100">{error}</p>}

          <button
            type="submit"
            disabled={loading || !code}
            className="w-full h-12 bg-shopee-primary text-white font-bold rounded-sm hover:bg-shopee-secondary transition-all flex items-center justify-center uppercase shadow-md disabled:bg-gray-300"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Cập nhật mật khẩu'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center py-12 px-4">
      <Suspense fallback={<Loader2 className="animate-spin text-shopee-primary" size={40} />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
