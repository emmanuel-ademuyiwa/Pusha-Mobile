import { HttpMethods } from '@/libs'
import { UseEndpoint } from '@/utils/api'

interface UpdateProfilePayload {
  first_name?: string
  last_name?: string
  email?: string
  phone_number?: string
  avatar?: string
}

interface ChangePasswordPayload {
  current_password: string
  new_password: string
  confirm_password: string
}

export default {
  getUserProfile: () => {
    return UseEndpoint({
      endpoint: '/user',
      method: HttpMethods.Get
    })
  },

  updateProfile: (payload: UpdateProfilePayload) => {
    return UseEndpoint({
      endpoint: '/user',
      method: HttpMethods.Put,
      payload: payload
    })
  },

  uploadAvatar: (payload: {avatar: string}) => {
    return UseEndpoint({
      endpoint: '/user/avatar',
      method: HttpMethods.Post,
      payload: payload
    })
  },

  changePassword: (payload: ChangePasswordPayload) => {
    return UseEndpoint({
      endpoint: '/user/change-password',
      method: HttpMethods.Put,
      payload: payload
    })
  },

  deleteAccount: () => {
    return UseEndpoint({
      endpoint: '/user/account',
      method: HttpMethods.Delete
    })
  }
}
