import { HttpMethods } from '@/libs'
import { UseEndpoint } from '@/utils/api'

export default {
  // Get all chat sessions
  getChats: (query?: {
    page?: number
    limit?: number
    platform?: string
    status?: 'active' | 'resolved' | 'pending'
  }) => {
    return UseEndpoint({
      clientType: 'auth',
      endpoint: '/chats',
      method: HttpMethods.Get,
      query: {page: 1, limit: 1000000, ...query}
    })
  },

  // Get all messages for a specific chat
  getChatMessages: (chatId: string, query?: {
    page?: number
    limit?: number
  }) => {
    return UseEndpoint({
      clientType: 'auth',
      endpoint: `/chats/${chatId}/messages`,
      method: HttpMethods.Get,
      query
    })
  },

  // Take over chat session from AI
  takeOverChat: (chatId: string) => {
    return UseEndpoint({
      clientType: 'auth',
      endpoint: `/chats/${chatId}/take-over`,
      method: HttpMethods.Post
    })
  },

  // Hand over chat session to AI
  handOverChat: (chatId: string) => {
    return UseEndpoint({
      clientType: 'auth',
      endpoint: `/chats/${chatId}/hand-over`,
      method: HttpMethods.Post
    })
  }
}
