import {Box, Typography} from '@/components/ui'
import React from 'react'

interface BillingCycleProps {
  subscription?: any
}

const BillingCycle = ({subscription}: BillingCycleProps) => {
  if (!subscription) return null

  return (
    <Box
      backgroundColor="white"
      borderRadius={12}
      p={16}
      borderWidth={1}
      style={{borderColor: '#E9EAEB'}}>
      <Typography variant="body-semibold" color="secondary-500" mb={12}>
        Billing Cycle
      </Typography>
      <Box flexDirection="row" justifyContent="space-between" mb={8}>
        <Typography variant="body" color="neutral-600">
          Next billing date
        </Typography>
        <Typography variant="body-semibold" color="secondary-500">
          {subscription.next_billing_date
            ? new Date(subscription.next_billing_date).toLocaleDateString()
            : '—'}
        </Typography>
      </Box>
      <Box flexDirection="row" justifyContent="space-between">
        <Typography variant="body" color="neutral-600">
          Amount
        </Typography>
        <Typography variant="body-semibold" color="secondary-500">
          ₦{subscription.amount ? Number(subscription.amount).toLocaleString() : '0'}
        </Typography>
      </Box>
    </Box>
  )
}

export default BillingCycle
