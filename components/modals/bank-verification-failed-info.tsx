import React, {forwardRef} from 'react'

import {BZModal, Box, Button, Typography} from '@/components/ui'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import {Modal} from '@/types/modal'

export const BankVerificationFailedInfoModal = forwardRef<Modal>(
  (props, ref) => {
    const innerRef = useForwardedRef(ref)

    const renderFooter = () => (
      <Box>
        <Button
          label="Close"
          variant="secondary"
          onPress={() => innerRef.current?.dismiss()}
        />
      </Box>
    )

    return (
      <BZModal
        title="Bank account verification failed"
        footer={renderFooter}
        ref={innerRef}
        snapPoints={[350]}>
        <Typography variant="body" color="neutral-600">
          This could be because the name you signed up with does not match the
          name on your BVN. {'\n'} {'\n'} Please confirm your name and update it
          under your profile settings, then try again.
          {'\n'} {'\n'} If this persists, please reach out to us.
        </Typography>
      </BZModal>
    )
  }
)

BankVerificationFailedInfoModal.displayName = 'BankVerificationFailedInfoModal'
