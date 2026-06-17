'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Loader2, Eye, EyeOff, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await auth.login(email, password);
      window.dispatchEvent(new Event('auth-change'));
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-shopee-primary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Side: Branding */}
        <div className="hidden md:flex flex-col items-center text-white space-y-6 flex-1">
          <div className="bg-white p-4 rounded-2xl shadow-2xl">
             <img src="https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg" alt="Shopee" className="w-32 h-32 object-contain" />
          </div>
          <h1 className="text-4xl font-bold">Shopee Clone</h1>
          <p className="text-xl text-center font-light opacity-90">Nền tảng thương mại điện tử yêu thích tại Đông Nam Á & Đài Loan</p>
        </div>

        {/* Right Side: Login Form */}
        <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-xl space-y-8">
          <div>
            <h2 className="text-xl font-medium text-gray-800">Đăng nhập</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="relative">
                <input
                  name="email"
                  type="text"
                  required
                  className="shopee-input pl-10 h-11 text-sm"
                  placeholder="Email / Tên đăng nhập"
                />
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="shopee-input pl-10 pr-10 h-11 text-sm"
                  placeholder="Mật khẩu"
                />
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-shopee-primary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-xs text-center">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-shopee-primary text-white font-medium rounded-sm hover:bg-shopee-secondary transition flex items-center justify-center uppercase"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Đăng nhập'}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-shopee-primary">
              <Link href="/forgot-password">Quên mật khẩu</Link>
            </div>

            <div className="relative flex items-center justify-center py-2">
              <div className="border-t border-gray-200 w-full"></div>
              <span className="absolute bg-white px-4 text-xs text-gray-400 uppercase">Hoặc</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button type="button" className="flex items-center justify-center gap-2 h-10 border rounded-sm text-sm hover:bg-gray-50 transition">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="FB" className="w-5 h-5" />
                Facebook
              </button>
              <button type="button" className="flex items-center justify-center gap-2 h-10 border rounded-sm text-sm hover:bg-gray-50 transition">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5" />
                Google
              </button>
            </div>

            <div className="text-center text-sm text-gray-400 pt-4">
              Bạn mới biết đến Shopee Clone? <Link href="/signup" className="text-shopee-primary font-medium">Đăng ký</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
