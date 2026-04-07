import {Box, Button, Typography} from '@/components/ui'
import React from 'react'
import {ScrollView} from 'react-native'
import {SUBSCRIPTION_PLANS} from '../data'

interface SubscriptionPlansProps {
  currentPlanId?: string
  onSelect?: (planId: string) => void
}

const SubscriptionPlans = ({currentPlanId, onSelect}: SubscriptionPlansProps) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Box gap={12} p={16}>
        {SUBSCRIPTION_PLANS.map(plan => (
          <Box
            key={plan.id}
            backgroundColor="white"
            borderRadius={12}
            p={16}
            borderWidth={currentPlanId === plan.id ? 2 : 1}
            style={{
              borderColor: currentPlanId === plan.id ? '#2554C7' : '#E9EAEB',
            }}>
            {plan.recommended ? (
              <Box
                backgroundColor="primary-100"
                px={10}
                py={4}
                borderRadius={20}
                alignSelf="flex-start"
                mb={8}>
                <Typography variant="c2-bold" color="white">
                  Recommended
                </Typography>
              </Box>
            ) : null}
            <Box flexDirection="row" alignItems="center" justifyContent="space-between" mb={12}>
              <Typography variant="h3-bold" color="secondary-500">
                {plan.name}
              </Typography>
              <Box>
                <Typography variant="h2-bold" color="primary-100">
                  ₦{plan.price.toLocaleString()}
                </Typography>
                <Typography variant="c2" color="neutral-600">
                  / {plan.interval}
                </Typography>
              </Box>
            </Box>
            {plan.features.map((f, i) => (
              <Typography key={i} variant="body" color="neutral-700" mb={4}>
                • {f}
              </Typography>
            ))}
            <Box mt={12}>
              <Button
                label={currentPlanId === plan.id ? 'Current Plan' : 'Select Plan'}
                variant={currentPlanId === plan.id ? 'secondary' : 'primary'}
                onPress={() => onSelect?.(plan.id)}
                disabled={currentPlanId === plan.id}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </ScrollView>
  )
}

export default SubscriptionPlans
