import Constants from 'expo-constants'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import {useEffect, useRef, useState} from 'react'
import {Platform} from 'react-native'

import api from '@/api'
import {QUERY_KEYS} from '@/constants/queryKeys'
import {queryClient} from '@/utils/queryClient'
import {getFromVault, saveToVault} from '@/utils/storage'

export interface PushNotificationHandler {
  fetchTokenAndSetListeners: () => Promise<void>
}

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken
  notification?: Notifications.Notification
  pushNotificationHandler?: PushNotificationHandler
}

// Save Token to Server
const registerToken = async (token: string) => {
  try {
    const payload = {
      device_token: token,
      device_type: Platform.OS === 'ios' ? 'ios' : 'android'
    }
    await api.communications.registerPushToken(payload)
    await queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.USER],
      type: 'all'
    })
  } catch (err) {
    console.error(err)
  }
}

// Get Push Token
export async function registerForPushNotificationsAsync() {
  let token
  if (Device.isDevice) {
    const {status: existingStatus} = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const {status} = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      return
    }

    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas.projectId
    })
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C'
    })
  }

  if (token) {
    saveToVault('pushToken', token)
    registerToken(token.data).then()
  }
  return token
}

// Push Notification Hook
export const usePushNotifications = (
  getTokenOnMount: boolean = true
): PushNotificationState => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldShowAlert: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true
    })
  })

  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >()

  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >()

  const notificationListener = useRef<Notifications.EventSubscription>()
  const responseListener = useRef<Notifications.EventSubscription>()

  const getToken = async () => {
    const currentExpoPushToken: Notifications.ExpoPushToken | undefined =
      getFromVault('pushToken')

    if (currentExpoPushToken) return

    const token = await registerForPushNotificationsAsync()
    setExpoPushToken(token)
  }

  const fetchTokenAndSetListeners = async () => {
    getToken()
    notificationListener.current =
      Notifications.addNotificationReceivedListener(newNotification => {
        setNotification(newNotification)
      })

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        // Handle notification tap
        console.log('Notification response:', response)
      })
  }

  useEffect(() => {
    if (getTokenOnMount) {
      fetchTokenAndSetListeners()
    }

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove()
      }

      if (responseListener.current) {
        responseListener.current.remove()
      }
    }
  }, [getTokenOnMount])

  const pushNotificationHandler: PushNotificationHandler = {
    fetchTokenAndSetListeners
  }

  return {
    expoPushToken,
    notification,
    pushNotificationHandler
  }
}
