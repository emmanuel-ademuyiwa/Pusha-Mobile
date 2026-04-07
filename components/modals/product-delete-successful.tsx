import React from 'react'
import SuccessCheck from '../svgs/success-check'
import {Box, Button, Typography} from '../ui'
import CenterdModal from '../ui/centerd-modal'

interface SuccessModalProps {
  show: boolean
  onClose: () => void
  title: string
  subtext: string
  buttonLabel?: string
  onButtonPress: () => void
  hasLinearGradient?: boolean
  icon?: React.ReactNode
}

const SuccessModal = ({
  show,
  onClose,
  title,
  subtext,
  buttonLabel = 'Done',
  onButtonPress,
  hasLinearGradient = false,
  icon
}: SuccessModalProps) => {
  return (
    <CenterdModal visible={show} onClose={onClose}>
      <Box alignItems="center" width={'100%'}>
        {icon || <SuccessCheck />}
        <Typography
          variant="h1-bold"
          color="secondary-500"
          fontSize={22}
          lineHeight={33}>
          {title}
        </Typography>
        <Typography
          my={16}
          textAlign="center"
          color="neutral-800"
          variant="body">
          {subtext}
        </Typography>

        <Box mt={16} width={'100%'}>
          <Button
            hasLinearGradient={hasLinearGradient}
            label={buttonLabel}
            onPress={onButtonPress}
          />
        </Box>
      </Box>
    </CenterdModal>
  )
}

export default SuccessModal
