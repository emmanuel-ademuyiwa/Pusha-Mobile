import { api } from '@/api'
import { create } from 'zustand'

import { errorHandler } from '@/utils/errorHandler'

type SocialsStoreType = {
  loadingState: {
    connectWhatsappAuth: boolean
  }
  actions: SocialsActions
}

type SocialsActions = {
  connectWhatsappAuth: (
    authType: 'whatsapp' | 'facebook' | 'tiktok'|'instagram',
    onSuccess?: (url: string) => void
  ) => Promise<void>
  resetStore: () => void
}

const useSocialsStore = create<SocialsStoreType>()(set => {
  return {
    loadingState: {
      connectWhatsappAuth: false
    },
    actions: {
      connectWhatsappAuth: async (authType, onSuccess) => {
        try {
          set(state => ({
            loadingState: {...state.loadingState, connectWhatsappAuth: true}
          }))

          const res = await api.socials.connectWhatsappAuth(authType)

          // Invalidate related queries to refresh data
          //   queryClient.invalidateQueries({
          //     queryKey: [QUERY_KEYS.Socials]
          //   })
          //   queryClient.removeQueries({
          //     queryKey: [QUERY_KEYS.SALE, saleId]
          //   })

          if (onSuccess) {
            onSuccess(res.data.data.url)
          }

          set(state => ({
            loadingState: {...state.loadingState, connectWhatsappAuth: false}
          }))
        } catch (err) {
          set(state => ({
            loadingState: {...state.loadingState, connectWhatsappAuth: false}
          }))
          errorHandler(err)
        }
      },

      resetStore: () => {
        set(() => ({
          loadingState: {
            connectWhatsappAuth: false
          }
        }))
      }
    }
  }
})

// Export selective hooks for optimal re-renders
export const useSocialsActions = () => useSocialsStore(state => state.actions)
export const useSocialsLoadingState = () =>
  useSocialsStore(state => state.loadingState)

export default useSocialsStore
