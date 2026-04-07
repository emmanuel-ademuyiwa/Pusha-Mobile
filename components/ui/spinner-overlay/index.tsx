import React from 'react'
import {StyleSheet, View, ViewProps} from 'react-native'

import BZActivityIndicator from '../activity-indicator'

interface SpinnerOverlayProps extends ViewProps {
  show: boolean
}

export const SpinnerOverlay: React.FC<SpinnerOverlayProps> = ({
  show,
  children,
  ...props
}) => {
  return (
    <View
      style={[styles.container, props.style]}
      pointerEvents={show ? 'none' : 'auto'}>
      {children}
      {show && (
        <View style={styles.overlay}>
          <BZActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1 // Ensure the overlay is above the content
  }
})

export default SpinnerOverlay
