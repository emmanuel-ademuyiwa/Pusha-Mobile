import {
  BackButton,
  Box,
  Container,
  SpinnerOverlay,
  TextAction,
  Typography
} from '@/components/ui'
import {ImageBackground} from 'expo-image'
import {StatusBar} from 'expo-status-bar'
import React, {useCallback, useEffect, useState} from 'react'

import NumericKeypad from '@/components/ui/numeric-keypad'
import {KeyboardAwareScrollView} from '@/components/util/keyboard-aware-scroll-view'
import {
  useAuthActions,
  useAuthLoadingState,
  useBiometricsEnabled
} from '@/store/authStore'
import {getFromVault} from '@/utils/storage'
import * as LocalAuthentication from 'expo-local-authentication'
import {LinearGradient} from 'expo-linear-gradient'
import {Alert, Platform} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

const images = {
  blue: require('@/assets/icon.png'),
  pattern: require('@/assets/pattern.png')
}

const Page = () => {
  const user = getFromVault('user')
  const authActions = useAuthActions()
  const authLoadingState = useAuthLoadingState()
  const biometricsEnabled = useBiometricsEnabled()
  const insets = useSafeAreaInsets()
  const [passcode, setPasscode] = useState('')
  const userEmail = user?.email

  const handleLogin = useCallback(async () => {
    if (!userEmail) {
      Alert.alert('Login', 'Please sign in again to continue.')
      return
    }

    const payload = {
      password: passcode,
      email: userEmail
    }
    await authActions.logIn(payload)
  }, [authActions, passcode, userEmail])

  const handleBiometricLogin = useCallback(async () => {
    const savedPasscode = getFromVault('authority') as string | undefined

    if (!userEmail || !savedPasscode) {
      Alert.alert('Biometric Login', 'Please sign in with your passcode first.')
      return
    }

    const hasHardware = await LocalAuthentication.hasHardwareAsync()
    const isEnrolled = await LocalAuthentication.isEnrolledAsync()

    if (!hasHardware || !isEnrolled) {
      Alert.alert(
        'Biometric Login',
        'Biometric authentication is not available on this device.'
      )
      return
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Log in with biometrics',
      disableDeviceFallback: true,
      cancelLabel: 'Cancel'
    })

    if (result.success) {
      await authActions.logIn({
        email: userEmail,
        password: savedPasscode
      })
    }
  }, [authActions, userEmail])

  useEffect(() => {
    passcode.length === 4 && handleLogin()
  }, [handleLogin, passcode])

  const handleSwitchAccount = async () => {
    await authActions.switchUser()
  }

  return (
    <SpinnerOverlay show={authLoadingState.loginUser}>
      <Box flex={1} pb={Math.round(insets.bottom + 8)}>
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'dark'} animated />
        <LinearGradient
          colors={['#2554C7', '#142952']}
          style={{
            height: 202,
            backgroundColor: '#142952'
          }}>
          <ImageBackground
            source={images.pattern}
            style={{
              height: 202
            }}>
            <>
              <Box
                pt={Math.round(insets.top)}
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between">
                <Box opacity={0} alignItems="center">
                  <BackButton />
                </Box>
                <Box>
                  <Typography variant="h3-bold" color="white">
                    Log in
                  </Typography>
                </Box>
                <Box opacity={0} alignItems="center">
                  <BackButton />
                </Box>
              </Box>

              <Box mt={20} px={24}>
                <Typography variant="h3" color="white">
                  Welcome to back, {user?.first_name}
                </Typography>
                <Typography
                  mt={8}
                  variant="h1-bold"
                  fontSize={28}
                  color="white"
                  lineHeight={34}>
                  Login to your Account
                </Typography>
              </Box>
            </>
          </ImageBackground>
        </LinearGradient>
        <Container flex={1}>
          <KeyboardAwareScrollView>
            <Box flex={1} justifyContent="center" alignItems="center">
              <Box flexDirection="row" gap={8} alignItems="center" mb={24}>
                {[0, 1, 2, 3].map(i => (
                  <Box
                    key={i}
                    width={16}
                    height={16}
                    borderRadius={8}
                    borderWidth={2}
                    borderColor="stroke"
                    backgroundColor={
                      passcode.length > i ? 'neutral-500' : 'gray-bg'
                    }
                    mx={8}
                    alignItems="center"
                    justifyContent="center"
                  />
                ))}
              </Box>

              <Typography variant="h3">Enter your Passcode</Typography>
            </Box>
            <NumericKeypad
              onKeyPress={val => {
                if (passcode.length < 4 && /\d/.test(val))
                  setPasscode(passcode + val)
              }}
              onDelete={() => setPasscode(passcode.slice(0, -1))}
              onBiometricPress={
                biometricsEnabled ? handleBiometricLogin : undefined
              }
            />
            <Box pb={50} />
          </KeyboardAwareScrollView>

          <TextAction
            textAlign="center"
            variant="body-bold"
            onPress={handleSwitchAccount}>
            Sign Out
          </TextAction>
        </Container>
      </Box>
    </SpinnerOverlay>
  )
}

export default Page
