import React, {useState} from 'react'
import {StyleSheet} from 'react-native'

import Box from '../box'
import SelectField, {SelectItems} from '../select-field'
import TextField from '../text-field'

interface PhoneNumberFieldProps {
  label?: string
  placeholder: string
  countryValue: string
  phoneValue: string
  onCountryChange: (value: string) => void
  onPhoneChange: (value: string) => void
  disabled?: boolean
  error?: string
  helperText?: string
  countries?: SelectItems
  marginTop?: number
  marginBottom?: number
  marginLeft?: number
  marginRight?: number
  marginVertical?: number
  marginHorizontal?: number
  marginEnd?: number
  marginStart?: number
  blurAction: any
}

export const PhoneField = (props: PhoneNumberFieldProps) => {
  const [isCountryFieldActive, setIsCountryFieldActive] = useState(false)
  const [isPhoneFieldActive, setIsPhoneFieldActive] = useState(false)

  const handleCountryFocusChange = (focused: boolean) => {
    setIsCountryFieldActive(focused)
  }

  const handlePhoneFocusChange = (focused: boolean) => {
    setIsPhoneFieldActive(focused)
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 12
    },
    countryContainer: {
      flex: 0,
      minWidth: 120
    },
    phoneContainer: {
      flex: 1
    }
  })

  const COUNTRY_OPTIONS = [
    {
      text: 'Nigeria (+234)',
      value: 'NG',
      code: '+234',
      img: require('@/assets/NGN.png')
    }
  ]

  return (
    <Box flexDirection="row" gap={12}>
      <Box flex={4}>
        <SelectField
          value={props.countryValue as string}
          onChangeValue={value => {
            props.onCountryChange(value)
          }}
          isToShowImg
          items={COUNTRY_OPTIONS}
          name={''}
          // placeholder="Region Code"
        />
      </Box>
      <Box flex={15}>
        <TextField
          keyboardType="phone-pad"
          placeholder={props?.placeholder}
          name="phone_number"
          textContentType="telephoneNumber"
          inputMode="numeric"
          blurAction={props.blurAction}
          value={props.phoneValue}
          error={props.error}
          onChangeText={props.onPhoneChange}
        />
      </Box>
    </Box>
  )
}

export default PhoneField
