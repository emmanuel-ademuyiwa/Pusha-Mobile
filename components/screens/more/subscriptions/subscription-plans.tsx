import {Box, Button, Typography} from '@/components/ui'
import AppIcon from '@/components/ui/app-icon'
import React, {useEffect, useRef, useState} from 'react'
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet
} from 'react-native'

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

const {width: SCREEN_W} = Dimensions.get('window')
const CARD_GAP = 12
const CARD_WIDTH = Math.min(SCREEN_W * 0.82, 340)
const PAGE_STRIDE = CARD_WIDTH + CARD_GAP

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
  const [activeIndex, setActiveIndex] = useState(0)
  const hScrollRef = useRef<ScrollView>(null)

  useEffect(() => {
    const idx = plans.findIndex(p => p.id === currentPlanId)
    if (idx >= 0) {
      setActiveIndex(idx)
      requestAnimationFrame(() => {
        hScrollRef.current?.scrollTo({
          x: idx * PAGE_STRIDE,
          animated: false
        })
      })
    }
  }, [currentPlanId, plans])

  const onMomentumScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const x = e.nativeEvent.contentOffset.x
    const idx = Math.round(x / PAGE_STRIDE)
    setActiveIndex(Math.max(0, Math.min(idx, plans.length - 1)))
  }

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
    <Box>
      <ScrollView
        ref={hScrollRef}
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={PAGE_STRIDE}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        scrollEventThrottle={16}
        style={{width: SCREEN_W}}
        contentContainerStyle={{
          paddingHorizontal: (SCREEN_W - CARD_WIDTH) / 2,
          paddingBottom: 4,
          flexDirection: 'row',
          alignItems: 'stretch'
        }}
        onMomentumScrollEnd={onMomentumScrollEnd}>
        {plans.map((plan, index) => {
          const isCurrent = currentPlanId === plan.id
          const loading = subscribingPlanId === plan.id
          const benefits =
            plan.features && plan.features.length > 0
              ? plan.features.slice(0, 8)
              : [plan.description?.trim() || '—']

          return (
            <React.Fragment key={plan.id}>
              {index > 0 ? <Box width={CARD_GAP} /> : null}
              <Box width={CARD_WIDTH}>
                <Box
                  backgroundColor={isCurrent ? 'light-primary' : 'white'}
                  borderRadius={16}
                  p={16}
                  borderWidth={1}
                  style={{
                    borderColor: isCurrent ? '#2554CF' : '#EDF2F8',
                    ...styles.cardShadow
                  }}>
                  <Box
                    flexDirection="row"
                    alignItems="flex-start"
                    justifyContent="space-between"
                    mb={12}>
                    <Typography
                      variant="h3-bold"
                      color="secondary-500"
                      style={{flex: 1, paddingRight: 8}}>
                      {plan.name}
                    </Typography>
                    {isCurrent ? (
                      <Box
                        backgroundColor="white"
                        px={10}
                        py={4}
                        borderRadius={20}
                        borderWidth={1}
                        style={{borderColor: '#B0C4DE'}}>
                        <Typography variant="c2-bold" color="primary-400">
                          Current plan
                        </Typography>
                      </Box>
                    ) : null}
                  </Box>
                  <Box gap={8}>
                    {benefits.map((line, i) => (
                      <Box
                        key={i}
                        flexDirection="row"
                        alignItems="center"
                        gap={8}>
                        <Box
                          width={20}
                          height={20}
                          borderRadius={10}
                          backgroundColor="light-primary"
                          alignItems="center"
                          justifyContent="center">
                          <AppIcon
                            name="CheckCircle"
                            size={11}
                            color="#2554CF"
                          />
                        </Box>
                        <Box flex={1}>
                          <Typography variant="body" color="neutral-700">
                            {line}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  {!isCurrent ? (
                    <Box mt={14}>
                      <Button
                        label="Change to this plan"
                        variant="primary"
                        hasLinearGradient={plan.premium}
                        loading={loading}
                        disabled={loading || subscribingPlanId !== null}
                        onPress={() => onSelect?.(plan.id)}
                      />
                    </Box>
                  ) : null}
                </Box>
              </Box>
            </React.Fragment>
          )
        })}
      </ScrollView>
      <Box flexDirection="row" justifyContent="center" gap={6} py={10}>
        {plans.map((_, i) => (
          <Box
            key={i}
            width={activeIndex === i ? 18 : 6}
            height={6}
            borderRadius={3}
            backgroundColor="neutral-400"
            opacity={activeIndex === i ? 1 : 0.4}
          />
        ))}
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2
  }
})

export default SubscriptionPlans
