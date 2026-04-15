import { HttpMethods } from '@/libs'
import { ICreateProductPayload } from '@/types'
import { UseEndpoint } from '@/utils/api'

function mapToTextUploadPayload(payload: ICreateProductPayload) {
  const brand = payload.brand?.trim()
  const desc = payload.description?.trim() ?? ''
  const description = brand
    ? desc
      ? `Brand: ${brand}\n\n${desc}`
      : `Brand: ${brand}`
    : desc || '—'

  const image_urls = (payload.images ?? []).filter(Boolean).join(',')

  return {
    name: payload.name.trim(),
    category: (payload.category ?? '').trim(),
    description,
    tags: payload.tags ?? [],
    unit_price: payload.unit_price,
    discount_price: payload.discount_price ?? 0,
    is_available: payload.visible,
    image_urls
  }
}

export default {
  createProduct: (payload: ICreateProductPayload) => {
    return UseEndpoint({
      endpoint: `/products`,
      method: HttpMethods.Post,
      payload: mapToTextUploadPayload(payload)
    })
  },
  uploadProductFile: (formData: FormData) => {
    return UseEndpoint({
      endpoint: `/products/upload/file`,
      method: HttpMethods.Post,
      payload: formData
    })
  },
  createProductsWithFile: (_storeId: string, payload: FormData) => {
    return UseEndpoint({
      endpoint: `/products/upload/file`,
      method: HttpMethods.Post,
      payload
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
