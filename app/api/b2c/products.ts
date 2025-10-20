import { api } from '@/app/lib/axios';

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

export interface ProductsResponse {
  data: Product[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const productsApi = {
  /**
   * 상품 목록 조회
   */
  getProducts: async (params?: {
    page?: number;
    size?: number;
    keyword?: string;
    categoryId?: number;
    sort?: string;
  }) => {
    const response = await api.get('/products', { params });
    return response.data as ProductsResponse;
  },

  /**
   * 상품 상세 조회
   */
  getProduct: async (productId: number) => {
    const response = await api.get(`/products/${productId}`);
    return response.data.data as Product;
  },

  /**
   * 추천 상품 조회
   */
  getFeaturedProducts: async (size: number = 10) => {
    const response = await api.get('/products/featured', {
      params: { size },
    });
    return response.data.data as Product[];
  },

  /**
   * 신상품 조회
   */
  getNewProducts: async (size: number = 10) => {
    const response = await api.get('/products/new', {
      params: { size },
    });
    return response.data.data as Product[];
  },

  /**
   * 베스트 상품 조회
   */
  getBestProducts: async (size: number = 20) => {
    const response = await api.get('/products/best', {
      params: { size },
    });
    return response.data.data as Product[];
  },

  /**
   * 아티스트 목록 조회
   */
  getArtists: async () => {
    const response = await api.get('/products/artists');
    return response.data.data as string[];
  },
};
