'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/products?keyword=${encodeURIComponent(keyword)}`);
      onClose();
      setKeyword('');
    }
  };

  return (
    <div
      className="bg-opacity-50 fixed inset-0 z-50 flex items-start justify-center bg-black pt-20"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">상품 검색</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg
              className="h-6 w-6"
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

        <form onSubmit={handleSearch}>
          <div className="flex gap-2">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="앨범명, 아티스트명을 검색하세요"
              autoFocus
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-emerald-500 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-600"
            >
              검색
            </button>
          </div>
        </form>

        {/* 최근 검색어 (옵션) */}
        <div className="mt-6">
          <p className="mb-3 text-sm font-medium text-gray-700">인기 검색어</p>
          <div className="flex flex-wrap gap-2">
            {['BTS', 'BLACKPINK', '아이브', 'NewJeans'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setKeyword(tag);
                  router.push(`/products?keyword=${encodeURIComponent(tag)}`);
                  onClose();
                }}
                className="rounded-full border border-gray-300 px-4 py-2 text-sm transition-colors hover:border-emerald-500 hover:text-emerald-600"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
