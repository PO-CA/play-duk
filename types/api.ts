/**
 * API 공통 응답 타입
 */

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

/**
 * 페이지네이션 응답
 */
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/**
 * 타입 가드
 */
export function isApiError(response: unknown): response is ApiErrorResponse {
  return (response as ApiErrorResponse)?.success === false;
}

export function isApiSuccess<T>(response: unknown): response is ApiSuccessResponse<T> {
  return (response as ApiSuccessResponse<T>)?.success === true;
}
