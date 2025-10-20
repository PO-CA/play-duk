'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useOrder, useCancelOrder } from '@/hooks/useOrders';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Number(params.id);
  const { isAuthenticated } = useAuthStore();
  const { data: order, isLoading } = useOrder(orderId);
  const cancelOrder = useCancelOrder();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleCancelOrder = () => {
    if (confirm('주문을 취소하시겠습니까?')) {
      cancelOrder.mutate(orderId, {
        onSuccess: () => {
          router.push('/mypage/orders');
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-gray-200" />
            <div className="h-64 rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            주문을 찾을 수 없습니다
          </h2>
          <button
            onClick={() => router.push('/mypage/orders')}
            className="text-emerald-600 hover:text-emerald-700"
          >
            주문 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            ← 뒤로
          </button>
          <h1 className="text-3xl font-bold text-gray-900">주문 상세</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Order Details */}
          <div className="space-y-6 lg:col-span-2">
            {/* Order Info */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-start justify-between border-b pb-4">
                <div>
                  <p className="mb-2 text-sm text-gray-600">
                    주문일시: {new Date(order.createdAt).toLocaleString('ko-KR')}
                  </p>
                  <p className="mb-2 text-sm text-gray-600">
                    주문번호: {order.orderNumber}
                  </p>
                </div>
                <span
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    order.status === 'DELIVERED'
                      ? 'bg-emerald-100 text-emerald-700'
                      : order.status === 'CANCELED'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {order.status === 'PENDING'
                    ? '결제대기'
                    : order.status === 'PAYMENT_COMPLETED'
                      ? '결제완료'
                      : order.status === 'PREPARING'
                        ? '상품준비중'
                        : order.status === 'SHIPPING'
                          ? '배송중'
                          : order.status === 'DELIVERED'
                            ? '배송완료'
                            : order.status === 'CANCELED'
                              ? '취소'
                              : order.status}
                </span>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {item.productThumbNailUrl ? (
                        <img
                          src={item.productThumbNailUrl}
                          alt={item.productTitle}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <svg
                            className="h-10 w-10 text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1 font-medium text-gray-900">
                        {item.productTitle}
                      </h3>
                      <p className="mb-2 text-sm text-gray-600">{item.productArtist}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          {item.quantity}개 × {item.pricePerUnit.toLocaleString()}원
                        </p>
                        <p className="font-bold text-emerald-600">
                          {item.totalPrice.toLocaleString()}원
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-gray-900">배송 정보</h2>
              <div className="space-y-2 text-sm">
                <div className="flex">
                  <span className="w-24 font-medium text-gray-700">수령인</span>
                  <span className="text-gray-900">{order.recipientName}</span>
                </div>
                <div className="flex">
                  <span className="w-24 font-medium text-gray-700">연락처</span>
                  <span className="text-gray-900">{order.recipientPhone}</span>
                </div>
                <div className="flex">
                  <span className="w-24 font-medium text-gray-700">배송지</span>
                  <span className="text-gray-900">{order.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-gray-900">결제 정보</h2>

                <div className="space-y-3 border-b pb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>상품금액</span>
                    <span>{order.totalProductPrice.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>배송비</span>
                    <span>
                      {order.deliveryFee === 0 ? (
                        <span className="text-emerald-600">무료</span>
                      ) : (
                        `${order.deliveryFee.toLocaleString()}원`
                      )}
                    </span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>할인</span>
                      <span>-{order.discountAmount.toLocaleString()}원</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between py-4 text-lg font-bold text-gray-900">
                  <span>총 결제금액</span>
                  <span className="text-emerald-600">
                    {order.finalPrice.toLocaleString()}원
                  </span>
                </div>

                {(order.status === 'PENDING' || order.status === 'PAYMENT_COMPLETED') && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelOrder.isPending}
                    className="w-full rounded-lg border border-red-500 py-3 font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {cancelOrder.isPending ? '처리중...' : '주문 취소'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
