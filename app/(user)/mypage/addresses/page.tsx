'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from '@/app/hooks/useAddresses';
import type { CreateAddressRequest } from '@/app/api/b2c/addresses';

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

export default function AddressesPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);

  const { data: addresses, isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();

  const [formData, setFormData] = useState<CreateAddressRequest>({
    recipientName: '',
    phoneNumber: '',
    zipCode: '',
    address: '',
    addressDetail: '',
    isDefault: false,
  });

  useEffect(() => {
    setIsClient(true);

    const isAuth = checkAuth();
    setIsAuthenticated(isAuth);

    if (!isAuth) {
      router.push('/login');
    }
  }, [router]);

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

  if (!isAuthenticated) {
    return null;
  }

  const handleOpenModal = (addressId?: number) => {
    if (addressId) {
      const address = addresses?.find((a) => a.id === addressId);
      if (address) {
        setFormData({
          recipientName: address.recipientName,
          phoneNumber: address.phoneNumber,
          zipCode: address.zipCode,
          address: address.address,
          addressDetail: address.addressDetail,
          isDefault: address.isDefault,
        });
        setEditingAddressId(addressId);
      }
    } else {
      setFormData({
        recipientName: '',
        phoneNumber: '',
        zipCode: '',
        address: '',
        addressDetail: '',
        isDefault: false,
      });
      setEditingAddressId(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddressId(null);
    setFormData({
      recipientName: '',
      phoneNumber: '',
      zipCode: '',
      address: '',
      addressDetail: '',
      isDefault: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingAddressId) {
      updateAddress.mutate(
        { addressId: editingAddressId, data: formData },
        {
          onSuccess: () => {
            handleCloseModal();
          },
        }
      );
    } else {
      createAddress.mutate(formData, {
        onSuccess: () => {
          handleCloseModal();
        },
      });
    }
  };

  const handleDelete = (addressId: number) => {
    if (confirm('이 배송지를 삭제하시겠습니까?')) {
      deleteAddress.mutate(addressId);
    }
  };

  const handleSetDefault = (addressId: number) => {
    setDefaultAddress.mutate(addressId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              ← 뒤로
            </button>
            <h1 className="text-3xl font-bold text-gray-900">배송지 관리</h1>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="rounded-lg bg-emerald-500 px-6 py-2 font-medium text-white transition-colors hover:bg-emerald-600"
          >
            배송지 추가
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg bg-white p-6">
                <div className="mb-4 h-4 w-32 rounded bg-gray-200" />
                <div className="h-16 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : addresses && addresses.length > 0 ? (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`rounded-lg bg-white p-6 shadow-sm ${
                  address.isDefault ? 'border-2 border-emerald-500' : ''
                }`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {address.recipientName}
                      </h3>
                      {address.isDefault && (
                        <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-medium text-white">
                          기본 배송지
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-gray-600">{address.phoneNumber}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(address.id)}
                      className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="rounded border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      삭제
                    </button>
                  </div>
                </div>

                <div className="text-gray-700">
                  <p>({address.zipCode})</p>
                  <p>{address.address}</p>
                  <p>{address.addressDetail}</p>
                </div>

                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    기본 배송지로 설정
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <svg
              className="mx-auto mb-4 h-24 w-24 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              등록된 배송지가 없습니다
            </h2>
            <p className="mb-6 text-gray-600">새 배송지를 추가해보세요!</p>
            <button
              onClick={() => handleOpenModal()}
              className="inline-block rounded-lg bg-emerald-500 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-600"
            >
              배송지 추가
            </button>
          </div>
        )}

        {/* 배송지 추가/수정 모달 */}
        {isModalOpen && (
          <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
            <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                {editingAddressId ? '배송지 수정' : '배송지 추가'}
              </h2>

              <form onSubmit={handleSubmit}>
                {/* 받는 사람 */}
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    받는 사람 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) =>
                      setFormData({ ...formData, recipientName: e.target.value })
                    }
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* 연락처 */}
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    연락처 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    required
                    placeholder="010-1234-5678"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* 우편번호 */}
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    우편번호 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) =>
                        setFormData({ ...formData, zipCode: e.target.value })
                      }
                      required
                      placeholder="12345"
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => alert('우편번호 검색 기능은 추후 구현 예정입니다.')}
                      className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      우편번호 검색
                    </button>
                  </div>
                </div>

                {/* 주소 */}
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    주소 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* 상세주소 */}
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    상세주소 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.addressDetail}
                    onChange={(e) =>
                      setFormData({ ...formData, addressDetail: e.target.value })
                    }
                    required
                    placeholder="상세주소를 입력하세요"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* 기본 배송지 설정 */}
                <div className="mb-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={(e) =>
                        setFormData({ ...formData, isDefault: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      기본 배송지로 설정
                    </span>
                  </label>
                </div>

                {/* 버튼 */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={createAddress.isPending || updateAddress.isPending}
                    className="flex-1 rounded-lg bg-emerald-500 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-600 disabled:bg-gray-300"
                  >
                    {createAddress.isPending || updateAddress.isPending
                      ? '저장 중...'
                      : editingAddressId
                        ? '수정'
                        : '추가'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
