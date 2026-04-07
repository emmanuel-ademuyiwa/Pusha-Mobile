import Fuse from 'fuse.js'
import React, {ReactNode, useEffect, useMemo, useRef, useState} from 'react'
import {
  ActivityIndicator,
  ImageSourcePropType,
  Keyboard,
  Platform
} from 'react-native'
import {Gesture, GestureDetector} from 'react-native-gesture-handler'
import uuid from 'react-native-uuid'

import AppIcon from '../app-icon'
import Box from '../box'
import Divider from '../divider'
import AppModal from '../modal'
import AppPressable from '../pressable'
import TextField, {TextFieldProps} from '../text-field'
import Typography from '../typography'

import {KeyboardAwareScrollView} from '@/components/util/keyboard-aware-scroll-view'
import {Modal} from '@/types/modal'
import {Image} from 'expo-image'

type SelectItem = {
  text: string
  value: string
  imgUrl?: string
  code?: string
  img?: ImageSourcePropType
}
export type SelectItems = SelectItem[]

interface SelectFieldProps extends Omit<TextFieldProps, 'margin'> {
  items: SelectItems
  disabled?: boolean
  placeholder?: string
  onChangeItem?: (item: SelectItem) => void
  onChangeValue?: (value: string) => void
  value?: string
  marginTop?: number
  marginBottom?: number
  marginLeft?: number
  marginRight?: number
  marginVertical?: number
  marginHorizontal?: number
  marginEnd?: number
  marginStart?: number
  loading?: boolean
  footer?: ReactNode
  snapPoints?: string[] | number[]
  search?: boolean
  isToShowValue?: boolean
  isToShowImg?: boolean
}

interface SelectItemsProps {
  item: SelectItem
  setItem: (item: SelectItem) => void
  currentSelection: string | undefined
  hasDivider: boolean
}

export const SelectField = (props: SelectFieldProps) => {
  const selectFieldModalRef = useRef<Modal>(null)
  const [selectedItem, setSelectedItem] = useState<string>('')
  const [searchResults, setSearchResults] = useState<SelectItem[]>(
    props.items ?? []
  )

  const {search = true} = props

  const snapPoints = useMemo(
    () => props.snapPoints || ['85%'],
    [props.snapPoints]
  )

  const fuse = new Fuse(props.items, {
    keys: [`text`]
  })

  const handleSearch = (searchText: string) => {
    if (searchText.length === 0) {
      setSearchResults(props.items)
      return
    }

    setSearchResults(fuse.search(searchText).map(i => i.item))
  }

  useEffect(() => {
    setSearchResults(props.items ?? [])
  }, [props.items])

  useEffect(() => {
    if (props.value) {
      const item = props.items.find(i => i.value === props.value)
      setSelectedItem(item?.value ?? '')
    }
  }, [props.value])

  const handleSetSelectField = (item: SelectItem) => {
    setSelectedItem(item.value)

    // Returns the selected Item Object
    if (props.onChangeItem) props.onChangeItem(item)
    // Returned the Selected Item Value
    if (props.onChangeValue) props.onChangeValue(item.value)

    selectFieldModalRef.current?.dismiss()
  }

  const handleOnPress = () => {
    if (props.loading) return
    // Dismiss any active keyboard
    Keyboard.dismiss()
    return props.disabled ? null : selectFieldModalRef.current?.present()
  }

  const getTextByValue = (value: string) => {
    const item = searchResults.find(j => j.value === value)
    return props?.isToShowValue ? item?.code : item?.text
  }
  const getImgByValue = (value: string) => {
    const item = searchResults.find(j => j.value === value)
    return props?.isToShowImg ? item?.img : item?.text
  }

  const tap = Gesture.Tap().onStart(handleOnPress).runOnJS(true)

  return (
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
      {props.isToShowImg ? (
        <AppPressable onPress={handleOnPress}>
          <Box
            width={76}
            height={48}
            flexDirection="row"
            gap={12}
            px={12}
            bg="white"
            alignItems="center"
            justifyContent="space-between"
            borderWidth={1}
            borderColor="gray-200"
            borderRadius={16}>
            <Image
              source={getImgByValue(selectedItem)}
              style={{width: 24, height: 16}}
            />
            <AppIcon name="dropdown" size={20} color="#45505F" />
          </Box>
        </AppPressable>
      ) : (
        <>
          {Platform.OS === 'android' && (
            <TextField
              onPress={handleOnPress}
              label={props.label}
              name={props.name}
              disabled={props.disabled}
              readOnly
              // suffixMarginLeft={0}
              value={getTextByValue(selectedItem)}
              placeholder={props.placeholder}
              icon={
                <AppIcon
                  name="ChevronDown"
                  size={20}
                  color={props.disabled ? '#9FB6EF' : '#77839E'}
                />
              }
            />
          )}
          {Platform.OS === 'ios' && (
            <GestureDetector gesture={tap}>
              <Box collapsable={false}>
                <TextField
                  // suffixMarginLeft={0}
                  label={props.label}
                  name={props.name}
                  disabled={props.disabled}
                  readOnly
                  value={getTextByValue(selectedItem)}
                  placeholder={props.placeholder}
                  icon={
                    props.loading ? (
                      <ActivityIndicator size="small" color="#798390" />
                    ) : (
                      <AppIcon
                        name="dropdown"
                        size={20}
                        color={props.disabled ? '#9FB6EF' : '#45505F'}
                      />
                    )
                  }
                />
              </Box>
            </GestureDetector>
          )}
        </>
      )}

      <AppModal
        title={props.label || props.placeholder}
        onDismiss={() => setSearchResults(props.items)}
        footer={props.footer ? () => props.footer : undefined}
        header={
          search && (
            <TextField
              name={`Search ${props.name}`}
              onChangeText={handleSearch}
              icon={<AppIcon name="search" size={20} color="#798390" />}
              placeholder={`Search ${props.name}`}
            />
          )
        }
        ref={selectFieldModalRef}
        snapPoints={snapPoints ?? ['85%']}>
        <Box flex={1}>
          <KeyboardAwareScrollView>
            {searchResults.length
              ? searchResults.map((item, idx) => (
                  <Box key={uuid.v4()} mt={idx === 0 ? 0 : 8}>
                    <SelectFieldItem
                      setItem={handleSetSelectField}
                      item={item}
                      currentSelection={selectedItem}
                      hasDivider={idx !== searchResults.length - 1}
                    />
                  </Box>
                ))
              : null}
          </KeyboardAwareScrollView>
        </Box>
      </AppModal>
    </Box>
  )
}

const SelectFieldItem = ({
  item,
  setItem,
  currentSelection,
  hasDivider
}: SelectItemsProps) => {
  return (
    <AppPressable onPress={() => setItem(item)}>
      <Box
        height={44}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center">
        <Typography variant="body" color="neutral-600">
          {item.text}
        </Typography>
        {currentSelection === item.value ? (
          <AppIcon name="check" size={20} color="#F8C426" />
        ) : null}
      </Box>
      {hasDivider && <Divider />}
    </AppPressable>
  )
}

export default SelectField
