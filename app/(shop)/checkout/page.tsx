'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/hooks/useCart';
import { useCreateOrder } from '@/app/hooks/useOrders';
import { useAuthStore } from '@/app/store/auth-store';

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { cart } = useCart();
  const createOrder = useCreateOrder();

  const [formData, setFormData] = useState({
    recipientName: user?.name || '',
    recipientPhone: '',
    zipcode: '',
    address: '',
    addressDetail: '',
    deliveryMemo: '',
    paymentMethod: 'CARD' as const,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const selectedItems = cart?.items.filter((item) => item.selected) || [];
  const selectedTotal = selectedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = selectedTotal >= 30000 ? 0 : 3000;
  const finalTotal = selectedTotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedItems.length === 0) {
      return;
    }

    createOrder.mutate({
      cartItemIds: selectedItems.map((item) => item.id),
      ...formData,
    });
  };

  if (!isAuthenticated || !cart || selectedItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">주문/결제</h1>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
          {/* Order Form */}
          <div className="space-y-6 lg:col-span-2">
            {/* Delivery Info */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-gray-900">배송 정보</h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    수령인 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.recipientName}
                    onChange={(e) =>
                      setFormData({ ...formData, recipientName: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-emerald-500"
                    placeholder="홍길동"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    연락처 *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.recipientPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, recipientPhone: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-emerald-500"
                    placeholder="01012345678"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      우편번호 *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.zipcode}
                      onChange={(e) =>
                        setFormData({ ...formData, zipcode: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-emerald-500"
                      placeholder="12345"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    주소 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-emerald-500"
                    placeholder="서울시 강남구 테헤란로"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    상세주소
                  </label>
                  <input
                    type="text"
                    value={formData.addressDetail}
                    onChange={(e) =>
                      setFormData({ ...formData, addressDetail: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-emerald-500"
                    placeholder="동, 호수 입력"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    배송 메모
                  </label>
                  <textarea
                    value={formData.deliveryMemo}
                    onChange={(e) =>
                      setFormData({ ...formData, deliveryMemo: e.target.value })
                    }
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-emerald-500"
                    placeholder="배송 시 요청사항을 입력해주세요"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-gray-900">결제 수단</h2>

              <div className="space-y-3">
                {[
                  { value: 'CARD', label: '신용/체크카드' },
                  { value: 'BANK_TRANSFER', label: '실시간 계좌이체' },
                  { value: 'VIRTUAL_ACCOUNT', label: '가상계좌' },
                  { value: 'KAKAO_PAY', label: '카카오페이' },
                  { value: 'NAVER_PAY', label: '네이버페이' },
                  { value: 'TOSS_PAY', label: '토스페이' },
                ].map((method) => (
                  <label
                    key={method.value}
                    className="flex cursor-pointer items-center rounded-lg border p-4 transition-colors hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={formData.paymentMethod === method.value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentMethod: e.target.value as typeof formData.paymentMethod,
                        })
                      }
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="ml-3 text-gray-900">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-gray-900">주문 상품</h2>

              <div className="mb-4 max-h-64 space-y-3 overflow-y-auto">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {item.productThumbNailUrl ? (
                        <img
                          src={item.productThumbNailUrl}
                          alt={item.productTitle}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <svg
                            className="h-6 w-6 text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="mb-1 line-clamp-2 font-medium text-gray-900">
                        {item.productTitle}
                      </p>
                      <p className="text-gray-600">
                        {item.quantity}개 · {item.totalPrice.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t pt-4">
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

              <div className="flex justify-between border-t py-4 text-lg font-bold text-gray-900">
                <span>총 결제금액</span>
                <span className="text-emerald-600">{finalTotal.toLocaleString()}원</span>
              </div>

              <button
                type="submit"
                disabled={createOrder.isPending}
                className="w-full rounded-lg bg-emerald-500 py-3 font-medium text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {createOrder.isPending ? '처리중...' : '결제하기'}
              </button>

              <p className="mt-4 text-center text-xs text-gray-500">
                주문 시 개인정보처리방침 및 이용약관에 동의합니다
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
