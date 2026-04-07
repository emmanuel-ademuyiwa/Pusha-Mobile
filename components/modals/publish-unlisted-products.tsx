import {ProductStatus} from '@baze-sdk/schema'
import {router} from 'expo-router'
import React, {forwardRef, useState} from 'react'

import api from '@/api'
import {BZModal, Banner, Box, Button, Typography} from '@/components/ui'
import {API_STATUS} from '@/constants/ApiConstants'
import {QUERY_KEYS} from '@/constants/queryKeys'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import {Modal} from '@/types/modal'
import {errorHandler} from '@/utils/errorHandler'
import {queryClient} from '@/utils/queryClient'
import toast from '@/utils/toast'

type Props = {
  selectedProducts: string[]
  storeId: string
}

export const PublishUnlistedProductsModal = forwardRef<Modal, Props>(
  (props, ref) => {
    const innerRef = useForwardedRef(ref)
    const [publishApiState, setPublishApiState] = useState<API_STATUS>(
      API_STATUS.IDLE
    )

    const handleBulkPublish = async () => {
      setPublishApiState(API_STATUS.LOADING)
      try {
        await api.products.bulkUpdateProductStatus(props.storeId, {
          products: props.selectedProducts,
          status: ProductStatus.published
        })

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.PRODUCTS],
            type: 'all'
          }),
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.PRODUCT],
            type: 'all'
          })
        ])

        toast.info('Products published successfully.')
        setPublishApiState(API_STATUS.SUCCESS)

        router.replace('/products')
      } catch (err) {
        setPublishApiState(API_STATUS.ERROR)
        errorHandler(err)
      }
    }

    const renderFooter = () => {
      return (
        <Box>
          <Box mt={24}>
            <Banner text="" variant="info" icon="info-fill">
              Products without names or price information will be skipped.
            </Banner>
          </Box>

          <Box flexDirection="row" gap={8} mt={24}>
            <Box flex={1}>
              <Button
                variant="tertiary"
                label="Cancel"
                onPress={() => {
                  if (publishApiState !== API_STATUS.LOADING) {
                    innerRef.current?.dismiss()
                  }
                }}
              />
            </Box>
            <Box flex={1}>
              <Button
                label="Publish products"
                onPress={handleBulkPublish}
                loading={publishApiState === API_STATUS.LOADING}
              />
            </Box>
          </Box>
        </Box>
      )
    }

    return (
      <BZModal
        panDownToClose={!(publishApiState === API_STATUS.LOADING)}
        snapPoints={[350]}
        title="Publish selected products"
        ref={innerRef}
        footer={renderFooter}>
        <Typography color="neutral-600">
          Are you sure you want to publish the selected items. Customers will
          now be able to order these products from your store.
        </Typography>
      </BZModal>
    )
  }
)

PublishUnlistedProductsModal.displayName = 'PublishUnlistedProductsModal'
