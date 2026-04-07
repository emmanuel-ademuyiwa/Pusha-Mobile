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

export const ArchiveUnlistedProductsModal = forwardRef<Modal, Props>(
  (props, ref) => {
    const innerRef = useForwardedRef(ref)
    const [archiveApiState, setArchiveApiState] = useState<API_STATUS>(
      API_STATUS.IDLE
    )

    const handleBulkArchive = async () => {
      setArchiveApiState(API_STATUS.LOADING)

      try {
        await api.products.bulkUpdateProductStatus(props.storeId, {
          products: props.selectedProducts,
          status: ProductStatus.archived
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

        toast.info('Products archived.')
        setArchiveApiState(API_STATUS.SUCCESS)

        router.replace('/products')
      } catch (err) {
        setArchiveApiState(API_STATUS.ERROR)
        errorHandler(err)
      }
    }

    const renderFooter = () => {
      return (
        <Box>
          <Box>
            <Banner text="" variant="warning" icon="info-fill">
              To retrieve these products, you would need to message our support
              team.
            </Banner>
          </Box>
          <Box flexDirection="row" gap={8} mt={24}>
            <Box flex={1}>
              <Button
                variant="tertiary"
                label="Cancel"
                onPress={() => {
                  if (archiveApiState !== API_STATUS.LOADING) {
                    innerRef.current?.dismiss()
                  }
                }}
              />
            </Box>
            <Box flex={1}>
              <Button
                loading={archiveApiState === API_STATUS.LOADING}
                variant="secondary"
                label="Archive products"
                onPress={handleBulkArchive}
              />
            </Box>
          </Box>
        </Box>
      )
    }

    return (
      <BZModal
        panDownToClose={!(archiveApiState === API_STATUS.LOADING)}
        snapPoints={[320]}
        title="Archive selected products"
        ref={innerRef}
        footer={renderFooter}>
        <Typography color="neutral-600">
          Are you sure you want to archive the selected items. These products
          will no longer be on your Baze account.
        </Typography>
      </BZModal>
    )
  }
)

ArchiveUnlistedProductsModal.displayName = 'ArchiveUnlistedProductsModal'
