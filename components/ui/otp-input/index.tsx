import React, {Dispatch, SetStateAction, useEffect, useRef} from 'react'
import {Keyboard, Pressable, TextInput} from 'react-native'

import BlinkingCursor from '../blinking-cursor'
import Box from '../box'
import Typography from '../typography'

interface OTPProps {
  otp: string
  setOTP: Dispatch<SetStateAction<string>>
  setIsInputFilled: Dispatch<SetStateAction<boolean>>
  length?: number
}

export const OtpInput = ({
  otp = '',
  setOTP,
  length = 4,
  setIsInputFilled
}: OTPProps) => {
  const boxArray = new Array(length).fill(0)
  const inputRef = useRef<TextInput>(null)

  const boxDigit = (_data: any, index: number) => {
    const emptyInput = ''
    const digit = otp[index] || emptyInput

    const showCursor = () => {
      if (index === 0 && !otp[index]) {
        return true
      }
      return !!(otp[index - 1] && !otp[index])
    }

    return (
      <Box
        key={index}
        style={{
          width: 56,
          height: 56,
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 16,
          marginHorizontal: 4,
          padding: 0,
          borderWidth: 1,
          borderColor: '#EAECF0'
        }}>
        {showCursor() && <BlinkingCursor />}
        {!showCursor() && (
          <Typography variant="h1-bold" fontSize={48} lineHeight={55} color="neutral-900">
            {digit}
          </Typography>
        )}
      </Box>
    )
  }

  useEffect(() => {
    setIsInputFilled(otp.length === length)

    if (otp.length === length) {
      Keyboard.dismiss()
    }

    return () => {
      setIsInputFilled(false)
    }
  }, [otp])

  return (
    <Box>
      <Pressable
        accessibilityRole="button"
        onPress={() => inputRef.current?.focus()}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignSelf: 'flex-start'
        }}>
        {boxArray.map(boxDigit)}
      </Pressable>
      <TextInput
        accessibilityLabel="Text input field"
        accessibilityHint="Enter OTP"
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        inputMode="numeric"
        value={otp}
        onChangeText={setOTP}
        maxLength={length}
        enablesReturnKeyAutomatically
        ref={inputRef}
        style={{
          position: 'absolute',
          opacity: 0
        }}
      />
    </Box>
  )
}
