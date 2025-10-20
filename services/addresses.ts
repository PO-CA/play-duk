import { api } from '@/lib/axios';

export interface Address {
  id: number;
  recipientName: string;
  phoneNumber: string;
  zipCode: string;
  address: string;
  addressDetail: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressRequest {
  recipientName: string;
  phoneNumber: string;
  zipCode: string;
  address: string;
  addressDetail: string;
  isDefault?: boolean;
}

export const addressesApi = {
  /**
   * 배송지 목록 조회
   */
  getAddresses: async () => {
    const response = await api.get('/addresses');
    return response.data.data as Address[];
  },

  /**
   * 배송지 상세 조회
   */
  getAddress: async (addressId: number) => {
    const response = await api.get(`/addresses/${addressId}`);
    return response.data.data as Address;
  },

  /**
   * 배송지 추가
   */
  createAddress: async (data: CreateAddressRequest) => {
    const response = await api.post('/addresses', data);
    return response.data.data as Address;
  },

  /**
   * 배송지 수정
   */
  updateAddress: async (addressId: number, data: CreateAddressRequest) => {
    const response = await api.put(`/addresses/${addressId}`, data);
    return response.data.data as Address;
  },

  /**
   * 배송지 삭제
   */
  deleteAddress: async (addressId: number) => {
    const response = await api.delete(`/addresses/${addressId}`);
    return response.data;
  },

  /**
   * 기본 배송지 설정
   */
  setDefaultAddress: async (addressId: number) => {
    const response = await api.put(`/addresses/${addressId}/default`);
    return response.data;
  },
};
