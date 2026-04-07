import {Image} from 'expo-image'
import {router} from 'expo-router'
import React, {forwardRef} from 'react'
import {Dimensions} from 'react-native'

import {BZModal, Box, Button, Typography} from '@/components/ui'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import {Modal} from '@/types/modal'

const deleteAccountIllustration = require('@assets/delete-account.png')

const DeleteAccountModal = forwardRef<Modal>((props, ref) => {
  const innerRef = useForwardedRef(ref)

  const windowWidth = Dimensions.get('window').width
  const bannerHeight = (windowWidth - 32) / 2

  const renderFooter = () => (
    <Box>
      <Button
        variant="destructive-1"
        label="Delete account"
        onPress={() => {
          innerRef.current?.dismiss()
          router.navigate('/delete-feedback')
        }}
      />
      <Button
        variant="secondary"
        label="Keep my account"
        marginTop={8}
        onPress={() => innerRef.current?.dismiss()}
      />
    </Box>
  )

  return (
    <BZModal ref={innerRef} snapPoints={[550]} footer={renderFooter}>
      <Box alignItems="center">
        <Image
          source={deleteAccountIllustration}
          accessibilityIgnoresInvertColors
          style={{height: bannerHeight, width: '100%'}}
        />
      </Box>
      <Typography marginTop={24} variant="h2-bold">
        Delete Account
      </Typography>
      <Typography color="neutral-600" mt={8}>
        Are you sure you want to delete your account? This is a permanent
        action. Your personal information, store information and all associated
        data will be deleted, and you will no longer have access to this
        account.
      </Typography>
      <Box paddingBottom={24} paddingHorizontal={4} />
    </BZModal>
  )
})

DeleteAccountModal.displayName = 'DeleteAccountModal'
export default DeleteAccountModal
