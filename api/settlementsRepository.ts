import {IFilterSettlementsPayload, SettlementEndpoints} from '@baze-sdk/schema'

import {UseEndpoint} from '@/utils/api'

export default {
  listSettledPayments: (storeId: string) => {
    return UseEndpoint({
      endpoint: SettlementEndpoints.list,
      query: {id: storeId}
    })
  },
  listSettledPayment: (storeId: string, payload: IFilterSettlementsPayload) => {
    return UseEndpoint({
      endpoint: SettlementEndpoints.list,
      query: {id: storeId}
    })
  },
  listPendingPayments: (storeId: string) => {
    return UseEndpoint({
      endpoint: SettlementEndpoints.listPending,
      query: {id: storeId}
    })
  }
}
