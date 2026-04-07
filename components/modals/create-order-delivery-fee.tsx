import { IStoreShippingFee } from '@baze-sdk/schema'
import React, { forwardRef, useEffect, useState } from 'react'

import {
  ICreateOrderDeliveryFeeType,
  ICreateOrderShippingFees
} from '../../modules/orders/types'

import { BZModal, BZPressable, Box, Button, Typography } from '@/components/ui'
import { useForwardedRef } from '@/hooks/useForwardedRef'
import { Modal } from '@/types/modal'
import { formatCurrency } from '@/utils/currency'

const CreateOrderDeliveryFee = forwardRef<
  Modal,
  {
    currentFee: ICreateOrderShippingFees
    setFee: (e: ICreateOrderShippingFees) => void
    storeShippingFees: IStoreShippingFee[]
    onCustomFeePress: () => void
  }
>((props, ref) => {
  const innerRef = useForwardedRef(ref)

  const handleFeeSelection = (e: ICreateOrderShippingFees) => {
    props.setFee(e)
    innerRef.current?.dismiss()
  }

  const renderFooter = () => (
    <Box>
      <Button
        variant="tertiary"
        label="Add custom fee"
        marginTop={8}
        onPress={props.onCustomFeePress}
      />
    </Box>
  )

  return (
    <BZModal
      headerDivider
      title="Select delivery fee"
      ref={innerRef}
      snapPoints={['80%']}
      footer={renderFooter}>
      <Box flex={1} mb={56}>
        {props.storeShippingFees.map(e => {
          return (
            <DeliveryFeeItem
              key={e._id}
              fee={e}
              selectedFee={props.currentFee}
              onSelect={handleFeeSelection}
            />
          )
        })}
      </Box>
    </BZModal>
  )
})

const DeliveryFeeItem = (props: {
  fee: IStoreShippingFee
  selectedFee: ICreateOrderShippingFees | undefined
  onSelect: (option: ICreateOrderShippingFees) => void
}) => {
  const [isSelected, setIsSelected] = useState(false)

  useEffect(() => {
    setIsSelected(props.selectedFee?.id === props.fee._id)
  }, [props.selectedFee])

  return (
    <BZPressable
      marginTop={16}
      onPress={() =>
        props.onSelect({
          type: ICreateOrderDeliveryFeeType.Store,
          amount: props.fee.amount.toString(),
          id: props.fee._id
        })
      }>
      <Box flexDirection="row" gap={8} pb={16}>
        {/* Radio Select */}
        <Box
          borderRadius={20}
          borderWidth={isSelected ? 6 : 3}
          borderColor={isSelected ? 'primary-100' : 'neutral-400'}
          width={20}
          height={20}
        />

        {/* Address details */}
        <Box
          flexDirection="row"
          justifyContent="space-between"
          gap={8}
          flex={1}>
          <Box justifyContent="space-between" gap={4} width={220}>
            <Typography variant="body-medium" numberOfLines={1}>
              {props.fee.name}
            </Typography>
            <Typography
              variant="c1"
              color="neutral-500"
              numberOfLines={1}
              mt={4}>
              {props.fee.description}
            </Typography>
          </Box>

          {/* Delivery price */}
          <Box flex={1} flexDirection="row" justifyContent="flex-end">
            <Typography variant="c1-medium">
              {formatCurrency(props.fee.amount, 'comma')}
            </Typography>
          </Box>
        </Box>
      </Box>
    </BZPressable>
  )
}

CreateOrderDeliveryFee.displayName = 'CreateOrderDeliveryFee'
export default CreateOrderDeliveryFee
