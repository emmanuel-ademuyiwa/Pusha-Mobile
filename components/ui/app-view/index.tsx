import React, {PropsWithChildren} from 'react'
import {Keyboard, Platform, TouchableWithoutFeedback} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

import {Box} from '../box'

import {ThemeColors} from '@/theme'

export interface Props {
  color?: ThemeColors
  hasTopBanner?: boolean
  footerPadding?: boolean
}

function getFooterPadding(footerPadding: boolean, insets: any) {
  if (!footerPadding) return 0
  return Platform.OS === 'android' ? 20 : insets.bottom
}

export const AppView = (props: PropsWithChildren<Props>) => {
  const {color = 'white', hasTopBanner = true, footerPadding = true} = props
  const insets = useSafeAreaInsets()

  return (
    <TouchableWithoutFeedback
      accessibilityRole="button"
      onPress={Keyboard.dismiss}>
      <Box
        backgroundColor={color}
        style={{
          flex: 1,
          paddingTop: hasTopBanner ? 0 : insets.top,
          paddingBottom: getFooterPadding(footerPadding, insets),
          paddingLeft: insets.left,
          paddingRight: insets.right
        }}>
        <Box flex={1} position="relative">
          {props.children}
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default AppView
