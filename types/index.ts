// 사용자 관련
export interface User {
  id: number;
  email: string;
  name: string;
  phoneNumber?: string;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'WITHDRAWN';
  createdAt: string;
}

// 상품 관련
export interface Product {
  id: number;
  title: string;
  thumbNailUrl: string;
  descriptionUrl: string;
  artist: string;
  member?: string;
  ent?: string;
  company?: string;
  stock: number;
  price: number;
  releaseDate: string;
  categoryTitle?: string;
}

// 장바구니 관련
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

// 주문 관련
export type OrderStatus =
  | 'PENDING'
  | 'PAYMENT_COMPLETED'
  | 'PREPARING'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'CONFIRMED'
  | 'CANCELED'
  | 'REFUND_REQUESTED'
  | 'REFUNDED';

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
  status: OrderStatus;
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

// 배송지 관련
export interface Address {
  id: number;
  recipientName: string;
  recipientPhone: string;
  zipcode: string;
  address: string;
  addressDetail?: string;
  memo?: string;
  isDefault: boolean;
}

// API 응답 관련
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errorCode: string;
  data?: unknown;
  timestamp: number;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
