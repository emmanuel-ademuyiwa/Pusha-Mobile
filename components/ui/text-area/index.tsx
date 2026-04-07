import React, {forwardRef, ReactElement, useState} from 'react'
import {Pressable, StyleSheet, TextInput, TextInputProps} from 'react-native'

import {Box} from '../box'
import Typography from '../typography'

export interface TextAreaProps extends TextInputProps {
  name: string
  label?: string
  error?: string
  counter?: number
  disabled?: boolean
  readOnly?: boolean
  helperText?: string
  height?: number
  blurAction?: (type: string) => void
  onPress?: () => void
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

export const TextArea = forwardRef<never, TextAreaProps>(
  (props, ref): ReactElement => {
    const {
      label,
      error,
      disabled,
      height,
      helperText = '',
      readOnly = false,
      blurAction,
      onPress = () => null,
      margin,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      marginVertical,
      marginHorizontal,
      marginEnd,
      marginStart,
      ...inputProps
    } = props

    const [focus, setFocus] = useState(false)

    function handleBlur() {
      setFocus(false)
      blurAction && blurAction(props.name)
    }

    const styles = StyleSheet.create({
      inputContainer: {
        minHeight: 80,
        height,
        paddingHorizontal: 12,
        borderRadius: 8,
        paddingVertical: 10,
        borderStyle: 'solid',
        borderWidth: 2,
        backgroundColor: !disabled ? '#f5f5f5' : '#EBEBEB',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      },
      input: {
        color: disabled ? '#798390' : '#111111',
        height: '100%',
        flex: 1,
        padding: 0
        // lineHeight: 0
      }
    })

    return (
      <Box
        style={{
          margin,
          marginTop,
          marginBottom,
          marginLeft,
          marginRight,
          marginVertical,
          marginHorizontal,
          marginEnd,
          marginStart
        }}>
        {label && (
          <Typography variant="c1-medium" color="neutral-600" mb={8}>
            {label}
          </Typography>
        )}
        <Pressable accessibilityRole="button" onPress={onPress}>
          <Box
            maxHeight={120}
            style={[
              styles.inputContainer,
              {borderColor: focus ? '#80A6F9' : '#f5f5f5'}
            ]}>
            <TextInput
              scrollEnabled
              allowFontScaling={false}
              onPressIn={onPress}
              ref={ref}
              style={styles.input}
              placeholder={inputProps.placeholder}
              onFocus={() => setFocus(true)}
              onBlur={handleBlur}
              placeholderTextColor="#6F7886"
              cursorColor="#111"
              selectionColor="#1f1f1f"
              editable={!disabled && !readOnly}
              textAlignVertical="top"
              multiline
              {...inputProps}
            />
          </Box>
          {!!(helperText || error) && (
            <Typography
              variant="c1"
              marginTop={8}
              color={error ? 'error-100' : 'neutral-400'}>
              {error ?? helperText}
            </Typography>
          )}
        </Pressable>
      </Box>
    )
  }
)

TextArea.displayName = 'TextArea'
export default TextArea
