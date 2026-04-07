import {Box, Button, BZModal, TextField, Typography} from '@/components/ui'
import BazeIcon from '@/components/ui/baze-icon'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import React, {forwardRef, useEffect, useState} from 'react'
import 'react-native-get-random-values'
import {Alert} from 'react-native'
import uuid from 'react-native-uuid'

import {VariantObject} from '@/modules/products/types'
import {Modal} from '@/types/modal'

const {v4: uuidv4} = uuid

const colorOptions = [
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'Purple',
  'Cyan',
  'Orange',
  'Pink',
  'Magenta',
  'Brown',
  'Black',
  'White',
  'Gray',
  'Lime',
  'Navy',
  'Teal',
  'Olive',
  'Maroon',
  'Silver',
  'Gold'
]

interface CreateVariantProps {
  onAddVariant?: (variant: VariantObject) => void
}

interface EditVariantProps {
  onUpdateVariant: (variant: VariantObject) => void
  edit: true
  variantObject: VariantObject
}

const ProductVariantsModal = forwardRef<
  Modal,
  CreateVariantProps | EditVariantProps
>((props, ref) => {
  const [options, setOptions] = useState([
    {uuid: uuidv4(), name: ''},
    {uuid: uuidv4(), name: ''},
    {uuid: uuidv4(), name: ''}
  ])
  const [variantName, setVariantName] = useState('')
  const innerRef = useForwardedRef(ref)

  useEffect(() => {
    if ('edit' in props && props.edit) {
      setVariantName(props.variantObject?.name || '')
      setOptions([...props.variantObject.options, {uuid: uuidv4(), name: ''}])
    }
  }, [props])

  const handleOnDismiss = () => {
    if ('edit' in props && props.edit) {
      setOptions([...props.variantObject.options, {uuid: uuidv4(), name: ''}])
      setVariantName(props.variantObject.name.trim())
    } else {
      setOptions([{uuid: uuidv4(), name: ''}])
      setVariantName('')
    }
  }

  const setVariant = () => {
    if (!validateFields()) {
      return
    }

    const dataObject = {
      name: variantName.trim(),
      options: options.map(option => {
        return {
          name: option.name.trim(),
          uuid: option.uuid
        }
      })
    }

    // filter out empty options

    dataObject.options = dataObject.options.filter(option => option.name)

    if ('onAddVariant' in props) {
      props.onAddVariant && props.onAddVariant({...dataObject, uuid: uuidv4()})
    }
    if ('onUpdateVariant' in props && 'edit' in props && props.edit) {
      props.onUpdateVariant &&
        props.onUpdateVariant({
          ...dataObject,
          uuid: props.variantObject.uuid
        })
    }
    innerRef.current?.dismiss()
  }

  const validateFields = () => {
    // Validate if the variant name is empty
    if (!variantName.trim()) {
      Alert.alert('Variant error !', 'Please enter a variant name')
      return false
    }

    const validOptions = options.filter(option => !!option.name.trim())
    if (validOptions.length === 0) {
      Alert.alert('Variant error !', 'Please enter at least one variant option')
      return false
    }

    return true
  }

  const handleOptions = (
    value: string,
    uuidKey: string,
    type: 'name' | 'price'
  ) => {
    const idx = options.findIndex(option => option.uuid === uuidKey)

    const updatedOptions = [...options]
    if (type === 'price')
      updatedOptions[idx] = {
        ...updatedOptions[idx]
      }
    if (type === 'name')
      updatedOptions[idx] = {...updatedOptions[idx], name: value}

    setOptions(updatedOptions)

    // Add a new edit field
    if (idx === options.length - 1) {
      setOptions(prevState => [...prevState, {uuid: uuidv4(), name: ''}])
    }
  }

  const deleteOption = (uuidKey: string) => {
    const updatedOptions = options.filter(option => option.uuid !== uuidKey)
    setOptions(updatedOptions)
  }

  const renderFooter = () => (
    <Box flexDirection="row" gap={8} alignItems="center">
      <Box flex={1}>
        <Button
          label="Cancel"
          variant="tertiary"
          onPress={innerRef.current?.dismiss}
        />
      </Box>
      <Box flex={1}>
        <Button label="Save" onPress={setVariant} />
      </Box>
    </Box>
  )

  return (
    <BZModal
      ref={innerRef}
      footerDivider
      onDismiss={handleOnDismiss}
      title="Add a product variant"
      snapPoints={['90%']}
      header={
        <TextField
          label="Variant name"
          name="Variant name"
          placeholder="e.g. Color"
          value={variantName}
          onChangeText={e => setVariantName(e)}
        />
      }
      headerDivider
      footer={renderFooter}>
      <Typography variant="c1-bold" mt={20}>
        Add options{' '}
        <Typography color="neutral-600">
          (1 variant option per field)
        </Typography>
      </Typography>

      {options.map((option, idx) => {
        return (
          <Box
            flexDirection="row"
            gap={8}
            alignItems="center"
            mt={16}
            key={option.uuid}>
            <Box flex={1}>
              <TextField
                name="Variant Option"
                placeholder={'e.g. ' + colorOptions[idx]}
                value={option.name}
                onChangeText={value =>
                  handleOptions(value, option.uuid, 'name')
                }
              />
            </Box>

            <Box>
              <Button
                disabled={options.length === 1}
                iconButton
                iconSize="sm"
                variant="secondary"
                Icon={<BazeIcon name="minus" color="white" size={16} />}
                onPress={() => {
                  deleteOption(option.uuid)
                }}
              />
            </Box>
          </Box>
        )
      })}
    </BZModal>
  )
})

ProductVariantsModal.displayName = 'ProductVariantsModal'
export default ProductVariantsModal
