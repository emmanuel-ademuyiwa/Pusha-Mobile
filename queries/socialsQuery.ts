import {useQuery} from '@tanstack/react-query'

import {api} from '@/api'
import {QUERY_KEYS} from '@/constants/queryKeys'

export const useBusinessIntegrations = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.BUSINESS_INTEGRATION],
    queryFn: async () => {
      const response = await api.socials.businessIntegrations()
      return response?.data?.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10 // 10 minutes
  })
}
