import {IProduct, IUpdateProductPayload} from '@baze-sdk/schema'
import {useQueryClient} from '@tanstack/react-query'
import React, {forwardRef, useEffect, useState} from 'react'
import {Alert} from 'react-native'

import {QuantityObject} from '../../modules/products/types'

import api from '@/api'
import {Box, Button, BZModal, TextField, Typography} from '@/components/ui'
import {API_STATUS} from '@/constants/ApiConstants'
import {QUERY_KEYS} from '@/constants/queryKeys'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import {Modal} from '@/types/modal'
import {errorHandler} from '@/utils/errorHandler'
import toast from '@/utils/toast'

interface InventoryModalProps {
  product: IProduct
  productId: string
}

const InventoryModal = forwardRef<Modal, InventoryModalProps>((props, ref) => {
  const innerRef = useForwardedRef(ref)
  const queryClient = useQueryClient()
  const isProductWithVariants =
    props.product.variantConfig &&
    props.product.variantConfig.quantityAndPrice.length > 0
  const [singleProductQuantity, setSingleProductQuantity] =
    useState<string>('0')
  const [variantProductQuantity, setVariantProductQuantity] = useState<
    QuantityObject[]
  >([])
  const [isUpdating, setIsUpdating] = useState<API_STATUS>(API_STATUS.IDLE)

  useEffect(() => {
    setInventory()
  }, [])

  const setInventory = () => {
    if (isProductWithVariants) {
      setVariantProductQuantity(
        props.product.variantConfig.quantityAndPrice.map(p => ({
          ...p,
          quantity: String(p.quantity),
          price: String(p.price),
          uuid: p.uuid
        }))
      )
    } else {
      setSingleProductQuantity(String(props.product.quantity))
    }
  }

  const handleQuantityUpdate = (val: string) => {
    if (!isProductWithVariants) {
      setSingleProductQuantity(String(Number(val.replace(/[^0-9]/g, ''))))
    }
  }

  function getOptionNameByVariantAndOptionId(
    variantId: string,
    optionId: string
  ): string | null {
    for (const variant of props.product.variantConfig.variants.config) {
      if (variant.uuid === variantId) {
        const option = variant.options.find(o => o.uuid === optionId)
        return option ? option.name : null
      }
    }
    return null // Return null if no matching variant or option is found
  }

  const updateVariantQuantityAndPrice = (uuid: string, value: string) => {
    setVariantProductQuantity(prevQty => {
      return prevQty.map(qty => {
        return qty.uuid === uuid
          ? {...qty, quantity: String(Number(value.replace(/[^0-9]/g, '')))}
          : qty
      })
    })
  }

  const validateQuantityFields = () => {
    if (isProductWithVariants) {
      const allQtyValid = variantProductQuantity.every(
        item => !isNaN(Number(item.quantity))
      )

      if (!allQtyValid) {
        Alert.alert(
          'Invalid Quantities',
          'Please ensure all quantity fields are valid'
        )
        return false
      }

      return true
    } else {
      if (isNaN(Number(singleProductQuantity))) {
        Alert.alert('Invalid Quantity', 'Please enter a valid quantity')
        return false
      }

      return true
    }
  }

  const handleInventoryUpdate = async () => {
    if (!validateQuantityFields()) {
      return
    }

    setIsUpdating(API_STATUS.LOADING)

    const {
      store,
      name,
      price,
      quantity,
      status,
      description,
      images,
      variantConfig
    } = props.product
    const payload: IUpdateProductPayload = {
      store,
      name,
      price,
      quantity,
      status,
      description,
      images,
      variantConfig
    }

    if (isProductWithVariants && payload.variantConfig) {
      payload.variantConfig.quantityAndPrice = variantProductQuantity.map(
        qty => ({
          ...qty,
          quantity: Number(qty.quantity),
          price: Number(qty.price)
        })
      )
    } else {
      payload.quantity = Number(singleProductQuantity)
    }

    try {
      await api.products.updateProduct(props.productId, payload)
      toast.info('Product inventory updated successfully')
      queryClient
        .invalidateQueries({
          queryKey: [QUERY_KEYS.PRODUCT, props.productId]
        })
        .then()
      queryClient
        .invalidateQueries({
          queryKey: [QUERY_KEYS.PRODUCTS]
        })
        .then()
      setIsUpdating(API_STATUS.SUCCESS)
      innerRef.current?.dismiss()
    } catch (err) {
      setIsUpdating(API_STATUS.ERROR)
      errorHandler(err)
      toast.error('Failed to update product quantity')
    }
  }

  const renderFooter = () => (
    <Box flexDirection="row" gap={8} alignItems="center">
      <Box flex={1}>
        <Button
          label="Cancel"
          variant="tertiary"
          disabled={isUpdating === API_STATUS.LOADING}
          onPress={() => {
            if (isUpdating !== API_STATUS.LOADING) {
              innerRef.current?.dismiss()
            }
          }}
        />
      </Box>
      <Box flex={1}>
        <Button
          label="Save"
          onPress={handleInventoryUpdate}
          loading={isUpdating === API_STATUS.LOADING}
        />
      </Box>
    </Box>
  )

  return (
    <BZModal
      ref={innerRef}
      footerDivider
      title="Manage Inventory"
      snapPoints={isProductWithVariants ? ['50%'] : [500]}
      onDismiss={setInventory}
      panDownToClose={isUpdating !== API_STATUS.LOADING}
      footer={renderFooter}>
      {isProductWithVariants ? (
        <Box flex={1}>
          {variantProductQuantity.length > 0 && (
            <Box
              gap={12}
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between">
              <Box>
                <Typography variant="c1-bold">Variant</Typography>
              </Box>
              <Box width={96}>
                <Typography variant="c1-bold">Quantity</Typography>
              </Box>
            </Box>
          )}

          {variantProductQuantity.map(qty => (
            <Box
              key={qty.uuid}
              marginTop={12}
              flexDirection="row"
              gap={12}
              alignItems="center"
              justifyContent="space-between">
              <Box>
                <Typography variant="c1-medium" color="neutral-600">
                  {qty.options
                    .map(option => {
                      return getOptionNameByVariantAndOptionId(
                        option.variant,
                        option.option
                      )
                    })
                    .join(' / ')}
                </Typography>
              </Box>
              <Box width={96}>
                <TextField
                  keyboardType="number-pad"
                  name="Qty"
                  value={qty.quantity.toString()}
                  readOnly={isUpdating === API_STATUS.LOADING}
                  onChangeText={val => {
                    updateVariantQuantityAndPrice(qty.uuid, val)
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Box mt={24}>
          <TextField
            name="Quantity"
            label="Quantity"
            suffix="PCS"
            value={singleProductQuantity}
            onChangeText={val => handleQuantityUpdate(val)}
            keyboardType="number-pad"
            readOnly={isUpdating === API_STATUS.LOADING}
          />
        </Box>
      )}
    </BZModal>
  )
})

InventoryModal.displayName = 'InventoryModal'
export default InventoryModal
