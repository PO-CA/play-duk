'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/app/store/auth-store';
import { useOrders } from '@/app/hooks/useOrders';

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

export default function MyPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: ordersData } = useOrders({ page: 0, size: 5 });
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
  // 클라이언트에서 인증 확인 후 렌더링
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">마이페이지</h1>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="rounded-lg bg-white p-6 shadow-sm lg:col-span-1">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <svg
                className="h-10 w-10 text-emerald-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <h2 className="mb-1 text-xl font-bold text-gray-900">{user?.name}님</h2>
            <p className="mb-6 text-sm text-gray-600">{user?.email}</p>

            <div className="space-y-2">
              <Link
                href="/mypage/orders"
                className="block rounded-lg border px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                주문내역
              </Link>
              <Link
                href="/mypage/profile"
                className="block rounded-lg border px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                프로필 수정
              </Link>
              <Link
                href="/mypage/addresses"
                className="block rounded-lg border px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                배송지 관리
              </Link>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="rounded-lg bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">최근 주문</h2>
              <Link
                href="/mypage/orders"
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                전체보기 →
              </Link>
            </div>

            {ordersData?.data && ordersData.data.length > 0 ? (
              <div className="space-y-4">
                {ordersData.data.slice(0, 5).map((order) => (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className="block rounded-lg border p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
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

                    <p className="mb-1 font-medium text-gray-900">
                      {order.orderItems[0]?.productTitle}
                      {order.orderItems.length > 1 &&
                        ` 외 ${order.orderItems.length - 1}건`}
                    </p>

                    <p className="text-sm text-gray-600">
                      {order.finalPrice.toLocaleString()}원
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <svg
                  className="mx-auto mb-4 h-16 w-16 text-gray-300"
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
                <p className="mb-4 text-gray-600">주문 내역이 없습니다</p>
                <Link
                  href="/products"
                  className="inline-block rounded-lg bg-emerald-500 px-6 py-2 font-medium text-white transition-colors hover:bg-emerald-600"
                >
                  상품 둘러보기
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/mypage/orders"
            className="rounded-lg bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-2 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <svg
                  className="h-6 w-6 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
            </div>
            <p className="font-medium text-gray-900">주문내역</p>
          </Link>

          <Link
            href="/cart"
            className="rounded-lg bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-2 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <svg
                  className="h-6 w-6 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="font-medium text-gray-900">장바구니</p>
          </Link>

          <Link
            href="/mypage/profile"
            className="rounded-lg bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-2 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <svg
                  className="h-6 w-6 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
            <p className="font-medium text-gray-900">프로필</p>
          </Link>

          <Link
            href="/mypage/addresses"
            className="rounded-lg bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-2 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <svg
                  className="h-6 w-6 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="font-medium text-gray-900">배송지</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
