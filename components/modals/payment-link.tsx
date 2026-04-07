import {router} from 'expo-router'
import React, {forwardRef} from 'react'
import {Share} from 'react-native'

import {
  BazeIcon,
  Box,
  Button,
  BZModal,
  TextAction,
  Typography
} from '@/components/ui'
import {STORE_DOMAIN} from '@/constants'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import {useSubdomain} from '@/store/storeStore'
import {Modal} from '@/types/modal'

interface PaymentLinkModalProps {
  orderRef: string
}

const PaymentLinkModal = forwardRef<Modal, PaymentLinkModalProps>(
  (props, ref) => {
    const innerRef = useForwardedRef(ref)
    const subdomain = useSubdomain()

    const shareLink = async () => {
      try {
        await Share.share({
          message: `https://${subdomain.name}${STORE_DOMAIN}/orders/${props.orderRef}`
        })
      } catch (error: any) {
        console.warn(error.message)
      }
    }

    const renderFooter = () => (
      <Box>
        <Button
          variant="secondary"
          label="Share link"
          onPress={() => shareLink()}
        />
        <Box mt={24}>
          <TextAction
            textAlign="center"
            onPress={() => router.replace('/orders')}>
            Dismiss
          </TextAction>
        </Box>
      </Box>
    )

    return (
      <BZModal
        ref={innerRef}
        snapPoints={[400]}
        footer={renderFooter}
        onDismiss={() => router.replace('/orders')}>
        <Box alignItems="center">
          <Box
            bg="success-200"
            p={12}
            borderRadius={12}
            width={48}
            height={48}
            alignItems="center"
            justifyContent="center">
            <BazeIcon name="money" size={24} color="#20B038" />
          </Box>
          <Typography variant="h2-bold" textAlign="center" mt={16}>
            Payment link
          </Typography>
          <Typography textAlign="center" color="neutral-600" mt={8}>
            Share this link with your customer for them to complete their order.
            They can view the order summary and also make payment.
          </Typography>
        </Box>
      </BZModal>
    )
  }
)

PaymentLinkModal.displayName = 'PaymentLinkModal'
export default PaymentLinkModal
