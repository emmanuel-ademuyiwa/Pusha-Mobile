import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'

import {api} from '@/api'
import type {ISetupBusinessPayload} from '@/api/merchantsRespository'
import {QUERY_KEYS} from '@/constants/queryKeys'

export const useGetBusiness = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.BUSINESS],
    queryFn: async () => {
      const response = await api.merchants.fetchBusiness()
      return response?.data?.data
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10
  })
}

export const useUpdateBusiness = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ISetupBusinessPayload) => {
      const response = await api.merchants.setupBusiness(payload)
      return response?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.BUSINESS]})
    }
  })
}

export const useUpdateAssistant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {name: string}) => {
      const response = await api.merchants.updateAssistant(payload)
      return response?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.BUSINESS]})
    }
  })
}

export const useSubmitKyc = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {bvn: string}) => {
      const response = await api.bankAccount.submitKyc(payload)
      return response?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.BUSINESS]})
    }
  })
}
