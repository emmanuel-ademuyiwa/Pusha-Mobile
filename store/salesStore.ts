import {api} from '@/api'
import {create} from 'zustand'

import {errorHandler} from '@/utils/errorHandler'
import toast from '@/utils/toast'
import {queryClient} from '@/utils/queryClient'
import {QUERY_KEYS} from '@/constants/queryKeys'

type SalesStoreType = {
  loadingState: {
    deleteSale: boolean
  }
  actions: SalesActions
}

type SalesActions = {
  deleteSale: (
    saleId: string,
    onSuccess?: () => void
  ) => Promise<void>
  resetStore: () => void
}

const useSalesStore = create<SalesStoreType>()(set => {
  return {
    loadingState: {
      deleteSale: false
    },
    actions: {
      deleteSale: async (saleId, onSuccess) => {
        try {
          set(state => ({
            loadingState: {...state.loadingState, deleteSale: true}
          }))

          await api.sales.deleteSale(saleId)

          toast.success('Sale deleted successfully!')
          
          // Invalidate related queries to refresh data
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.SALES]
          })
          queryClient.removeQueries({
            queryKey: [QUERY_KEYS.SALE, saleId]
          })
          
          if (onSuccess) {
            onSuccess()
          }

          set(state => ({
            loadingState: {...state.loadingState, deleteSale: false}
          }))
        } catch (err) {
          set(state => ({
            loadingState: {...state.loadingState, deleteSale: false}
          }))
          errorHandler(err)
        }
      },

      resetStore: () => {
        set(() => ({
          loadingState: {
            deleteSale: false
          }
        }))
      }
    }
  }
})

// Export selective hooks for optimal re-renders
export const useSalesActions = () =>
  useSalesStore(state => state.actions)
export const useSalesLoadingState = () =>
  useSalesStore(state => state.loadingState)

export default useSalesStore