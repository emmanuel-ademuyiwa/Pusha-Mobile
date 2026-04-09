import Constants from 'expo-constants'
import {io, type Socket} from 'socket.io-client'

export type DashboardChatSocketOptions = {
  session_id: string
  token: string
  endpoint?: string
}

/** Matches web `pusha-web-app/utils/socket.ts` dashboard connection. */
const DEFAULT_DASHBOARD_SOCKET_ENDPOINT = 'wss://api-beta.pushahq.com/webchat'

export function connectDashboardChatSocket(
  opts: DashboardChatSocketOptions
): Socket {
  const extra = Constants.expoConfig?.extra as
    | {DASHBOARD_CHAT_SOCKET_URL?: string}
    | undefined
  const endpoint =
    opts.endpoint ?? extra?.DASHBOARD_CHAT_SOCKET_URL ?? DEFAULT_DASHBOARD_SOCKET_ENDPOINT

  return io(endpoint, {
    transports: ['websocket'],
    path: '/socket.io',
    query: {
      session_id: opts.session_id,
      token: opts.token
    },
    upgrade: true
  })
}
