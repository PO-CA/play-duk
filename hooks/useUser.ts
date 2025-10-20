import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi, type UpdateUserRequest } from '@/services/users';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/axios';
import { useAuthStore } from '@/store/auth-store';

export function useUser() {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: usersApi.getMe,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => usersApi.updateMe(data),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
      setUser(user);
      toast.success('회원정보가 수정되었습니다.');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}
