'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useUpdateUser } from '@/app/hooks/useUser';
import type { UpdateUserRequest } from '@/app/api/b2c/users';

// localStorage에서 직접 인증 체크
function checkAuth(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const authStorage = localStorage.getItem('b2c-auth-storage');
    if (!authStorage) return false;

    const { state } = JSON.parse(authStorage);
    return state?.accessToken != null && state?.isAuthenticated === true;
  } catch {
    return false;
  }
}

export default function ProfilePage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data: user, isLoading } = useUser();
  const updateUser = useUpdateUser();

  const [formData, setFormData] = useState<UpdateUserRequest>({
    name: '',
    phoneNumber: '',
    password: '',
  });
  const [passwordConfirm, setPasswordConfirm] = useState('');

  useEffect(() => {
    setIsClient(true);

    const isAuth = checkAuth();
    setIsAuthenticated(isAuth);

    if (!isAuth) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user]);

  if (!isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || isLoading) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 비밀번호 확인
    if (formData.password && formData.password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 빈 password는 제외
    const updateData: UpdateUserRequest = {
      name: formData.name,
      phoneNumber: formData.phoneNumber,
    };

    if (formData.password && formData.password.length > 0) {
      updateData.password = formData.password;
    }

    updateUser.mutate(updateData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            ← 뒤로
          </button>
          <h1 className="text-3xl font-bold text-gray-900">프로필 수정</h1>
        </div>

        <div className="mx-auto max-w-2xl">
          <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-sm">
            {/* 이메일 (수정 불가) */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                이메일
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-gray-600"
              />
              <p className="mt-1 text-sm text-gray-500">이메일은 변경할 수 없습니다.</p>
            </div>

            {/* 이름 */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* 전화번호 */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                전화번호
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                placeholder="010-1234-5678"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* 비밀번호 변경 */}
            <div className="mb-6 border-t pt-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">비밀번호 변경</h3>
              <p className="mb-4 text-sm text-gray-600">
                비밀번호를 변경하지 않으려면 비워두세요.
              </p>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  새 비밀번호
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  minLength={8}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
                {formData.password && formData.password.length < 8 && (
                  <p className="mt-1 text-sm text-red-500">
                    비밀번호는 최소 8자 이상이어야 합니다.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
                {passwordConfirm && formData.password !== passwordConfirm && (
                  <p className="mt-1 text-sm text-red-500">
                    비밀번호가 일치하지 않습니다.
                  </p>
                )}
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={updateUser.isPending}
                className="flex-1 rounded-lg bg-emerald-500 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-600 disabled:bg-gray-300"
              >
                {updateUser.isPending ? '저장 중...' : '저장'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
