import React, {forwardRef} from 'react'
import {Linking} from 'react-native'

import {
  BZModal,
  Banner,
  Box,
  Button,
  TextAction,
  Typography
} from '@/components/ui'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import {Modal} from '@/types/modal'

export const BusinessAccountInfoModal = forwardRef<Modal>((props, ref) => {
  const innerRef = useForwardedRef(ref)

  const renderFooter = () => {
    return (
      <Box>
        <Box>
          <Banner text="" variant="info" icon="info-fill">
            The profile name on your account has to match with the name of one
            of the directors on your CAC documents.
          </Banner>
        </Box>
        <Button
          marginTop={12}
          variant="secondary"
          label="Got it!"
          onPress={() => innerRef.current?.dismiss()}
        />
      </Box>
    )
  }

  return (
    <BZModal
      snapPoints={[500]}
      ref={innerRef}
      title="Link business account"
      footer={renderFooter}>
      <Box>
        <Typography color="neutral-600">
          Want to link your business account instead? Please email us at
          <TextAction
            onPress={() => Linking.openURL(`mailto:support@trybaze.com`)}>
            {' '}
            support@trybaze.com
          </TextAction>{' '}
          with the following documents and we’ll set it up for you.
        </Typography>

        <Box flexDirection="row" gap={8} mt={24}>
          <Typography variant="body-medium" color="neutral-600">
            •
          </Typography>
          <Typography variant="body-medium" color="neutral-600">
            Bank account details.
          </Typography>
        </Box>
        <Box flexDirection="row" gap={8} mt={8}>
          <Typography variant="body-medium" color="neutral-600">
            •
          </Typography>
          <Typography variant="body-medium" color="neutral-600">
            CAC Certificate.
          </Typography>
        </Box>
        <Box flexDirection="row" gap={8} mt={8}>
          <Typography variant="body-medium" color="neutral-600">
            •
          </Typography>
          <Typography variant="body-medium" color="neutral-600">
            Valid ID card of business owner or registered director.
          </Typography>
        </Box>
        <Box flexDirection="row" gap={8} mt={8}>
          <Typography variant="body-medium" color="neutral-600">
            •
          </Typography>
          <Typography variant="body-medium" color="neutral-600">
            Your email should expressly request us to add this bank account as
            your settlement account.
          </Typography>
        </Box>
      </Box>
    </BZModal>
  )
})

BusinessAccountInfoModal.displayName = 'BusinessAccountInfoModal'
