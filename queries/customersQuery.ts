import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/api'
import { ICustomerPayload } from '@/api/customersRepository'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useInfinitePagination } from '@/hooks/useInfinitePagination'
import { errorHandler } from '@/utils/errorHandler'
import toast from '@/utils/toast'

// Query hooks for fetching customer data
export const useListCustomers = (query?: {
  page?: number
  limit?: number
  search?: string
  sort?: string
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMERS, query],
    queryFn: async () => {
      const response = await api.customers.listCustomers(query)
      return response?.data?.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10 // 10 minutes
  })
}

// Infinite scroll version
export const useInfiniteCustomers = (search?: string, limit: number = 50) => {
  return useInfinitePagination({
    queryKey: [QUERY_KEYS.CUSTOMERS, 'infinite', search],
    queryFn: async ({pageParam}) => {
      const response = await api.customers.listCustomers({
        page: pageParam,
        limit,
        search: search || undefined
      })
      return response?.data?.data
    },
    limit,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10
  })
}

export const useGetCustomer = (customerId: string, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMER, customerId],
    queryFn: async () => {
      const response = await api.customers.getCustomer(customerId)
      return response?.data?.data
    },
    enabled: !!customerId && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10 // 10 minutes
  })
}

// Mutation hooks for customer operations
export const useCreateCustomer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ICustomerPayload) => {
      const response = await api.customers.createCustomer(payload)
      return response?.data?.data
    },
    onSuccess: () => {
      toast.success('Customer created successfully!')
      
      // Invalidate and refetch customers list
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CUSTOMERS]
      })
    },
    onError: error => {
      errorHandler(error)
    }
  })
}

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({customerId, payload}: {customerId: string; payload: ICustomerPayload}) => {
      const response = await api.customers.updateCustomer(customerId, payload)
      return response?.data?.data
    },
    onSuccess: (data, variables) => {
      toast.success('Customer updated successfully!')

      // Invalidate and update related queries
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CUSTOMERS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CUSTOMER, variables.customerId]
      })
    },
    onError: error => {
      errorHandler(error)
    }
  })
}

// Specialized query hooks for customer analytics and relationships
export const useCustomerSales = (customerId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SALES_BY_CUSTOMER, customerId],
    queryFn: async () => {
      const response = await api.sales.listSales({customer_id: customerId})
      return response?.data?.data
    },
    enabled: !!customerId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10 // 10 minutes
  })
}

export const useCustomerPayments = (customerId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PAYMENTS_BY_CUSTOMER, customerId],
    queryFn: async () => {
      const response = await api.payments.listPayments({customer_id: customerId})
      return response?.data?.data
    },
    enabled: !!customerId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10 // 10 minutes
  })
}

// Hook for searching customers with debounced search
export const useSearchCustomers = (searchTerm: string, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMERS, 'search', searchTerm],
    queryFn: async () => {
      const response = await api.customers.listCustomers({
        search: searchTerm,
        limit: 20 // Limit search results for performance
      })
      return response?.data?.data
    },
    enabled: enabled && searchTerm.length >= 2, // Only search if 2+ characters
    staleTime: 1000 * 60 * 2, // 2 minutes for search results
    gcTime: 1000 * 60 * 5 // 5 minutes
  })
}

// Hook for customer statistics/analytics
export const useCustomerStats = (customerId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMER, customerId, 'stats'],
    queryFn: async () => {
      // This would typically be a separate analytics endpoint
      // For now, we'll fetch sales and payments data and compute stats
      const [salesResponse, paymentsResponse] = await Promise.all([
        api.sales.listSales({customer_id: customerId}),
        api.payments.listPayments({customer_id: customerId})
      ])
      
      const sales = salesResponse?.data?.data?.records || []
      const payments = paymentsResponse?.data?.data?.records || []
      
      // Calculate statistics
      const totalPurchases = (sales && sales.length > 0) ? sales.reduce((sum: number, sale: any) => sum + (sale.total_amount || 0), 0) : 0
      const totalPayments = (payments && payments.length > 0) ? payments.reduce((sum: number, payment: any) => sum + (payment.amount || 0), 0) : 0
      const outstandingDebt = totalPurchases - totalPayments
      const lastPurchase = sales.length > 0 ? new Date(Math.max(...sales.map((sale: any) => new Date(sale.created_at).getTime()))) : null
      
      return {
        totalPurchases,
        totalPayments,
        outstandingDebt,
        lastPurchase,
        totalSales: sales.length,
        totalPaymentsCount: payments.length
      }
    },
    enabled: !!customerId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10 // 10 minutes
  })
}
