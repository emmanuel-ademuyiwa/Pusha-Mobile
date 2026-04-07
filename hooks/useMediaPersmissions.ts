import * as Linking from 'expo-linking'
import * as MediaLibrary from 'expo-media-library'
import {Alert, Platform} from 'react-native'

export const useMediaPersmissions = () => {
  const requestPermission = async () => {
    const {status} = await MediaLibrary.requestPermissionsAsync()

    if (status === 'granted') {
      return
    } else if (status === 'denied') {
      Alert.alert(
        `${Platform.OS === 'ios' ? 'Photos' : 'Media'} permission required!`,
        `Please enable ${
          Platform.OS === 'ios' ? 'Photos' : 'Media'
        } permissions in your device settings. `,
        [
          {
            text: 'Cancel',
            style: 'destructive'
          },
          {
            text: 'Settings',
            onPress: () => {
              Linking.openSettings()
            }
          }
        ]
      )
    }

    return status
  }

  return {requestPermission}
}
