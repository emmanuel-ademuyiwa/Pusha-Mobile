import {useIsRestoring} from '@tanstack/react-query'
import * as ExpoSplashScreen from 'expo-splash-screen'
import {StatusBar} from 'expo-status-bar'
import React, {useEffect} from 'react'

import {Box} from '@/components/ui'
import {useAuthActions} from '@/store/authStore'
import {getFromVault, saveToVault} from '@/utils/storage'

// Prevent auto-hide at the very top level
ExpoSplashScreen.preventAutoHideAsync()

ExpoSplashScreen.setOptions({
  duration: 1000,
  fade: true
})

const Page = () => {
  const authActions = useAuthActions()
  const isRestoringCache = useIsRestoring()

  const init = async () => {
    const hasAppLaunchedBefore: boolean | null = getFromVault(
      'hasAppLaunchedBefore'
    )

    if (hasAppLaunchedBefore) {
      authActions.authenticate()
      return
    } else {
      setTimeout(() => {
        authActions.authenticate()
      }, 5000)
    }

    saveToVault('hasAppLaunchedBefore', true)
  }

  useEffect(() => {
    // AUTHENTICATE AFTER TANSTACK QUERY CACHE IS RESTORED
    if (!isRestoringCache) {
      init().then()
      // Hide the native splash after your custom splash logic is done
      setTimeout(() => {
        ExpoSplashScreen.hideAsync()
      }, 2000) // Adjust timing as needed
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRestoringCache])

  return (
    <Box flex={1}>
      <StatusBar style="light" animated />
      {/* <SplashScreen /> */}
    </Box>
  )
}

export default Page
