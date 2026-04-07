import React from 'react'
import {Switch} from 'react-native'

interface SwitchProps {
  value: boolean
  onValueChange: () => void
}

export const BZSwitch = (props: SwitchProps) => {
  const handleOnValueChange = () => {
    props.onValueChange()
  }
  return (
    <Switch
      trackColor={{false: '#767577', true: '#20B038'}}
      thumbColor="#ffffff"
      onValueChange={handleOnValueChange}
      value={props.value}
    />
  )
}

export default BZSwitch
