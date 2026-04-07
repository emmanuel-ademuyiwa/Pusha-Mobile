import { HttpMethods } from '@/libs'
import { UseEndpoint } from '@/utils/api'

interface WithdrawPayload {
  amount: number
  bank_account_id?: string
  description?: string
}

export default {
  getEarnings: () => {
    return UseEndpoint({
      endpoint: '/earnings',
      method: HttpMethods.Get
    })
  },

  withdraw: (payload: WithdrawPayload) => {
    return UseEndpoint({
      endpoint: '/earnings/withdraw',
      method: HttpMethods.Post,
      payload: payload
    })
  }
}