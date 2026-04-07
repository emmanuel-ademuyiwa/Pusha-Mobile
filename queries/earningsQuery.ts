import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'

import {api} from '@/api'
import {QUERY_KEYS} from '@/constants/queryKeys'

export const useGetEarnings = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.EARNINGS],
    queryFn: async () => {
      const response = await api.earnings.getEarnings()
      return response?.data?.data
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5 // 5 minutes
  })
}

export const useWithdrawEarnings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      amount: number
      bank_account_id?: string
      description?: string
    }) => {
      const response = await api.earnings.withdraw(payload)
      return response?.data
    },
    onSuccess: () => {
      // Invalidate earnings and wallet related queries
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EARNINGS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WALLET]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WITHDRAWALS]
      })
    }
  })
}