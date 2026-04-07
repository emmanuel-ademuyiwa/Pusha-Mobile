import { HttpMethods } from '@/libs'
import { UseEndpoint } from '@/utils/api'

interface SubscribePayload {
  plan_id?: string
}

interface InitiatePaymentPayload {
  plan_id: string
  billing_cycle: 'MONTHLY' | 'YEARLY'
  auto_renew: boolean
}

interface VerifyPaymentPayload {
  reference: string
}

export default {
  getPlans: () => {
    return UseEndpoint({
      endpoint: '/subscription/plans',
      method: HttpMethods.Get
    })
  },

  subscribe: (payload: SubscribePayload) => {
    return UseEndpoint({
      endpoint: '/subscription/subscribe',
      method: HttpMethods.Post,
      payload: payload
    })
  },

  getCurrentSubscription: () => {
    return UseEndpoint({
      endpoint: '/subscription/current',
      method: HttpMethods.Get
    })
  },

  initiatePayment: (payload: InitiatePaymentPayload) => {
    return UseEndpoint({
      endpoint: '/subscription/initiate-payment',
      method: HttpMethods.Post,
      payload: payload
    })
  },

  verifyPayment: (payload: VerifyPaymentPayload) => {
    return UseEndpoint({
      endpoint: '/subscription/verify-payment',
      method: HttpMethods.Post,
      payload: payload
    })
  },

  cancelSubscription: () => {
    return UseEndpoint({
      endpoint: '/subscription/cancel',
      method: HttpMethods.Post
    })
  }
}
