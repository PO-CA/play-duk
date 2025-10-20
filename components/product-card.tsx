import Link from 'next/link';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

/**
 * 상품 카드 컴포넌트
 */
export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-gray-100">
        {product.thumbNailUrl ? (
          <img
            src={product.thumbNailUrl}
            alt={product.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg
              className="h-16 w-16 text-gray-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        )}
      </div>

      <h3 className="mb-1 line-clamp-2 text-sm font-medium text-gray-900">
        {product.title}
      </h3>
      <p className="mb-2 text-xs text-gray-600">{product.artist}</p>
      <div className="flex items-center justify-between">
        <p className="font-bold text-emerald-600">{product.price.toLocaleString()}원</p>
        {product.stock === 0 && (
          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
            품절
          </span>
        )}
      </div>
    </Link>
  );
}
