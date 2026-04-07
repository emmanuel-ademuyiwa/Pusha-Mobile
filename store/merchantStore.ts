import {api} from '@/api'
import {create} from 'zustand'

import {errorHandler} from '@/utils/errorHandler'
import toast from '@/utils/toast'

interface ISetupBusinessPayload {
  name: string
  address: string
  city: string
  state: string
  country: string
  currency: string
  business_tags: string
  description: string
}

interface SocialConnection {
  id: string
  name: string
  isConnected: boolean
}

type MerchantStoreType = {
  businessDetails: {
    businessName: string
    business_tags: string
    city: string
    state: string
    businessAddress: string
    description: string
    currency: string
    country: string
  }
  socialConnections: SocialConnection[]
  loadingState: {
    setupBusiness: boolean
    fetchBusiness: boolean
    updateSocials: boolean
  }
  actions: MerchantActions
}

type MerchantActions = {
  setBusinessDetails: (
    details: Partial<MerchantStoreType['businessDetails']>
  ) => void
  setupBusiness: (
    payload: ISetupBusinessPayload,
    onSuccess?: () => void
  ) => Promise<void>
  fetchBusiness: () => Promise<void>
  updateSocialConnection: (platformId: string, isConnected: boolean) => void
  resetStore: () => void
}

const useMerchantStore = create<MerchantStoreType>()(set => {
  return {
    businessDetails: {
      businessName: '',
      business_tags: '',
      city: '',
      state: '',
      businessAddress: '',
      description: '',
      currency: '',
      country: 'Nigeria'
    },
    socialConnections: [
      { id: 'whatsapp', name: 'WhatsApp', isConnected: false },
      { id: 'instagram', name: 'Instagram', isConnected: false },
      { id: 'facebook', name: 'Facebook', isConnected: false },
      { id: 'tiktok', name: 'TikTok', isConnected: false }
    ],
    loadingState: {
      setupBusiness: false,
      fetchBusiness: false,
      updateSocials: false
    },
    actions: {
      setBusinessDetails: details => {
        set(state => ({
          businessDetails: {
            ...state.businessDetails,
            ...details
          }
        }))
      },

      setupBusiness: async (payload, onSuccess) => {
        try {
          set(state => ({
            loadingState: {...state.loadingState, setupBusiness: true}
          }))

          const formattedPayload: ISetupBusinessPayload = {
            name: payload.name.trim(),
            address: payload.address.trim(),
            city: payload.city.trim(),
            state: payload.state,
            country: payload.country || 'Nigeria',
            currency: payload.currency,
            business_tags: payload.business_tags.trim(),
            description: payload.description.trim()
          }

          const response = await api.merchants.setupBusiness(formattedPayload)

          if (response?.data) {
            toast.success('Business setup completed successfully!')

            // Update store with the setup details
            set(state => ({
              businessDetails: {
                businessName: formattedPayload.name,
                business_tags: formattedPayload.business_tags,
                city: formattedPayload.city,
                state: formattedPayload.state,
                businessAddress: formattedPayload.address,
                description: formattedPayload.description,
                currency: formattedPayload.currency,
                country: formattedPayload.country
              }
            }))

            // Fetch updated business data after successful setup
            await useMerchantStore.getState().actions.fetchBusiness()

            if (onSuccess) {
              onSuccess()
            }
          }

          set(state => ({
            loadingState: {...state.loadingState, setupBusiness: false}
          }))
        } catch (err) {
          set(state => ({
            loadingState: {...state.loadingState, setupBusiness: false}
          }))
          errorHandler(err)
        }
      },

      fetchBusiness: async () => {
        try {
          set(state => ({
            loadingState: {...state.loadingState, fetchBusiness: true}
          }))

          const response = await api.merchants.fetchBusiness()

          if (response?.data?.data) {
            const businessData = response.data.data
            console.log("🚀 ~ businessData:", businessData)
            
            set(state => ({
              businessDetails: {
                businessName: businessData.name || '',
                business_tags: businessData.business_tags || '',
                city: businessData.city || '',
                state: businessData.state || '',
                businessAddress: businessData.address || '',
                description: businessData.description || '',
                currency: businessData.currency || '',
                country: businessData.country || 'Nigeria'
              }
            }))
          }

          set(state => ({
            loadingState: {...state.loadingState, fetchBusiness: false}
          }))
        } catch (err) {
          set(state => ({
            loadingState: {...state.loadingState, fetchBusiness: false}
          }))
          errorHandler(err)
        }
      },

      updateSocialConnection: (platformId, isConnected) => {
        set(state => ({
          socialConnections: state.socialConnections.map(connection =>
            connection.id === platformId
              ? {...connection, isConnected}
              : connection
          )
        }))
      },

      resetStore: () => {
        set(() => ({
          businessDetails: {
            businessName: '',
            business_tags: '',
            city: '',
            state: '',
            businessAddress: '',
            description: '',
            currency: '',
            country: 'Nigeria'
          },
          socialConnections: [
            { id: 'whatsapp', name: 'WhatsApp', isConnected: false },
            { id: 'instagram', name: 'Instagram', isConnected: false },
            { id: 'facebook', name: 'Facebook', isConnected: false },
            { id: 'tiktok', name: 'TikTok', isConnected: false }
          ],
          loadingState: {
            setupBusiness: false,
            fetchBusiness: false,
            updateSocials: false
          }
        }))
      }
    }
  }
})

export const useBusinessSetupActions = () =>
  useMerchantStore(state => state.actions)
export const useBusinessSetupLoadingState = () =>
  useMerchantStore(state => state.loadingState)
export const useBusinessDetails = () =>
  useMerchantStore(state => state.businessDetails)
export const useSocialConnections = () =>
  useMerchantStore(state => state.socialConnections)

export default useMerchantStore
