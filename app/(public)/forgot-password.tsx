import {StatusBar} from 'expo-status-bar'
import React, {useState} from 'react'

import {
  Box,
  Button,
  Container,
  SpinnerOverlay,
  TextField,
  Typography
} from '@/components/ui'
import {KeyboardAwareScrollView} from '@/components/util/keyboard-aware-scroll-view'
import {ScreenView} from '@/components/util/screen-view'
import {useAuthActions, useAuthLoadingState} from '@/store/authStore'
import {Image} from 'expo-image'

const Logos = {
  gold: require('@/assets/icon.png')
}

const Page = () => {
  const [email, setEmail] = useState<string>('')
  const loadingState = useAuthLoadingState()
  const authActions = useAuthActions()

  const handleForgotPassword = async () => {
    await authActions.requestPasswordReset({email})
    setEmail('')
  }

  return (
    <>
      <StatusBar style="dark" animated />
      <SpinnerOverlay show={loadingState.requestPasswordReset}>
        <ScreenView backButton={false} hasTopBanner={false}>
          <Container flex={1}>
            <KeyboardAwareScrollView>
              <Box>
                <Image
                  source={Logos.gold}
                  style={{
                    height: 40,
                    width: 40,
                    marginTop: 40
                  }}
                  accessibilityIgnoresInvertColors
                />
                <Typography variant="h1-bold" fontWeight={600} marginTop={24}>
                  Forgot password
                </Typography>
                <Typography variant="body" color="neutral-600" marginTop={8}>
                  Enter your details to get started with Pusha.
                </Typography>
              </Box>
              <Box flex={1}>
                <Typography variant="body" color="neutral-600">
                  Please provide your registered email.
                </Typography>
                <Box marginTop={24}>
                  <TextField
                    placeholder="Email"
                    autoCapitalize="none"
                    name="Email"
                    value={email}
                    onChangeText={(e: any) => setEmail(e)}
                    keyboardType="email-address"
                  />
                </Box>
              </Box>
              <Box marginTop={16}>
                <Button
                  label="Continue"
                  variant="primary"
                  onPress={handleForgotPassword}
                  disabled={!email}
                />
              </Box>
            </KeyboardAwareScrollView>
          </Container>
        </ScreenView>
      </SpinnerOverlay>
    </>
  )
}

export default Page
