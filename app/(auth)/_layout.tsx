import {Stack} from 'expo-router'
import {StatusBar} from 'expo-status-bar'
import React, {useEffect} from 'react'

import OTAUpdatesScreen from '@/components/screens/ota-updates'
import {Box} from '@/components/ui'
import {useIsUpdateScreenShown, useUpdatesActions} from '@/store/updatesStore'

const AuthLayout = () => {
  const isUpdatesScreenShown = useIsUpdateScreenShown()
  const updatesActions = useUpdatesActions()

  useEffect(() => {
    if (!__DEV__) {
      updatesActions.autoCheckOTA()
    }
  }, [])

  return (
    <Box flex={1} position="relative">
      <StatusBar style="dark" animated />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'simple_push'
        }}>
        <Stack.Screen
          name="products/[productId]"
          options={{
            gestureEnabled: false
          }}
        />
        <Stack.Screen
          name="create-product"
          options={{
            gestureEnabled: false
          }}
        />
        <Stack.Screen
          name="webview-modal"
          options={{
            presentation: 'modal',
            gestureEnabled: true,
            animation: 'slide_from_bottom'
          }}
        />
      </Stack>
      {isUpdatesScreenShown && (
        <Box position="absolute" height="100%" width="100%">
          <OTAUpdatesScreen />
        </Box>
      )}
    </Box>
  )
}

export default AuthLayout
