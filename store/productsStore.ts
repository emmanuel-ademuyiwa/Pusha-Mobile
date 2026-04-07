import {api} from '@/api'
import {ICreateProductPayload} from '@/types'
import {create} from 'zustand'

import {errorHandler} from '@/utils/errorHandler'
import toast from '@/utils/toast'

interface ProductsStoreType {
  products: any[]
  categories: any[]
  loadingState: {
    createProduct: boolean
    updateProduct: boolean
    deleteProduct: boolean
    createCategory: boolean
  }
  actions: ProductsActions
}

type ProductsActions = {
  createProduct: (
    payload: ICreateProductPayload,
    onSuccess?: () => void
  ) => Promise<void>
  deleteProduct: (payloadId: string, onSuccess?: () => void) => Promise<void>
  updateProduct: (
    productId: string,
    payload: ICreateProductPayload,
    onSuccess?: () => void
  ) => Promise<void>
  createCategory: (
    payload: {name: string},
    onSuccess?: () => void
  ) => Promise<void>
  resetStore: () => void
}

const useProductsStore = create<ProductsStoreType>()(set => {
  return {
    products: [],
    categories: [],
    loadingState: {
      createProduct: false,
      updateProduct: false,
      deleteProduct: false,
      createCategory: false
    },
    actions: {
      createProduct: async (payload, onSuccess) => {
        try {
          set(state => ({
            loadingState: {...state.loadingState, createProduct: true}
          }))

          const response = await api.products.createProduct(payload)

          if (response?.data) {
            if (onSuccess) {
              onSuccess()
            }
          }

          set(state => ({
            loadingState: {...state.loadingState, createProduct: false}
          }))
        } catch (err) {
          set(state => ({
            loadingState: {...state.loadingState, createProduct: false}
          }))
          errorHandler(err)
        }
      },
      deleteProduct: async (payload, onSuccess) => {
        try {
          set(state => ({
            loadingState: {...state.loadingState, deleteProduct: true}
          }))

          const response = await api.products.deleteProduct(payload)

          if (response?.data) {
            if (onSuccess) {
              onSuccess()
            }
          }

          set(state => ({
            loadingState: {...state.loadingState, deleteProduct: false}
          }))
        } catch (err) {
          set(state => ({
            loadingState: {...state.loadingState, deleteProduct: false}
          }))
          errorHandler(err)
        }
      },

      updateProduct: async (productId, payload, onSuccess) => {
        try {
          set(state => ({
            loadingState: {...state.loadingState, updateProduct: true}
          }))

          const response = await api.products.updateProduct(productId, payload)

          if (response?.data) {
            if (onSuccess) {
              onSuccess()
            }
          }

          set(state => ({
            loadingState: {...state.loadingState, updateProduct: false}
          }))
        } catch (err) {
          set(state => ({
            loadingState: {...state.loadingState, updateProduct: false}
          }))
          errorHandler(err)
        }
      },

      createCategory: async (payload, onSuccess) => {
        try {
          set(state => ({
            loadingState: {...state.loadingState, createCategory: true}
          }))

          const response = await api.products.createCategory(payload)

          if (response?.data) {
            toast.success('Category created successfully!')

            if (onSuccess) {
              onSuccess()
            }
          }

          set(state => ({
            loadingState: {...state.loadingState, createCategory: false}
          }))
        } catch (err) {
          set(state => ({
            loadingState: {...state.loadingState, createCategory: false}
          }))
          errorHandler(err)
        }
      },

      resetStore: () => {
        set(() => ({
          products: [],
          categories: [],
          loadingState: {
            createProduct: false,
            updateProduct: false,
            deleteProduct: false,
            createCategory: false
          }
        }))
      }
    }
  }
})

export const useProductsActions = () => useProductsStore(state => state.actions)
export const useProductsLoadingState = () =>
  useProductsStore(state => state.loadingState)
export const useProducts = () => useProductsStore(state => state.products)
export const useProductCategories = () =>
  useProductsStore(state => state.categories)

export default useProductsStore
