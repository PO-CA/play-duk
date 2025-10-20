import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersApi, type CreateOrderRequest } from '@/services/orders';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/axios';

export function useOrders(params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => ordersApi.getOrders(params),
    staleTime: 1000 * 60 * 5, // 5분
  });
}

export function useOrder(orderId: number) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersApi.getOrder(orderId),
    enabled: !!orderId,
  });
}

export function useCreateOrder() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => ordersApi.createOrder(data),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('주문이 완료되었습니다.');
      router.push(`/orders/${order.id}`);
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersApi.cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('주문이 취소되었습니다.');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}
