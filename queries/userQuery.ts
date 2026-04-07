import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'

import {api} from '@/api'
import {QUERY_KEYS} from '@/constants/queryKeys'

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER],
    queryFn: async () => {
      const response = await api.user.getUserProfile()
      return response?.data?.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10 // 10 minutes
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      first_name?: string
      last_name?: string
      email?: string
      phone_number?: string
      avatar?: string
    }) => {
      const response = await api.user.updateProfile(payload)
      return response?.data
    },
    onSuccess: () => {
      // Invalidate user profile query
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER]
      })
    }
  })
}

export const useUploadAvatar = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {avatar: string}) => {
      const response = await api.user.uploadAvatar(payload)
      return response?.data
    },
    onSuccess: () => {
      // Invalidate user profile query
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER]
      })
    }
  })
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (payload: {
      current_password: string
      new_password: string
      confirm_password: string
    }) => {
      const response = await api.user.changePassword(payload)
      return response?.data
    }
  })
}

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await api.user.deleteAccount()
      return response?.data
    }
  })
}