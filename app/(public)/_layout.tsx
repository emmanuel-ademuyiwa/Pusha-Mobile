import {Stack} from 'expo-router'
import React, {useEffect} from 'react'

import {Box} from '@/components/ui'
import {useAuthActions} from '@/store/authStore'
// import {useStoreActions} from '@/store/storeStore'

const PublicLayout = () => {
  const authActions = useAuthActions()
  // const storeActions = useStoreActions()

  useEffect(() => {
    // storeActions.resetStore()
    authActions.resetStore()
  }, [authActions])

  return (
    <Box flex={1}>
      <Stack
        initialRouteName="login"
        screenOptions={{
          animation: 'none',
          headerShown: false,
          contentStyle: {
            backgroundColor: '#fff'
          }
        }}
      />
    </Box>
  )
}

export default PublicLayout
