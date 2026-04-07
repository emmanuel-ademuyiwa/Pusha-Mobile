import {IProduct, IUpdateProductPayload, ProductStatus} from '@baze-sdk/schema'
import {useQueryClient} from '@tanstack/react-query'
import React, {forwardRef, useState} from 'react'

import api from '@/api'
import {Box, Button, BZModal, Typography} from '@/components/ui'
import {API_STATUS} from '@/constants/ApiConstants'
import {QUERY_KEYS} from '@/constants/queryKeys'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import {Modal} from '@/types/modal'
import {errorHandler} from '@/utils/errorHandler'
import toast from '@/utils/toast'

interface PublishProductModalProps {
  product: IProduct
  productId: string
}

const PublishProductModal = forwardRef<Modal, PublishProductModalProps>(
  (props, ref) => {
    const innerRef = useForwardedRef(ref)
    const queryClient = useQueryClient()

    const [isUpdating, setIsUpdating] = useState<API_STATUS>(API_STATUS.IDLE)

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

    const handleStatusUpdate = async () => {
      setIsUpdating(API_STATUS.LOADING)

      const payload: IUpdateProductPayload = {
        store,
        name,
        price,
        quantity,
        description,
        images: images?.length > 0 ? images : undefined,
        variantConfig,
        status:
          status === 'published'
            ? ProductStatus.shelved
            : ProductStatus.published
      }

      try {
        await api.products.updateProduct(props.productId, payload)

        toast.info(
          status === 'published'
            ? 'Product unlisted'
            : 'Product published successfully'
        )
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.PRODUCT, props.productId]
          }),
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.PRODUCTS]
          })
        ])

        innerRef.current?.dismiss()
      } catch (err) {
        errorHandler(err)

        toast.error('Failed to update product status')
      } finally {
        setIsUpdating(API_STATUS.IDLE)
      }
    }

    const renderFooter = () => (
      <Box>
        <Button
          variant={status === 'published' ? 'secondary' : 'primary'}
          label={status === 'published' ? 'Unlist product' : 'Publish product'}
          onPress={handleStatusUpdate}
          loading={isUpdating === API_STATUS.LOADING}
        />
      </Box>
    )

    return (
      <BZModal
        panDownToClose={isUpdating !== API_STATUS.LOADING}
        ref={innerRef}
        title={status === 'published' ? 'Unlist product' : 'Publish product'}
        snapPoints={[250]}
        footer={renderFooter}>
        {status === 'published' ? (
          <Typography color="neutral-600">
            Are you sure you want to unlist this product? It will no longer be
            available on your online store.
          </Typography>
        ) : (
          <Typography color="neutral-600">
            Are you sure you want to publish this product? Customers will now be
            able to order it from your store.
          </Typography>
        )}
      </BZModal>
    )
  }
)

PublishProductModal.displayName = 'PublishProductModal'
export default PublishProductModal
