import {api} from '@/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {router} from 'expo-router'
import {isEmpty} from 'lodash'
import {create} from 'zustand'

import {OtpContext} from '@/libs'
import {userQuery} from '@/queries/userQueries'
import {needsBusinessOnboarding} from '@/utils/needs-business-onboarding'
import {errorHandler} from '@/utils/errorHandler'
import {
  clearSession,
  getFromVault,
  resetAppStorage,
  saveToVault,
  valueExistsInVault
} from '@/utils/storage'
import toast from '@/utils/toast'

type AuthStoreType = {
  loadingState: {
    loginUser: boolean
    registerUser: boolean
    verifyOtp: boolean
    verifyResetAccountOTP: boolean
    resendEmailVerificationOTP: boolean
    resendPasswordResetOTP: boolean
    requestPasswordReset: boolean
    requestPasswordChange: boolean
    resetPassword: boolean
    changePassword: boolean
    deleteAccount: boolean
  }
  biometricsEnabled: boolean
  deleteAccountPayload: any
  actions: AuthStoreActions
}

type AuthStoreActions = {
  logIn: (payload: any) => Promise<void>
  signup: (payload: any, onSuccess: () => void) => Promise<void>
  requestPasswordReset: (payload: any) => Promise<void>
  // requestPasswordChange: () => Promise<void>
  resetPassword: (
    payload: {
      password: string
      confirm_password: string
      otp: string
    },
    onSuccess: () => void
  ) => Promise<void>
  changePassword: (payload: any) => Promise<void>
  verifyOtp: (
    otp: string,
    context: OtpContext,
    onSuccess: () => void
  ) => Promise<void>
  resendEmailVerificationOTP: (payload: string) => Promise<void>
  // resendPasswordResetOTP: () => Promise<void>
  setDeleteAccountPayload: (deleteAccountPayload: any) => void
  // deleteAccount: () => Promise<void>
  logout: () => Promise<void>
  switchUser: () => Promise<void>
  setBiometricsEnabled: (biometricsEnabled: boolean) => void
  authenticate: () => Promise<void>
  routeUser: () => Promise<void>
  resetStore: () => void
}

const useAuthStore = create<AuthStoreType>()((set, get) => {
  return {
    biometricsEnabled: false,
    deleteAccountPayload: {
      reasons: [],
      password: '',
      otherFeedback: ''
    } as any,
    loadingState: {
      loginUser: false,
      registerUser: false,
      verifyOtp: false,
      resendEmailVerificationOTP: false,
      resendPasswordResetOTP: false,
      requestPasswordChange: false,
      requestPasswordReset: false,
      resetPassword: false,
      changePassword: false,
      verifyResetAccountOTP: false,
      deleteAccount: false
    },
    actions: {
      signup: async (payload, onSuccess) => {
        try {
          console.log({payload})
          set(state => ({
            loadingState: {...state.loadingState, registerUser: true}
          }))

          const {email, passcode, fullname, phone} = payload
          const [firstName, lastName] = fullname.split(' ')

          console.log({email, passcode, phone, firstName, lastName})

          const formattedPayload: any = {
            email: email.trim()?.toLowerCase(),
            password: passcode.trim(),
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone_number: phone.trim()
          }

          await api.auth.registerNewUser(formattedPayload)

          saveToVault('authority', formattedPayload.password)

          // This here starts the countdown for the OTP verification (Don't touch !!!)
          // The timer is set to 2 minutes and 15 seconds
          const now = new Date().getTime()
          const endTime = now + 2.25 * 60000
          await AsyncStorage.setItem('verifyAccountTimer', endTime.toString())

          // await get().actions.routeUser()
          onSuccess()
          set(state => ({
            loadingState: {...state.loadingState, registerUser: false}
          }))
        } catch (err) {
          set(state => ({
            loadingState: {...state.loadingState, registerUser: false}
          }))
          errorHandler(err)
        }
      },
      logIn: async loginPayload => {
        try {
          set(state => ({
            loadingState: {...state.loadingState, loginUser: true}
          }))

          const {email, password} = loginPayload
          const formattedPayload: any = {
            email_or_phone: email.trim(),
            password: password.trim()
          }
          const {data} = await api.auth.login(formattedPayload)
          console.log('🚀 ~ data:', data)

          if (data) {
            saveToVault('authority', loginPayload.password)
            saveToVault('accessToken', data?.access_token)
            if (data?.refresh_token) {
              saveToVault('refreshToken', data?.refresh_token)
            }

            const loginUser = data?.user

            // No `user.business` (or no business id) → skip GET /user and go to setup
            if (needsBusinessOnboarding(loginUser)) {
              saveToVault(
                'user',
                loginUser ?? {email: email.trim().toLowerCase()}
              )
              router.dismissTo('/(auth)/setup-business')
              set(state => ({
                loadingState: {...state.loadingState, loginUser: false}
              }))
              return
            }

            await get().actions.routeUser()

            set(state => ({
              loadingState: {...state.loadingState, loginUser: false}
            }))
          }
        } catch (err: any) {
          console.log({err})
          if (
            err.response?.data.message ===
            'Your account is yet to be verified. Please check your email or phone for the verification code.'
          ) {
            router.navigate(
              `/(public)/signup?verifyEmail=true&email=${loginPayload?.email}`
            )
          }

          set(state => ({
            loadingState: {...state.loadingState, loginUser: false}
          }))
        }
      },
      requestPasswordReset: async payload => {
        clearSession('no-route')
        try {
          set(state => ({
            loadingState: {...state.loadingState, requestPasswordReset: true}
          }))
          await api.auth.requestPasswordReset(payload.email)
          set(state => ({
            loadingState: {...state.loadingState, requestPasswordReset: false}
          }))

          // This here starts the countdown for the password reset OTP verification (Don't touch !!!)
          // The timer is set to 2 minutes and 15 seconds
          const now = new Date().getTime()
          const endTime = now + 2.25 * 60000
          await AsyncStorage.setItem('resetPasswordTimer', endTime.toString())
          //

          router.replace(`/reset-password-otp?email=${payload}`)
          // Alert.alert('Password Reset', message)
        } catch (err) {
          set(state => ({
            loadingState: {...state.loadingState, requestPasswordReset: false}
          }))
          errorHandler(err)
        }
      },
      // requestPasswordChange: async () => {
      //   try {
      //     set(state => ({
      //       loadingState: {...state.loadingState, requestPasswordChange: true}
      //     }))
      //     await api.merchants.requestPasswordChange()

      //     set(state => ({
      //       loadingState: {...state.loadingState, requestPasswordChange: false}
      //     }))
      //   } catch (err) {
      //     set(state => ({
      //       loadingState: {...state.loadingState, requestPasswordChange: false}
      //     }))
      //     throw err
      //   }
      // },
      resetPassword: async (payload, onSuccess) => {
        try {
          set(state => ({
            loadingState: {...state.loadingState, resetPassword: true}
          }))
          await api.auth.resetPassword(payload)
          onSuccess()
          toast.info('Password reset successfully')

          set(state => ({
            loadingState: {...state.loadingState, resetPassword: false}
          }))
        } catch (err) {
          set(state => ({
            loadingState: {...state.loadingState, resetPassword: false}
          }))
          errorHandler(err)
        }
      },
      changePassword: async payload => {
        try {
          set(state => ({
            loadingState: {...state.loadingState, changePassword: true}
          }))
          await api.auth.changePassword(payload)

          toast.info('Password changed successfully')
          router.back()

          set(state => ({
            loadingState: {...state.loadingState, changePassword: false}
          }))
        } catch (err) {
          set(state => ({
            loadingState: {...state.loadingState, changePassword: false}
          }))
          router.back()
          errorHandler(err)
        }
      },

      verifyOtp: async (otp: string, context: OtpContext, onSuccess) => {
        set(state => ({
          loadingState: {...state.loadingState, verifyOtp: true}
        }))

        const payload = {
          context,
          otp
        }
        try {
          const {data} = await api.communications.verifyOTP(payload, context)
          console.log({data})

          switch (context) {
            // Verify user email
            case OtpContext.VerifyEmail: {
              toast.info('Email verified successfully')

              break
            }
            // Reset password
            case OtpContext.ResetPassword: {
              router.replace('/reset-password')
              break
            }
            case OtpContext.ChangePassword: {
              // router.replace('/change-password')
              break
            }
          }
          onSuccess()
          set(state => ({
            loadingState: {...state.loadingState, verifyOtp: false}
          }))
        } catch (err) {
          set(state => ({
            loadingState: {...state.loadingState, verifyOtp: false}
          }))
          errorHandler(err)
        }
      },

      resendEmailVerificationOTP: async (payload: string) => {
        set(state => ({
          loadingState: {
            ...state.loadingState,
            resendEmailVerificationOTP: true
          }
        }))

        try {
          await api.auth.resendEmailVerificationOTP(payload)
          set(state => ({
            loadingState: {
              ...state.loadingState,
              resendEmailVerificationOTP: true
            }
          }))
          toast.info('OTP has been resent')
        } catch (err) {
          set(state => ({
            loadingState: {
              ...state.loadingState,
              resendEmailVerificationOTP: false
            }
          }))
          errorHandler(err)
        }
      },
      // resendPasswordResetOTP: async () => {
      //   set(state => ({
      //     loadingState: {
      //       ...state.loadingState,
      //       resendPasswordResetOTP: true
      //     }
      //   }))

      //   try {
      //     await api.communications.resendPasswordResetOTP()
      //     toast.info('OTP has been resent')
      //     set(state => ({
      //       loadingState: {
      //         ...state.loadingState,
      //         resendPasswordResetOTP: true
      //       }
      //     }))
      //   } catch (err) {
      //     set(state => ({
      //       loadingState: {
      //         ...state.loadingState,
      //         resendPasswordResetOTP: false
      //       }
      //     }))
      //     errorHandler(err)
      //   }
      // },
      authenticate: async () => {
        try {
          const user: any | undefined = getFromVault('user')

          const tokenExists = valueExistsInVault('accessToken')
          console.log({tokenExists})

          const authorityExists = valueExistsInVault('authority')
          const biometricsEnabled = getFromVault('biometricsEnabled') as boolean

          set(() => ({biometricsEnabled}))

          const activeUserSession = !isEmpty(user) && !!authorityExists

          const canNavigateToHome = Boolean(
            user && user.email && user.is_active
          )

          if (activeUserSession) {
            if (!user?.is_active) {
              router.navigate({
                pathname: '/signup',
                params: {
                  email: user.email
                }
              })
            } else if (canNavigateToHome && tokenExists) {
              router.dismissTo('/dashboard')
            } else {
              clearSession()
            }
          } else {
            get().actions.switchUser()
          }
        } catch (err) {
          clearSession()
          errorHandler(err)
        }
      },
      routeUser: async () => {
        try {
          const user = await userQuery()

          if (user) {
            saveToVault('user', user)

            if (!needsBusinessOnboarding(user)) {
              router.replace('/dashboard')
            } else {
              router.dismissTo('/(auth)/setup-business')
            }
          } else {
            clearSession()
          }
        } catch (err) {
          clearSession()
          errorHandler(err)
        }
      },
      setDeleteAccountPayload: deleteAccountPayload => {
        set(() => ({deleteAccountPayload}))
      },

      logout: async () => {
        clearSession()
      },
      // deleteAccount: async () => {
      //   const payload = get().deleteAccountPayload

      //   if (!payload.otherFeedback) {
      //     delete payload.otherFeedback
      //   }

      //   try {
      //     set(state => ({
      //       loadingState: {...state.loadingState, deleteAccount: true}
      //     }))
      //     await api.merchants.deleteAccount(payload)
      //     toast.info('Account has been deleted')
      //     get().actions.switchUser()
      //     get().actions.resetStore()
      //     set(state => ({
      //       loadingState: {...state.loadingState, deleteAccount: false}
      //     }))
      //   } catch (err) {
      //     set(state => ({
      //       loadingState: {...state.loadingState, deleteAccount: false}
      //     }))
      //     errorHandler(err)
      //   }
      // },

      switchUser: async () => {
        resetAppStorage()
        router.replace('/login-or-register')
      },

      setBiometricsEnabled: (biometricsEnabled: boolean) =>
        set(() => ({biometricsEnabled})),
      resetStore: () => {
        const biometricsEnabled = getFromVault('biometricsEnabled') as boolean
        set({
          biometricsEnabled,
          deleteAccountPayload: {
            reasons: [],
            password: '',
            otherFeedback: ''
          } as any,
          loadingState: {
            loginUser: false,
            registerUser: false,
            verifyOtp: false,
            resendEmailVerificationOTP: false,
            resendPasswordResetOTP: false,
            requestPasswordChange: false,
            requestPasswordReset: false,
            resetPassword: false,
            changePassword: false,
            verifyResetAccountOTP: false,
            deleteAccount: false
          }
        })
      }
    }
  }
})

const useBiometricsEnabled = () =>
  useAuthStore(state => state.biometricsEnabled)
const useAuthLoadingState = () => useAuthStore(state => state.loadingState)
const useDeleteAccountPayload = () =>
  useAuthStore(state => state.deleteAccountPayload)
const useAuthActions = () => useAuthStore(state => state.actions)

export {
  useAuthActions,
  useAuthLoadingState,
  useAuthStore,
  useBiometricsEnabled,
  useDeleteAccountPayload
}
