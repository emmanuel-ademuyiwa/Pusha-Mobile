import {
  IFilterOrders,
  IUpdateOrderStatusPayload,
  OrderEndpoints
} from '@baze-sdk/schema'
import {UseEndpoint} from '@utils/api'

export default {
  listOrders: async (storeId: string, payload: IFilterOrders) => {
    return UseEndpoint({
      endpoint: OrderEndpoints.fetch,
      payload,
      query: {id: storeId}
    })
  },
  updateOrderStatus: (storeId: string, payload: IUpdateOrderStatusPayload) => {
    return UseEndpoint({
      endpoint: OrderEndpoints.merchantUpdateStatus,
      payload,
      query: {id: storeId}
    })
  },
  listOrdersByStatus: async (
    storeId: string,
    payload: typeof OrderEndpoints.leanFetch.bodyType
  ) => {
    return UseEndpoint({
      endpoint: OrderEndpoints.leanFetch,
      payload,
      query: {id: storeId}
    })
  },
  createOrder: (
    id: string,
    payload: typeof OrderEndpoints.merchantCreate.bodyType
  ) => {
    return UseEndpoint({
      endpoint: OrderEndpoints.merchantCreate,
      payload,
      query: {id}
    })
  },
  updateOrder: (
    storeId: string,
    payload: typeof OrderEndpoints.merchantUpdate.bodyType
  ) => {
    return UseEndpoint({
      endpoint: OrderEndpoints.merchantUpdate,
      payload,
      query: {id: storeId}
    })
  },
  updateOrderPaymentStatus: (
    storeId: string,
    payload: typeof OrderEndpoints.merchantUpdatePaymentStatus.bodyType
  ) => {
    return UseEndpoint({
      endpoint: OrderEndpoints.merchantUpdatePaymentStatus,
      payload,
      query: {id: storeId}
    })
  }
}
