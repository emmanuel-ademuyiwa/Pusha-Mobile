import * as Updates from 'expo-updates'
import {create} from 'zustand'

import {saveToVault} from '@/utils/storage'
import toast from '@/utils/toast'

interface UpdatesStore {
  isUpdateScreenShown: boolean
  updateExists: undefined | boolean
  loadingState: {
    otaCheck: boolean
    appStoreCheck: boolean
    otaUpdate: boolean
  }
  actions: {
    checkForOTAUpdate: () => Promise<void>
    checkForAppStoreUpdate: () => Promise<void>
    setIsUpdateScreenShown: (state: boolean) => void
    fetchOTAUpdate: () => Promise<void>
    autoCheckOTA: () => Promise<void>
  }
}

const useUpdatesStore = create<UpdatesStore>()((set, get) => {
  return {
    isUpdateScreenShown: false,
    updateExists: undefined,
    loadingState: {
      otaCheck: false,
      appStoreCheck: false,
      otaUpdate: false
    },

    actions: {
      checkForOTAUpdate: async () => {
        const now = Date.now()
        try {
          set(state => ({
            loadingState: {
              ...state.loadingState,
              otaCheck: true
            }
          }))

          const update = await Updates.checkForUpdateAsync()

          if (update.isAvailable) {
            set(() => ({updateExists: true}))
          } else {
            set(() => ({updateExists: false}))
          }

          saveToVault('otaLastChecked', now.toString())
        } catch (err) {
          set(() => ({isUpdateScreenShown: false, updateExists: undefined}))
          toast.error('Failed to check for updates')
        } finally {
          set(state => ({
            loadingState: {
              ...state.loadingState,
              otaCheck: false
            }
          }))
        }
      },
      fetchOTAUpdate: async () => {
        try {
          set(state => ({
            loadingState: {
              ...state.loadingState,
              otaUpdate: true
            }
          }))

          const update = await Updates.checkForUpdateAsync()

          if (update.isAvailable) {
            await Updates.fetchUpdateAsync()
            await Updates.reloadAsync()
          } else {
            toast.info("You're up to date!")
            set(state => ({
              updateExists: undefined,
              isUpdateScreenShown: false,
              loadingState: {
                ...state.loadingState,
                otaUpdate: false
              }
            }))
          }
        } catch (err) {
          set(() => ({isUpdateScreenShown: false, updateExists: undefined}))
          toast.error('Failed to fetch updates')
          set(state => ({
            loadingState: {
              ...state.loadingState,
              otaUpdate: false
            }
          }))
        }
      },
      autoCheckOTA: async () => {
        const now = Date.now()
        try {
          const update = await Updates.checkForUpdateAsync()

          if (update.isAvailable) {
            set(() => ({updateExists: true, isUpdateScreenShown: true}))
          } else {
            set(() => ({updateExists: false, isUpdateScreenShown: false}))
          }

          saveToVault('otaLastChecked', now.toString())
        } catch (err) {
          set(() => ({isUpdateScreenShown: false, updateExists: undefined}))
        } finally {
          set(state => ({
            loadingState: {
              ...state.loadingState,
              otaCheck: false
            }
          }))
        }
      },
      checkForAppStoreUpdate: async () => {},
      setIsUpdateScreenShown: (state: boolean) => {
        set(() => ({isUpdateScreenShown: state, updateExists: undefined}))
      }
    }
  }
})

const useIsUpdateScreenShown = () =>
  useUpdatesStore(state => state.isUpdateScreenShown)
const useUpdateExists = () => useUpdatesStore(state => state.updateExists)
const useUpdatesActions = () => useUpdatesStore(state => state.actions)
const useUpdatesLoadingState = () =>
  useUpdatesStore(state => state.loadingState)

export {
  useUpdatesStore,
  useIsUpdateScreenShown,
  useUpdateExists,
  useUpdatesActions,
  useUpdatesLoadingState
}
