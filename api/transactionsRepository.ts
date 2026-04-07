import {TransactionsEndpoints} from '@baze-sdk/schema'

import {UseEndpoint} from '@/utils/api'

export default {
  intiateCharge: (payload: any) => {
    return UseEndpoint({
      endpoint: TransactionsEndpoints.initiateWebstoreCharge,
      payload
    })
  }
}
