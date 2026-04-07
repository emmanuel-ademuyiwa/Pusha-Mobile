import {Box} from '@/components/ui'
import React from 'react'
import BillingCycle from './billing-cycle'
import SubscriptionPlans from './subscription-plans'

interface SubscribedTabProps {
  subscription?: any
  onChangePlan?: (planId: string) => void
}

const SubscribedTab = ({subscription, onChangePlan}: SubscribedTabProps) => {
  return (
    <Box flex={1} gap={16} p={16}>
      <BillingCycle subscription={subscription} />
      <SubscriptionPlans
        currentPlanId={subscription?.plan_id}
        onSelect={onChangePlan}
      />
    </Box>
  )
}

export default SubscribedTab
