import Constants from 'expo-constants'
import {io, type Socket} from 'socket.io-client'

/** Matches `pusha-web-app/utils/socket.ts` — public widget / onboarding client socket. */
const DEFAULT_WEBCHAT_SOCKET_ENDPOINT =
  'wss://api-beta.pushahq.com/clientwebchat'

export type WebchatClientSocketOptions = {
  session_id: string
  business_id: string
  endpoint?: string
}

export function connectWebchatClientSocket(
  opts: WebchatClientSocketOptions
): Socket {
  const extra = Constants.expoConfig?.extra as
    | {WEBCHAT_CLIENT_SOCKET_URL?: string}
    | undefined
  const endpoint =
    opts.endpoint ?? extra?.WEBCHAT_CLIENT_SOCKET_URL ?? DEFAULT_WEBCHAT_SOCKET_ENDPOINT

  return io(endpoint, {
    transports: ['websocket'],
    path: '/socket.io',
    query: {
      session_id: opts.session_id,
      business_id: opts.business_id
    },
    upgrade: true
  })
}
