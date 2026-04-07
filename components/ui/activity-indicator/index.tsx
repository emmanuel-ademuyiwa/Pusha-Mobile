import React, {FC} from 'react'
import {ActivityIndicator, ActivityIndicatorProps} from 'react-native'

interface BZActivityIndicatorProps extends ActivityIndicatorProps {}

export const BZActivityIndicator: FC<BZActivityIndicatorProps> = props => {
  const {color = '#2C67F7', size, ...otherProps} = props
  return <ActivityIndicator color={color} size={size} {...otherProps} />
}

export const PushaActivityIndicator: FC<BZActivityIndicatorProps> = props => {
  const {color = '#2554C7', size, ...otherProps} = props
  return <ActivityIndicator color={color} size={size} {...otherProps} />
}

export default BZActivityIndicator
