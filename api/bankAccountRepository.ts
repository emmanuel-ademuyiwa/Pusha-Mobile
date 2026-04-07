import {HttpMethods} from '@/libs'
import {UseEndpoint} from '@/utils/api'

interface CreateBankAccountPayload {
  account_number: string
  bank_code: string
  account_name?: string
  otp?: string
}

interface SendOtpPayload {
  phone_number?: string
  email?: string
}

interface ResolveBankAccountQuery {
  account_number: string
  bank_code: string
}

export default {
  getBankAccount: () => {
    return UseEndpoint({
      endpoint: '/business/bank-account',
      method: HttpMethods.Get
    })
  },

  createBankAccount: (payload: CreateBankAccountPayload) => {
    return UseEndpoint({
      endpoint: '/business/bank-account/create',
      method: HttpMethods.Post,
      payload: payload
    })
  },

  sendOtp: (payload: SendOtpPayload) => {
    return UseEndpoint({
      endpoint: '/business/bank-account/send-otp',
      method: HttpMethods.Post,
      payload: payload
    })
  },

  getBanks: () => {
    return UseEndpoint({
      endpoint: '/banks',
      method: HttpMethods.Get
    })
  },

  resolveBankAccount: (query: ResolveBankAccountQuery) => {
    return UseEndpoint({
      endpoint: '/banks/resolve',
      method: HttpMethods.Get,
      query: query
    })
  }
}