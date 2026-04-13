import { Image } from 'expo-image'
import React from 'react'
import { ActivityIndicator } from 'react-native'

import { AppView, Box, Button, Container, Typography } from '../ui'

import {
  useUpdateExists,
  useUpdatesActions,
  useUpdatesLoadingState
} from '@/store/updatesStore'

const OTAUpdatesScreen = () => {
  const Logos = {
    white: require('@/assets/icon.png')
  }
  const updatesActions = useUpdatesActions()
  const updatesLoading = useUpdatesLoadingState()
  const updatesExists = useUpdateExists()

  return (
    <AppView color="primary-100">
      <Container flex={1}>
        <Box flex={1} justifyContent="center" alignItems="center">
          <Image
            source={Logos.white}
            style={{
              height: 50,
              width: 50
            }}
            accessibilityIgnoresInvertColors
          />
          {updatesLoading.otaCheck && (
            <>
              <Typography
                mt={24}
                variant="h2-bold"
                color="white"
                textAlign="center">
                Checking for updates
              </Typography>
              <Typography mt={8} color="white" textAlign="center">
                Please wait a moment.
              </Typography>
            </>
          )}

          {updatesLoading.otaUpdate && (
            <>
              <Typography
                mt={24}
                variant="h2-bold"
                color="white"
                textAlign="center">
                We’re downloading the update
              </Typography>
              <Typography mt={8} color="white" textAlign="center">
                Your app will automatically restart when the download is
                completed.
              </Typography>
            </>
          )}

          {!updatesLoading.otaCheck && !updatesLoading.otaUpdate && (
            <>
              {updatesExists === false && (
                <>
                  <Typography
                    mt={24}
                    variant="h2-bold"
                    color="white"
                    textAlign="center">
                    Your app is up to date 🎉
                  </Typography>
                  <Typography mt={8} color="white" textAlign="center">
                    You&apos;re on the latest version of the app. Well done!
                  </Typography>
                </>
              )}
              {updatesExists && (
                <>
                  <Typography
                    mt={24}
                    variant="h2-bold"
                    color="white"
                    textAlign="center">
                    There&apos;s a new update! 🎉
                  </Typography>
                  <Typography mt={8} color="white" textAlign="center">
                    A newer version of Pusha is available. Click the button to
                    download the new version for the best app experience.
                  </Typography>
                </>
              )}
            </>
          )}
        </Box>
      </Container>
      <Container>
        {(updatesLoading.otaCheck || updatesLoading.otaUpdate) && (
          <Box height={40} alignItems="center" justifyContent="center">
            <ActivityIndicator size="large" color="white" />
          </Box>
        )}

        {!updatesLoading.otaCheck && !updatesLoading.otaUpdate && (
          <>
            <>
              {updatesExists === false && (
                <Button
                  label="Dismiss"
                  align="stretch"
                  onPress={() => updatesActions.setIsUpdateScreenShown(false)}
                />
              )}
            </>
            <>
              {updatesExists && (
                <Button
                  label="Update Pusha"
                  align="stretch"
                  onPress={() => updatesActions.fetchOTAUpdate()}
                />
              )}
            </>
          </>
        )}
      </Container>
    </AppView>
  )
}

export default OTAUpdatesScreen
