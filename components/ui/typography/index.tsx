import {createText, TextProps} from '@shopify/restyle'
import React, {ComponentProps, PropsWithChildren} from 'react'
import {Text} from 'react-native'

import {Theme} from '@/theme'

const TextContainer = createText<Theme>()

export interface TypographyProps
  extends Omit<
      TextProps<Theme>,
      | 'allowFontScaling'
      | 'adjustsFontSizeToFit'
      | 'includeFontPadding'
      | 'maxFontSizeMultiplier'
      | 'minimumFontScale'
    >,
    Omit<
      ComponentProps<typeof Text>,
      | 'allowFontScaling'
      | 'adjustsFontSizeToFit'
      | 'includeFontPadding'
      | 'maxFontSizeMultiplier'
      | 'minimumFontScale'
    > {}

export function Typography(props: PropsWithChildren<TypographyProps>) {
  const {children, ...rest} = props

  return (
    <TextContainer
      {...rest}
      allowFontScaling={false}
      adjustsFontSizeToFit={false}>
      {children}
    </TextContainer>
  )
}

export default Typography
