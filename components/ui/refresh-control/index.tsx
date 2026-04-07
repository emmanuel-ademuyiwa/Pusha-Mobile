import React, {FC} from 'react'
import {RefreshControl, RefreshControlProps} from 'react-native'

interface BZRefreshControlProps extends RefreshControlProps {}

export const BZRefreshControl: FC<BZRefreshControlProps> = props => {
  const {tintColor = '#2C67F7', size, refreshing, onRefresh} = props

  return (
    <RefreshControl
      tintColor={tintColor}
      progressBackgroundColor="white"
      colors={['#2C67F7']}
      size={size}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  )
}

export default BZRefreshControl
