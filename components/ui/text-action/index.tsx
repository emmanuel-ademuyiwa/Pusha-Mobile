import * as Haptics from 'expo-haptics'
import React, {PropsWithChildren} from 'react'
import {Keyboard} from 'react-native'

import AppIcon from '../app-icon'
import Box from '../box'
import AppPressable from '../pressable'
import Typography, {TypographyProps} from '../typography'

export interface TextActionProps extends TypographyProps {
  variant?:
    | 'c1-bold'
    | 'body-bold'
    | 'body'
    | 'h3-bold'
    | 'h2-bold'
    | 'h1-bold'
  iconName?: string
  iconPosition?: 'start' | 'end'
  iconColor?: string
  onPress?: () => void
}

export const TextAction = (props: PropsWithChildren<TextActionProps>) => {
  const {
    variant = 'body-bold',
    color = 'primary-100',
    iconPosition = 'end',
    iconColor = '#21C67F6',
    onPress,
    ...TextActionProps
  } = props

  const handleOnPress = () => {
    Keyboard.dismiss()
    onPress && onPress()
  }
  return (
    <>
      {props.iconName ? (
        <AppPressable
          flexDirection="row"
          alignItems="center"
          onPress={handleOnPress}>
          {iconPosition === 'start' && (
            <Box mr={4}>
              <AppIcon name={props.iconName} size={16} color={iconColor} />
            </Box>
          )}
          <Typography variant={variant} color={color} {...TextActionProps}>
            {props.children}
          </Typography>
          {iconPosition === 'end' && (
            <Box ml={4}>
              <AppIcon name={props.iconName} size={16} color={iconColor} />
            </Box>
          )}
        </AppPressable>
      ) : (
        <Typography
          variant={variant}
          color={color}
          {...TextActionProps}
          onPress={() => {
            Haptics.impactAsync()
            handleOnPress()
          }}>
          {props.children}
        </Typography>
      )}
    </>
  )
}

export default TextAction
