import {router} from 'expo-router'
import React, {forwardRef} from 'react'

import {
  BazeIcon,
  Box,
  BZModal,
  BZPressable,
  Divider,
  Typography
} from '@/components/ui'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import {Modal} from '@/types/modal'

const CustomerModal = forwardRef<Modal>((props, ref) => {
  const innerRef = useForwardedRef(ref)

  const handleSingleCustomer = () => {
    innerRef.current?.close()
    router.navigate('/create-customer')
  }

  const handleMultipleCustomers = () => {
    innerRef.current?.close()
    router.navigate('/upload-multiple-customers')
  }

  return (
    <BZModal ref={innerRef} title="Add Customer" snapPoints={[250]}>
      <BZPressable onPress={() => handleSingleCustomer()}>
        <Box height={44} flexDirection="row" gap={8} alignItems="center">
          <BazeIcon name="add-customer" size={20} color="#798390" />
          <Typography variant="body" color="neutral-600">
            Add single customer
          </Typography>
        </Box>
        <Divider />
      </BZPressable>
      <BZPressable onPress={() => handleMultipleCustomers()} marginTop={8}>
        <Box height={44} flexDirection="row" gap={8} alignItems="center">
          <BazeIcon name="upload" size={20} color="#798390" />
          <Typography variant="body" color="neutral-600">
            Upload multiple customers
          </Typography>
        </Box>
      </BZPressable>
    </BZModal>
  )
})

CustomerModal.displayName = 'CustomerModal'
export default CustomerModal
