import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'

import {api} from '@/api'
import {QUERY_KEYS} from '@/constants/queryKeys'

export const useGetBankAccount = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.BANK_ACCOUNT],
    queryFn: async () => {
      const response = await api.bankAccount.getBankAccount()
      return response?.data?.data
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 20 // 20 minutes
  })
}

export const useGetBanks = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.BANK_ACCOUNTS],
    queryFn: async () => {
      const response = await api.bankAccount.getBanks()
      return response?.data?.data
    },
    staleTime: 1000 * 60 * 30, // 30 minutes - banks don't change often
    gcTime: 1000 * 60 * 60 // 60 minutes
  })
}

export const useResolveBankAccount = (
  accountNumber: string,
  bankCode: string,
  enabled = true
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BANK_ACCOUNT, 'resolve', accountNumber, bankCode],
    queryFn: async () => {
      const response = await api.bankAccount.resolveBankAccount({
        account_number: accountNumber,
        bank_code: bankCode
      })
      return response?.data?.data
    },
    enabled: !!accountNumber && !!bankCode && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10 // 10 minutes
  })
}

export const useCreateBankAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      account_number: string
      bank_code: string
      account_name?: string
      otp?: string
    }) => {
      const response = await api.bankAccount.createBankAccount(payload)
      return response?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.BANK_ACCOUNT]
      })
    }
  })
}

export const useSendBankAccountOtp = () => {
  return useMutation({
    mutationFn: async (payload: {phone_number?: string; email?: string}) => {
      const response = await api.bankAccount.sendOtp(payload)
      return response?.data
    }
  })
}