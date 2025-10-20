/**
 * 애플리케이션 상수
 */

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  CART: 'cart-storage',
  AUTH: 'auth-storage',
} as const;

// API 타임아웃
export const API_TIMEOUT = 10000;

// 페이지네이션
export const DEFAULT_PAGE_SIZE = 12;
export const DEFAULT_PAGE = 1;

// 이미지 설정
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// 가격 범위
export const PRICE_RANGES = [
  { label: '전체', min: 0, max: Infinity },
  { label: '1만원 미만', min: 0, max: 10000 },
  { label: '1만원 ~ 5만원', min: 10000, max: 50000 },
  { label: '5만원 ~ 10만원', min: 50000, max: 100000 },
  { label: '10만원 이상', min: 100000, max: Infinity },
];

// 정렬 옵션
export const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: '최신순' },
  { value: 'createdAt-asc', label: '오래된순' },
  { value: 'price-asc', label: '낮은 가격순' },
  { value: 'price-desc', label: '높은 가격순' },
  { value: 'rating-desc', label: '평점 높은순' },
  { value: 'popular-desc', label: '인기순' },
] as const;

// 주문 상태
export const ORDER_STATUS = {
  PENDING: '결제 대기',
  PAID: '결제 완료',
  PROCESSING: '상품 준비중',
  SHIPPED: '배송중',
  DELIVERED: '배송 완료',
  CANCELLED: '취소됨',
} as const;

// 결제 수단
export const PAYMENT_METHODS = [
  { value: 'card', label: '신용/체크카드' },
  { value: 'bank', label: '계좌이체' },
  { value: 'virtual', label: '가상계좌' },
  { value: 'phone', label: '휴대폰 결제' },
] as const;

// 배송비
export const SHIPPING_FEE = 3000;
export const FREE_SHIPPING_THRESHOLD = 30000;

// 검증 규칙
export const VALIDATION = {
  EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE_REGEX: /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 50,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 20,
} as const;

// 에러 메시지
export const ERROR_MESSAGES = {
  REQUIRED: '필수 입력 항목입니다.',
  INVALID_EMAIL: '올바른 이메일 형식이 아닙니다.',
  INVALID_PHONE: '올바른 전화번호 형식이 아닙니다.',
  PASSWORD_TOO_SHORT: `비밀번호는 최소 ${VALIDATION.PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`,
  PASSWORD_TOO_LONG: `비밀번호는 최대 ${VALIDATION.PASSWORD_MAX_LENGTH}자 이하여야 합니다.`,
  PASSWORD_MISMATCH: '비밀번호가 일치하지 않습니다.',
  NETWORK_ERROR: '네트워크 오류가 발생했습니다.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
} as const;
