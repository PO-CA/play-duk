import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * Axios 인스턴스 생성
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/b2c',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 요청 인터셉터 - 인증 토큰 자동 추가
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // localStorage에서 토큰 가져오기 (Zustand persist 사용)
    if (typeof window !== 'undefined') {
      const authStorage = localStorage.getItem('b2c-auth-storage');

      if (authStorage) {
        try {
          const { state } = JSON.parse(authStorage);
          const token = state?.accessToken;

          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Failed to parse auth storage:', error);
        }
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터 - 에러 처리 및 토큰 재발급
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 에러 (인증 실패)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (typeof window !== 'undefined') {
          const authStorage = localStorage.getItem('b2c-auth-storage');
          if (authStorage) {
            const { state } = JSON.parse(authStorage);
            const { accessToken, refreshToken } = state;

            if (refreshToken) {
              // 토큰 재발급
              const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/reissue`,
                { accessToken, refreshToken }
              );

              const newAccessToken = response.data.data.accessToken;

              // 새 토큰을 localStorage에 저장
              const updatedState = {
                ...state,
                accessToken: newAccessToken,
              };
              localStorage.setItem(
                'b2c-auth-storage',
                JSON.stringify({ state: updatedState, version: 0 })
              );

              // 원래 요청 재시도
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              }
              return api(originalRequest);
            }
          }
        }
      } catch (refreshError) {
        // 리프레시 토큰도 만료 - 로그아웃
        if (typeof window !== 'undefined') {
          localStorage.removeItem('b2c-auth-storage');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * B2C API 에러 응답 타입 정의
 */
export interface B2CErrorResponse {
  success: boolean;
  message: string;
  errorCode: string;
  data?: unknown;
  timestamp: number;
}

/**
 * Axios 에러를 읽기 쉬운 형태로 변환
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as B2CErrorResponse;
    return apiError?.message || error.message || '알 수 없는 오류가 발생했습니다.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '알 수 없는 오류가 발생했습니다.';
}

/**
 * 에러 응답에서 에러 코드 추출
 */
export function getErrorCode(error: unknown): string | undefined {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as B2CErrorResponse;
    return apiError?.errorCode;
  }
  return undefined;
}

/**
 * 에러 응답에서 추가 데이터 추출
 */
export function getErrorData(error: unknown): unknown {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as B2CErrorResponse;
    return apiError?.data;
  }
  return undefined;
}
