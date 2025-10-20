import { api } from '@/lib/axios';

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
  marketingAgreed?: boolean;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  grantType: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  phoneNumber?: string;
  role: string;
  status: string;
  createdAt: string;
}

export const authApi = {
  /**
   * 회원가입
   */
  signUp: async (data: SignUpRequest) => {
    const response = await api.post('/auth/signup', data);
    return response.data.data;
  },

  /**
   * 로그인
   */
  signIn: async (data: SignInRequest) => {
    const response = await api.post('/auth/login', data);
    return response.data.data as TokenResponse;
  },

  /**
   * 토큰 재발급
   */
  reissue: async (accessToken: string, refreshToken: string) => {
    const response = await api.post('/auth/reissue', {
      accessToken,
      refreshToken,
    });
    return response.data.data as TokenResponse;
  },

  /**
   * 로그아웃
   */
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  /**
   * 내 정보 조회
   */
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data.data as User;
  },
};
