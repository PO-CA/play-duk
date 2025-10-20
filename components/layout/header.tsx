'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { SearchModal } from '@/components/home/search-modal';

/**
 * 헤더 컴포넌트 - 밝은 녹색 테마
 */
export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { totalItems } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600" />
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-2xl font-bold text-transparent">
                PlayDuk
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="/products?category=best"
                className="font-medium text-gray-700 transition-colors hover:text-emerald-600"
              >
                BEST
              </Link>
              <Link
                href="/products?category=new"
                className="font-medium text-gray-700 transition-colors hover:text-emerald-600"
              >
                신상
              </Link>
              <Link
                href="/events"
                className="font-medium text-gray-700 transition-colors hover:text-emerald-600"
              >
                이벤트
              </Link>
              <Link
                href="/products"
                className="font-medium text-gray-700 transition-colors hover:text-emerald-600"
              >
                전체
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden items-center gap-4 md:flex">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
              >
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              <Link
                href="/cart"
                className="relative flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
              >
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/mypage"
                    className="rounded-lg px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                  >
                    {user?.name}님
                  </Link>
                  <button
                    onClick={logout}
                    className="rounded-lg px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="rounded-lg bg-emerald-500 px-6 py-2 font-medium text-white shadow-sm transition-colors hover:bg-emerald-600"
                >
                  로그인
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="animate-slideUp space-y-2 border-t py-4 md:hidden">
              <button
                onClick={() => {
                  setIsSearchModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full rounded-lg px-4 py-2 text-left text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
              >
                검색
              </button>
              <Link
                href="/products?category=best"
                className="block rounded-lg px-4 py-2 text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                BEST
              </Link>
              <Link
                href="/products?category=new"
                className="block rounded-lg px-4 py-2 text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                신상
              </Link>
              <Link
                href="/events"
                className="block rounded-lg px-4 py-2 text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                이벤트
              </Link>
              <Link
                href="/products"
                className="block rounded-lg px-4 py-2 text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                전체
              </Link>
              <div className="mt-2 border-t pt-2">
                <Link
                  href="/cart"
                  className="block rounded-lg px-4 py-2 text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  장바구니 ({totalItems})
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/mypage"
                      className="block rounded-lg px-4 py-2 text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      마이페이지
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full rounded-lg px-4 py-2 text-left text-gray-600 transition-colors hover:bg-gray-100"
                    >
                      로그아웃
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="block rounded-lg bg-emerald-500 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-emerald-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    로그인
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
}
