import {api} from '@/api'
import {create} from 'zustand'

import {ICreatePaymentPayload} from '@/types'
import {errorHandler} from '@/utils/errorHandler'
import toast from '@/utils/toast'
import {queryClient} from '@/utils/queryClient'
import {QUERY_KEYS} from '@/constants/queryKeys'

type PaymentsStoreType = {
  loadingState: {
    createPayment: boolean
    confirmPayment: boolean
  }
  actions: PaymentsActions
}

type PaymentsActions = {
  createPayment: (
    payload: ICreatePaymentPayload,
    onSuccess?: (payment: any) => void
  ) => Promise<void>
  confirmPayment: (
    paymentId: string,
    onSuccess?: (payment: any) => void
  ) => Promise<void>
  resetStore: () => void
}

const usePaymentsStore = create<PaymentsStoreType>()(set => {
  return {
    loadingState: {
      createPayment: false,
      confirmPayment: false
    },
    actions: {
      createPayment: async (payload, onSuccess) => {
        try {
          set(state => ({
            loadingState: {...state.loadingState, createPayment: true}
          }))

          const response = await api.payments.createPayment(payload)

          if (response?.data?.data) {
            toast.success('Payment created successfully!')
            
            // Invalidate related queries to refresh data
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.PAYMENTS]
            })
            
            if (onSuccess) {
              onSuccess(response.data.data)
            }
          }

          set(state => ({
            loadingState: {...state.loadingState, createPayment: false}
          }))
        } catch (err) {
          set(state => ({
            loadingState: {...state.loadingState, createPayment: false}
          }))
          errorHandler(err)
        }
      },

      confirmPayment: async (paymentId, onSuccess) => {
        try {
          set(state => ({
            loadingState: {...state.loadingState, confirmPayment: true}
          }))

          const response = await api.payments.confirmPayment(paymentId)

          if (response?.data?.data) {
            toast.success('Payment confirmed successfully!')
            
            // Invalidate related queries to refresh data
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.PAYMENTS]
            })
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.PAYMENT, paymentId]
            })
            
            if (onSuccess) {
              onSuccess(response.data.data)
            }
          }

          set(state => ({
            loadingState: {...state.loadingState, confirmPayment: false}
          }))
        } catch (err) {
          set(state => ({
            loadingState: {...state.loadingState, confirmPayment: false}
          }))
          errorHandler(err)
        }
      },

      resetStore: () => {
        set(() => ({
          loadingState: {
            createPayment: false,
            confirmPayment: false
          }
        }))
      }
    }
  }
})

// Export selective hooks for optimal re-renders
export const usePaymentsActions = () =>
  usePaymentsStore(state => state.actions)
export const usePaymentsLoadingState = () =>
  usePaymentsStore(state => state.loadingState)

export default usePaymentsStore