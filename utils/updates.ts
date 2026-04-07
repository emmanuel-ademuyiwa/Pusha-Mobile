import * as Sentry from '@sentry/react-native'
import * as Updates from 'expo-updates'

export async function updateAppOnMount() {
  try {
    const update = await Updates.checkForUpdateAsync()

    if (update.isAvailable) {
      await Updates.fetchUpdateAsync()
      await Updates.reloadAsync()
    }
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        source: 'fetch-update-async'
      }
    })
  }
}
