import {
  Box,
  Button,
  PushaActivityIndicator,
  SpinnerOverlay,
  Typography
} from '@/components/ui'
import AppIcon from '@/components/ui/app-icon'
import {
  useGetSubscriptionPlans,
  useSubscribeFreeTier
} from '@/queries/subscriptionQuery'
import {errorHandler} from '@/utils/errorHandler'
import toast from '@/utils/toast'
import {router} from 'expo-router'
import React, {useEffect, useMemo, useState} from 'react'
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View
} from 'react-native'
import {TouchableOpacity} from 'react-native'

type BillingCycle = 'MONTHLY' | 'YEARLY'

type ApiPlan = {
  id: string
  name: string
  description?: string | null
  monthly_price: number
  annual_price: number
  features?: string[] | null
}

const {width: SCREEN_W} = Dimensions.get('window')
const CARD_GAP = 12
const CARD_WIDTH = Math.min(SCREEN_W * 0.82, 340)

const formatPrice = (price: number): string => {
  if (price === 0) return 'Free'
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2
  }).format(price)
}

const PatternBackdrop = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {[0, 1, 2, 3, 4, 5].map(i => (
      <View
        key={i}
        style={{
          position: 'absolute',
          width: 120 + (i % 3) * 40,
          height: 120 + (i % 3) * 40,
          borderRadius: 999,
          backgroundColor: '#FFFFFF',
          opacity: 0.06,
          left: ((i * 67) % (SCREEN_W + 40)) - 20,
          top: 80 + i * 95
        }}
      />
    ))}
  </View>
)

const Unsubscribed = () => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('MONTHLY')
  const [activeIndex, setActiveIndex] = useState(0)

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
      const isPremium = index === list.length - 1 && list.length > 0
      const weekly =
        billingCycle === 'MONTHLY'
          ? Math.round(plan.monthly_price / 4)
          : Math.round(plan.annual_price / 52)
      return {
        ...plan,
        displayMain: formatPrice(price),
        weeklyLabel:
          billingCycle === 'MONTHLY'
            ? `${formatPrice(weekly)}/week`
            : `${formatPrice(weekly)}/week`,
        periodWord: billingCycle === 'MONTHLY' ? 'monthly' : 'yearly',
        premium: isPremium
      }
    })
  }, [plansRaw, billingCycle])

  useEffect(() => {
    setActiveIndex(0)
  }, [billingCycle])

  const onMomentumScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const x = e.nativeEvent.contentOffset.x
    const idx = Math.round(x / (CARD_WIDTH + CARD_GAP))
    setActiveIndex(Math.max(0, Math.min(idx, plans.length - 1)))
  }

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
        <Typography variant="body" color="white" mt={12} opacity={0.9}>
          Loading plans…
        </Typography>
      </Box>
    )
  }

  if (isPlansError) {
    return (
      <Box flex={1} p={16} alignItems="center" justifyContent="center" gap={12}>
        <Typography variant="body" color="white" textAlign="center">
          Failed to load plans. Please try again.
        </Typography>
        <Button label="Retry" onPress={() => refetch()} />
      </Box>
    )
  }

  if (plans.length === 0) {
    return (
      <Box flex={1} p={16} alignItems="center" justifyContent="center">
        <Typography variant="body" color="white" textAlign="center">
          No plans available at the moment.
        </Typography>
      </Box>
    )
  }

  return (
    <SpinnerOverlay show={isSubscribing}>
      <Box flex={1} position="relative">
        <PatternBackdrop />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          nestedScrollEnabled>
          <Box paddingHorizontal={20} paddingTop={8} paddingBottom={16}>
            <Typography
              variant="body"
              color="white"
              textAlign="center"
              style={{opacity: 0.95}}>
              Do so much more with Pusha
            </Typography>
            <Typography
              variant="h2-bold"
              color="white"
              textAlign="center"
              mt={8}
              lineHeight={32}>
              Subscribe to our amazing plans
            </Typography>

            <Box
              flexDirection="row"
              alignSelf="center"
              borderRadius={12}
              padding={4}
              mt={20}
              style={{backgroundColor: 'rgba(255,255,255,0.15)'}}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setBillingCycle('MONTHLY')}
                style={[
                  styles.cycleBtn,
                  billingCycle === 'MONTHLY' && styles.cycleBtnActive
                ]}>
                <Typography
                  variant="c1-medium"
                  color={billingCycle === 'MONTHLY' ? 'primary-100' : 'white'}
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
                  color={billingCycle === 'YEARLY' ? 'primary-100' : 'white'}
                  opacity={billingCycle === 'YEARLY' ? 1 : 0.85}>
                Yearly
                </Typography>
              </TouchableOpacity>
            </Box>
          </Box>

          <FlatList
            horizontal
            data={plans}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + CARD_GAP}
            decelerationRate="fast"
            ItemSeparatorComponent={() => <Box width={CARD_GAP} />}
            contentContainerStyle={{
              paddingHorizontal: (SCREEN_W - CARD_WIDTH) / 2,
              paddingBottom: 8
            }}
            nestedScrollEnabled
            onMomentumScrollEnd={onMomentumScrollEnd}
            renderItem={({item: pkg}) => {
              const benefits =
                pkg.features && pkg.features.length > 0
                  ? pkg.features.slice(0, 8)
                  : [pkg.description?.trim() || 'Full access to Pusha features']

              return (
                <Box width={CARD_WIDTH}>
                  <Box
                    backgroundColor="white"
                    borderRadius={20}
                    p={20}
                    style={styles.cardShadow}>
                    {pkg.premium ? (
                      <Typography
                        variant="c2"
                        color="neutral-600"
                        mb={10}
                        style={{letterSpacing: 1}}>
                        RECOMMENDED
                      </Typography>
                    ) : (
                      <Box height={18} />
                    )}
                    <Typography variant="h2-bold" color="secondary-500" mb={14}>
                      {pkg.name}
                    </Typography>
                    <Box gap={10} mb={16}>
                      {benefits.map((line, i) => (
                        <Box
                          key={i}
                          flexDirection="row"
                          alignItems="center"
                          gap={10}>
                          <Box
                            width={22}
                            height={22}
                            borderRadius={11}
                            backgroundColor="light-primary"
                            alignItems="center"
                            justifyContent="center">
                            <AppIcon name="CheckCircle" size={12} color="#2554CF" />
                          </Box>
                          <Box flex={1}>
                            <Typography variant="body" color="neutral-700">
                              {line}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                    <Box
                      backgroundColor="light-blue"
                      borderRadius={12}
                      px={12}
                      py={12}
                      mb={16}>
                      <Box flexDirection="row" flexWrap="wrap" alignItems="center">
                        <Typography variant="body-semibold" color="primary-400">
                          {pkg.displayMain}{' '}
                        </Typography>
                        <Typography variant="c1" color="neutral-600">
                          {pkg.periodWord} • {pkg.weeklyLabel}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      label="Subscribe"
                      onPress={() => handleSelectPlan(pkg.id)}
                      disabled={isSubscribing}
                    />
                  </Box>
                </Box>
              )
            }}
          />

          <Box flexDirection="row" justifyContent="center" gap={6} py={12}>
            {plans.map((_, i) => (
              <Box
                key={i}
                width={activeIndex === i ? 18 : 6}
                height={6}
                borderRadius={3}
                backgroundColor="white"
                opacity={activeIndex === i ? 1 : 0.45}
              />
            ))}
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10
  },
  cycleBtnActive: {
    backgroundColor: '#FFFFFF'
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6
  }
})

export default Unsubscribed
