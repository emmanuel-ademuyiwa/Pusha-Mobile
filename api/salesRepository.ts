import {HttpMethods} from '@/libs'
import {UseEndpoint} from '@/utils/api'

export default {
  listSales: (query?: {
    page?: number
    limit?: number
    status?: string
    customer_id?: string
    date_range?:{
      start?: string
      end?: string
    }
  }) => {
    return UseEndpoint({
      clientType: 'auth',
      endpoint: '/sales',
      method: HttpMethods.Get,
      query
    })
  },

  getSale: (saleId: string) => {
    return UseEndpoint({
      clientType: 'auth',
      endpoint: `/sales/${saleId}`,
      method: HttpMethods.Get
    })
  },

  updateSale: (saleId: string, payload: any) => {
    return UseEndpoint({
      clientType: 'auth',
      endpoint: `/sales/${saleId}`,
      method: HttpMethods.Put,
      payload
    })
  },

  deleteSale: (saleId: string) => {
    return UseEndpoint({
      clientType: 'auth',
      endpoint: `/sales/${saleId}`,
      method: HttpMethods.Delete
    })
  }
}