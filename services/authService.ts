import axios from 'axios'

import {BASE_URL, REQUEST_TIMEOUT_MS} from '@/constants/ApiConstants'
import {ApiResponse} from '@/libs'
import {getFromVault, saveToVault} from '@/utils/storage'

const refreshClient = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    Accept: 'application/json'
  }
})

refreshClient.interceptors.request.use(
  async request => {
    const refreshToken: string | undefined = getFromVault('refreshToken')
    const invalidAccessToken: string | undefined = getFromVault('accessToken')

    if (invalidAccessToken && refreshToken) {
      request.headers.Authorization = `bearer ${invalidAccessToken}`
      request.headers.refreshToken = `bearer ${refreshToken}`
    }

    return request
  },
  error => Promise.reject(error)
)

refreshClient.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
)

// Get new access token with refresh token
export const authService = {
  refreshToken: async () => {
    try {
      const {data}: ApiResponse<any> = await refreshClient.get('')

      saveToVault('refreshToken', data.refreshToken)
      saveToVault('accessToken', data.token)

      return data.token
    } catch (err) {
      throw err
    }
  }
}
