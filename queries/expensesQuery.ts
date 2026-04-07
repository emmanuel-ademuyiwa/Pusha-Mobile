import { useQuery } from '@tanstack/react-query'

import { api } from '@/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useInfinitePagination } from '@/hooks/useInfinitePagination'

export const useListExpenses = (query?: {
  page?: number
  limit?: number
  category_id?: string
  date_from?: string
  date_to?: string
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.EXPENSES, query],
    queryFn: async () => {
      const response = await api.expenses.listExpenses(query)
      return response?.data?.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10 // 10 minutes
  })
}

// Infinite scroll version
export const useInfiniteExpenses = (limit: number = 30) => {
  return useInfinitePagination({
    queryKey: [QUERY_KEYS.EXPENSES, 'infinite'],
    queryFn: async ({pageParam}) => {
      const response = await api.expenses.listExpenses({
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

export const useGetExpense = (expenseId: string, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.EXPENSE, expenseId],
    queryFn: async () => {
      const response = await api.expenses.getExpense(expenseId)
      return response?.data?.data
    },
    enabled: !!expenseId && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10 // 10 minutes
  })
}

export const useListExpenseCategories = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.EXPENSE_CATEGORIES],
    queryFn: async () => {
      const response = await api.expenses.listExpenseCategories()
      return response?.data?.data
    },
    staleTime: 1000 * 60 * 10, // 10 minutes (categories change less frequently)
    gcTime: 1000 * 60 * 15 // 15 minutes
  })
}

export const useExpensesByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.EXPENSES_BY_CATEGORY, categoryId],
    queryFn: async () => {
      const response = await api.expenses.listExpenses({
        category_id: categoryId
      })
      return response?.data?.data
    },
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10 // 10 minutes
  })
}

export const useExpensesByDateRange = (dateFrom: string, dateTo: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.EXPENSES_BY_DATE, dateFrom, dateTo],
    queryFn: async () => {
      const response = await api.expenses.listExpenses({
        date_from: dateFrom,
        date_to: dateTo
      })
      return response?.data?.data
    },
    enabled: !!dateFrom && !!dateTo,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10 // 10 minutes
  })
}
