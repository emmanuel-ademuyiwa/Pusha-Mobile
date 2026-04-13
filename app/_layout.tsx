import NetInfo from '@react-native-community/netinfo'
import * as Sentry from '@sentry/react-native'
import {ThemeProvider} from '@shopify/restyle'
import {focusManager, onlineManager} from '@tanstack/react-query'
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client'
import {Stack} from 'expo-router'
import React, {useEffect} from 'react'
import type {AppStateStatus} from 'react-native'
import {AppState, Platform, View} from 'react-native'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import {
  KeyboardProvider,
  KeyboardToolbar
} from 'react-native-keyboard-controller'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import Toast, {ToastProvider} from 'react-native-toast-notifications'
// import {vexo} from 'vexo-analytics'

import {theme} from '@/theme'
import {ModalProvider} from '@/types/modal'
import {clientPersister, queryClient} from '@/utils/queryClient'
import {useFonts} from 'expo-font'
import { PaystackProvider } from 'react-native-paystack-webview';

const SENTRY_DSN =
  'https://2ee17e224c7d687a717558c492a4e6f0@o4509294588461056.ingest.us.sentry.io/4509294595342336'

  const PAYSTACK_PUBLIC_KEY = 'pk_test_668fc54ca163266d580e0ee04ee1a3cc0205c190'

// Init Sentry Config

if (!__DEV__) {
  Sentry.init({
    dsn: SENTRY_DSN,
    debug: true
  })
}

// vexo(ENV.VEXO_ID ?? '')

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active')
  }
}

onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => {
    setOnline(!!state.isConnected)
  })
})

const PaystackProviderWrapper = ({children}: {children: React.ReactNode}) => {

  return (
    <PaystackProvider
      publicKey={PAYSTACK_PUBLIC_KEY}
      defaultChannels={[]}>
      {children}
    </PaystackProvider>
  )
}


function App() {
  const [fontsLoaded] = useFonts({
    'InstrumentSan-Regular': require('../assets/fonts/InstrumentSan-Regular.ttf'),
    'InstrumentSan-Medium': require('../assets/fonts/InstrumentSan-Medium.ttf'),
    'InstrumentSan-SemiBold': require('../assets/fonts/InstrumentSan-SemiBold.ttf'),
    'InstrumentSan-Bold': require('../assets/fonts/InstrumentSan-Bold.ttf'),
    'Dahlia-Bold': require('../assets/fonts/dahlia-bold.otf'),
    'Dahlia-Medium': require('../assets/fonts/dahlia-medium.otf'),
    'Dahlia-Regular': require('../assets/fonts/dahlia-bold.otf'),
    icomoon: require('../assets/fonts/icomoon.ttf')
  })

  // const {pushNotificationHandler, expoPushToken, notification} =
  //   usePushNotifications(false)
  // const pushNotificationAction = usePushNotificationActions()

  // useEffect(() => {
  //   pushNotificationAction.setPushNotificationHandler(pushNotificationHandler)
  // }, [])

  // useEffect(() => {
  //   pushNotificationAction.setPushNotificationToken(expoPushToken)
  // }, [expoPushToken])

  // useEffect(() => {
  //   pushNotificationAction.setPushNotificationNotification(notification)
  // }, [notification])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange)

    return () => subscription.remove()
  }, [])

  if (!fontsLoaded) {
    return null // Or a loading indicator
  }

  return (
    <View style={{flex: 1}}>
      <PaystackProviderWrapper>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: clientPersister,
          maxAge: Infinity
        }}>
        <GestureHandlerRootView style={{flex: 1}}>
          <ToastProvider offsetTop={40} placement="top" duration={3000}>
            <ThemeProvider theme={theme}>
              <KeyboardProvider>
                <ModalProvider>
                  <SafeAreaProvider>
                    <Stack
                      screenOptions={{
                        headerShown: false,
                        animation: 'fade'
                      }}
                    />
                  </SafeAreaProvider>
                </ModalProvider>
                <KeyboardToolbar />
              </KeyboardProvider>
            </ThemeProvider>
          </ToastProvider>
        </GestureHandlerRootView>
      </PersistQueryClientProvider>
      </PaystackProviderWrapper>
      {/* @ts-ignore */}
      <Toast ref={ref => (global.toast = ref)} />
    </View>
  )
}

const SalesRepApp = __DEV__ ? App : Sentry.wrap(App)

export default SalesRepApp
