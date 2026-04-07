import { HttpMethods } from '@/libs'
import { ICreateProductPayload } from '@/types'
import { UseEndpoint } from '@/utils/api'

export default {
  createProduct: (payload: ICreateProductPayload) => {
    return UseEndpoint({
      endpoint: `/products`,
      method: HttpMethods.Post,
      payload: payload
    })
  },
  createProductsWithFile: (storeId: string, payload: any) => {
    return UseEndpoint({
      endpoint: `/products`,
      method: HttpMethods.Post,
      payload: payload
    })
  },
  listProducts: (query?: {page?: number; limit?: number; search?: string}) => {
    return UseEndpoint({
      endpoint: `/products`,
      query: query
    })
  },
  getProduct: (productId: string) => {
    return UseEndpoint({
      endpoint: `/products/${productId}`
    })
  },
  updateProduct: (productId: string, payload: ICreateProductPayload) => {
    return UseEndpoint({
      endpoint: `/products/${productId}`,
      method: HttpMethods.Put,
      payload: payload
    })
  },
  updateProductCollections: (productId: string, payload: any) => {
    return UseEndpoint({
      endpoint: `/`,
      method: HttpMethods.Post,
      payload: payload
    })
  },
  bulkUpdateProductStatus: (storeId: string, payload: any) => {
    return UseEndpoint({
      endpoint: `/`,
      method: HttpMethods.Post,
      payload: payload
    })
  },
  listCategories: () => {
    return UseEndpoint({
      endpoint: `/product-categories`
    })
  },
  createCategory: (payload: {name: string; description?: string}) => {
    return UseEndpoint({
      endpoint: `/product-categories`,
      method: HttpMethods.Post,
      payload: payload
    })
  },
  deleteProduct: (productId: string) => {
    return UseEndpoint({
      endpoint: `/products/${productId}/delete`,
      method: HttpMethods.Delete
    })
  },
  productsStockAnalytics: () => {
    return UseEndpoint({
      endpoint: `/products/stock/analytics`
    })
  }
}
