import {
  AppIcon,
  AppPressable,
  BackButton,
  Box,
  Button,
  Container,
  Divider,
  SpinnerOverlay,
  TextAction,
  TextField,
  Typography
} from '@/components/ui'
import { ImageBackground } from 'expo-image'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { FormikErrors, FormikTouched, useFormik } from 'formik'
import React, { Dispatch, SetStateAction, useState } from 'react'

import SignupOtpVerificationModal from '@/components/modals/signup-otp-verification'
import GoogleIcon from '@/components/svgs/google-icon'
import { KeyboardAwareScrollView } from '@/components/util/keyboard-aware-scroll-view'
import { signupSchema } from '@/schemas/forms/auth'
import { useAuthActions, useAuthLoadingState } from '@/store/authStore'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams } from 'expo-router/build/hooks'
import { Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const images = {
  blue: require('@/assets/icon.png'),
  pattern: require('@/assets/pattern.png')
}

const Page = () => {
  const authActions = useAuthActions()
  const authLoadingState = useAuthLoadingState()
  const params = useLocalSearchParams()
  const shouldVerifyEmail = params.verifyEmail === 'true'
  const emailFromParams = params.email as string
  const [passcodeVissible, setpasscodeVissible] = useState(true)
  const [shouldVerifyOTP, setShoudlVerifyOYP] = useState(
    shouldVerifyEmail || false
  )
  const insets = useSafeAreaInsets()

  const handleSignup = async (formData: {
    fullname: string
    email: string
    phone: string
    passcode: string
    referralCode?: string
  }) => {
    await authActions.signup(formData, () => setShoudlVerifyOYP(true))
  }

  const formik = useFormik({
    initialValues: {
      fullname: '',
      email: '',
      phone: '',
      passcode: '',
      referralCode: ''
    },
    validateOnMount: true,
    validationSchema: signupSchema,
    onSubmit: values => handleSignup(values)
  })

  return (
    <SpinnerOverlay show={authLoadingState.registerUser}>
      <Box flex={1} pb={Math.round(insets.bottom + 8)}>
        <StatusBar style="light" animated />
        <LinearGradient
          colors={['#2554C7', '#142952']}
          style={{
            height: 236,
            backgroundColor: '#142952'
          }}>
          <ImageBackground
            source={images.pattern}
            style={{
              height: 236
            }}>
            <>
              <Box
                pt={Platform.OS === 'ios' ? Math.round(insets.top) : Math.round(insets.top) + 20}
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between">
                <Box
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center">
                  <BackButton />
                </Box>
                <Box>
                  <Typography variant="h3-bold" color="white">
                    Create Account
                  </Typography>
                </Box>
                <Box opacity={0} alignItems="center">
                  <BackButton />
                </Box>
              </Box>

              <Box mt={20} px={24}>
                <Typography variant="h3" color="white">
                  Welcome to Pusha
                </Typography>
                <Typography
                  mt={8}
                  variant="h1-bold"
                  fontSize={28}
                  color="white"
                  lineHeight={34}>
                  Let’s get you started on your Account
                </Typography>
              </Box>
            </>
          </ImageBackground>
        </LinearGradient>
        <Container flex={1}>
          <KeyboardAwareScrollView>
            <Box>
              <Typography
                variant="body-bold"
                color="secondary-500"
                marginTop={24}>
                Sign up with
              </Typography>

              <Box mt={20}>
                <Box flexDirection="row" gap={15}>
                  <Box flex={1}>
                    <Button
                      variant="outline"
                      LeftIcon={<GoogleIcon />}
                      label="Google"
                      hasLinearGradient={false}
                    />
                  </Box>
                  <Box flex={1}>
                    <Button
                      LeftIcon={
                        <AppIcon name="Facebook" color="white" size={24} />
                      }
                      backgroundColor="primary-100"
                      label="Facebook"
                    />
                  </Box>
                </Box>

                <Box>
                  <Box
                    gap={18}
                    my={20}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center">
                    <Box flex={1}>
                      <Divider thickness={1.17} color="#EDF1F3" />
                    </Box>
                    <Typography variant="body-medium" color="text-primary">
                      or continue with
                    </Typography>
                    <Box flex={1}>
                      <Divider thickness={1.17} color="#EDF1F3" />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box flex={1} justifyContent="space-between">
              <Box>
                <Box>
                  <TextField
                    label="Full name"
                    name="fullname"
                    placeholder="Enter your first & last name"
                    onChangeText={formik.handleChange('fullname')}
                    blurAction={formik.setFieldTouched}
                    inputMode="text"
                    value={formik.values.fullname}
                    error={
                      formik.errors.fullname && formik.touched.fullname
                        ? formik.errors.fullname
                        : ''
                    }
                  />
                </Box>

                <Box marginTop={24}>
                  <TextField
                    keyboardType="email-address"
                    autoCapitalize="none"
                    label="Email"
                    name="email"
                    placeholder="Enter your email address"
                    textContentType="emailAddress"
                    inputMode="email"
                    onChangeText={formik.handleChange('email')}
                    blurAction={formik.setFieldTouched}
                    value={formik.values.email}
                    error={
                      formik.errors.email && formik.touched.email
                        ? formik.errors.email
                        : ''
                    }
                  />
                </Box>

                <Box marginTop={24}>
                  <TextField
                    label="Phone number"
                    prefix="+234"
                    placeholder="8030000000"
                    name="phone"
                    textContentType="telephoneNumber"
                    keyboardType="phone-pad"
                    inputMode="numeric"
                    onChangeText={text => {
                      const cleanedText = text
                        .replace(/\D/g, '')
                        .replace(' ', '')
                      formik.setFieldValue('phone', cleanedText)
                    }}
                    blurAction={formik.setFieldTouched}
                    value={formik.values.phone}
                    error={
                      formik.errors.phone && formik.touched.phone
                        ? formik.errors.phone
                        : ''
                    }
                  />
                </Box>

                <Box marginTop={24}>
                  <TextField
                    label="Passcode"
                    name="passcode"
                    placeholder=" • • • •"
                    keyboardType="phone-pad"
                    inputMode="numeric"
                    value={formik.values.passcode}
                    error={
                      formik.errors.passcode && formik.touched.passcode
                        ? formik.errors.passcode
                        : ''
                    }
                    secureTextEntry={passcodeVissible}
                    onChangeText={formik.handleChange('passcode')}
                    blurAction={formik.setFieldTouched}
                    icon={PasswordIcon(
                      passcodeVissible,
                      setpasscodeVissible,
                      formik.touched,
                      formik.errors
                    )}
                  />
                </Box>

                <Box mt={24}>
                  <TextField
                    label="Referral code"
                    name="referralCode"
                    placeholder="Enter referral code"
                    onChangeText={formik.handleChange('referralCode')}
                    blurAction={formik.setFieldTouched}
                    inputMode="text"
                    value={formik.values.referralCode}
                    error={
                      formik.errors.referralCode && formik.touched.referralCode
                        ? formik.errors.referralCode
                        : ''
                    }
                  />
                </Box>
              </Box>
            </Box>
          </KeyboardAwareScrollView>
          <Box marginTop={12}>
            <Button
              hasLinearGradient
              label="Create account"
              variant="primary"
              disabled={!formik.isValid}
              onPress={formik.handleSubmit}
            />
            <Typography
              variant="body"
              textAlign="center"
              marginTop={16}
              color="text-primary">
              Already have an account?{' '}
              <TextAction
                variant="body-bold"
                color="primary-300"
                onPress={() => router.replace('/fresh-login')}>
                Sign in
              </TextAction>
            </Typography>
          </Box>

          <SignupOtpVerificationModal
            email={emailFromParams || formik.values.email}
            toInitiateRequest={
              Boolean(shouldVerifyEmail) && Boolean(emailFromParams)
            }
            show={shouldVerifyOTP}
            onClose={() => setShoudlVerifyOYP(false)}
          />
        </Container>
      </Box>
    </SpinnerOverlay>
  )
}

const PasswordIcon = (
  passcodeVissible: boolean,
  setpasscodeVissible: Dispatch<SetStateAction<boolean>>,
  touched: FormikTouched<{passcode: string}>,
  errors: FormikErrors<{passcode: string}>
) => {
  return !passcodeVissible ? (
    <AppPressable onPress={() => setpasscodeVissible(!passcodeVissible)}>
      <AppIcon
        name="EyeOff"
        size={20}
        color={errors.passcode && touched.passcode ? 'red' : '#798390'}
      />
    </AppPressable>
  ) : (
    <AppPressable onPress={() => setpasscodeVissible(!passcodeVissible)}>
      <AppIcon
        name="Eye"
        size={20}
        color={errors.passcode && touched.passcode ? 'red' : '#798390'}
      />
    </AppPressable>
  )
}

export default Page
