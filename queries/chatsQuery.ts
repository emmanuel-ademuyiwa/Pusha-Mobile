import { api } from '@/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { errorHandler } from '@/utils/errorHandler'
import toast from '@/utils/toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface IChatCustomer {
  id: string
  business_id: string
  first_name: string
  last_name: string | null
  email: string | null
  phone_number: string | null
  gender: string | null
  avatar: string | null
  requires_human: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface IChatSession {
  id: string
  business_id: string
  channel: string
  channel_id: string
  customer_id: string | null
  platform_id: string
  ai_controlled: boolean
  created_at: string
  updated_at: string
  customer: IChatCustomer | null
}

export interface IChatsResponse {
  records: IChatSession[]
  pagination: {
    total: number
    page: number
    per_page: number
  }
}

// Get all chat sessions
export const useGetChats = (query?: {
  page?: number
  limit?: number
  platform?: string
  status?: 'active' | 'resolved' | 'pending'
}) => {
  return useQuery<IChatsResponse>({
    queryKey: [QUERY_KEYS.CHATS, query],
    queryFn: async () => {
      const response = await api.chats.getChats(query)
      return response?.data?.data
    },
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5
  })
}

// Get chat messages for a specific chat
export const useGetChatMessages = (chatId: string, query?: {
  page?: number
  limit?: number
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CHAT_MESSAGES, chatId, query],
    queryFn: async () => {
      const response = await api.chats.getChatMessages(chatId, query)
      return response?.data?.data
    },
    enabled: !!chatId,
    staleTime: 1000 * 60 * 1, // 1 minute
    gcTime: 1000 * 60 * 3 // 3 minutes
  })
}

// Take over chat session from AI
export const useTakeOverChat = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (chatId: string) => {
      const response = await api.chats.takeOverChat(chatId)
      return response?.data
    },
    onSuccess: (data, chatId) => {
      // Invalidate and refetch chat data
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHATS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHAT_MESSAGES, chatId] })
      
      toast.success('Chat taken over successfully')
    },
    onError: (error) => {
      errorHandler(error)
      toast.error('Failed to take over chat')
    }
  })
}

// Hand over chat session to AI
export const useHandOverChat = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (chatId: string) => {
      const response = await api.chats.handOverChat(chatId)
      return response?.data
    },
    onSuccess: (data, chatId) => {
      // Invalidate and refetch chat data
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHATS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHAT_MESSAGES, chatId] })
      
      toast.success('Chat handed over to AI successfully')
    },
    onError: (error) => {
      errorHandler(error)
      toast.error('Failed to hand over chat to AI')
    }
  })
}