import {HttpMethods} from '@/libs'
import {ICreatePaymentPayload} from '@/types'
import {UseEndpoint} from '@/utils/api'

export default {
  listPayments: (query?: {
    page?: number
    limit?: number
    status?: string
    method?: string
    customer_id?: string
  }) => {
    return UseEndpoint({
      clientType: 'auth',
      endpoint: '/payments',
      method: HttpMethods.Get,
      query
    })
  },

  getPayment: (paymentId: string) => {
    return UseEndpoint({
      clientType: 'auth',
      endpoint: `/payments/${paymentId}`,
      method: HttpMethods.Get
    })
  },

  createPayment: (payload: ICreatePaymentPayload) => {
    return UseEndpoint({
      clientType: 'auth',
      endpoint: '/payments',
      method: HttpMethods.Post,
      payload
    })
  },

  confirmPayment: (paymentId: string) => {
    return UseEndpoint({
      clientType: 'auth',
      endpoint: `/payments/${paymentId}/confirm`,
      method: HttpMethods.Patch
    })
  }
}