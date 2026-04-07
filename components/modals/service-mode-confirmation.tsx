import {StoreStatus} from '@baze-sdk/schema'
import React, {forwardRef} from 'react'

import {BZModal, Box, Button, Typography} from '@/components/ui'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import {Modal} from '@/types/modal'

type Props = {
  setServiceMode: (value: boolean) => void
  setPreviewStoreStatus: (value: StoreStatus) => void
}

export const ServiceModeConfirmationModal = forwardRef<Modal, Props>(
  (props, ref) => {
    const innerRef = useForwardedRef(ref)

    const renderFooter = () => (
      <Box flexDirection="row" gap={8}>
        <Box flex={1}>
          <Button
            variant="tertiary"
            label="Cancel"
            onPress={() => {
              props.setServiceMode(false)
              props.setPreviewStoreStatus(StoreStatus.live)
              innerRef.current?.close()
            }}
          />
        </Box>
        <Box flex={1}>
          <Button
            variant="destructive-1"
            label="Proceed"
            onPress={() => {
              props.setServiceMode(true)
              props.setPreviewStoreStatus(StoreStatus.maintenance)

              setTimeout(() => {
                innerRef.current?.close()
              }, 250)
            }}
          />
        </Box>
      </Box>
    )

    return (
      <BZModal
        title="Service mode"
        footer={renderFooter}
        ref={innerRef}
        snapPoints={[300]}>
        <Box mt={8}>
          <Typography color="neutral-600">
            Are you sure you want to turn on Service mode? Customers will not be
            able to access your store again until you put it back online. To
            continue, click on the proceed and then save changes.
          </Typography>
        </Box>
      </BZModal>
    )
  }
)

ServiceModeConfirmationModal.displayName = 'ServiceModeConfirmationModal'
