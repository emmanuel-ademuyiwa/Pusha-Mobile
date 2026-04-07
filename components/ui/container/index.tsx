import React, {PropsWithChildren} from 'react'

import {Box} from '../box'

interface Props {
  flex?: number
  margin?: number
  marginTop?: number
  marginBottom?: number
  marginLeft?: number
  marginRight?: number
  marginVertical?: number
  marginHorizontal?: number
  marginEnd?: number
  marginStart?: number
}

export const Container = (props: PropsWithChildren<Props>) => {
  return (
    <Box
      paddingHorizontal={16}
      flex={props.flex}
      style={{
        margin: props.margin,
        marginTop: props.marginTop,
        marginBottom: props.marginBottom,
        marginLeft: props.marginLeft,
        marginRight: props.marginRight,
        marginVertical: props.marginVertical,
        marginHorizontal: props.marginHorizontal,
        marginEnd: props.marginEnd,
        marginStart: props.marginStart
      }}>
      {props.children}
    </Box>
  )
}

export default Container
