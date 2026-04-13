import {
  BackgroundColorProps,
  createRestyleComponent,
  createVariant,
  SpacingProps,
  VariantProps
} from '@shopify/restyle'
import {BlurView} from 'expo-blur'
import * as Haptics from 'expo-haptics'
import {LinearGradient} from 'expo-linear-gradient'
import React, {ComponentProps, ReactNode, useState} from 'react'
import {Pressable} from 'react-native'

import {Box} from '../box'
import {ThreeDotsLoader} from '../three-dots-loader'
import {Typography} from '../typography'

import {Theme} from '@/theme'

enum ButtonStyle {
  primary = 'primary-100',
  outline = 'white',
  secondary = 'black',
  tertiary = 'neutral-200',
  'destructive-1' = 'error-100',
  'destructive-2' = 'error-300'
}

enum DisabledButtonStyle {
  primary = 'primary-disabled',
  secondary = 'neutral-400',
  tertiary = 'neutral-200',
  outline = 'transparent',
  'destructive-1' = 'error-disabled',
  'destructive-2' = 'error-300'
}

type ButtonProps = Omit<
  SpacingProps<Theme>,
  | 'padding'
  | 'paddingTop'
  | 'paddingBottom'
  | 'paddingRight'
  | 'paddingLeft'
  | 'paddingVertical'
  | 'paddingHorizontal'
  | 'paddingEnd'
  | 'paddingStart'
  | 'borderWidth'
> &
  VariantProps<Theme, 'buttonVariants'> &
  BackgroundColorProps<Theme> & {
    size?: 'sm' | 'md' | 'lg'
    iconButton?: boolean
    iconSize?: 'sm' | 'md' | 'lg' | 'xl' | 'fab' | number
    Icon?: ReactNode
    LeftIcon?: ReactNode
    RightIcon?: ReactNode
    disabled?: boolean
    loading?: boolean
    label?: string
    onPress?: () => void
    onLongPress?: () => void
    color?: any
    borderColor?: any
    paddingHorizontal?: number
    hasLinearGradient?: boolean
    align?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
    borderWidth?: number
  }

const buttonVariant = createVariant({
  themeKey: 'buttonVariants'
})

const ButtonContainer = createRestyleComponent<
  VariantProps<Theme, 'buttonVariants'> & ComponentProps<typeof Box>,
  Theme
>([buttonVariant], Box)

export const Button = ({
  onPress,
  onLongPress,
  size = 'md',
  LeftIcon,
  RightIcon,
  align = 'stretch',
  Icon,
  variant = 'primary',
  loading,
  disabled,
  label = '',
  iconButton = false,
  iconSize = 'lg',
  margin,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  marginVertical,
  marginHorizontal,
  marginEnd,
  marginStart,
  color,
  backgroundColor,
  ...rest
}: ButtonProps) => {
  const isInActive = disabled || loading
  const [opacity, setOpacity] = useState(1)

  const fadeIn = () => {
    setOpacity(0.85)
  }

  const fadeOut = () => {
    setOpacity(1)
  }

  const fontColor = () => {
    switch (variant) {
      case 'primary':
        return 'white'

      case 'destructive-2':
        return 'error-100'

      case 'tertiary':
        return 'neutral-700'

      case 'outline':
        return 'gray-700'

      default:
        return 'neutral-1000'
    }
  }

  const marginStyle = {
    margin,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    marginVertical,
    marginHorizontal,
    marginEnd,
    marginStart
  }

  const getIconButtonSize = () => {
    switch (iconSize) {
      case 'fab':
        return 48
      case 'xl':
        return 48
      case 'md':
        return 32
      case 'sm':
        return 24
      default:
        return typeof iconSize === 'number' ? iconSize : 40
    }
  }

  const getIconButtonRadius = () => {
    switch (iconSize) {
      case 'fab':
        return 12

      default:
        return getIconButtonSize() / 2
    }
  }

  const handlePress = () => {
    if (!isInActive && onPress) {
      // Haptics.impactAsync()
      onPress()
    }
  }

  const handleLongPress = () => {
    if (!isInActive && onLongPress) {
      Haptics.impactAsync()
      onLongPress()
    }
  }

  const buttonContent = (
    <>
      {!loading && (
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          paddingHorizontal={size === 'sm' ? 8 : 24}>
          {LeftIcon && (
            <Box marginRight={variant === 'primary' ? 2 : size === 'md' ? 8 : 4}>
              {LeftIcon}
            </Box>
          )}
          <Typography variant={size === 'sm' ? 'c1-medium' : 'h3-bold'} color={color || fontColor()}>
            {label}
          </Typography>
          {RightIcon && (
            <Box marginLeft={variant === 'primary' ? 2 : size === 'md' ? 8 : 4}>
              {RightIcon}
            </Box>
          )}
        </Box>
      )}
      {loading && <ThreeDotsLoader />}
    </>
  )

  const cornerRadius = 12
  const innerHeight = size === 'sm' ? 38 : size === 'lg' ? 50 : 42

  return !iconButton ? (
    <Pressable
      accessibilityRole="button"
      onPressIn={fadeIn}
      onPressOut={fadeOut}
      onPress={handlePress}
      onLongPress={handleLongPress}
      disabled={loading || disabled}
      style={[
        marginStyle,
        variant === 'primary' && {
          alignSelf: align,
          borderRadius: cornerRadius,
          opacity: disabled ? 0.5 : opacity,
          boxShadow:
            '0px 10px 10px 0px rgba(0,0,0,0.1), 0px 4px 4px 0px rgba(0,0,0,0.051), 0px 1px 0px 0px rgba(0,0,0,0.051)'
        }
      ]}>
      {/* {rest.hasLinearGradient ? (
        <LinearGradient
          colors={[
            'rgba(255,255,255,0.05)',
            'rgba(255,255,255,0)',
            'rgba(255,255,255,0.5)'
          ]}
          locations={[0, 0.336, 0.892]}
          start={{x: 0.21, y: 0.91}}
          end={{x: 0.79, y: 0.09}}
          style={{borderRadius: cornerRadius, padding: 1}}>
          <BlurView
            intensity={20}
            tint="light"
            style={{
              borderRadius: cornerRadius - 1,
              height: innerHeight,
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            {buttonContent}
          </BlurView>
        </LinearGradient>
      ) : ( */}
        <ButtonContainer
          alignSelf={align}
          borderWidth={variant === 'outline' ? 1 : 0}
          backgroundColor={
            disabled
              ? DisabledButtonStyle[variant]
              : backgroundColor || ButtonStyle[variant]
          }
          borderColor={variant === 'outline' ? 'stroke' : undefined}
          height={size === 'sm' ? 32 : size === 'md' ? 44 : 48}
          borderRadius={8}
          style={[
            {
              alignItems: 'center',
              justifyContent: 'center',
              ...(variant === 'outline' && {
                borderColor: 'rgba(11, 19, 36, 0.07)'
              })
            }
          ]}
          {...rest}>
          {buttonContent}
        </ButtonContainer>
      {/* )} */}
    </Pressable>
  ) : (
    <Pressable
      accessibilityRole="button"
      role="button"
      onPressIn={fadeIn}
      onPressOut={fadeOut}
      onPress={handlePress}
      onLongPress={handleLongPress}
      disabled={loading || disabled}
      style={marginStyle}>
      <ButtonContainer
        borderWidth={1}
        borderColor={variant === 'outline' ? 'stroke' : undefined}
        backgroundColor={
          disabled
            ? DisabledButtonStyle[variant]
            : backgroundColor || ButtonStyle[variant]
        }
        height={getIconButtonSize()}
        width={getIconButtonSize()}
        borderRadius={getIconButtonRadius()}
        style={[
          {
            opacity,
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0px 1px 3px 0px #0B13241A'
          }
        ]}
        {...rest}>
        {Icon && <Box>{Icon}</Box>}
      </ButtonContainer>
    </Pressable>
  )
}

export default Button
