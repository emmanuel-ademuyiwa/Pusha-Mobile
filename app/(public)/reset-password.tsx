import {
  AppIcon,
  AppPressable,
  Box,
  Button,
  Container,
  SpinnerOverlay,
  TextField
} from '@/components/ui'
import {StatusBar} from 'expo-status-bar'
import {FormikErrors, FormikTouched, useFormik} from 'formik'
import React, {Dispatch, SetStateAction, useState} from 'react'

import ResetPasscodeSuccessModal from '@/components/modals/reset-passcode-success'
import {KeyboardAwareScrollView} from '@/components/util/keyboard-aware-scroll-view'
import {ScreenView} from '@/components/util/screen-view'
import {setPasswordSchema} from '@/schemas/forms/auth'
import {useAuthActions, useAuthLoadingState} from '@/store/authStore'
import {clearSession} from '@/utils/storage'
import {useLocalSearchParams} from 'expo-router'

const Page = () => {
  const params = useLocalSearchParams()
  const otp = params.otp
  const [passwordVisible, setPasswordVisible] = useState(true)
  const [isRequestSuccessful, setIsRequestSuccessful] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const authLoadingState = useAuthLoadingState()
  const authActions = useAuthActions()

  const handleResetPassword = async (formData: any) => {
    await authActions.resetPassword({otp, ...formData}, () =>
      setIsRequestSuccessful(true)
    )
  }

  const formik = useFormik({
    initialValues: {
      password: '',
      confirm_password: ''
    },
    validationSchema: setPasswordSchema,
    onSubmit: values => handleResetPassword(values)
  })

  return (
    <SpinnerOverlay show={authLoadingState.resetPassword}>
      <StatusBar style="dark" animated />
      <ScreenView
        hasTopBanner={false}
        navTitle="Reset passcode"
        alignNav="center">
        <KeyboardAwareScrollView>
          <Container>
            <Box flex={1} justifyContent="space-between">
              <Box>
                <Box marginTop={24}>
                  <TextField
                    label="New passcode"
                    name="password"
                    keyboardType="phone-pad"
                    inputMode="numeric"
                    placeholder=" • • • • • • • •"
                    textContentType="newPassword"
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
                      formik.errors,
                      'password'
                    )}
                  />
                </Box>
                <Box marginTop={16}>
                  <TextField
                    label="Confirm new passcode"
                    name="confirm_password"
                    keyboardType="phone-pad"
                    inputMode="numeric"
                    textContentType="password"
                    placeholder=" • • • • • • • •"
                    value={formik.values.confirm_password}
                    error={
                      formik.errors.confirm_password &&
                      formik.touched.confirm_password
                        ? formik.errors.confirm_password
                        : ''
                    }
                    secureTextEntry={confirmPasswordVisible}
                    onChangeText={formik.handleChange('confirm_password')}
                    blurAction={formik.setFieldTouched}
                    icon={PasswordIcon(
                      confirmPasswordVisible,
                      setConfirmPasswordVisible,
                      formik.touched,
                      formik.errors,
                      'confirm_password'
                    )}
                  />
                </Box>

                <Button
                  marginTop={16}
                  label="Reset password"
                  onPress={formik.handleSubmit}
                  loading={authLoadingState.resetPassword}
                />
              </Box>
            </Box>
          </Container>
        </KeyboardAwareScrollView>
        <ResetPasscodeSuccessModal
          show={isRequestSuccessful}
          onClose={() => clearSession('login')}
        />
      </ScreenView>
    </SpinnerOverlay>
  )
}

const PasswordIcon = (
  passwordVisible: boolean,
  setPasswordVisible: Dispatch<SetStateAction<boolean>>,
  touched: FormikTouched<{confirm_password: string; password: string}>,
  errors: FormikErrors<{confirm_password: string; password: string}>,
  type: 'password' | 'confirm_password'
) => {
  return (
    <AppPressable onPress={() => setPasswordVisible(!passwordVisible)}>
      <AppIcon
        name={passwordVisible ? 'EyeSlash' : 'Eye'}
        size={20}
        color={errors[type] && touched[type] ? 'red' : '#798390'}
      />
    </AppPressable>
  )
}

export default Page
