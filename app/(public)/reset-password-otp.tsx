import useCountdownTimer from '@/hooks/useCountdownTimer'
import {StatusBar} from 'expo-status-bar'
import React, {useEffect, useState} from 'react'

import {
  Box,
  Container,
  OtpInput,
  SpinnerOverlay,
  TextAction,
  Typography
} from '@/components/ui'
import {ScreenView} from '@/components/util/screen-view'
import {useAuthActions, useAuthLoadingState} from '@/store/authStore'
import {clearSession} from '@/utils/storage'
import {router, useLocalSearchParams} from 'expo-router'

const Page = () => {
  const [otp, setOTP] = useState('')
  const params = useLocalSearchParams()
  const email = params?.email
  const [isTimerReady, setIsTimerReady] = useState(false)
  const [isInputFilled, setIsInputFilled] = useState(false)
  const authActions = useAuthActions()

  // Allow resend after 2 minutes and 15 seconds
  const {seconds, startTimer, minutes, resetTimer, timerActive} =
    useCountdownTimer('resetPasswordTimer', 0.25)

  const authLoadingState = useAuthLoadingState()

  const resendOTP = async () => {
    try {
      await authActions.requestPasswordReset({email})
      await resetTimer()
      await startTimer()
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const otpTimer = async () => {
      await startTimer()
      setIsTimerReady(true)
    }

    otpTimer().then()

    return () => {
      setOTP('')
      resetTimer().then()
      setIsTimerReady(false)
    }
  }, [])

  // Run action to verify otp
  useEffect(() => {
    if (isInputFilled) {
      router.navigate(`/(public)/reset-password?otp=${otp}`)
    }
  }, [isInputFilled])

  const backToLogin = async () => {
    setOTP('')
    clearSession('fresh-login')
  }

  return (
    <>
      <StatusBar style="dark" animated />
      <SpinnerOverlay show={authLoadingState.verifyOtp}>
        <ScreenView
          hasTopBanner={false}
          navTitle="Reset Passcode"
          alignNav="center">
          <Container>
            <Typography variant="h1-semibold" color="secondary-500" mt={8}>
              Forgot password?
            </Typography>
            <Typography color="neutral-800" marginTop={8}>
              Enter the code sent to your email address to reset your password
            </Typography>
            <Box marginTop={24}>
              <OtpInput
                otp={otp}
                setOTP={setOTP}
                setIsInputFilled={setIsInputFilled}
                length={6}
              />
            </Box>

            {isTimerReady &&
              (timerActive ? (
                <Typography
                  textAlign="center"
                  color="neutral-800"
                  marginTop={32}>
                  Resend code in{' '}
                  <Typography color="neutral-500">
                    {`${minutes.toString().padStart(2, '0')}:${seconds
                      .toString()
                      .padStart(2, '0')}`}
                  </Typography>
                </Typography>
              ) : (
                <Box marginTop={32} alignItems="center">
                  <TextAction
                    // color=""
                    onPress={resendOTP}>
                    Resend code
                  </TextAction>
                </Box>
              ))}
          </Container>
        </ScreenView>
      </SpinnerOverlay>
    </>
  )
}

export default Page
