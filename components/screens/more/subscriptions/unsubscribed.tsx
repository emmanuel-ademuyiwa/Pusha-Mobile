import {Box, Button, Typography} from '@/components/ui'
import React from 'react'
import {SUBSCRIPTION_PLANS} from './data'

interface UnsubscribedProps {
  onSubscribe?: (planId: string) => void
}

const Unsubscribed = ({onSubscribe}: UnsubscribedProps) => {
  return (
    <Box flex={1} p={16}>
      <Box alignItems="center" mb={24}>
        <Typography variant="h2-bold" color="secondary-500" textAlign="center">
          Upgrade Your Plan
        </Typography>
        <Typography variant="body" color="neutral-600" textAlign="center" mt={8}>
          Get access to premium features to grow your business faster.
        </Typography>
      </Box>
      <Box gap={12}>
        {SUBSCRIPTION_PLANS.filter(p => p.price > 0).map(plan => (
          <Box
            key={plan.id}
            backgroundColor="white"
            borderRadius={12}
            p={16}
            borderWidth={1}
            style={{borderColor: '#E9EAEB'}}>
            <Box flexDirection="row" alignItems="center" justifyContent="space-between" mb={8}>
              <Typography variant="h3-bold" color="secondary-500">
                {plan.name}
              </Typography>
              <Typography variant="h3-bold" color="primary-100">
                ₦{plan.price.toLocaleString()}/{plan.interval === 'monthly' ? 'mo' : 'yr'}
              </Typography>
            </Box>
            {plan.features.slice(0, 3).map((f, i) => (
              <Typography key={i} variant="c1" color="neutral-600" mb={2}>
                • {f}
              </Typography>
            ))}
            <Box mt={12}>
              <Button label={`Get ${plan.name}`} onPress={() => onSubscribe?.(plan.id)} />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default Unsubscribed
