import {router} from 'expo-router'
import React from 'react'
import SuccessCheck from '../svgs/success-check'
import {Box, Button, Typography} from '../ui'
import CenterdModal from '../ui/centerd-modal'

const ResetPasscodeSuccessModal = ({
  show,
  onClose
}: {
  show: boolean
  onClose: () => void
}) => {
  return (
    <CenterdModal visible={show} onClose={onClose}>
      <Box alignItems="center" width={'100%'}>
        <SuccessCheck />
        <Typography
          variant="h1-bold"
          color="secondary-500"
          fontSize={22}
          lineHeight={33}>
          Success
        </Typography>
        <Typography
          my={16}
          textAlign="center"
          color="neutral-800"
          variant="body">
          Your new password have been created already
        </Typography>

        <Box mt={16} width={'100%'}>
          <Button
            label="Continue to Login"
            onPress={() => router.replace('/login')}
          />
        </Box>
      </Box>
    </CenterdModal>
  )
}

export default ResetPasscodeSuccessModal
