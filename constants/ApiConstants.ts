import ENV from '../env'

export const REQUEST_TIMEOUT_MS = 15000

export enum API_STATUS_CODES {
  REQUEST_NOT_AUTHORISED = 401,
  RESOURCE_NOT_FOUND = 404,
  SERVER_ERROR = 502,
  SERVER_UNAVAILABLE = 503,
  REQUEST_FORBIDDEN = 403
}

export enum API_STATUS {
  SUCCESS = 'success',
  ERROR = 'error',
  LOADING = 'loading',
  IDLE = 'idle'
}

export const BASE_URL = ENV.BASE_URL as string
export const DEV_BASE_URL = ENV.DEV_BASE_URL as string
