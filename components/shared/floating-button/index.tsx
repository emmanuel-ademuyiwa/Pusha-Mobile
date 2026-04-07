import Box from '@/components/ui/box'
import React from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

interface FloatingButtonProps {
  onPress: () => void
  children?: React.ReactNode
}

export const FloatingButton = ({onPress, children}: FloatingButtonProps) => {
  const insets = useSafeAreaInsets()

  return (
    <Box
      style={[styles.wrapper, {bottom: Math.max(insets.bottom + 16, 24)}]}>
      <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.85}>
        {children}
      </TouchableOpacity>
    </Box>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: 16,
    zIndex: 100,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2554C7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2554C7',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
})

export default FloatingButton
