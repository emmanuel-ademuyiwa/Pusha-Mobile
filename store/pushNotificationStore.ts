import {create} from 'zustand'

import {PushNotificationState} from '@/hooks/usePushNotifications'

interface pushNotificationStore {
  pushToken: PushNotificationState['expoPushToken']
  notification: PushNotificationState['notification']
  pushNotificationHandler: PushNotificationState['pushNotificationHandler']
  actions: {
    setPushNotificationHandler: (
      handler: PushNotificationState['pushNotificationHandler']
    ) => void
    setPushNotificationToken: (
      token: PushNotificationState['expoPushToken']
    ) => void
    setPushNotificationNotification: (
      notification: PushNotificationState['notification']
    ) => void
  }
}

const usePushNotificationStore = create<pushNotificationStore>()(set => {
  return {
    pushToken: {} as PushNotificationState['expoPushToken'],
    notification: {} as PushNotificationState['notification'],
    pushNotificationHandler:
      {} as PushNotificationState['pushNotificationHandler'],
    actions: {
      setPushNotificationHandler: handler =>
        set({
          pushNotificationHandler: handler
        }),

      setPushNotificationToken: token =>
        set({
          pushToken: token
        }),
      setPushNotificationNotification: notification =>
        set({
          notification
        })
    }
  }
})

const usePushNotificationHandler = () =>
  usePushNotificationStore(state => state.pushNotificationHandler)

const usePushNotificationToken = () =>
  usePushNotificationStore(state => state.pushToken)

const usePushNotificationNotification = () =>
  usePushNotificationStore(state => state.notification)

const usePushNotificationActions = () =>
  usePushNotificationStore(state => state.actions)

export {
  usePushNotificationStore,
  usePushNotificationHandler,
  usePushNotificationToken,
  usePushNotificationNotification,
  usePushNotificationActions
}
