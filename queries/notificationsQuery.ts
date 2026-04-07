import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'

import {api} from '@/api'
import {QUERY_KEYS} from '@/constants/queryKeys'
import {INotificationListResponse} from '@/types'

export const useGetNotifications = (page?: number, limit?: number) => {
  return useQuery<INotificationListResponse>({
    queryKey: [QUERY_KEYS.NOTIFICATIONS, page, limit],
    queryFn: async () => {
      const response = await api.notifications.getNotifications(page, limit)
      return response?.data?.data as INotificationListResponse
    },
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5
  })
}

export const useAddDevice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {device_token: string; device_type: string}) => {
      const response = await api.notifications.addDevice(payload)
      return response?.data
    },
    onSuccess: () => {
      // Optionally invalidate any relevant queries
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NOTIFICATIONS]
      })
    }
  })
}

export const useMarkAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await api.notifications.markAsRead(notificationId)
      return response?.data
    },
    onSuccess: () => {
      // Refresh notifications list
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NOTIFICATIONS]
      })
    }
  })
}

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await api.notifications.markAllAsRead()
      return response?.data
    },
    onSuccess: () => {
      // Refresh notifications list
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NOTIFICATIONS]
      })
    }
  })
}