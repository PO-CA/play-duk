import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  name: string;
  phoneNumber?: string;
  role: string;
  status: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setAuth: (accessToken: string, refreshToken: string, user: User | null) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

/**
 * 인증 상태 관리 스토어
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // 상태
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      // 액션
      setAuth: (accessToken, refreshToken, user) =>
        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: true,
        }),

      setUser: (user) =>
        set({
          user,
        }),

      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'b2c-auth-storage',
    }
  )
);
