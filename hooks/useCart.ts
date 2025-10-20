import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/services/cart';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/axios';

export function useCart() {
  const queryClient = useQueryClient();

  // 장바구니 조회
  const {
    data: cart,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.getCart,
    staleTime: 0, // 항상 최신 데이터
  });

  // 상품 추가
  const addItemMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      cartApi.addCartItem(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('장바구니에 추가되었습니다.');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  // 수량 변경
  const updateQuantityMutation = useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: number; quantity: number }) =>
      cartApi.updateQuantity(cartItemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  // 선택 상태 변경
  const updateSelectedMutation = useMutation({
    mutationFn: ({ cartItemId, selected }: { cartItemId: number; selected: boolean }) =>
      cartApi.updateSelected(cartItemId, selected),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // 아이템 삭제
  const deleteItemMutation = useMutation({
    mutationFn: cartApi.deleteCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('삭제되었습니다.');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  // 일괄 삭제
  const deleteItemsMutation = useMutation({
    mutationFn: cartApi.deleteCartItems,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('선택한 상품이 삭제되었습니다.');
    },
  });

  // 장바구니 비우기
  const clearCartMutation = useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('장바구니가 비워졌습니다.');
    },
  });

  return {
    cart,
    isLoading,
    error,
    addItem: addItemMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    updateSelected: updateSelectedMutation.mutate,
    deleteItem: deleteItemMutation.mutate,
    deleteItems: deleteItemsMutation.mutate,
    clearCart: clearCartMutation.mutate,
  };
}
