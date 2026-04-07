import dayjs from 'dayjs'
import {Image} from 'expo-image'
import React, {forwardRef} from 'react'

import {BZModal, BazeIcon, Box, Button, Typography} from '@/components/ui'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import {Modal} from '@/types/modal'
import {formatCurrency} from '@/utils/currency'
import {saveToVault} from '@/utils/storage'

const welcomeTrialIllustration = require('@assets/welcome-trial-illustration.png')

const WelcomeTrialPeriod = forwardRef<Modal, {date: Date}>((props, ref) => {
  const innerRef = useForwardedRef(ref)

  const renderFooter = () => (
    <Box>
      <Button
        label="Got it"
        marginTop={8}
        onPress={() => {
          saveToVault('showTrialModal', false)
          innerRef.current?.dismiss()
        }}
      />
    </Box>
  )

  return (
    <BZModal
      ref={innerRef}
      snapPoints={[600]}
      footer={renderFooter}
      onDismiss={() => saveToVault('showTrialModal', false)}>
      <Box alignItems="center">
        <Image
          source={welcomeTrialIllustration}
          accessibilityIgnoresInvertColors
          style={{height: 156, width: '100%', borderRadius: 12}}
        />
      </Box>
      <Typography marginTop={24} variant="h2-bold">
        Your first 3 months are on us!
      </Typography>

      <Box flexDirection="row" gap={8} alignItems="flex-start" mt={24}>
        <BazeIcon name="unlock" size={16} color="#20B038" />

        <Box mr={40}>
          <Typography variant="body-bold" color="neutral-700">
            Today: Get full access
          </Typography>
          <Typography variant="c1" color="neutral-600" mt={4}>
            Try out Baze before you subscribe. No card required!
          </Typography>
        </Box>
      </Box>
      <Box flexDirection="row" gap={8} alignItems="flex-start" mt={24}>
        <BazeIcon name="notifications-fill" size={16} color="#20B038" />

        <Box mr={40}>
          <Typography variant="body-bold" color="neutral-700">
            Day 85: Trial reminder
          </Typography>
          <Typography variant="c1" color="neutral-600" mt={4}>
            We’ll remind you that your trial is about to end.
          </Typography>
        </Box>
      </Box>
      <Box flexDirection="row" gap={8} alignItems="flex-start" mt={24}>
        <BazeIcon name="subscription" size={16} color="#20B038" />

        <Box mr={40}>
          <Typography variant="body-bold" color="neutral-700">
            Day 90: Subscription starts
          </Typography>
          <Typography variant="c1" color="neutral-600" mt={4}>
            Your subscription would start on{' '}
            <Typography variant="c1-bold" color="neutral-600">
              {dayjs(props.date).add(90, 'day').format('MMMM D, YYYY')}
            </Typography>{' '}
            at {formatCurrency(5000, 'comma')} per month.
          </Typography>
        </Box>
      </Box>

      <Box paddingBottom={24} paddingHorizontal={4} />
    </BZModal>
  )
})

WelcomeTrialPeriod.displayName = 'WelcomeTrialPeriod'
export default WelcomeTrialPeriod
