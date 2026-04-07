import CheckBox from 'expo-checkbox'
import React from 'react'

interface CheckBoxProps {
  onChange?: () => void
  onValueChange?: (value: boolean) => void
  value?: boolean
  disabled?: boolean
}

export const AppCheckBox = (props: CheckBoxProps) => {
  return <CheckBox {...props} color={props.value ? '#CC9933' : '#959CA7'} />
}

export default AppCheckBox
