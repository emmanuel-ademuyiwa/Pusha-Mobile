import {BASE_URL} from '@/constants/ApiConstants'
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios'
import {errorHandler} from './errorHandler'
import {getFromVault} from './storage'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

interface ApiCallParams<T, Q> {
  path: string | undefined
  method: string
  data?: T
  config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'data'>
  query?: Q
}

const baseUrl = BASE_URL || ''
export const callApi = async <Output, Input, Query = Input>(
  params: ApiCallParams<Input, Query>
): Promise<ApiResponse<Output>> => {
  const {path, method = 'GET', data, config, query} = params
  const url = `${baseUrl}${path}`
  // const session: any = await getSession();
  const token = getFromVault('accessToken')
  const headersToBePassed: any = {}

  if (token) {
    headersToBePassed['Authorization'] = `Bearer ${token}`
  }

  try {
    const response: AxiosResponse<Output> = await axios({
      url,
      method,
      data,
      ...config,
      params: query,
      headers: headersToBePassed
    })

    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    const axiosError: any = error
    errorHandler(error)
    return {
      success: false,
      error: axiosError.response?.data?.message || axiosError.message
    }
  }
}
