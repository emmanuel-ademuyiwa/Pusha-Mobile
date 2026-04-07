import {HttpMethods} from '@/libs'
import {UseEndpoint} from '@/utils/api'

interface WithdrawalPayload {
  amount: number
  bank_account_id: string
  description?: string
}

interface SendOtpPayload {
  phone_number?: string
  email?: string
}

export default {
  getWithdrawals: (page?: number, limit?: number) => {
    const query: Record<string, any> = {}
    if (page) query.page = page
    if (limit) query.limit = limit
    
    return UseEndpoint({
      clientType: 'private',
      endpoint: '/wallet/withdrawals',
      method: HttpMethods.Get,
      query: query
    })
  },

  makeWithdrawal: (payload: WithdrawalPayload) => {
    return UseEndpoint({
      clientType: 'private',
      endpoint: '/wallet/withdrawals',
      method: HttpMethods.Post,
      payload: payload
    })
  },

  sendWithdrawalOtp: (payload: SendOtpPayload) => {
    return UseEndpoint({
      clientType: 'private',
      endpoint: '/wallet/withdrawals/send-otp',
      method: HttpMethods.Post,
      payload: payload
    })
  },

  getWalletBalance: () => {
    return UseEndpoint({
      clientType: 'private',
      endpoint: '/wallet',
      method: HttpMethods.Get
    })
  },

  getTransactions: (page?: number, limit?: number) => {
    const query: Record<string, any> = {}
    if (page) query.page = page
    if (limit) query.limit = limit
    
    return UseEndpoint({
      clientType: 'private',
      endpoint: '/wallet/transactions',
      method: HttpMethods.Get,
      query: query
    })
  }
}