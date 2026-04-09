import {
  Box,
  Button,
  PushaActivityIndicator,
  SpinnerOverlay,
  Typography
} from '@/components/ui'
import {
  useGetSubscriptionPlans,
  useSubscribeFreeTier
} from '@/queries/subscriptionQuery'
import {errorHandler} from '@/utils/errorHandler'
import toast from '@/utils/toast'
import {router} from 'expo-router'
import React, {useMemo, useState} from 'react'
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native'

type BillingCycle = 'MONTHLY' | 'YEARLY'

type ApiPlan = {
  id: string
  name: string
  description?: string | null
  monthly_price: number
  annual_price: number
  features?: string[] | null
}

const formatPrice = (price: number): string => {
  if (price === 0) return 'Free'
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(price)
}

const Unsubscribed = () => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('MONTHLY')
  const {
    data: plansRaw,
    isLoading: isPlansLoading,
    isError: isPlansError,
    refetch
  } = useGetSubscriptionPlans()
  const {mutateAsync: subscribeFreeTier, isPending: isSubscribing} =
    useSubscribeFreeTier()

  const plans = useMemo(() => {
    const list = (plansRaw ?? []) as ApiPlan[]
    return list.map((plan, index) => {
      const price =
        billingCycle === 'MONTHLY' ? plan.monthly_price : plan.annual_price
      const period = billingCycle === 'MONTHLY' ? '/month' : '/year'
      const isPremium = index === list.length - 1 && list.length > 0
      return {
        ...plan,
        displayPrice: formatPrice(price),
        period,
        premium: isPremium
      }
    })
  }, [plansRaw, billingCycle])

  const handleSelectPlan = async (planId: string) => {
    try {
      await subscribeFreeTier({
        plan_id: planId,
        billing_cycle: billingCycle
      })
      toast.success('Successfully subscribed!')
      router.replace('/dashboard')
    } catch (err) {
      errorHandler(err)
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
          Failed to load plans. Please try again.
        </Typography>
        <Button label="Retry" onPress={() => refetch()} />
      </Box>
    )
  }

  if (plans.length === 0) {
    return (
      <Box flex={1} p={16} alignItems="center" justifyContent="center">
        <Typography variant="body" color="neutral-700" textAlign="center">
          No plans available at the moment.
        </Typography>
      </Box>
    )
  }

  return (
    <SpinnerOverlay show={isSubscribing}>
      <Box flex={1}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <Box flex={1} p={16}>
        <Box alignItems="center" mb={20}>
          <Typography variant="h2-bold" color="secondary-500" textAlign="center">
            Choose your plan
          </Typography>
          <Typography variant="body" color="neutral-800" textAlign="center" mt={8}>
            Select a plan that fits your business
          </Typography>
        </Box>

        <Box
          flexDirection="row"
          alignSelf="center"
          backgroundColor="white"
          borderRadius={12}
          borderWidth={1}
          style={{borderColor: '#EDF2F8'}}
          padding={4}
          mb={20}>
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

        <Box gap={12}>
          {plans.map(pkg => (
            <Box
              key={pkg.id}
              backgroundColor="white"
              borderRadius={16}
              p={16}
              borderWidth={pkg.premium ? 2 : 1}
              style={{
                borderColor: pkg.premium ? '#1D4ED8' : '#EDF2F8'
              }}>
              <Box
                flexDirection="row"
                alignItems="flex-start"
                justifyContent="space-between"
                mb={8}>
                <Typography
                  variant="h3-bold"
                  style={{color: pkg.premium ? '#1D4ED8' : '#1A202C', flex: 1}}>
                  {pkg.name}
                </Typography>
                {pkg.premium ? (
                  <Box
                    backgroundColor="primary-100"
                    px={8}
                    py={4}
                    borderRadius={8}>
                    <Typography variant="c2-bold" color="white">
                      Recommended
                    </Typography>
                  </Box>
                ) : null}
              </Box>

              <Typography variant="h2-bold" color="secondary-500" mb={4}>
                {pkg.displayPrice}
              </Typography>
              <Typography variant="c1" color="neutral-600" mb={12}>
                {pkg.period}
              </Typography>

              {pkg.features && pkg.features.length > 0 ? (
                pkg.features.slice(0, 6).map((f, i) => (
                  <Typography key={i} variant="body" color="neutral-800" mb={6}>
                    • {f}
                  </Typography>
                ))
              ) : (
                <Typography variant="body" color="neutral-700" mb={12}>
                  {pkg.description || '—'}
                </Typography>
              )}

              <Box mt={12}>
                <Button
                  label="Select plan"
                  hasLinearGradient={pkg.premium}
                  disabled={isSubscribing}
                  onPress={() => handleSelectPlan(pkg.id)}
                />
              </Box>
            </Box>
          ))}
          </Box>
        </Box>
        </ScrollView>
      </Box>
    </SpinnerOverlay>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 32
  },
  cycleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8
  },
  cycleBtnActive: {
    backgroundColor: '#1D4ED8'
  }
})

export default Unsubscribed
