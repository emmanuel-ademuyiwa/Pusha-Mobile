import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useInfinitePagination } from '@/hooks/useInfinitePagination'
import { errorHandler } from '@/utils/errorHandler'
import toast from '@/utils/toast'

export interface ISaleItem {
  id: string
  sale_id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  product_image: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface ISalePayment {
  id: string
  sale_id: string
  customer_id: string
  business_id: string
  amount: number
  method: string
  status: string
  reference: string
  charges: number
  stamp_duty: number
  amount_settled: number
  paid_at: string | null
  settled: boolean
  meta: any
  vba_id: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface ISaleCustomer {
  id: string
  business_id: string
  first_name: string
  last_name: string | null
  email: string | null
  phone_number: string | null
  gender: string | null
  avatar: string | null
  requires_human: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface ISaleOrder {
  id: string
  order_id: string
  business_id: string
  customer_id: string
  total_amount: number
  sale_channel: string
  session_id: string | null
  amount_paid: number
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | string
  payment_status: 'PENDING' | 'PAID' | string
  delivery_status: 'PENDING' | 'SHIPPED' | 'DELIVERED' | string
  sale_date: string
  note: string | null
  receipt_url: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  payments: ISalePayment[]
  sale_items: ISaleItem[]
  customer: ISaleCustomer | null
}

export interface ISalesResponse {
  records: ISaleOrder[]
  pagination: {
    total: number
    page: number
    per_page: number
  }
}

export const useListSales = (query?: {
  page?: number
  limit?: number
  status?: string
  customer_id?: string
  date_from?: string
  date_to?: string
}) => {
  return useQuery<ISalesResponse>({
    queryKey: [QUERY_KEYS.SALES, query],
    queryFn: async () => {
      const response = await api.sales.listSales(query)
      return response?.data?.data
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10
  })
}

// Infinite scroll version
export const useInfiniteSales = (limit: number = 30) => {
  return useInfinitePagination({
    queryKey: [QUERY_KEYS.SALES, 'infinite'],
    queryFn: async ({pageParam}) => {
      const response = await api.sales.listSales({
        page: pageParam,
        limit
      })
      return response?.data?.data
    },
    limit,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10
  })
}

export const useGetSale = (saleId: string, enabled = true) => {
  return useQuery<ISaleOrder>({
    queryKey: [QUERY_KEYS.SALE, saleId],
    queryFn: async () => {
      const response = await api.sales.getSale(saleId)
      return response?.data?.data
    },
    enabled: !!saleId && enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10
  })
}

export const useUpdateSale = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({saleId, payload}: {saleId: string; payload: any}) => {
      const response = await api.sales.updateSale(saleId, payload)
      return response?.data?.data
    },
    onSuccess: (data, variables) => {
      toast.success('Sale updated successfully!')

      // Invalidate and update related queries
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SALES]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SALE, variables.saleId]
      })
    },
    onError: error => {
      errorHandler(error)
    }
  })
}

export const useSalesByCustomer = (customerId: string) => {
  return useQuery<ISalesResponse>({
    queryKey: [QUERY_KEYS.SALES_BY_CUSTOMER, customerId],
    queryFn: async () => {
      const response = await api.sales.listSales({customer_id: customerId})
      return response?.data?.data
    },
    enabled: !!customerId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10
  })
}

export const useSalesByDateRange = (dateFrom: string, dateTo: string) => {
  return useQuery<ISalesResponse>({
    queryKey: [QUERY_KEYS.SALES_BY_DATE, dateFrom, dateTo],
    queryFn: async () => {
      const response = await api.sales.listSales({
        date_from: dateFrom,
        date_to: dateTo
      })
      return response?.data?.data
    },
    enabled: !!dateFrom && !!dateTo,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10
  })
}
