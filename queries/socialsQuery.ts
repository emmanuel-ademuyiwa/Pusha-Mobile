import {useMutation, useQuery} from '@tanstack/react-query'

import {api} from '@/api'
import {QUERY_KEYS} from '@/constants/queryKeys'

export interface BusinessIntegrationItem {
  id: string
  connected: boolean
  enabled: boolean
}

export interface BusinessIntegrationsData {
  integrations: BusinessIntegrationItem[]
  /** Mirrors web: reserved for future API; currently always false. */
  salesEnabled: boolean
}

function parseFacebookAuthUrl(body: unknown): string {
  if (typeof body === 'string') return body
  const o = body as {url?: string; data?: {url?: string}}
  return o?.url ?? o?.data?.url ?? ''
}

export const useBusinessIntegrations = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.BUSINESS_INTEGRATION],
    queryFn: async (): Promise<BusinessIntegrationsData> => {
      const response = await api.socials.businessIntegrations()
      const outer = response?.data as {data?: Record<string, boolean>} | undefined
      const d = outer?.data ?? (response?.data as Record<string, boolean>) ?? {}
      const isMetaConnected = Boolean(
        d.facebook || d.instagram || d.whatsapp
      )
      const integrations: BusinessIntegrationItem[] = [
        {
          id: 'facebook',
          connected: isMetaConnected,
          enabled: isMetaConnected
        },
        {
          id: 'tiktok',
          connected: Boolean(d.tiktok),
          enabled: Boolean(d.tiktok)
        },
        {id: 'webchat', connected: true, enabled: true}
      ]
      return {
        integrations,
        salesEnabled: false
      }
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10
  })
}

export const useFacebookAuthUrl = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await api.socials.connectFacebookAuth()
      return parseFacebookAuthUrl(res?.data as unknown)
    }
  })
}
