'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { strapi, getImageUrl } from '@/lib/strapi';
import { auth } from '@/lib/auth';
import { useCartStore } from '@/lib/store';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Settings,
  RefreshCw,
  ShoppingCart,
  ChevronRight,
  ReceiptText
} from 'lucide-react';

interface OrderItem {
  productId: string;
  productName: string;
  productImage: any;
  variantName: string | null;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  documentId: string;
  items: OrderItem[];
  totalPrice: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
  };
  paymentMethod: string;
  orderStatus: string;
  createdAt: string;
}

export default function OrdersClient() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const router = useRouter();
  const { addItem } = useCartStore();

  const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
    pending: {
      label: t('orders.status.pending'),
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 border-amber-200',
      icon: <Clock size={16} className="text-amber-500" />,
    },
    processing: {
      label: t('orders.status.processing'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200',
      icon: <Settings size={16} className="text-blue-500 animate-spin" />,
    },
    shipped: {
      label: t('orders.status.shipped'),
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 border-indigo-200',
      icon: <Truck size={16} className="text-indigo-500" />,
    },
    delivered: {
      label: t('orders.status.delivered'),
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200',
      icon: <CheckCircle2 size={16} className="text-green-500" />,
    },
    cancelled: {
      label: t('orders.status.cancelled'),
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200',
      icon: <XCircle size={16} className="text-red-500" />,
    },
  };

  const TABS = [
    { key: 'all', label: t('orders.tabs.all') },
    { key: 'pending', label: t('orders.tabs.pending') },
    { key: 'processing', label: t('orders.tabs.processing') },
    { key: 'shipped', label: t('orders.tabs.shipped') },
    { key: 'delivered', label: t('orders.tabs.delivered') },
    { key: 'cancelled', label: t('orders.tabs.cancelled') },
  ];

  const fetchOrders = useCallback(async () => {
    const token = auth.getToken();
    if (!token) {
      router.push('/');
      return;
    }
    try {
      const res = await strapi.get('/orders/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancel = async (documentId: string) => {
    if (!confirm(t('orders.confirmCancel'))) return;
    setCancellingId(documentId);
    const token = auth.getToken();
    try {
      await strapi.put(`/orders/${documentId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchOrders();
      alert(t('orders.cancelSuccess'));
    } catch (err: any) {
      console.error(err);
      alert(t('orders.cancelError') + (err.response?.data?.error?.message || err.message));
    } finally {
      setCancellingId(null);
    }
  };

  const handleRebuy = (order: Order) => {
    for (const item of order.items) {
      addItem(
        {
          documentId: item.productId,
          id: item.productId,
          productName: item.productName,
          basePrice: item.price,
          slug: '',
          image: item.productImage,
        },
        item.variantName ? { variantName: item.variantName, extraPrice: 0, stock: 9999 } : null,
        item.quantity
      );
    }
    alert(t('orders.rebuySuccess'));
    router.push('/cart');
  };

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter((o) => o.orderStatus === activeTab);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex items-center gap-2 mb-6">
        <ReceiptText size={24} className="text-shopee-primary" />
        <h1 className="text-xl font-medium text-gray-800">{t('orders.myOrders')}</h1>
      </div>

      {/* Status Tabs */}
      <div className="bg-white rounded-sm shadow-sm mb-4">
        <div className="flex border-b overflow-x-auto">
          {TABS.map((tab) => {
            const count = tab.key === 'all'
              ? orders.length
              : orders.filter((o) => o.orderStatus === tab.key).length;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 min-w-[120px] py-3.5 text-sm font-medium text-center transition-all relative whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'text-shopee-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span className={`ml-1 text-xs ${activeTab === tab.key ? 'text-shopee-primary' : 'text-gray-400'}`}>
                    ({count})
                  </span>
                )}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-shopee-primary"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-sm shadow-sm p-16 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="text-gray-300 w-12 h-12" />
          </div>
          <p className="text-gray-500">{t('orders.noOrders')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusConfig = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.pending;
            const canCancel = order.orderStatus === 'pending' || order.orderStatus === 'processing';
            const isCancelled = order.orderStatus === 'cancelled';
            const isCancelling = cancellingId === order.documentId;

            return (
              <div key={order.documentId} className="bg-white rounded-sm shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="flex items-center justify-between px-6 py-3 border-b bg-gray-50">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">
                      {t('orders.orderId')}: <span className="text-gray-700 font-medium">{order.documentId.slice(0, 8).toUpperCase()}</span>
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.bgColor} ${statusConfig.color}`}>
                    {statusConfig.icon}
                    {statusConfig.label}
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center overflow-hidden">
                          {item.productImage ? (
                            <img 
                              src={getImageUrl(item.productImage.url || (Array.isArray(item.productImage) ? item.productImage[0]?.url : ''))} 
                              alt={item.productName} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.png';
                              }}
                            />
                          ) : (
                            <Package size={24} className="text-gray-300" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-800 font-medium line-clamp-1">{item.productName}</p>
                          {item.variantName && (
                            <p className="text-xs text-gray-500 mt-1">{t('orders.variant')}: {item.variantName}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-0.5">x{item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-shopee-primary font-medium">
                          ₫{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex items-center justify-between px-6 py-4 bg-orange-50/50 border-t">
                  <div className="text-sm text-gray-500">
                    <span className="mr-1">{t('orders.deliverTo')}:</span>
                    <span className="text-gray-700">{order.shippingAddress?.address || '---'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{t('orders.totalAmount')}:</span>
                    <span className="text-xl text-shopee-primary font-medium">
                      ₫{order.totalPrice?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 px-6 py-3 border-t">
                  {canCancel && (
                    <button
                      onClick={() => handleCancel(order.documentId)}
                      disabled={isCancelling}
                      className="px-5 py-2 border border-gray-300 text-gray-600 text-sm rounded-sm hover:bg-gray-50 hover:border-red-300 hover:text-red-500 transition disabled:opacity-50"
                    >
                      {isCancelling ? t('orders.cancelling') : t('orders.cancelOrder')}
                    </button>
                  )}

                  {isCancelled && (
                    <button
                      onClick={() => handleRebuy(order)}
                      className="flex items-center gap-1.5 px-5 py-2 bg-shopee-primary text-white text-sm rounded-sm hover:bg-opacity-90 transition"
                    >
                      <RefreshCw size={14} />
                      {t('orders.rebuy')}
                    </button>
                  )}

                  {order.orderStatus === 'delivered' && (
                    <button
                      onClick={() => handleRebuy(order)}
                      className="flex items-center gap-1.5 px-5 py-2 bg-shopee-primary text-white text-sm rounded-sm hover:bg-opacity-90 transition"
                    >
                      <RefreshCw size={14} />
                      {t('orders.rebuy')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
