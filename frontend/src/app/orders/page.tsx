import OrdersClient from '@/components/OrdersClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đơn hàng của tôi - Shopee Clone',
  description: 'Xem và quản lý đơn hàng của bạn',
};

export default function OrdersPage() {
  return <OrdersClient />;
}
