import { useQuery } from '@tanstack/react-query'

import { api } from '@/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useInfinitePagination } from '@/hooks/useInfinitePagination'

export interface IProduct {
  id: string
  business_id: string
  name: string
  brand: string | null
  description: string | null
  semantic_description: string | null
  category_id: string | null
  tags: string[]
  unit_price: number
  discount_price: number
  is_available: boolean
  images: string[]
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface IProductsResponse {
  records: IProduct[]
  pagination: {
    total: number
    page: number
    per_page: number
  }
}

export const useListProducts = (query?: {
  page?: number
  limit?: number
  search?: string
}) => {
  return useQuery<IProductsResponse>({
    queryKey: [QUERY_KEYS.PRODUCTS, query],
    queryFn: async () => {
      const response = await api.products.listProducts(query)
      return response?.data?.data
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10
  })
}

// Infinite scroll version
export const useInfiniteProducts = (search?: string, limit: number = 25) => {
  return useInfinitePagination({
    queryKey: [QUERY_KEYS.PRODUCTS, 'infinite', search],
    queryFn: async ({ pageParam }) => {
      const response = await api.products.listProducts({
        page: pageParam,
        limit,
        search: search?.trim() || undefined
      })
      return response?.data?.data
    },
    limit,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10
  })
}

export const useGetProduct = (productId: string, enabled = true) => {
  return useQuery<IProduct>({
    queryKey: [QUERY_KEYS.PRODUCTS, productId],
    queryFn: async () => {
      const response = await api.products.getProduct(productId)
      return response?.data?.data
    },
    enabled: !!productId && enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10
  })
}

export const useListCategories = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: async () => {
      const response = await api.products.listCategories()
      return response?.data?.data
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10
  })
}

export const useProductsStockAnalytics = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTSANALYTICS],
    queryFn: async () => {
      const response = await api.products.productsStockAnalytics()
      return response?.data?.data
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10
  })
}
