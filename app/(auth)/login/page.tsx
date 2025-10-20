'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';

export default function LoginPage() {
  const { signIn, isSigningIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-white px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600" />
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-3xl font-bold text-transparent">
                PlayDuk
              </span>
            </div>
          </div>

          <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">로그인</h1>
          <p className="mb-8 text-center text-gray-600">PlayDuk에 오신 것을 환영합니다</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-emerald-500"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-emerald-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isSigningIn}
              className="w-full rounded-lg bg-emerald-500 py-3 font-medium text-white shadow-sm transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {isSigningIn ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              계정이 없으신가요?{' '}
              <Link
                href="/register"
                className="font-medium text-emerald-600 hover:text-emerald-700"
              >
                회원가입
              </Link>
            </p>
          </div>

          {/* 소셜 로그인 (추후 구현) */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  또는 다른 방법으로 로그인
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                type="button"
                className="flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
              >
                <span className="text-sm font-medium">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
              >
                <span className="text-sm font-medium">Naver</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
              >
                <span className="text-sm font-medium">Kakao</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
