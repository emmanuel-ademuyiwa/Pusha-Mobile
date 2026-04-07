import {HttpMethods} from '@/libs'
import {AxiosInstance} from 'axios'
import {apiClient, publicClient, resetAccountClient} from './axios'

type ClientType = 'public' | 'auth' | 'reset'

export async function UseEndpoint({
  clientType = 'auth',
  endpoint,
  payload,
  query,
  method = HttpMethods.Get,
  headers
}: {
  clientType?: ClientType
  endpoint: any
  payload?: any
  query?: any
  method?: HttpMethods
  headers?: any
}) {
  return requestHandler(clientType, endpoint, method, payload, query, headers)
}

function requestHandler(
  clientType: ClientType,
  endpoint: string,
  method: HttpMethods = HttpMethods.Get,
  payload?: any,
  query?: any,
  headers?: any
) {
  // Remove any leading slash from endpoint to avoid double slashes
  const cleanEndpoint = endpoint

  const client: AxiosInstance = (() => {
    switch (clientType) {
      case 'reset':
        return resetAccountClient
      case 'public':
        return publicClient
      default:
        return apiClient
    }
  })()

  const config: {
    method: HttpMethods
    url: string
    data?: any
    params?: any
    headers?: any
  } = {
    method,
    url: cleanEndpoint,
    headers
  }

  if (payload) {
    config.data = payload
  }

  if (query) {
    config.params = query
  }

  return client.request(config)
}

export default requestHandler

// 0991764372001774
