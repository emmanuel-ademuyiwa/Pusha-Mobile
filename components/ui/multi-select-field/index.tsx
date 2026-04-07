import React, {useEffect, useMemo, useRef, useState} from 'react'
import {Keyboard, Platform} from 'react-native'
import {Gesture, GestureDetector} from 'react-native-gesture-handler'

import AppIcon from '../app-icon'
import Box from '../box'
import Button from '../button'
import AppCheckBox from '../checkbox'
import Container from '../container'
import Divider from '../divider'
import BZModal from '../modal'
import AppPressable from '../pressable'
import TextField, {TextFieldProps} from '../text-field'
import Typography from '../typography'

import {KeyboardAwareScrollView} from '@/components/util/keyboard-aware-scroll-view'
import {Modal} from '@/types/modal'

type SelectItem = {text: string; value: string; imgUrl?: string}

interface SelectFieldProps extends Omit<TextFieldProps, 'value'> {
  items: SelectItem[]
  disabled?: boolean
  placeholder?: string | undefined
  label?: string
  helperText?: string
  snapPoints?: string[] | number[]
  onChangeItem?: (item: SelectItem | SelectItem[]) => void
  onChangeValue?: (value: string[]) => void
  value?: string[]
  marginTop?: number
  marginBottom?: number
  marginLeft?: number
  marginRight?: number
  marginVertical?: number
  marginHorizontal?: number
  marginEnd?: number
  marginStart?: number
}

interface SelectItemsProps {
  item: SelectItem
  setItem: (item: SelectItem, isChecked: boolean) => void
  currentSelection: SelectItem[]
  isLastItem: boolean
  isFirstItem: boolean
}

export const MultiSelectField = (props: SelectFieldProps) => {
  const selectFieldModalRef = useRef<Modal>(null)

  const [selectedItems, setSelectedItems] = useState<SelectItem[]>([])

  const snapPoints = useMemo(
    () => props.snapPoints || ['85%'],
    [props.snapPoints]
  )

  useEffect(() => {
    if (props.value) {
      const theSelectedItems = []
      for (const item of props.items) {
        if (props.value.includes(item.value)) {
          theSelectedItems.push(item)
        }
      }
      setSelectedItems(theSelectedItems)
    }
  }, [props.items, props.value])

  useEffect(() => {
    if (props.value) {
      const theSelectedItems = []
      for (const item of props.items) {
        if (props.value.includes(item.value)) {
          theSelectedItems.push(item)
        }
      }
      setSelectedItems(theSelectedItems)
    }
  }, [props.value])

  const handleSetSelectField = () => {
    // Returns the selected Item []
    if (props.onChangeItem) props.onChangeItem(selectedItems)
    // Returned the Selected Item Value []
    if (props.onChangeValue)
      props.onChangeValue(selectedItems.map(item => item.value))

    selectFieldModalRef.current?.dismiss()
  }

  const handleOnPress = () => {
    // Dismiss any active keyboard
    Keyboard.dismiss()
    return props.disabled ? null : selectFieldModalRef.current?.present()
  }

  const setSelectFieldItems = (
    selectedItem: SelectItem,
    isChecked: boolean
  ) => {
    const item = props.items.find(i => i.value === selectedItem.value)

    if (isChecked) {
      if (item) {
        setSelectedItems(prevState => {
          return [...prevState, item]
        })
      }
    } else {
      const index = selectedItems.findIndex(j => j.value === selectedItem.value)

      if (index > -1) {
        setSelectedItems(prevState =>
          prevState.filter(k => k.value !== selectedItem.value)
        )
      }
    }
  }

  const fieldValues = () => {
    let string = ''
    selectedItems.forEach((item, idx) => {
      string += `${item.text}${idx === selectedItems.length - 1 ? '' : ', '}`
    })

    return string
  }

  const tap = Gesture.Tap().onStart(handleOnPress).runOnJS(true)

  return (
    <>
      <Box
        style={{
          marginTop: props.marginTop,
          marginBottom: props.marginBottom,
          marginLeft: props.marginLeft,
          marginRight: props.marginRight,
          marginVertical: props.marginVertical,
          marginHorizontal: props.marginHorizontal,
          marginEnd: props.marginEnd,
          marginStart: props.marginStart
        }}>
        {/* Field Label */}
        {props.label && (
          <Typography variant="c1-medium" color="neutral-600" marginBottom={8}>
            {props.label}
          </Typography>
        )}

        {/* Textfield */}
        {Platform.OS === 'android' && (
          <TextField
            onPress={() => Platform.OS === 'android' && handleOnPress()}
            name={props.name}
            disabled={props.disabled}
            readOnly
            value={fieldValues()}
            placeholder={props.placeholder}
            icon={
              <AppIcon
                name="dropdown"
                size={20}
                color={props.disabled ? '#9FB6EF' : '#2C67F6'}
              />
            }
          />
        )}

        {Platform.OS === 'ios' && (
          <GestureDetector gesture={tap}>
            <Box collapsable={false}>
              <TextField
                name={props.name}
                disabled={props.disabled}
                readOnly
                value={fieldValues()}
                placeholder={props.placeholder}
                icon={
                  <AppIcon
                    name="dropdown"
                    size={20}
                    color={props.disabled ? '#9FB6EF' : '#2C67F6'}
                  />
                }
              />
            </Box>
          </GestureDetector>
        )}
        {/* Helper text */}
        {props.helperText && (
          <Typography variant="c1" color="neutral-400" marginTop={8}>
            {props.helperText}
          </Typography>
        )}
      </Box>

      <BZModal
        footer={() => SelectModalFooter(handleSetSelectField)}
        title={props.name}
        ref={selectFieldModalRef}
        onDismiss={() => {
          if (props.value) {
            const theSelectedItems = []
            for (const item of props.items) {
              if (props.value.includes(item.value)) {
                theSelectedItems.push(item)
              }
            }
            setSelectedItems(theSelectedItems)
          }
        }}
        snapPoints={snapPoints}>
        <KeyboardAwareScrollView>
          {props.items.length
            ? props.items.map((item, idx) => (
                <SelectFieldItem
                  isFirstItem={idx === 0}
                  isLastItem={idx === props.items.length - 1}
                  setItem={setSelectFieldItems}
                  item={item}
                  key={item.value}
                  currentSelection={selectedItems}
                />
              ))
            : null}
        </KeyboardAwareScrollView>
      </BZModal>
    </>
  )
}

const SelectFieldItem = ({
  item,
  setItem,
  currentSelection,
  isFirstItem,
  isLastItem
}: SelectItemsProps) => {
  const initialState = () => {
    const index = currentSelection.findIndex(
      selectedItem => selectedItem.value === item.value
    )

    return index > -1
  }
  const [isChecked, setIsChecked] = useState(initialState())

  function handleSetIsChecked(state: boolean) {
    setIsChecked(state)
    setItem(item, state)
  }

  return (
    <>
      <AppPressable
        onPress={() => handleSetIsChecked(!isChecked)}
        height={44}
        marginTop={isFirstItem ? 0 : 8}
        paddingVertical={12}
        flexDirection="row"
        gap={10}
        alignItems="center">
        <AppCheckBox value={isChecked} />
        <Typography variant="body" color="neutral-600">
          {item.text}
        </Typography>
      </AppPressable>
      {!isLastItem && <Divider />}
    </>
  )
}

const SelectModalFooter = (handleSetSelectField: () => void) => {
  return (
    <Container>
      <Button
        label="Continue"
        variant="secondary"
        marginTop={20}
        onPress={handleSetSelectField}
      />
    </Container>
  )
}

export default MultiSelectField
