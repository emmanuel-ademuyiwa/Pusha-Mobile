import {Toast} from 'react-native-toast-notifications'

import {useAppStore} from '@/store/appStore'

type ToastType = 'danger' | 'success' | 'normal'

const showToast = (message: string, type: ToastType) => {
  if (!useAppStore.getState().isSnackActive) {
    useAppStore.getState().actions.setSnackActiveState(true)

    Toast.show(message, {type})

    setTimeout(() => {
      useAppStore.getState().actions.setSnackActiveState(false)
    }, 2500)
  }
}

export const toast = {
  error: (message: string) => showToast(message, 'danger'),
  success: (message: string) => showToast(message, 'success'),
  info: (message: string) => showToast(message, 'normal'),
  dismissAll: () => Toast.hideAll()
}

export default toast
