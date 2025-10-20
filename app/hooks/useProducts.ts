import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/app/api/b2c/products';

export function useProducts(params?: {
  page?: number;
  size?: number;
  keyword?: string;
  categoryId?: number;
  sort?: string;
}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.getProducts(params),
    staleTime: 1000 * 60 * 5, // 5분
  });
}

export function useProduct(productId: number) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => productsApi.getProduct(productId),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useFeaturedProducts(size: number = 10) {
  return useQuery({
    queryKey: ['products', 'featured', size],
    queryFn: () => productsApi.getFeaturedProducts(size),
    staleTime: 1000 * 60 * 10, // 10분
  });
}

export function useNewProducts(size: number = 10) {
  return useQuery({
    queryKey: ['products', 'new', size],
    queryFn: () => productsApi.getNewProducts(size),
    staleTime: 1000 * 60 * 10,
  });
}
