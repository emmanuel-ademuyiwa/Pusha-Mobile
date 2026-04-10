import {Box, Typography} from '@/components/ui'
import AppIcon from '@/components/ui/app-icon'
import toast from '@/utils/toast'
import React from 'react'
import {TouchableOpacity} from 'react-native'

type CardRow = {
  id: string
  brand: 'Visa' | 'Mastercard'
  last4: string
  expiry: string
  isDefault?: boolean
}

/** Placeholder rows until card APIs are available in the app. */
const PLACEHOLDER_CARDS: CardRow[] = [
  {
    id: '1',
    brand: 'Visa',
    last4: '5678',
    expiry: '06/2025',
    isDefault: true
  },
  {
    id: '2',
    brand: 'Mastercard',
    last4: '5678',
    expiry: '06/2025'
  }
]

const PaymentMethodsSection = () => {
  return (
    <Box mt={24}>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        mb={12}>
        <Typography variant="h3-bold" color="secondary-500">
          Payment method
        </Typography>
        <TouchableOpacity
          onPress={() =>
            toast.info('Card management will be available in a future update.')
          }
          hitSlop={12}>
          <Typography variant="body-semibold" color="primary-100">
            Add Card
          </Typography>
        </TouchableOpacity>
      </Box>
      <Box gap={12}>
        {PLACEHOLDER_CARDS.map(card => {
          const highlighted = card.isDefault === true
          return (
            <Box
              key={card.id}
              flexDirection="row"
              alignItems="center"
              backgroundColor={highlighted ? 'light-primary' : 'white'}
              borderRadius={12}
              p={14}
              borderWidth={1}
              style={{
                borderColor: highlighted ? '#2554CF' : '#E9EAEB'
              }}>
              <Box
                width={44}
                height={28}
                borderRadius={6}
                backgroundColor="white"
                alignItems="center"
                justifyContent="center"
                borderWidth={1}
                style={{borderColor: '#E9EAEB'}}>
                <Typography variant="c2-bold" color="secondary-500">
                  {card.brand === 'Visa' ? 'VISA' : 'MC'}
                </Typography>
              </Box>
              <Box flex={1} ml={12}>
                <Typography variant="body-semibold" color="secondary-500">
                  **** **** **** {card.last4}
                </Typography>
                <Typography variant="c2" color="neutral-600" mt={2}>
                  Expiry {card.expiry}
                </Typography>
              </Box>
              {card.isDefault ? (
                <Box
                  backgroundColor="light-blue"
                  px={8}
                  py={4}
                  borderRadius={8}
                  mr={8}>
                  <Typography variant="c2-bold" color="primary-400">
                    Default
                  </Typography>
                </Box>
              ) : null}
              <TouchableOpacity
                hitSlop={12}
                onPress={() =>
                  toast.info('Manage payment methods coming soon.')
                }>
                <AppIcon name="MoreHorizontal" size={22} color="#64748B" />
              </TouchableOpacity>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default PaymentMethodsSection
