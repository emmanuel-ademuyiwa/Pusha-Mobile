import {
  SalesPromotionEndpoints,
  SalesPromotionType,
  CreateSalesPromotionDto,
  UpdateSalesPromotionDto
} from '@baze-sdk/schema'

import {UseEndpoint} from '@/utils/api'

export default {
  fetchSalesPromotions: (storeId: string, type: SalesPromotionType) => {
    return UseEndpoint({
      endpoint: SalesPromotionEndpoints.fetch,
      query: {id: storeId, type}
    })
  },
  fetchSalesPromotion: (storeId: string, salesPromotionId: string) => {
    return UseEndpoint({
      endpoint: SalesPromotionEndpoints.fetchOne,
      query: {salesPromotionId, id: storeId}
    })
  },
  createSalesPromotion: (storeId: string, payload: CreateSalesPromotionDto) => {
    return UseEndpoint({
      endpoint: SalesPromotionEndpoints.create,
      payload,
      query: {id: storeId}
    })
  },
  updateSalesPromotion: (
    storeId: string,
    salesPromotionId: string,
    payload: UpdateSalesPromotionDto
  ) => {
    return UseEndpoint({
      endpoint: SalesPromotionEndpoints.update,
      payload,
      query: {salesPromotionId, id: storeId}
    })
  }
}
