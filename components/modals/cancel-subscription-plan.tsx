import {Image} from 'expo-image'
import {router} from 'expo-router'
import React, {forwardRef} from 'react'
import {Dimensions} from 'react-native'

import {BZModal, Box, Button, Typography} from '@/components/ui'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import {Modal} from '@/types/modal'

const cancelSubscriptionIllustration = require('@assets/delete-account.png')

const CancelSubscriptionModal = forwardRef<Modal>((props, ref) => {
  const innerRef = useForwardedRef(ref)

  const windowWidth = Dimensions.get('window').width
  const bannerHeight = (windowWidth - 32) / 2

  const renderFooter = () => (
    <Box>
      <Button
        variant="destructive-1"
        label="Cancel subscription"
        onPress={() => {
          innerRef.current?.dismiss()
          router.navigate('/cancel-subscription-feedback')
        }}
      />
      <Button
        variant="secondary"
        label="I don’t want to cancel"
        marginTop={8}
        onPress={() => innerRef.current?.dismiss()}
      />
    </Box>
  )

  return (
    <BZModal ref={innerRef} snapPoints={[550]} footer={renderFooter}>
      <Box alignItems="center">
        <Image
          source={cancelSubscriptionIllustration}
          accessibilityIgnoresInvertColors
          style={{height: bannerHeight, width: '100%'}}
        />
      </Box>
      <Typography marginTop={24} variant="h2-bold">
        Cancel subscription plan
      </Typography>
      <Typography color="neutral-600" mt={8}>
        Are you sure you want to cancel your plan?
      </Typography>
      <Typography color="neutral-600" mt={24}>
        We will have to take your store offline, and you won’t be able to use
        Baze to manage orders & talk to customers after the end of your billing
        period.
      </Typography>
      <Box paddingBottom={24} paddingHorizontal={4} />
    </BZModal>
  )
})

CancelSubscriptionModal.displayName = 'CancelSubscriptionModal'
export default CancelSubscriptionModal
