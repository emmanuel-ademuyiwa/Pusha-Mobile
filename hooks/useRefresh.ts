import {useNetInfo} from '@react-native-community/netinfo'
import React from 'react'

import toast from '@/utils/toast'

const useRefresh = (refetch: any) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const netinfo = useNetInfo()

  const refresh = async () => {
    try {
      setIsRefreshing(true)

      if (netinfo.isInternetReachable === false) {
        toast.error('Please check your internet connection')
        return
      }
      await refetch()
    } catch (err) {
      console.log(err)
    } finally {
      setIsRefreshing(false)
    }
  }

  return {isRefreshing, refresh}
}

export default useRefresh
