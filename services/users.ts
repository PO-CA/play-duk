import { api } from '@/lib/axios';

export interface UpdateUserRequest {
  name?: string;
  phoneNumber?: string;
  password?: string;
  marketingAgreed?: boolean;
}

export interface User {
  id: number;
  email: string;
  name: string;
  phoneNumber?: string;
  role: string;
  status: string;
  marketingAgreed: boolean;
  createdAt: string;
}

export const usersApi = {
  /**
   * 내 정보 조회
   */
  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data.data as User;
  },

  /**
   * 내 정보 수정
   */
  updateMe: async (data: UpdateUserRequest) => {
    const response = await api.put('/users/me', data);
    return response.data.data as User;
  },
};
