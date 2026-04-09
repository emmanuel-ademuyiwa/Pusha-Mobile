import {
  AppIcon,
  Box,
  Button,
  Container,
  PageError,
  PushaActivityIndicator,
  Typography
} from '@/components/ui'
import {ScreenView} from '@/components/util/screen-view'
import {useGetBankAccount} from '@/queries/bankAccountQuery'
import {router} from 'expo-router'
import React from 'react'

const Page = () => {
  const {data: account, isLoading, isError, refetch} = useGetBankAccount()

  const a = account as
    | {
        bank_name?: string
        account_name?: string
        account_number?: string
        bank_code?: string
      }
    | undefined
    | null

  if (isError) {
    return <PageError reload={() => refetch().then(() => {})} />
  }

  const hasAccount = Boolean(
    a && (a.account_number || a.bank_name || a.account_name)
  )

  return (
    <ScreenView navTitle="Bank Details" alignNav="center" hasTopBanner={false}>
      <Container>
        <Typography variant="c1" color="neutral-600" mb={16}>
          This account receives your settlements and withdrawals. Add or change it
          after verifying with an OTP sent to your email.
        </Typography>

        {isLoading ? (
          <Box py={40} alignItems="center">
            <PushaActivityIndicator />
          </Box>
        ) : hasAccount ? (
          <Box
            backgroundColor="white"
            borderRadius={12}
            borderWidth={1}
            style={{borderColor: '#E9EAEB'}}
            padding={16}
            mb={16}>
            <Box flexDirection="row" alignItems="center" gap={10} mb={12}>
              <Box
                width={44}
                height={44}
                borderRadius={10}
                backgroundColor="light-primary"
                alignItems="center"
                justifyContent="center">
                <AppIcon name="Building2" size={22} color="#2554CF" />
              </Box>
              <Box flex={1}>
                <Typography variant="body-bold" color="secondary-500" numberOfLines={1}>
                  {a?.bank_name ?? 'Bank'}
                </Typography>
                <Typography variant="c2" color="neutral-600" mt={4} numberOfLines={1}>
                  {a?.account_name ?? '—'}
                </Typography>
              </Box>
            </Box>
            <Box
              flexDirection="row"
              justifyContent="space-between"
              py={8}
              borderTopWidth={1}
              style={{borderTopColor: '#F5F5F5'}}>
              <Typography variant="c1" color="neutral-600">
                Account number
              </Typography>
              <Typography variant="c1-bold" color="secondary-500">
                {a?.account_number ?? '—'}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            backgroundColor="neutral-100"
            borderRadius={12}
            padding={16}
            mb={16}
            alignItems="center">
            <Typography variant="body" color="neutral-600" textAlign="center">
              No bank account linked yet. Add an account to receive payouts.
            </Typography>
          </Box>
        )}

        <Button
          label={hasAccount ? 'Change bank account' : 'Add bank account'}
          LeftIcon={<AppIcon name="Plus" size={16} color="#fff" />}
          onPress={() => router.push('/(auth)/(more)/add-bank-account' as any)}
        />
      </Container>
    </ScreenView>
  )
}

export default Page
