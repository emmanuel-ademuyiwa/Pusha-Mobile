import {router} from 'expo-router'
import React, {useState} from 'react'
import {Box, Button, Typography} from '../ui'
import CenterdModal from '../ui/centerd-modal'

const CancelSubscription = ({
  show,
  onClose
}: {
  show: boolean
  onClose: () => void
}) => {
  const [isCancelled, setIsCancelled] = useState(false)

  return (
    <CenterdModal visible={show} onClose={onClose}>
      {isCancelled ? (
        <Box alignItems="center" width={'100%'}>
          <Typography
            variant="h1-bold"
            color="secondary-500"
            fontSize={22}
            maxWidth={136}
            textAlign="center"
            lineHeight={33}>
            Subscription Cancelled
          </Typography>
          <Typography
            my={16}
            textAlign="center"
            color="neutral-800"
            maxWidth={279}
            variant="body">
            You have sucessfullly cancelled your subscription with Pusha. Feel
            free to renew later.
          </Typography>

          <Box mt={16} width={'100%'}>
            <Button
              label="Done"
              onPress={() => router.replace('/(auth)/(more)/subscriptions')}
            />
          </Box>
        </Box>
      ) : (
        <Box alignItems="center" width={'100%'}>
          <Typography
            variant="h1-bold"
            color="secondary-500"
            fontSize={22}
            lineHeight={33}>
            Cancel Subscription?
          </Typography>
          <Typography
            my={16}
            textAlign="center"
            color="neutral-800"
            variant="body">
            Are you sure you want to cancel your subscription?
          </Typography>

          <Box mt={16} width={'100%'} gap={16}>
            <Button label="No" hasLinearGradient={false} onPress={onClose} />

            <Button
              label="Yes, Cancel"
              hasLinearGradient={false}
              textColor={'primary-400'}
              borderColor="light-blue"
              backgroundColor="light-blue"
              onPress={() => setIsCancelled(true)}
            />
          </Box>
        </Box>
      )}
    </CenterdModal>
  )
}

export default CancelSubscription
