import {UseEndpoint} from '@/utils/api'

export default {
  getDashboardStat: (storeId: string, payload: IFilterDashboard) => {
    return UseEndpoint({
      endpoint: StoreAnalyticsEndpoints.filterDashboard,
      payload,
      query: {id: storeId}
    })
  }
}
