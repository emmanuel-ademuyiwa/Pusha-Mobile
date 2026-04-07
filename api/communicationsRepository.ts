import {HttpMethods, OtpContext} from '@/libs'
import {UseEndpoint} from '@/utils/api'

export default {
  verifyOTP: ({otp}: any, context: OtpContext) => {
    const endpoint =
      context === OtpContext.VerifyEmail ? `/auth/verify/${otp}` : ''
    return UseEndpoint({
      endpoint,
      clientType: context === OtpContext.VerifyEmail ? 'public' : 'auth',
      query: {otp},
      method: HttpMethods.Patch
    })
  },
  registerPushToken: (payload: {device_token: string; device_type: string}) => {
    return UseEndpoint({
      endpoint: '/notifications/user/add-device',
      payload,
      method: HttpMethods.Post
    })
  }
  // resendEmailVerificationOTP: () => {
  //   return UseEndpoint({
  //     endpoint: AccountVerificationEndpoints.resendOtpForEmailVerification
  //   })
  // },
  // resendPasswordResetOTP: () => {
  //   return UseEndpoint({
  //     endpoint: AccountVerificationEndpoints.resendOtpForPasswordReset
  //   })
  // }
}
