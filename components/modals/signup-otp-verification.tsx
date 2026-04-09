import useCountdownTimer from '@/hooks/useCountdownTimer'
import {OtpContext} from '@/libs'
import {useAuthActions, useAuthLoadingState} from '@/store/authStore'
import {router} from 'expo-router'
import React, {useEffect, useState} from 'react'
import OtpIllustration from '../svgs/otp-illustration'
import SuccessIllustration from '../svgs/success-illustration'
import {Box, Button, OtpInput, TextAction, Typography} from '../ui'
import CenterdModal from '../ui/centerd-modal'

const SignupOtpVerificationModal = ({
  show,
  email,
  onClose,
  toInitiateRequest
}: {
  email: string
  show: boolean
  onClose: () => void
  toInitiateRequest?: boolean
}) => {
  const [otp, setOTP] = useState('')
  const authActions = useAuthActions()
  const authLoadingState = useAuthLoadingState()
  const [isTimerReady, setIsTimerReady] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [isInputFilled, setIsInputFilled] = useState(false)

  const {seconds, startTimer, minutes, resetTimer, timerActive} =
    useCountdownTimer('resetPasswordTimer', 1)

  const resendOTP = async () => {
    try {
      await authActions.resendEmailVerificationOTP(email)
      await resetTimer()
      await startTimer()
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (toInitiateRequest) resendOTP()
  }, [toInitiateRequest])

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

  async function verifyResetAccountOTP() {
    await authActions.verifyOtp(otp, OtpContext.VerifyEmail, () =>
      setEmailVerified(true)
    )
  }

  // Run action to verify otp
  useEffect(() => {
    if (isInputFilled) {
      verifyResetAccountOTP().then(() => setOTP(''))
    }
  }, [isInputFilled])

  return (
    <CenterdModal show={show} onClose={onClose}>
      {emailVerified ? (
        <Box alignItems="center" width={'100%'}>
          <SuccessIllustration />
          <Typography
            variant="h1-bold"
            color="secondary-500"
            fontSize={22}
            lineHeight={33}>
            Congratulations🎉
          </Typography>
          <Typography
            my={16}
            textAlign="center"
            color="neutral-800"
            variant="body">
            You have successfully created your Pusha account
          </Typography>

          <Box mt={16} width={'100%'}>
            <Button
              label="Continue"
              onPress={() => router.replace('/fresh-login')}
            />
          </Box>
        </Box>
      ) : (
        <Box alignItems="center" width={'100%'}>
          <OtpIllustration />
          <Typography
            variant="h1-bold"
            color="secondary-500"
            fontSize={22}
            lineHeight={33}>
            OTP Verification
          </Typography>
          <Typography
            my={16}
            textAlign="center"
            color="neutral-800"
            variant="body">
            Verify your account by entering the 6-digit OTP sent to your email
            address
          </Typography>

          <OtpInput
            otp={otp}
            setOTP={setOTP}
            length={6}
            setIsInputFilled={setIsInputFilled}
          />

          <Box mt={16} width={'100%'}>
            <Button
              label="Continue"
              onPress={() => setEmailVerified(true)}
              loading={authLoadingState.verifyOtp}
            />
          </Box>

          {isTimerReady &&
            (timerActive ? (
              <Typography
                variant="c1"
                textAlign="center"
                color="neutral-500"
                marginTop={12}>
                Resend code in{' '}
                <Typography variant="c1-medium" color="neutral-500">
                  {`${minutes.toString().padStart(2, '0')}:${seconds
                    .toString()
                    .padStart(2, '0')}`}
                </Typography>
              </Typography>
            ) : (
              <Box marginTop={12} alignItems="center">
                <TextAction
                  variant="body-bold"
                  color="primary-300"
                  onPress={resendOTP}>
                  Resend code
                </TextAction>
              </Box>
            ))}
        </Box>
      )}
    </CenterdModal>
  )
}

export default SignupOtpVerificationModal
