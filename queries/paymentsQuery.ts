import {useQuery} from '@tanstack/react-query'

import {api} from '@/api'
import {QUERY_KEYS} from '@/constants/queryKeys'

export const useListPayments = (query?: {
  page?: number
  limit?: number
  status?: string
  method?: string
  customer_id?: string
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PAYMENTS, query],
    queryFn: async () => {
      const response = await api.payments.listPayments(query)
      return response?.data?.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10 // 10 minutes
  })
}

export const useGetPayment = (paymentId: string, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PAYMENT, paymentId],
    queryFn: async () => {
      const response = await api.payments.getPayment(paymentId)
      return response?.data?.data
    },
    enabled: !!paymentId && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10 // 10 minutes
  })
}

export const usePaymentsByStatus = (status: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PAYMENTS_BY_STATUS, status],
    queryFn: async () => {
      const response = await api.payments.listPayments({status})
      return response?.data?.data
    },
    enabled: !!status,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10 // 10 minutes
  })
}

export const usePaymentsByCustomer = (customerId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PAYMENTS_BY_CUSTOMER, customerId],
    queryFn: async () => {
      const response = await api.payments.listPayments({
        customer_id: customerId
      })
      return response?.data?.data
    },
    enabled: !!customerId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10 // 10 minutes
  })
}
