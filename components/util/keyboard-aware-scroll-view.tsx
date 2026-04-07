import React from 'react'
import {Pressable} from 'react-native'
import {KeyboardAwareScrollView as RNKeyboardAwareScrollView} from 'react-native-keyboard-controller'
import type {KeyboardAwareScrollViewProps} from 'react-native-keyboard-controller'

interface Props extends KeyboardAwareScrollViewProps {
  children?: React.ReactNode
}

export function KeyboardAwareScrollView({
  children,
  bottomOffset = 62,
  showsVerticalScrollIndicator = false,
  contentContainerStyle,
  alwaysBounceVertical = false,
  ...props
}: Readonly<Props>) {
  return (
    <RNKeyboardAwareScrollView
      bottomOffset={bottomOffset}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      {...props}
      contentContainerStyle={[{flexGrow: 1}, contentContainerStyle]}>
      <Pressable accessibilityRole="button" style={{flexGrow: 1}}>
        {children}
      </Pressable>
    </RNKeyboardAwareScrollView>
  )
}
