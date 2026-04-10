import {router} from 'expo-router'
import React, {useEffect, useState} from 'react'

import {Box, Button, Typography} from '../ui'
import CenterdModal from '../ui/centerd-modal'
import {useCancelSubscription} from '@/queries/subscriptionQuery'
import {errorHandler} from '@/utils/errorHandler'

const CancelSubscription = ({
  show,
  onClose
}: {
  show: boolean
  onClose: () => void
}) => {
  const [isCancelled, setIsCancelled] = useState(false)
  const {mutateAsync: cancelSubscription, isPending} = useCancelSubscription()

  useEffect(() => {
    if (!show) setIsCancelled(false)
  }, [show])

  const handleConfirmCancel = async () => {
    try {
      await cancelSubscription()
      setIsCancelled(true)
    } catch (err) {
      errorHandler(err)
    }
  }

  const handleDone = () => {
    onClose()
    setIsCancelled(false)
    router.replace('/(auth)/(more)/subscriptions')
  }

  return (
    <CenterdModal show={show} onClose={onClose}>
      {isCancelled ? (
        <Box alignItems="center" width={'100%'}>
          <Typography
            variant="h1-bold"
            color="secondary-500"
            fontSize={22}
            maxWidth={200}
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
            You have successfully cancelled your subscription with Pusha. Feel
            free to renew later.
          </Typography>

          <Box mt={16} width={'100%'}>
            <Button
              label="Done"
              loading={false}
              disabled={false}
              onPress={handleDone}
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

          <Box mt={16} width={'100%'} gap={12}>
            <Button
              label="No"
              hasLinearGradient={false}
              disabled={isPending}
              onPress={onClose}
            />

            <Button
              label="Yes, Cancel"
              hasLinearGradient={false}
              variant="primary"
              backgroundColor="light-blue"
              color="primary-400"
              loading={isPending}
              disabled={isPending}
              onPress={handleConfirmCancel}
            />
          </Box>
        </Box>
      )}
    </CenterdModal>
  )
}

export default CancelSubscription
