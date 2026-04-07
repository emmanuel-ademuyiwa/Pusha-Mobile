import axios from 'axios'
import {authService} from './../services/authService'

import {getNetworkStatus} from './network'
import {queryClient} from './queryClient'
import {clearSession, getFromVault} from './storage'
import toast from './toast'

import {
  BASE_URL as LIVE_BASE_URL,
  REQUEST_TIMEOUT_MS
} from '../constants/ApiConstants'
// import {authService} from '../services/authService'

const BASE_URL = !__DEV__ ? LIVE_BASE_URL : LIVE_BASE_URL

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    Accept: 'application/json'
  }
})

let isRefreshing = false
let refreshSubscribers: any[] = []

function onRefreshed(token: any) {
  refreshSubscribers.forEach(callback => callback(token))
  refreshSubscribers = []
}

function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback)
}

export const publicClient = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    Accept: 'application/json'
  }
})

export const resetAccountClient = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    Accept: 'application/json'
  }
})

// Public client request interceptor
publicClient.interceptors.request.use(
  async request => {
    const isNetworkActive = await getNetworkStatus()

    if (!isNetworkActive) {
      toast.error('Please check your internet connection')
      return Promise.reject(new Error('No internet connection'))
    }

    return request
  },
  error => Promise.reject(error)
)

publicClient.interceptors.request.use(request => {
  console.log('🌐 publicClient REQUEST:', {
    url: request.url,
    baseURL: request.baseURL,
    fullURL: ` ${request.url}`,
    method: request.method,
    headers: request.headers,
    data: request.data
  })
  return request
})

publicClient.interceptors.response.use(
  response => {
    console.log('✅ publicClient RESPONSE:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
      headers: response.headers
    })
    // Check for access token in headers
    return response
  },
  error => {
    console.log('❌ publicClient ERROR:', {
      status: error.response?.status,
      error: {error},
      url: error.config?.url,
      fullURL: `${error.config?.baseURL || ''}${error.config?.url}`,
      message: error.message,
      responseData: error.response?.data
    })
    return Promise.reject(error)
  }
)

// API client request interceptor
apiClient.interceptors.request.use(
  async request => {
    console.log('🌐 apiclient REQUEST:', {
      url: request.url,
      baseURL: request.baseURL,
      fullURL: ` ${request.url}`,
      method: request.method,
      headers: request.headers,
      data: request.data
    })
    const isNetworkActive = await getNetworkStatus()

    if (!isNetworkActive) {
      toast.error('Please check your internet connection')
      return Promise.reject(new Error('No internet connection'))
    }

    const accessToken: string | undefined = getFromVault('accessToken') as any
    // const uniqueId = await DeviceInfo.getUniqueId()

    // request.headers['device-unique-id'] = uniqueId

    if (accessToken) {
      request.headers.Authorization = `bearer ${accessToken}`
    }

    return request
  },
  error => Promise.reject(error)
)

// Reset account client request interceptor
resetAccountClient.interceptors.request.use(
  async request => {
    const isNetworkActive = await getNetworkStatus()

    if (!isNetworkActive) {
      toast.error('Please check your internet connection')
      return Promise.reject(new Error('No internet connection'))
    }

    const resetToken: string | undefined = getFromVault('resetToken') as any
    // const uniqueId = await DeviceInfo.getUniqueId()

    // request.headers['device-unique-id'] = uniqueId

    if (resetToken) {
      request.headers.Authorization = `bearer ${resetToken}`
    }

    return request
  },
  error => Promise.reject(error)
)

apiClient.interceptors.response.use(
  response => {
    console.log('✅ publicClient RESPONSE:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
      headers: response.headers
    })
    // Check for access token in headers
    return response
  },

  async error => {
    console.log('❌ apiClient ERROR:', {
      status: error.response?.status,
      error: {error},
      url: error.config?.url,
      fullURL: `${error.config?.baseURL || ''}${error.config?.url}`,
      message: error.message,
      responseData: error.response?.data
    })
    // console.log(error.code)
    const originalRequest = error.config

    // Handle token expiration and retry the request with a refreshed token
    if (error.response && error.response.status === 401) {
      if (originalRequest._retry) {
        await queryClient.cancelQueries({type: 'all'})
        clearSession('expired')
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // Add the request to the queue to be retried after the token is refreshed
        return new Promise(resolve => {
          addRefreshSubscriber((token: string) => {
            originalRequest.headers.Authorization = 'Bearer ' + token
            resolve(apiClient(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const accessToken = await authService.refreshToken()

        onRefreshed(accessToken)
        isRefreshing = false
        return apiClient(originalRequest)
      } catch (err) {
        isRefreshing = false

        await queryClient.cancelQueries({type: 'all'})
        clearSession('expired')
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

publicClient.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
)

resetAccountClient.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
)
