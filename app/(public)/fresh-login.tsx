import {
  AppIcon,
  AppPressable,
  BackButton,
  Box,
  Button,
  Container,
  SpinnerOverlay,
  TextAction,
  TextField,
  Typography
} from '@/components/ui'
import {ImageBackground} from 'expo-image'
import {router} from 'expo-router'
import {StatusBar} from 'expo-status-bar'
import {FormikErrors, FormikTouched, useFormik} from 'formik'
import React, {Dispatch, SetStateAction, useState} from 'react'

import {KeyboardAwareScrollView} from '@/components/util/keyboard-aware-scroll-view'
import {loginSchema} from '@/schemas/forms/auth'
import {useAuthActions, useAuthLoadingState} from '@/store/authStore'
import {LinearGradient} from 'expo-linear-gradient'
import {Platform} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

const images = {
  blue: require('@/assets/icon.png'),
  pattern: require('@/assets/pattern.png')
}

const Page = () => {
  const insets = useSafeAreaInsets()
  const [passwordVisible, setPasswordVisible] = useState(true)
  const authActions = useAuthActions()
  const authLoadingState = useAuthLoadingState()

  const handleLogin = async (formData: any) => {
    await authActions.logIn(formData)
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: loginSchema,
    onSubmit: values => handleLogin(values)
  })

  return (
    <>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'dark'} animated />
      <SpinnerOverlay show={authLoadingState.loginUser}>
        <Box flex={1} pb={Math.round(insets.bottom+8)}>
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
                    Welcome to back!
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
              <Box flex={1} justifyContent="space-between">
                <Box>
                  <Box marginTop={20}>
                    <TextField
                      autoCapitalize="none"
                      keyboardType="email-address"
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

                  <Box marginTop={20}>
                    <TextField
                      label="Passcode"
                      name="password"
                      placeholder=" • • • •"
                      textContentType="password"
                      inputMode="numeric"
                      value={formik.values.password}
                      error={
                        formik.errors.password && formik.touched.password
                          ? formik.errors.password
                          : ''
                      }
                      secureTextEntry={passwordVisible}
                      onChangeText={formik.handleChange('password')}
                      blurAction={formik.setFieldTouched}
                      icon={PasswordIcon(
                        passwordVisible,
                        setPasswordVisible,
                        formik.touched,
                        formik.errors
                      )}
                    />
                  </Box>
                  <TextAction
                    variant="body-bold"
                    marginTop={24}
                    onPress={() =>
                      router.navigate('/(public)/forgot-password')
                    }>
                    Forgot passcode?
                  </TextAction>
                </Box>
              </Box>
            </KeyboardAwareScrollView>
            <Box marginTop={16}>
              <Button
                hasLinearGradient
                label="Log In"
                onPress={formik.handleSubmit}
              />
              <Typography
                variant="body"
                textAlign="center"
                marginTop={16}
                color="neutral-600">
                Don&apos;t have an account?{' '}
                <TextAction
                  variant="body-bold"
                  onPress={() => router.replace('/signup')}>
                  Get Started
                </TextAction>
              </Typography>
            </Box>
          </Container>
        </Box>
      </SpinnerOverlay>
    </>
  )
}

const PasswordIcon = (
  passwordVisible: boolean,
  setPasswordVisible: Dispatch<SetStateAction<boolean>>,
  touched: FormikTouched<{email: string; password: string}>,
  errors: FormikErrors<{email: string; password: string}>
) => {
  const iconName = passwordVisible ? 'Eye' : 'EyeSlash'
  return (
    <AppPressable onPress={() => setPasswordVisible(!passwordVisible)}>
      <AppIcon
        name={iconName}
        size={20}
        color={errors.password && touched.password ? 'red' : '#798390'}
      />
    </AppPressable>
  )
}

export default Page
