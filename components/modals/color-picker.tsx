import React, {forwardRef, useEffect, useRef, useState} from 'react'
import {Alert} from 'react-native'
import ColorPicker, {
  ColorPickerRef,
  HSLSaturationSlider,
  HueSlider,
  LuminanceSlider,
  Panel1,
  Preview
} from 'reanimated-color-picker'

import {
  Box,
  Button,
  BZModal,
  TextAction,
  TextField,
  Typography
} from '@/components/ui'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import {Modal} from '@/types/modal'
import {hexToHSL, hslToHex} from '@/utils'

interface ColorObject {
  hex: string
  hsl: string
  hsla: string
  hsv: string
  hsva: string
  hwb: string
  hwba: string
  rgb: string
  rgba: string
}

interface ColorPickerModalProps {
  setCustomColor: (color: string) => void
  color: string
}

export const ColorPickerModal = forwardRef<Modal, ColorPickerModalProps>(
  (props, ref) => {
    const innerRef = useForwardedRef(ref)
    const pickerRef = useRef<ColorPickerRef>(null)

    const [colorTextField, setColorTextField] = useState(props.color)
    const [color, setColor] = useState(props.color)

    const handleColorInit = () => {
      if (props.color) {
        setColor(props.color)

        if (props.color.startsWith('hsl')) {
          setColorTextField(() => hslToHex(props.color))
        } else {
          setColorTextField(props.color)
        }
      }
    }

    useEffect(() => {
      handleColorInit()
    }, [props.color])

    function isValidHexColor(hex: string) {
      const regex = /^#(?:[0-9a-fA-F]{3}){1,2}$/
      return regex.test(hex)
    }

    const handleUpdateColors = (updatedColor: ColorObject) => {
      setColorTextField(updatedColor.hex)
      setColor(updatedColor.hex)
    }

    const handleColorTextfield = () => {
      if (isValidHexColor(colorTextField)) {
        setColor(colorTextField)
        pickerRef?.current?.setColor(colorTextField)
      } else {
        Alert.alert('Invalid Hex', 'Please enter a valid hex code', [
          {text: 'OK'}
        ])
      }
    }

    const handleSetColor = () => {
      props.setCustomColor(hexToHSL(color))
      innerRef.current?.dismiss()
    }

    return (
      <BZModal
        ref={innerRef}
        title="Pick a custom color"
        snapPoints={[650]}
        onDismiss={handleColorInit}
        footer={() => PickerFooter(handleSetColor)}>
        <ColorPicker
          boundedThumb
          thumbShape="solid"
          thumbColor={color}
          value={color}
          style={{flex: 1}}
          ref={pickerRef}
          onComplete={(selectColorObject: ColorObject) => {
            handleUpdateColors(selectColorObject)
          }}>
          <Box flexDirection="row" gap={8} mb={24}>
            <Box flex={1}>
              <TextField
                autoCapitalize="none"
                name="Color Field"
                placeholder="#f5f5f5"
                value={colorTextField}
                onChangeText={val => setColorTextField(val)}
                suffix={
                  <TextAction onPress={handleColorTextfield}>Apply</TextAction>
                }
              />
            </Box>
            <Preview
              hideText
              hideInitialColor
              style={{
                width: 40,
                height: 40,
                borderRadius: 8
              }}
            />
          </Box>

          <Panel1 style={{height: 150, borderRadius: 16}} />

          <Box mt={24}>
            <Typography variant="c1-bold" mb={8}>
              Hue
            </Typography>
            <HueSlider boundedThumb style={{height: 56, borderRadius: 18}} />
          </Box>
          <Box mt={24}>
            <Typography variant="c1-bold" mb={8}>
              Saturation
            </Typography>
            <HSLSaturationSlider style={{height: 36, borderRadius: 18}} />
          </Box>

          <Box mt={24}>
            <Typography variant="c1-bold" mb={8}>
              Luminance
            </Typography>
            <LuminanceSlider style={{height: 36, borderRadius: 18}} />
          </Box>
        </ColorPicker>
      </BZModal>
    )
  }
)

const PickerFooter = (handleSetColor: () => void) => {
  return (
    <Box>
      <Button label="Continue" variant="secondary" onPress={handleSetColor} />
    </Box>
  )
}

ColorPickerModal.displayName = 'ColorPickerModal'
