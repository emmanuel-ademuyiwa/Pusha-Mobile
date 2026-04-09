import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'

import {api} from '@/api'
import {QUERY_KEYS} from '@/constants/queryKeys'

export const useGetWalletBalance = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.WALLET],
    queryFn: async () => {
      const response = await api.wallet.getWalletBalance()
      return response?.data?.data
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5 // 5 minutes
  })
}

export const useGetWalletTransactions = (page = 1, limit = 50) => {
  return useQuery({
    queryKey: [QUERY_KEYS.WALLET_TRANSACTIONS, page, limit],
    queryFn: async () => {
      const response = await api.wallet.getTransactions(page, limit)
      const raw = response?.data?.data ?? response?.data
      if (Array.isArray(raw)) return raw
      const records = (raw as {records?: unknown[]})?.records
      if (Array.isArray(records)) return records
      return []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10 // 10 minutes
  })
}

export const useGetWithdrawals = (page?: number, limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.WITHDRAWALS, page, limit],
    queryFn: async () => {
      const response = await api.wallet.getWithdrawals(page, limit)
      return response?.data?.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10 // 10 minutes
  })
}

export const useMakeWithdrawal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {amount: number; otp: string}) => {
      const response = await api.wallet.makeWithdrawal(payload)
      return response?.data
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WALLET]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WITHDRAWALS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WALLET_TRANSACTIONS]
      })
    }
  })
}

export const useSendWithdrawalOtp = () => {
  return useMutation({
    mutationFn: async (payload: {phone_number?: string; email?: string}) => {
      const response = await api.wallet.sendWithdrawalOtp(payload)
      return response?.data
    }
  })
}