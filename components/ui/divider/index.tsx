import {SpacingProps} from '@shopify/restyle'
import React from 'react'

import Box from '../box'

import {Theme} from '@/theme'

interface Props extends SpacingProps<Theme> {
  orientation?: 'horizontal' | 'vertical'
  thickness?: number
  color?: string
}

export const Divider = (props: Props) => {
  const {orientation = 'horizontal', color = 'rgba(0,0,0,0.08)'} = props
  return (
    <>
      {orientation === 'horizontal' && (
        <Box
          height={props.thickness ?? 1}
          style={{backgroundColor: color}}
          {...props}
        />
      )}
      {orientation === 'vertical' && (
        <Box
          width={props.thickness ?? 1}
          height="100%"
          style={{backgroundColor: color}}
          {...props}
        />
      )}
    </>
  )
}

export default Divider
