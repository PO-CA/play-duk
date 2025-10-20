import { create } from 'zustand';

interface CartStoreState {
  totalItems: number;
}

interface CartStoreActions {
  setTotalItems: (count: number) => void;
}

type CartStore = CartStoreState & CartStoreActions;

/**
 * 장바구니 상태 관리 스토어
 * 서버 동기화 방식이므로 totalItems만 관리
 */
export const useCartStore = create<CartStore>()((set) => ({
  totalItems: 0,
  setTotalItems: (count) => set({ totalItems: count }),
}));
