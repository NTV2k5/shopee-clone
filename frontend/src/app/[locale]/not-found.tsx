'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ShoppingBag } from 'lucide-react';

export default function LocalNotFound() {
  const locale = useLocale();

  const messages = {
    en: {
      title: 'Page Not Found',
      desc: 'The page you are looking for does not exist or has been moved.',
      backHome: 'Go back home'
    },
    vi: {
      title: 'Không Tìm Thấy Trang',
      desc: 'Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di dời.',
      backHome: 'Quay lại trang chủ'
    },
    zh: {
      title: '页面未找到',
      desc: '您寻找的页面不存在或已被移动。',
      backHome: '返回首页'
    },
    ja: {
      title: 'ページが見つかりません',
      desc: 'お探しのページは存在しないか、移動された可能性があります。',
      backHome: 'ホームに戻る'
    }
  };

  const msg = messages[locale as keyof typeof messages] || messages.en;

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center bg-white mt-6 rounded-sm shadow-sm min-h-[50vh]">
      <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6 text-shopee-primary">
        <ShoppingBag size={48} />
      </div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">{msg.title}</h1>
      <p className="text-gray-500 mb-6 text-center max-w-md">{msg.desc}</p>
      <Link 
        href="/" 
        className="bg-shopee-primary text-white px-8 py-2.5 rounded-sm hover:opacity-95 transition font-medium text-sm shadow-sm"
      >
        {msg.backHome}
      </Link>
    </div>
  );
}
