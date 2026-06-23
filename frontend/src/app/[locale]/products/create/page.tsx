import type { Metadata } from 'next';
import CreateProductClient from './CreateProductClient';

export const metadata: Metadata = {
  title: 'Thêm sản phẩm mới',
  description: 'Tạo và đăng bán sản phẩm mới trên Shopee Clone',
  robots: { index: false, follow: false }, // Private page — không cần index
};

export default function CreateProductPage() {
  return <CreateProductClient />;
}
