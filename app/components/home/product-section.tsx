'use client';

import Link from 'next/link';
import { ProductCard } from '@/app/components/product-card';
import type { Product } from '@/app/api/b2c/products';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllLink: string;
}

export function ProductSection({
  title,
  subtitle,
  products,
  viewAllLink,
}: ProductSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">{title}</h2>
            {subtitle && <p className="mt-1 text-gray-600">{subtitle}</p>}
          </div>
          <Link
            href={viewAllLink}
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 md:text-base"
          >
            전체보기 →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {products.slice(0, 12).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
