import {HttpMethods} from '@/libs'
import {UseEndpoint} from '@/utils/api'

interface AddDevicePayload {
  device_token: string
  device_type: string
}

export default {
  getNotifications: (page?: number, limit?: number) => {
    const query: Record<string, any> = {}
    if (page) query.page = page
    if (limit) query.limit = limit
    
    return UseEndpoint({
      clientType: 'private',
      endpoint: '/notifications',
      method: HttpMethods.Get,
      query: query
    })
  },

  addDevice: (payload: AddDevicePayload) => {
    return UseEndpoint({
      clientType: 'private',
      endpoint: '/notifications/user/add-device',
      method: HttpMethods.Post,
      payload: payload
    })
  },

  markAsRead: (notificationId: string) => {
    return UseEndpoint({
      clientType: 'private',
      endpoint: `/notifications/${notificationId}/read`,
      method: HttpMethods.Put
    })
  },

  markAllAsRead: () => {
    return UseEndpoint({
      clientType: 'private',
      endpoint: '/notifications/mark-all-read',
      method: HttpMethods.Put
    })
  }
}