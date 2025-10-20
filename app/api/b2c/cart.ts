import { api } from '@/app/lib/axios';

export interface CartItem {
  id: number;
  productId: number;
  productTitle: string;
  productArtist: string;
  productThumbNailUrl: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  selected: boolean;
}

export interface Cart {
  id: number;
  items: CartItem[];
  totalPrice: number;
  totalCount: number;
}

export const cartApi = {
  /**
   * 장바구니 조회
   */
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data.data as Cart;
  },

  /**
   * 장바구니에 상품 추가
   */
  addCartItem: async (productId: number, quantity: number) => {
    const response = await api.post('/cart/items', {
      productId,
      quantity,
    });
    return response.data.data as Cart;
  },

  /**
   * 장바구니 아이템 수량 변경
   */
  updateQuantity: async (cartItemId: number, quantity: number) => {
    const response = await api.patch(`/cart/items/${cartItemId}/quantity`, null, {
      params: { quantity },
    });
    return response.data.data as Cart;
  },

  /**
   * 장바구니 아이템 선택 상태 변경
   */
  updateSelected: async (cartItemId: number, selected: boolean) => {
    const response = await api.patch(`/cart/items/${cartItemId}/selected`, null, {
      params: { selected },
    });
    return response.data.data as Cart;
  },

  /**
   * 장바구니 아이템 삭제
   */
  deleteCartItem: async (cartItemId: number) => {
    const response = await api.delete(`/cart/items/${cartItemId}`);
    return response.data;
  },

  /**
   * 장바구니 아이템 일괄 삭제
   */
  deleteCartItems: async (cartItemIds: number[]) => {
    const response = await api.delete('/cart/items', {
      params: { cartItemIds: cartItemIds.join(',') },
    });
    return response.data;
  },

  /**
   * 장바구니 비우기
   */
  clearCart: async () => {
    const response = await api.delete('/cart');
    return response.data;
  },
};
