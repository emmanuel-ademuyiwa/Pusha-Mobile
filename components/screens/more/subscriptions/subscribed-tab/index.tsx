import {Box, Button, PushaActivityIndicator, Typography} from '@/components/ui'
import {
  useChangePlan,
  useGetSubscriptionPlans
} from '@/queries/subscriptionQuery'
import {errorHandler} from '@/utils/errorHandler'
import toast from '@/utils/toast'
import React, {useMemo, useState} from 'react'
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native'
import PaymentMethodsSection from '../payment-methods'
import SubscribedBillingTab, {
  type SubscriptionRecord
} from '../subscribed-billing-tab'
import SubscriptionPlans from '../subscription-plans'

type BillingCycle = 'MONTHLY' | 'YEARLY'

type MainTab = 'plans' | 'billing'

interface SubscribedTabProps {
  subscription?: SubscriptionRecord
}

const SubscribedTab = ({subscription}: SubscribedTabProps) => {
  const [mainTab, setMainTab] = useState<MainTab>('plans')
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('MONTHLY')
  const [changingPlanId, setChangingPlanId] = useState<string | null>(null)

  const {
    data: plansRaw,
    isLoading: isPlansLoading,
    isError: isPlansError,
    refetch
  } = useGetSubscriptionPlans()
  const {mutateAsync: changePlan} = useChangePlan()

  const currentPlanId =
    subscription?.plan_id ??
    (subscription?.plan as {id?: string} | undefined)?.id

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
    <ScrollView
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled>
      <Box flex={1} p={16} paddingBottom={32}>
        <Box
          flexDirection="row"
          backgroundColor="neutral-100"
          borderRadius={12}
          padding={4}
          marginBottom={20}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => setMainTab('plans')}
            style={[styles.segmentItem, mainTab === 'plans' && styles.segmentActive]}>
            <Typography
              variant="c1-medium"
              color={mainTab === 'plans' ? 'secondary-500' : 'neutral-600'}>
              Subscription plans
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => setMainTab('billing')}
            style={[
              styles.segmentItem,
              mainTab === 'billing' && styles.segmentActive
            ]}>
            <Typography
              variant="c1-medium"
              color={mainTab === 'billing' ? 'secondary-500' : 'neutral-600'}>
              Billing Cycle
            </Typography>
          </TouchableOpacity>
        </Box>

        {mainTab === 'billing' && subscription ? (
          <SubscribedBillingTab subscription={subscription} />
        ) : null}

        {mainTab === 'plans' ? (
          <>
            <Typography variant="h3-bold" color="secondary-500" mb={14}>
              Subscription plan
            </Typography>

            <Box
              flexDirection="row"
              alignSelf="stretch"
              backgroundColor="neutral-100"
              borderRadius={12}
              padding={4}
              marginBottom={16}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setBillingCycle('MONTHLY')}
                style={[
                  styles.cycleBtn,
                  billingCycle === 'MONTHLY' && styles.cycleBtnActive
                ]}>
                <Typography
                  variant="c1-medium"
                  color={billingCycle === 'MONTHLY' ? 'white' : 'secondary-500'}
                  opacity={billingCycle === 'MONTHLY' ? 1 : 0.85}>
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
                  color={billingCycle === 'YEARLY' ? 'white' : 'secondary-500'}
                  opacity={billingCycle === 'YEARLY' ? 1 : 0.85}>
                  Yearly
                </Typography>
              </TouchableOpacity>
            </Box>

            <SubscriptionPlans
              plans={plans}
              currentPlanId={currentPlanId}
              onSelect={handleChangePlan}
              subscribingPlanId={changingPlanId}
            />

          </>
        ) : null}
      </Box>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  segmentItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  segmentActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1
  },
  cycleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8
  },
  cycleBtnActive: {
    backgroundColor: '#1D4ED8'
  }
})

export default SubscribedTab
