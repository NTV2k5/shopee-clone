'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Loader2, User, Mail, Lock } from 'lucide-react';

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await auth.register(username, email, password);
      window.dispatchEvent(new Event('auth-change'));
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-shopee-primary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-xl space-y-8">
        <div>
          <h2 className="text-xl font-medium text-gray-800">Đăng ký</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="space-y-4">
            <div className="relative">
              <input
                name="username"
                type="text"
                required
                className="shopee-input pl-10 h-11 text-sm"
                placeholder="Tên đăng nhập"
              />
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
            </div>
            <div className="relative">
              <input
                name="email"
                type="email"
                required
                className="shopee-input pl-10 h-11 text-sm"
                placeholder="Email"
              />
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            </div>
            <div className="relative">
              <input
                name="password"
                type="password"
                required
                className="shopee-input pl-10 h-11 text-sm"
                placeholder="Mật khẩu"
              />
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-shopee-primary text-white font-medium rounded-sm hover:bg-shopee-secondary transition flex items-center justify-center uppercase"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Đăng ký'}
            </button>
          </div>

          <div className="text-center text-xs text-gray-500 pt-4">
            Bằng việc đăng ký, bạn đã đồng ý với Shopee Clone về 
            <Link href="/" className="text-shopee-primary mx-1">Điều khoản dịch vụ</Link> & 
            <Link href="/" className="text-shopee-primary mx-1">Chính sách bảo mật</Link>
          </div>

          <div className="text-center text-sm text-gray-400">
            Bạn đã có tài khoản? <Link href="/login" className="text-shopee-primary font-medium">Đăng nhập</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
