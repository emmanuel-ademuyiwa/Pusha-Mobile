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
import {useProductActions} from '@/store/productStore'
import {Modal} from '@/types/modal'

const ProductModal = forwardRef<Modal>((props, ref) => {
  const innerRef = useForwardedRef(ref)
  const productActions = useProductActions()

  const handleSingleProduct = () => {
    innerRef.current?.close()
    productActions.resetProductStore()
    router.navigate('/create-product')
  }

  const handleMultipleProducts = () => {
    innerRef.current?.close()
    router.navigate('/upload-multiple-products')
  }

  return (
    <BZModal ref={innerRef} title="Add Product" snapPoints={[250]}>
      <BZPressable onPress={() => handleSingleProduct()}>
        <Box height={44} flexDirection="row" gap={8} alignItems="center">
          <BazeIcon name="add-product" size={20} color="#798390" />
          <Typography variant="body" color="neutral-600">
            Add single product
          </Typography>
        </Box>
        <Divider />
      </BZPressable>
      <BZPressable onPress={() => handleMultipleProducts()} marginTop={8}>
        <Box height={44} flexDirection="row" gap={8} alignItems="center">
          <BazeIcon name="upload" size={20} color="#798390" />
          <Typography variant="body" color="neutral-600">
            Upload multiple products
          </Typography>
        </Box>
      </BZPressable>
    </BZModal>
  )
})

ProductModal.displayName = 'ProductModal'
export default ProductModal
