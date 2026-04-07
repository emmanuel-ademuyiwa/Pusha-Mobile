import React, {forwardRef, ReactElement, ReactNode, useState} from 'react'
import {Pressable, StyleSheet, TextInput, TextInputProps} from 'react-native'

import AppIcon from '../app-icon'
import {Box} from '../box'
import Typography from '../typography'

export interface TextFieldProps extends TextInputProps {
  name: string
  label?: string
  error?: string
  counter?: number
  prefixIcon?: ReactNode
  icon?: ReactNode
  disabled?: boolean
  readOnly?: boolean
  helperText?: string
  prefix?: string | ReactNode
  suffix?: string | ReactNode
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
  width?: number
  backgroundColor?: string
}

export const TextField = forwardRef<TextInput, TextFieldProps>(
  (props, ref): ReactElement => {
    const {
      label,
      error = '',
      disabled,
      helperText = '',
      readOnly = false,
      width = '100%',
      blurAction,
      onPress = () => null,
      prefix,
      suffix,
      margin,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      marginVertical,
      marginHorizontal,
      marginEnd,
      marginStart,
      placeholder,
      prefixIcon,
      backgroundColor = '#ffffff',
      name,
      ...inputProps
    } = props

    const [focus, setFocus] = useState(false)

    function handleBlur() {
      setFocus(false)
      blurAction && blurAction(props.name)
    }

    const styles = StyleSheet.create({
      inputContainer: {
        height: 44,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderStyle: 'solid',
        borderWidth: 1,
        backgroundColor: !disabled ? backgroundColor : '#EBEBEB',
        width,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      input: {
        color: disabled ? '#798390' : '#45505F',
        height: '100%',
        flex: 1
      },

      suffixContainer: {
        marginLeft: 12
      },

      prefixContainer: {
        marginRight: 16,
        paddingRight: 8,
        borderRightWidth: 2,
        borderRightColor: 'rgba(0, 0, 0, 0.16)'
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
        {/* {label && (
          <Typography variant="c1-medium" color="neutral-600" mb={8}>
            {label}
          </Typography>
        )} */}
        <Pressable accessibilityRole="button" onPress={onPress}>
          <Box
            style={[
              styles.inputContainer,
              {borderColor: focus ? '#2554C7' : '#E9EAEB'}
            ]}>
            {/* Prefix */}
            {prefix && (
              <Box
                style={styles.prefixContainer}
                alignItems="flex-end"
                justifyContent="center">
                <Typography variant="c1-medium" color="neutral-600">
                  {prefix}
                </Typography>
              </Box>
            )}

            {prefixIcon && (
              <Box
                alignItems="flex-end"
                justifyContent="center"
                marginRight={4}>
                {prefixIcon}
              </Box>
            )}

            <TextInput
              aria-label={props.label}
              allowFontScaling={false}
              onPressIn={onPress}
              ref={ref}
              style={styles.input}
              placeholder={props.placeholder}
              onFocus={() => setFocus(true)}
              onBlur={handleBlur}
              placeholderTextColor="#6F7886"
              cursorColor="#111"
              selectionColor="#1f1f1f"
              editable={!disabled && !readOnly}
              {...inputProps}
            />
            {/* )} */}

            {/* Suffix */}
            {Boolean(suffix || inputProps.icon || error.length) && (
              <Box
                style={styles.suffixContainer}
                minWidth={40}
                alignItems="flex-end"
                justifyContent="center">
                {error ? (
                  inputProps.icon ? (
                    inputProps.icon
                  ) : (
                    <AppIcon name="Info" size={20} color="red" />
                  )
                ) : inputProps.icon ? (
                  inputProps.icon
                ) : (
                  ''
                )}
                {suffix &&
                  !error &&
                  (typeof suffix === 'string' ? (
                    <Typography variant="c1-medium" color="neutral-400">
                      {suffix}
                    </Typography>
                  ) : (
                    suffix
                  ))}
              </Box>
            )}
          </Box>
          {(helperText || Boolean(error)) && (
            <Typography
              variant="c1"
              marginTop={8}
              color={error ? 'error-100' : 'neutral-400'}>
              {error || helperText}
            </Typography>
          )}
        </Pressable>
      </Box>
    )
  }
)

TextField.displayName = 'TextField'
export default TextField
