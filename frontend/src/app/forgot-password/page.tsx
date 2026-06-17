'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ChevronLeft, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulating Strapi forgot password request
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-md space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-shopee-primary">
            <ChevronLeft size={24} />
          </Link>
          <h2 className="text-xl font-medium text-gray-800">Quên mật khẩu</h2>
        </div>

        {sent ? (
          <div className="text-center space-y-4 py-8">
             <div className="bg-green-100 text-green-600 p-4 rounded-sm text-sm">
                Đường dẫn đặt lại mật khẩu đã được gửi đến email của bạn.
             </div>
             <Link href="/login" className="text-shopee-primary font-medium block">Quay lại đăng nhập</Link>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleReset}>
            <p className="text-sm text-gray-500">Nhập email của bạn và chúng tôi sẽ gửi đường dẫn để đặt lại mật khẩu.</p>
            <div className="relative">
              <input
                type="email"
                required
                className="shopee-input pl-10 h-11 text-sm"
                placeholder="Email của bạn"
              />
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-shopee-primary text-white font-medium rounded-sm hover:bg-shopee-secondary transition flex items-center justify-center uppercase"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Tiếp theo'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
