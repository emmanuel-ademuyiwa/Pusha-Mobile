import {Box, Button, PushaActivityIndicator, Typography} from '@/components/ui'
import {
  useChangePlan,
  useGetSubscriptionPlans
} from '@/queries/subscriptionQuery'
import {errorHandler} from '@/utils/errorHandler'
import toast from '@/utils/toast'
import React, {useMemo, useState} from 'react'
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native'
import BillingCycle from './billing-cycle'
import SubscriptionPlans from './subscription-plans'

type BillingCycle = 'MONTHLY' | 'YEARLY'

interface SubscribedTabProps {
  subscription?: {
    plan_id?: string
    next_billing_date?: string
    amount?: number | string
    [key: string]: unknown
  }
}

const SubscribedTab = ({subscription}: SubscribedTabProps) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('MONTHLY')
  const [changingPlanId, setChangingPlanId] = useState<string | null>(null)

  const {
    data: plansRaw,
    isLoading: isPlansLoading,
    isError: isPlansError,
    refetch
  } = useGetSubscriptionPlans()
  const {mutateAsync: changePlan} = useChangePlan()

  const plans = useMemo(() => {
    const list = (plansRaw ?? []) as Array<{
      id: string
      name: string
      description?: string | null
      monthly_price: number
      annual_price: number
      features?: string[] | null
    }>
    return list.map((plan, index) => {
      const price =
        billingCycle === 'MONTHLY' ? plan.monthly_price : plan.annual_price
      const period = billingCycle === 'MONTHLY' ? '/month' : '/year'
      const isPremium = index === list.length - 1 && list.length > 0
      return {
        ...plan,
        displayPrice:
          price === 0
            ? 'Free'
            : new Intl.NumberFormat('en-NG', {
                style: 'currency',
                currency: 'NGN',
                minimumFractionDigits: 0
              }).format(price),
        period,
        premium: isPremium
      }
    })
  }, [plansRaw, billingCycle])

  const handleChangePlan = async (planId: string) => {
    setChangingPlanId(planId)
    try {
      await changePlan({
        plan_id: planId,
        billing_cycle: billingCycle
      })
      toast.success('Subscription plan updated successfully!')
    } catch (err) {
      errorHandler(err)
    } finally {
      setChangingPlanId(null)
    }
  }

  if (isPlansLoading && (!plansRaw || (plansRaw as unknown[]).length === 0)) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center" p={24}>
        <PushaActivityIndicator />
        <Typography variant="body" color="neutral-700" mt={12}>
          Loading plans…
        </Typography>
      </Box>
    )
  }

  if (isPlansError) {
    return (
      <Box flex={1} p={16} alignItems="center" justifyContent="center" gap={12}>
        <Typography variant="body" color="neutral-800" textAlign="center">
          Failed to load plans.
        </Typography>
        <Button label="Retry" onPress={() => refetch()} />
      </Box>
    )
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Box flex={1} gap={16} p={16}>
        <BillingCycle subscription={subscription} />

        <Box
          flexDirection="row"
          alignSelf="center"
          backgroundColor="white"
          borderRadius={12}
          borderWidth={1}
          style={{borderColor: '#EDF2F8'}}
          padding={4}
          marginBottom={4}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setBillingCycle('MONTHLY')}
            style={[
              styles.cycleBtn,
              billingCycle === 'MONTHLY' && styles.cycleBtnActive
            ]}>
            <Typography
              variant="c1-medium"
              style={{
                color: billingCycle === 'MONTHLY' ? '#FFFFFF' : '#64748B'
              }}>
              Monthly
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setBillingCycle('YEARLY')}
            style={[
              styles.cycleBtn,
              billingCycle === 'YEARLY' && styles.cycleBtnActive
            ]}>
            <Typography
              variant="c1-medium"
              style={{
                color: billingCycle === 'YEARLY' ? '#FFFFFF' : '#64748B'
              }}>
              Yearly
            </Typography>
          </TouchableOpacity>
        </Box>

        <SubscriptionPlans
          plans={plans}
          currentPlanId={subscription?.plan_id}
          onSelect={handleChangePlan}
          subscribingPlanId={changingPlanId}
        />
      </Box>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  cycleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8
  },
  cycleBtnActive: {
    backgroundColor: '#1D4ED8'
  }
})

export default SubscribedTab
