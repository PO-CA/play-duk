'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';

export default function RegisterPage() {
  const { signUp, isSigningUp } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phoneNumber: '',
    marketingAgreed: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    }

    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (formData.phoneNumber && !formData.phoneNumber.match(/^01[0-9]{8,9}$/)) {
      newErrors.phoneNumber = '올바른 휴대폰 번호 형식이 아닙니다. (예: 01012345678)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    signUp({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      phoneNumber: formData.phoneNumber || undefined,
      marketingAgreed: formData.marketingAgreed,
    });
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

          <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">회원가입</h1>
          <p className="mb-8 text-center text-gray-600">PlayDuk의 회원이 되어보세요</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                이메일 *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-emerald-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                비밀번호 *
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-emerald-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="8자 이상"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                비밀번호 확인 *
              </label>
              <input
                type="password"
                required
                value={formData.passwordConfirm}
                onChange={(e) =>
                  setFormData({ ...formData, passwordConfirm: e.target.value })
                }
                className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-emerald-500 ${
                  errors.passwordConfirm ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="비밀번호 재입력"
              />
              {errors.passwordConfirm && (
                <p className="mt-1 text-sm text-red-600">{errors.passwordConfirm}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                이름 *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-emerald-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="홍길동"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                휴대폰 번호
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-emerald-500 ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="01012345678 (- 없이)"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="marketing"
                type="checkbox"
                checked={formData.marketingAgreed}
                onChange={(e) =>
                  setFormData({ ...formData, marketingAgreed: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="marketing" className="ml-2 text-sm text-gray-600">
                마케팅 정보 수신에 동의합니다 (선택)
              </label>
            </div>

            <button
              type="submit"
              disabled={isSigningUp}
              className="w-full rounded-lg bg-emerald-500 py-3 font-medium text-white shadow-sm transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {isSigningUp ? '가입 중...' : '회원가입'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              이미 계정이 있으신가요?{' '}
              <Link
                href="/login"
                className="font-medium text-emerald-600 hover:text-emerald-700"
              >
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
