import NetInfo from '@react-native-community/netinfo'

export const getNetworkStatus = async () => {
  const networkStatus = await NetInfo.fetch()
  return networkStatus.isConnected
}
