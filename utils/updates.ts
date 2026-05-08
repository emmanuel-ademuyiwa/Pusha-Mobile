import * as Updates from 'expo-updates'

export async function updateAppOnMount() {
  try {
    const update = await Updates.checkForUpdateAsync()

    if (update.isAvailable) {
      await Updates.fetchUpdateAsync()
      await Updates.reloadAsync()
    }
  } catch {
    // OTA check failed silently on mount; user can retry from settings
  }
}
