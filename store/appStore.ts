import {create} from 'zustand'
interface AppStore {
  isSnackActive: boolean
  actions: {
    setSnackActiveState: (state: boolean) => void
  }
}

const useAppStore = create<AppStore>()(set => {
  return {
    isSnackActive: false,

    actions: {
      setSnackActiveState: async isActive => {
        set(() => ({
          isSnackActive: isActive
        }))
      }
    }
  }
})

const useSnackActiveState = () => useAppStore(state => state.isSnackActive)
const useAppActions = () => useAppStore(state => state.actions)

export {useSnackActiveState, useAppActions, useAppStore}
