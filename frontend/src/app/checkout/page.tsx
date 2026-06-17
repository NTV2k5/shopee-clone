import CheckoutClient from '@/components/CheckoutClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thanh toán - Shopee Clone',
  description: 'Tiến hành thanh toán đơn hàng',
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
