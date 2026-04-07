import ENV from '@/env'

export const phoneNumberPattern = /^0?[789][01]\d{8}$/

export const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w+)+$/

export const LOW_STOCK_THRESHOLD = 7

export const MAX_VARIANTS_SUPPORTED = 3

export const UPDATE_CHECK_INTERVAL = 24 * 60 * 60 * 1000

export const STORE_DOMAIN = ENV.STORE_DOMAIN

export const bazeCommunityURL =
  'https://chat.whatsapp.com/ER57PD4L2px4UaeqwxILdA'
