import {Box, Button, Typography} from '@/components/ui'
import React from 'react'

export type DisplayPlan = {
  id: string
  name: string
  description?: string | null
  monthly_price: number
  annual_price: number
  features?: string[] | null
  displayPrice: string
  period: string
  premium: boolean
}

interface SubscriptionPlansProps {
  plans: DisplayPlan[]
  currentPlanId?: string
  onSelect?: (planId: string) => void
  subscribingPlanId?: string | null
}

const SubscriptionPlans = ({
  plans,
  currentPlanId,
  onSelect,
  subscribingPlanId
}: SubscriptionPlansProps) => {
  if (plans.length === 0) {
    return (
      <Box p={16} alignItems="center">
        <Typography variant="body" color="neutral-700">
          No plans available.
        </Typography>
      </Box>
    )
  }

  return (
    <Box gap={12}>
      {plans.map(plan => {
        const isCurrent = currentPlanId === plan.id
        const loading = subscribingPlanId === plan.id

        return (
          <Box
            key={plan.id}
            backgroundColor="white"
            borderRadius={16}
            p={16}
            borderWidth={plan.premium ? 2 : 1}
            style={{
              borderColor: plan.premium ? '#1D4ED8' : '#EDF2F8'
            }}>
            {plan.premium ? (
              <Box
                backgroundColor="primary-100"
                px={8}
                py={4}
                borderRadius={8}
                alignSelf="flex-start"
                mb={8}>
                <Typography variant="c2-bold" color="white">
                  Recommended
                </Typography>
              </Box>
            ) : null}
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              mb={8}>
              <Typography
                variant="h3-bold"
                style={{color: plan.premium ? '#1D4ED8' : '#1A202C', flex: 1}}>
                {plan.name}
              </Typography>
            </Box>
            <Typography variant="h2-bold" color="secondary-500" mb={4}>
              {plan.displayPrice}
            </Typography>
            <Typography variant="c1" color="neutral-600" mb={12}>
              {plan.period}
            </Typography>
            {plan.features && plan.features.length > 0 ? (
              plan.features.map((f, i) => (
                <Typography key={i} variant="body" color="neutral-800" mb={6}>
                  • {f}
                </Typography>
              ))
            ) : (
              <Typography variant="body" color="neutral-700" mb={12}>
                {plan.description || '—'}
              </Typography>
            )}
            <Box mt={12}>
              <Button
                label={isCurrent ? 'Current plan' : 'Change to this plan'}
                variant={isCurrent ? 'secondary' : 'primary'}
                hasLinearGradient={!isCurrent && plan.premium}
                loading={loading}
                disabled={isCurrent || loading || subscribingPlanId !== null}
                onPress={() => onSelect?.(plan.id)}
              />
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

export default SubscriptionPlans
