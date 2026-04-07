import { router, useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { WebView } from 'react-native-webview'

import { AppIcon, AppPressable, Box, Typography } from '@/components/ui'
import { PushaActivityIndicator } from '@/components/ui/activity-indicator'

interface WebViewModalParams {
  url: string
  title?: string
  successRedirectPattern?: string
  successRedirectPath?: string
}

const WebViewModal = () => {
  const params = useLocalSearchParams()
  const [loading, setLoading] = useState(true)

  const {
    url,
    title = 'Web Page',
    successRedirectPattern,
    successRedirectPath
  } = params

  const handleClose = () => {
    router.back()
  }

  const handleLoadStart = () => {
    setLoading(true)
  }

  const handleLoadEnd = () => {
    setLoading(false)
  }

  const handleNavigationStateChange = (navState: any) => {
    console.log('WebView navigation state:', navState)
    
    if (successRedirectPattern && navState.url.includes(successRedirectPattern)) {
      if (successRedirectPath) {
        router.replace(successRedirectPath as any)
      } else {
        router.back()
      }
    }
  }

  const handleError = (syntheticEvent: any) => {
    const {nativeEvent} = syntheticEvent
    console.warn('WebView error:', nativeEvent)
    setLoading(false)
  }

  if (!url) {
    return (
      <Box flex={1} backgroundColor="white" justifyContent="center" alignItems="center">
        <Typography variant="body" color="text-primary">
          No URL provided
        </Typography>
      </Box>
    )
  }

  return (
    <Box flex={1} backgroundColor="white">
      {/* Header  */}
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal={16}
        paddingTop={10}
        paddingBottom={10}
        backgroundColor="white"
        borderBottomWidth={1}
        borderBottomColor="neutral-200">
        <Typography variant="h3-bold" color="secondary-500" flex={1} textAlign="center">
          {title}
        </Typography>
        
        <AppPressable onPress={handleClose}>
          <AppIcon name="X" size={24} color="#454A53" />
        </AppPressable>
      </Box>

      {/* WebView Container */}
      <Box flex={1} bg='white' position="relative">
        <WebView
          source={{uri: url as string}}
          style={{flex: 1}}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onNavigationStateChange={handleNavigationStateChange}
          onError={handleError}
          startInLoadingState={true}
          renderLoading={() => <PushaActivityIndicator />}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsBackForwardNavigationGestures={true}
        />

        {/* Loading overlay */}
        {loading && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            justifyContent="center"
            alignItems="center"
            backgroundColor="white">
            <PushaActivityIndicator />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default WebViewModal