import { api } from '@/lib/axios';

export interface OrderItem {
  id: number;
  productId: number;
  productTitle: string;
  productArtist: string;
  productThumbNailUrl: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: string;
  orderItems: OrderItem[];
  totalProductPrice: number;
  deliveryFee: number;
  discountAmount: number;
  finalPrice: number;
  recipientName: string;
  recipientPhone: string;
  address: string;
  orderedAt: string;
  createdAt: string;
}

export interface CreateOrderRequest {
  cartItemIds: number[];
  recipientName: string;
  recipientPhone: string;
  zipcode: string;
  address: string;
  addressDetail?: string;
  deliveryMemo?: string;
  paymentMethod:
    | 'CARD'
    | 'BANK_TRANSFER'
    | 'VIRTUAL_ACCOUNT'
    | 'KAKAO_PAY'
    | 'NAVER_PAY'
    | 'TOSS_PAY';
}

export interface OrdersResponse {
  data: Order[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const ordersApi = {
  /**
   * 주문 생성
   */
  createOrder: async (data: CreateOrderRequest) => {
    const response = await api.post('/orders', data);
    return response.data.data as Order;
  },

  /**
   * 주문 목록 조회
   */
  getOrders: async (params?: { page?: number; size?: number }) => {
    const response = await api.get('/orders', { params });
    return response.data as OrdersResponse;
  },

  /**
   * 주문 상세 조회
   */
  getOrder: async (orderId: number) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data.data as Order;
  },

  /**
   * 주문번호로 조회
   */
  getOrderByNumber: async (orderNumber: string) => {
    const response = await api.get(`/orders/number/${orderNumber}`);
    return response.data.data as Order;
  },

  /**
   * 주문 취소
   */
  cancelOrder: async (orderId: number) => {
    const response = await api.post(`/orders/${orderId}/cancel`);
    return response.data.data as Order;
  },
};
