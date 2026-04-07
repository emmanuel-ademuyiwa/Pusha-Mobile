import {HttpMethods} from '@/libs'
import {RegisterData} from '@/types'
import {UseEndpoint} from '@/utils/api'

export default {
  registerNewUser: (payload: RegisterData) => {
    return UseEndpoint({
      clientType: 'public',
      endpoint: `/auth/signup`,
      method: HttpMethods.Post,
      payload: payload
    })
  },
  login: (payload: {email: string; password: string}) => {
    return UseEndpoint({
      clientType: 'public',
      endpoint: '/auth/signin',
      method: HttpMethods.Post,
      payload: payload
    })
  },
  verifyRegisterationOtp: (otp: string) => {
    return UseEndpoint({
      clientType: 'public',
      endpoint: `/auth/verify/${otp}`,
      method: HttpMethods.Patch
    })
  },
  requestPasswordReset: (email: string) => {
    return UseEndpoint({
      clientType: 'public',
      endpoint: `/auth/send-password-reset-token/${email}`,
      method: HttpMethods.Post
    })
  },
  resetPassword: (payload: {
    otp: string
    password: string
    confirm_password: string
  }) => {
    return UseEndpoint({
      clientType: 'public',
      endpoint: `/auth/reset-password`,
      method: HttpMethods.Patch,
      payload: payload
    })
  },
  resendEmailVerificationOTP: (email: string) => {
    return UseEndpoint({
      clientType: 'public',
      endpoint: `/auth/resend-verification/${email}`,
      method: HttpMethods.Patch
    })
  },
  changePassword: (payload: {
    password: string
    confirm_password: string
    old_password: string
  }) => {
    return UseEndpoint({
      clientType: 'auth',
      endpoint: `/auth/change-password`,
      method: HttpMethods.Patch,
      payload: payload
    })
  }
}
