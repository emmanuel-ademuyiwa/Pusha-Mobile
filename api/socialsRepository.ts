import { HttpMethods } from '@/libs'
import { UseEndpoint } from '@/utils/api'

export default {
  connectWhatsappAuth: (authType: 'whatsapp' | 'facebook' | 'tiktok' | 'instagram') => {
    return UseEndpoint({
      endpoint: `/${authType}/auth-url`,
      method: HttpMethods.Get
    })
  },
  connectFacebookAuth: () => {
    return UseEndpoint({
      endpoint: '/facebook/auth-url',
      method: HttpMethods.Get
    })
  },
  businessIntegrations: () => {
    return UseEndpoint({
      endpoint: '/business/integrations',
      method: HttpMethods.Get
    })
  }
}
