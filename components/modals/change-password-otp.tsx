import {router} from 'expo-router'
import React, {forwardRef} from 'react'

import {BZModal, Button, Typography} from '@/components/ui'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import {useAuthActions, useAuthLoadingState} from '@/store/authStore'
import {Modal} from '@/types/modal'
import {errorHandler} from '@/utils/errorHandler'

export const ChangePasswordOTPModal = forwardRef<Modal>((props, ref) => {
  const innerRef = useForwardedRef(ref)
  const authActions = useAuthActions()
  const authLoadingState = useAuthLoadingState()

  const renderFooter = () => (
    <Button
      variant="secondary"
      label="Send OTP"
      loading={authLoadingState.requestPasswordChange}
      onPress={handlePasswordChange}
    />
  )

  const handlePasswordChange = async () => {
    try {
      await authActions.requestPasswordChange()
      innerRef.current?.dismiss()
      router.navigate('/change-password-otp')
    } catch (err) {
      errorHandler(err)
    }
  }
  return (
    <BZModal
      panDownToClose={!authLoadingState.requestPasswordChange}
      ref={innerRef}
      snapPoints={[250]}
      title="Change password?"
      footer={renderFooter}>
      <Typography color="neutral-600">
        We will send you an OTP to confirm you want to take this action.
      </Typography>
    </BZModal>
  )
})

ChangePasswordOTPModal.displayName = 'ChangePasswordOTPModal'
