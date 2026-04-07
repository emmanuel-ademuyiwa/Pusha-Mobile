import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

export const useGetSubscriptionPlans = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.SUBSCRIPTION_PLANS],
    queryFn: async () => {
      const response = await api.subscription.getPlans()
      return response?.data?.data
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 30 // 30 minutes
  })
}

export const useGetCurrentSubscription = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CURRENT_SUBSCRIPTION],
    queryFn: async () => {
      const response = await api.subscription.getCurrentSubscription()
      return response?.data?.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10 // 10 minutes
  })
}

export const useSubscribe = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {plan_id?: string}) => {
      const response = await api.subscription.subscribe(payload)
      return response?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CURRENT_SUBSCRIPTION]
      })
    }
  })
}

export const useInitiateSubscriptionPayment = () => {
  return useMutation({
    mutationFn: async (payload: {plan_id: string; billing_cycle: 'MONTHLY' | 'YEARLY'; auto_renew: boolean}) => {
      const response = await api.subscription.initiatePayment(payload)
      return response?.data
    }
  })
}

export const useVerifySubscriptionPayment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { reference: string}) => {
      const response = await api.subscription.verifyPayment(payload)
      return response?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CURRENT_SUBSCRIPTION]
      })
    }
  })
}

export const useCancelSubscription = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await api.subscription.cancelSubscription()
      return response?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CURRENT_SUBSCRIPTION]
      })
    }
  })
}