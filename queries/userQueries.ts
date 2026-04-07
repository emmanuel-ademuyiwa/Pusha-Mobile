import {api} from '@/api'

import {QUERY_KEYS} from '@/constants/queryKeys'
import {queryClient} from '@/utils/queryClient'
import {saveToVault} from '@/utils/storage'

export const userQuery = async () => {
  return await queryClient.fetchQuery({
    queryKey: [QUERY_KEYS.USER],
    queryFn: async () => {
      const res = await api.user.getUserProfile()
      saveToVault('user', res.data.data)
      return res.data.data
    },
    staleTime: 1000 * 60 * 5
  })
}
