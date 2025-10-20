import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/app/services/auth';
import { useAuthStore } from '@/app/store/auth-store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getErrorMessage } from '@/app/lib/axios';

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAuth, clearAuth, isAuthenticated, user } = useAuthStore();

  // 회원가입
  const signUpMutation = useMutation({
    mutationFn: authApi.signUp,
    onSuccess: () => {
      toast.success('회원가입이 완료되었습니다. 로그인해주세요.');
      router.push('/login');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  // 로그인
  const signInMutation = useMutation({
    mutationFn: authApi.signIn,
    onSuccess: async (data) => {
      // 먼저 토큰 저장
      setAuth(data.accessToken, data.refreshToken, null);

      // 사용자 정보 조회
      try {
        const user = await authApi.getMe();
        setAuth(data.accessToken, data.refreshToken, user);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }

      toast.success('로그인되었습니다.');
      router.push('/');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  // 로그아웃
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuth();
      toast.success('로그아웃되었습니다.');
      router.push('/');
      queryClient.clear();
    },
    onError: () => {
      // 에러가 나도 로그아웃 처리
      clearAuth();
      router.push('/');
      queryClient.clear();
    },
  });

  return {
    isAuthenticated,
    user,
    signUp: signUpMutation.mutate,
    signIn: signInMutation.mutate,
    logout: () => logoutMutation.mutate(),
    isSigningUp: signUpMutation.isPending,
    isSigningIn: signInMutation.isPending,
  };
}
