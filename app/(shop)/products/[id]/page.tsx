'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProduct } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);
  const { isAuthenticated } = useAuthStore();

  const { data: product, isLoading } = useProduct(productId);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    if (!product) return;

    if (product.stock < quantity) {
      toast.error('재고가 부족합니다.');
      return;
    }

    addItem({ productId: product.id, quantity });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="mb-8 grid gap-8 md:grid-cols-2">
              <div className="aspect-square rounded-lg bg-gray-200" />
              <div className="space-y-4">
                <div className="h-8 w-3/4 rounded bg-gray-200" />
                <div className="h-4 w-1/2 rounded bg-gray-200" />
                <div className="h-12 w-1/3 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            상품을 찾을 수 없습니다
          </h2>
          <button
            onClick={() => router.push('/products')}
            className="text-emerald-600 hover:text-emerald-700"
          >
            상품 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <button onClick={() => router.push('/')} className="hover:text-emerald-600">
            홈
          </button>
          <span>›</span>
          <button
            onClick={() => router.push('/products')}
            className="hover:text-emerald-600"
          >
            상품
          </button>
          <span>›</span>
          <span className="text-gray-900">{product.title}</span>
        </div>

        {/* Product Info */}
        <div className="mb-12 grid gap-8 md:grid-cols-2">
          {/* Images */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              {product.thumbNailUrl ? (
                <img
                  src={product.thumbNailUrl}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <svg
                    className="h-32 w-32 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">{product.title}</h1>
              <p className="text-lg text-gray-600">{product.artist}</p>
            </div>

            <div className="border-t border-b py-6">
              <div className="mb-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-emerald-600">
                  {product.price.toLocaleString()}원
                </span>
              </div>

              {product.stock > 0 ? (
                <p className="text-sm text-gray-600">재고: {product.stock}개</p>
              ) : (
                <p className="font-medium text-red-600">품절</p>
              )}
            </div>

            {/* Product Info Table */}
            <div className="space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
              {product.member && (
                <div className="flex">
                  <span className="w-24 font-medium text-gray-700">멤버</span>
                  <span className="text-gray-900">{product.member}</span>
                </div>
              )}
              {product.ent && (
                <div className="flex">
                  <span className="w-24 font-medium text-gray-700">소속사</span>
                  <span className="text-gray-900">{product.ent}</span>
                </div>
              )}
              {product.company && (
                <div className="flex">
                  <span className="w-24 font-medium text-gray-700">제조사</span>
                  <span className="text-gray-900">{product.company}</span>
                </div>
              )}
              {product.releaseDate && (
                <div className="flex">
                  <span className="w-24 font-medium text-gray-700">발매일</span>
                  <span className="text-gray-900">
                    {new Date(product.releaseDate).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700">수량</span>
                <div className="flex items-center rounded-lg border">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-2 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-16 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-4 py-2 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {product.stock > 0 ? (
                <>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 rounded-lg border border-emerald-500 py-3 font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
                  >
                    장바구니
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 rounded-lg bg-emerald-500 py-3 font-medium text-white transition-colors hover:bg-emerald-600"
                  >
                    바로구매
                  </button>
                </>
              ) : (
                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-lg bg-gray-300 py-3 font-medium text-gray-500"
                >
                  품절
                </button>
              )}
            </div>

            {/* Delivery Info */}
            <div className="rounded-lg bg-emerald-50 p-4 text-sm">
              <p className="mb-2 font-medium text-emerald-900">배송 안내</p>
              <ul className="space-y-1 text-emerald-700">
                <li>• 3만원 이상 구매 시 무료배송</li>
                <li>• 평균 1-2일 내 배송</li>
                <li>• 안전한 포장으로 배송</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.descriptionUrl && (
          <div className="mb-8 rounded-lg bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">상품 상세</h2>
            <img src={product.descriptionUrl} alt="상품 상세" className="w-full" />
          </div>
        )}
      </div>
    </div>
  );
}
