import {HttpMethods} from '@/libs'
import {UseEndpoint} from '@/utils/api'

export interface PaystackBank {
  active: boolean
  code: string
  country: string
  gateway: string
  name: string
}

export interface IValidateAccountResponse {
  canBeUsed: boolean
  nameOnAccount: string
}

export interface ISetupBusinessPayload {
  name: string
  address: string
  city?: string
  state?: string
  country: string
  currency: string
  business_tags: string
  description: string
  email: string
  phone_number?: string
  ai_order_threshold?: number
}

export default {
  setupBusiness: (payload: ISetupBusinessPayload) => {
    return UseEndpoint({
      endpoint: '/business',
      payload,
      method: HttpMethods.Put
    })
  },
  fetchBusiness: () => {
    return UseEndpoint({
      endpoint: '/business'
    })
  }
}
