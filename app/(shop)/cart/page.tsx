'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/app/hooks/useCart';
import { useAuthStore } from '@/app/store/auth-store';
import { useEffect } from 'react';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { cart, isLoading, updateQuantity, updateSelected, deleteItem, deleteItems } =
    useCart();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const selectedItems = cart?.items.filter((item) => item.selected) || [];
  const selectedTotal = selectedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = selectedTotal >= 30000 ? 0 : 3000;
  const finalTotal = selectedTotal + deliveryFee;

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      return;
    }
    router.push('/checkout');
  };

  const handleDeleteSelected = () => {
    const ids = selectedItems.map((item) => item.id);
    deleteItems(ids);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="mb-4 h-8 w-32 rounded bg-gray-200" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 rounded-lg bg-gray-200" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
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
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            장바구니가 비어있습니다
          </h2>
          <p className="mb-6 text-gray-600">상품을 담아보세요!</p>
          <button
            onClick={() => router.push('/products')}
            className="rounded-lg bg-emerald-500 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-600"
          >
            상품 둘러보기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">장바구니</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Actions */}
            <div className="mb-4 flex items-center justify-between rounded-lg bg-white p-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedItems.length === cart.items.length}
                  onChange={(e) => {
                    cart.items.forEach((item) => {
                      updateSelected({
                        cartItemId: item.id,
                        selected: e.target.checked,
                      });
                    });
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-medium text-gray-900">
                  전체선택 ({selectedItems.length}/{cart.items.length})
                </span>
              </div>
              <button
                onClick={handleDeleteSelected}
                disabled={selectedItems.length === 0}
                className="text-sm text-gray-600 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                선택삭제
              </button>
            </div>

            {/* Items */}
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-lg bg-white p-4 shadow-sm"
                >
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={(e) =>
                      updateSelected({
                        cartItemId: item.id,
                        selected: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />

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
                          className="h-8 w-8 text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="mb-1 font-medium text-gray-900">
                        {item.productTitle}
                      </h3>
                      <p className="text-sm text-gray-600">{item.productArtist}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-lg border">
                        <button
                          onClick={() =>
                            updateQuantity({
                              cartItemId: item.id,
                              quantity: Math.max(1, item.quantity - 1),
                            })
                          }
                          className="px-3 py-1 hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity({
                              cartItemId: item.id,
                              quantity: item.quantity + 1,
                            })
                          }
                          className="px-3 py-1 hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-emerald-600">
                          {item.totalPrice.toLocaleString()}원
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-gray-900">주문 요약</h2>

              <div className="space-y-3 border-b pb-4">
                <div className="flex justify-between text-gray-600">
                  <span>상품금액</span>
                  <span>{selectedTotal.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>배송비</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600">무료</span>
                    ) : (
                      `${deliveryFee.toLocaleString()}원`
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-between py-4 text-lg font-bold text-gray-900">
                <span>총 결제금액</span>
                <span className="text-emerald-600">{finalTotal.toLocaleString()}원</span>
              </div>

              {selectedTotal > 0 && selectedTotal < 30000 && (
                <p className="mb-4 text-sm text-gray-600">
                  {(30000 - selectedTotal).toLocaleString()}원 더 담으면 무료배송!
                </p>
              )}

              <button
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
                className="w-full rounded-lg bg-emerald-500 py-3 font-medium text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                주문하기 ({selectedItems.length}개)
              </button>

              <button
                onClick={() => router.push('/products')}
                className="mt-3 w-full rounded-lg border border-gray-300 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                계속 쇼핑하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
