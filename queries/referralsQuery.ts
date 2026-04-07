import {useQuery} from '@tanstack/react-query'

import {api} from '@/api'
import {QUERY_KEYS} from '@/constants/queryKeys'

export const useGetReferrals = (page?: number, limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.REFERRALS, page, limit],
    queryFn: async () => {
      const response = await api.referrals.getReferrals(page, limit)
      return response?.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10 // 10 minutes
  })
}

export const useGetReferralStats = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.REFERRAL_STATS],
    queryFn: async () => {
      const response = await api.referrals.getReferralStats()
      return response?.data?.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10 // 10 minutes
  })
}

export const useGetReferralEarnings = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.REFERRAL_EARNINGS],
    queryFn: async () => {
      const response = await api.referrals.getReferralEarnings()
      return response?.data?.data
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5 // 5 minutes
  })
}