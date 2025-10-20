'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useOrders, useCancelOrder } from '@/app/hooks/useOrders';

// localStorage에서 직접 인증 체크
function checkAuth(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const authStorage = localStorage.getItem('b2c-auth-storage');
    if (!authStorage) return false;

    const { state } = JSON.parse(authStorage);
    return state?.accessToken != null && state?.isAuthenticated === true;
  } catch {
    return false;
  }
}

export default function OrdersPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data, isLoading } = useOrders({ page: currentPage, size: 10 });
  const cancelOrder = useCancelOrder();

  useEffect(() => {
    setIsClient(true);

    // 인증 체크
    const isAuth = checkAuth();
    setIsAuthenticated(isAuth);

    if (!isAuth) {
      router.push('/login');
    }
  }, [router]);

  // 서버사이드 렌더링 시에는 로딩 표시
  if (!isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleCancelOrder = (orderId: number) => {
    if (confirm('주문을 취소하시겠습니까?')) {
      cancelOrder.mutate(orderId);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">주문내역</h1>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg bg-white p-6">
                <div className="mb-4 h-4 w-32 rounded bg-gray-200" />
                <div className="h-16 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : data?.data && data.data.length > 0 ? (
          <>
            <div className="space-y-4">
              {data.data.map((order) => (
                <div key={order.id} className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-start justify-between border-b pb-4">
                    <div>
                      <p className="mb-1 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('ko-KR')} ·{' '}
                        주문번호: {order.orderNumber}
                      </p>
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
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
                    <Link
                      href={`/orders/${order.id}`}
                      className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                    >
                      상세보기 →
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          {item.productThumbNailUrl ? (
                            <img
                              src={item.productThumbNailUrl}
                              alt={item.productTitle}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <svg
                                className="h-8 w-8 text-gray-300"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="mb-1 font-medium text-gray-900">
                            {item.productTitle}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.quantity}개 · {item.totalPrice.toLocaleString()}원
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <p className="text-lg font-bold text-gray-900">
                      총 {order.finalPrice.toLocaleString()}원
                    </p>

                    {(order.status === 'PENDING' ||
                      order.status === 'PAYMENT_COMPLETED') && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                      >
                        주문취소
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="rounded-lg border px-4 py-2 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  이전
                </button>

                {[...Array(Math.min(5, data.totalPages))].map((_, i) => {
                  const page = currentPage < 3 ? i : currentPage - 2 + i;
                  if (page >= data.totalPages) return null;

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`rounded-lg px-4 py-2 transition-colors ${
                        page === currentPage
                          ? 'bg-emerald-500 text-white'
                          : 'border hover:bg-gray-50'
                      }`}
                    >
                      {page + 1}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(data.totalPages - 1, p + 1))
                  }
                  disabled={currentPage === data.totalPages - 1}
                  className="rounded-lg border px-4 py-2 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  다음
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-16 text-center">
            <svg
              className="mx-auto mb-4 h-24 w-24 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              주문 내역이 없습니다
            </h2>
            <p className="mb-6 text-gray-600">첫 주문을 시작해보세요!</p>
            <Link
              href="/products"
              className="inline-block rounded-lg bg-emerald-500 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-600"
            >
              상품 둘러보기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
