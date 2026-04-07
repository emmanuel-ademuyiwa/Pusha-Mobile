import * as Haptics from 'expo-haptics'
import React from 'react'
import {
  AccessibilityState,
  GestureResponderEvent,
  Platform,
  Pressable,
  StyleSheet
} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated'

import AppIcon from '../app-icon'
import Typography from '../typography'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

interface TabBarButtonProps {
  tab: {selectedIcon: string; icon: string; text: string}
  onPress?: (e: GestureResponderEvent) => void
  accessibilityState?: AccessibilityState
  activeTintColor: string
  inactiveTintColor: string
  // Add these new props based on what we see in the logs
  'aria-selected'?: boolean
  style?: any
  children?: any
  [key: string]: any // Allow for other props we might not have explicitly defined
}

export const TabBarButton = ({
  tab,
  onPress,
  accessibilityState,
  activeTintColor,
  inactiveTintColor,
  'aria-selected': ariaSelected,
  ...rest
}: TabBarButtonProps) => {
  const focused = accessibilityState?.selected || ariaSelected || false

  const color = focused ? activeTintColor : inactiveTintColor
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}]
  }))

  return (
    <AnimatedPressable
      onPress={e => {
        if (Platform.OS !== 'web') {
          Haptics.selectionAsync()
        }
        onPress?.(e)
      }}
      onPressIn={() => {
        scale.value = withSpring(0.92)
      }}
      onPressOut={() => {
        scale.value = withSpring(1)
      }}
      style={[styles.pressable, animatedStyle]}
      {...rest}>
      <AppIcon
        name={focused ? tab.selectedIcon : tab.icon}
        size={24}
        color={color}
      />
      <Typography
        marginTop={4}
        variant="c2-bold"
        color={focused ? 'primary-100' : 'neutral-700'}
        textTransform="capitalize">
        {tab.text}
      </Typography>
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
