// Request Large Heap on Android
// Unnecesaary for now

const {withAndroidManifest} = require('expo/config-plugins')

module.exports = function withAndroidManifestPlugin(appConfig) {
  return withAndroidManifest(appConfig, function (decoratedAppConfig) {
    try {
      decoratedAppConfig.modResults.manifest.application[0].$[
        'android:largeHeap'
      ] = 'true'
    } catch (err) {
      console.error(`withAndroidManifestPlugin failed`, err)
    }
    return decoratedAppConfig
  })
}
