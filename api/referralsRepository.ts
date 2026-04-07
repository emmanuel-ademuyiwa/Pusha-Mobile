import { HttpMethods } from '@/libs'
import { UseEndpoint } from '@/utils/api'

export default {
  getReferrals: (page?: number, limit?: number) => {
    const query: Record<string, any> = {}
    if (page) query.page = page
    if (limit) query.limit = limit
    
    return UseEndpoint({
      endpoint: '/referrals',
      method: HttpMethods.Get,
      query: query
    })
  },

  getReferralStats: () => {
    return UseEndpoint({
      endpoint: '/referrals/stats',
      method: HttpMethods.Get
    })
  },

  getReferralEarnings: () => {
    return UseEndpoint({
      endpoint: '/earnings',
      method: HttpMethods.Get
    })
  }
}