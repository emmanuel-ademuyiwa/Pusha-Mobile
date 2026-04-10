import CancelSubscription from '@/components/modals/cancel-subscription'
import {Box, TextAction, Typography} from '@/components/ui'
import AppIcon from '@/components/ui/app-icon'
import React, {useState} from 'react'
import {TouchableOpacity} from 'react-native'

export type SubscriptionRecord = {
  plan_id?: string
  next_billing_date?: string
  end_date?: string
  amount?: number | string
  plan?: {id?: string; name?: string}
  [key: string]: unknown
}

const formatLongDate = (raw?: string) => {
  if (!raw) return '—'
  try {
    const d = new Date(raw)
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  } catch {
    return '—'
  }
}

const formatNgn = (n?: number | string) => {
  if (n === undefined || n === null) return '₦0'
  const num = Number(n)
  if (Number.isNaN(num)) return '₦0'
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2
  }).format(num)
}

interface SubscribedBillingTabProps {
  subscription: SubscriptionRecord
}

const SubscribedBillingTab = ({subscription}: SubscribedBillingTabProps) => {
  const [cancelOpen, setCancelOpen] = useState(false)
  const nextDate =
    subscription.next_billing_date || subscription.end_date || ''
  const amount = subscription.amount

  return (
    <Box>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        mb={12}>
        <Typography variant="h3-bold" color="secondary-500">
          Billing Cycle
        </Typography>
        <TextAction variant="c1-bold" color="error-100" onPress={() => setCancelOpen(true)}>Cancel Subscription</TextAction>
      </Box>

      <Box
        backgroundColor="light-primary"
        borderRadius={14}
        p={16}
        borderWidth={1}
        style={{borderColor: '#B0C4DE'}}>
        <Box flexDirection="row" justifyContent="space-between" alignItems="flex-end">
          <Box flex={1}>
            <Typography
              variant="c2-bold"
              color="primary-400"
              mb={6}
              style={{letterSpacing: 0.6}}>
              NEXT BILLING DATE
            </Typography>
            <Typography variant="h3-bold" color="secondary-500">
              {formatLongDate(nextDate)}
            </Typography>
          </Box>
          <Typography variant="h3-bold" color="secondary-500">
            {formatNgn(amount)}
          </Typography>
        </Box>
      </Box>

      <Box mt={28}>
        <Typography variant="h3-bold" color="secondary-500" mb={14}>
          Billing History
        </Typography>
        <Box alignItems="center" py={24} px={16}>
          <AppIcon name="Info" size={32} color="#94A3B8" />
          <Typography
            variant="body"
            color="neutral-600"
            textAlign="center"
            mt={10}>
            Your subscription invoices will appear here when available.
          </Typography>
        </Box>
      </Box>

      <CancelSubscription show={cancelOpen} onClose={() => setCancelOpen(false)} />
    </Box>
  )
}

export default SubscribedBillingTab
