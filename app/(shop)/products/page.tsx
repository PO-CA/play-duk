'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProducts } from '@/hooks/useProducts';

export default function ProductsPage() {
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const { data, isLoading } = useProducts({
    page: currentPage,
    size: 20,
    keyword: keyword || undefined,
    sort: 'createdAt,desc',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">전체 상품</h1>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="상품명, 아티스트로 검색"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="rounded-lg bg-emerald-500 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-600"
              >
                검색
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg bg-white p-4">
                <div className="mb-3 aspect-square rounded-lg bg-gray-200" />
                <div className="mb-2 h-4 rounded bg-gray-200" />
                <div className="h-4 w-2/3 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : data?.data && data.data.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-gray-600">
              총 {data.totalElements}개의 상품
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {data.data.map((product) => (
                <Link
                  key={product.id}
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
                  <p className="font-bold text-emerald-600">
                    {product.price.toLocaleString()}원
                  </p>
                  {product.stock === 0 && (
                    <span className="mt-2 inline-block rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                      품절
                    </span>
                  )}
                </Link>
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
            <p className="text-gray-600">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
