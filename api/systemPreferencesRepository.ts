import {SystemPreferencesEndpoints} from '@baze-sdk/schema'

import {UseEndpoint} from '@/utils/api'
export default {
  sendTemplateToMail: (
    slug: 'product-upload-template' | 'customer-upload-template'
  ) => {
    return UseEndpoint({
      endpoint: SystemPreferencesEndpoints.requestTemplateEmail,
      query: {slug}
    })
  },
  getTemplateURL: async <T>(
    slug: 'product-upload-template' | 'customer-upload-template'
  ) => {
    const response = await UseEndpoint({
      clientType: 'public',
      endpoint: SystemPreferencesEndpoints.fetchBySlug,
      query: {slug}
    })
    return response.data.preference.value as T
  }
}
