import {
  AppIcon,
  AppModal,
  Badge,
  Box,
  Button,
  Container,
  PageError,
  PushaActivityIndicator,
  TextField,
  Typography
} from '@/components/ui'
import {KeyboardAwareScrollView} from '@/components/util/keyboard-aware-scroll-view'
import {ScreenView} from '@/components/util/screen-view'
import {useGetBankAccount} from '@/queries/bankAccountQuery'
import {
  useGetWalletBalance,
  useGetWalletTransactions,
  useMakeWithdrawal,
  useSendWithdrawalOtp
} from '@/queries/walletQuery'
import {formatCurrency, formatCurrencyFields} from '@/utils/currency'
import {toast} from '@/utils/toast'
import {LinearGradient} from 'expo-linear-gradient'
import {useFormik} from 'formik'
import {router} from 'expo-router'
import React, {useMemo, useRef, useState} from 'react'
import {Platform, StyleSheet, TouchableOpacity} from 'react-native'

import type {Modal as SheetModal} from '@/types/modal'
import {object, string} from 'yup'

const PRESET_WITHDRAWAL_AMOUNTS = [100, 500, 1000, 2000]
const STROKE = '#E9EAEB'
const PAGE_BG = '#F4F6F9'

const amountSchema = object({
  amount: string()
    .required('Amount is required')
    .test('valid', 'Please enter a valid amount', val => {
      if (!val) return false
      const n = parseFloat(String(val).replace(/[₦,\s]/g, ''))
      return !isNaN(n) && n > 0
    })
})

const otpSchema = object({
  otp: string()
    .required('OTP is required')
    .matches(/^\d{4,8}$/, 'OTP must be 4–8 digits')
})

export type WalletTransactionRow = {
  id?: string
  type?: string
  description?: string
  narration?: string
  reference?: string
  created_at: string
  amount: number
  status?: string
}

function formatStatusShort(status: string) {
  if (!status) return ''
  const s = status.toLowerCase()
  if (s.includes('success')) return 'Completed'
  if (s.includes('pending') || s.includes('process')) return 'Pending'
  if (s.includes('fail')) return 'Failed'
  return formatStatusLabel(status)
}

function formatStatusLabel(status: string) {
  if (!status) return '—'
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}

function getStatusTone(
  status: string
): 'success' | 'caution' | 'error' | 'neutral' {
  const s = (status || '').toLowerCase()
  if (s.includes('successful') || s === 'completed') return 'success'
  if (s.includes('pending') || s === 'processing') return 'caution'
  if (s.includes('failed') || s === 'rejected') return 'error'
  return 'neutral'
}

function SectionHeader({
  eyebrow,
  title,
  subtitle
}: {
  eyebrow: string
  title: string
  subtitle?: string
}) {
  return (
    <Box mb={14}>
      <Typography
        variant="c2-medium"
        color="primary-100"
        mb={6}
        style={{letterSpacing: 1.2}}>
        {eyebrow.toUpperCase()}
      </Typography>
      <Typography variant="h3-bold" color="secondary-500" mb={subtitle ? 6 : 0}>
        {title}
      </Typography>
      {subtitle ? (
        <Typography variant="c1" color="neutral-600" style={{lineHeight: 21}}>
          {subtitle}
        </Typography>
      ) : null}
    </Box>
  )
}

const Page = () => {
  const withdrawModalRef = useRef<SheetModal>(null)
  const [withdrawStep, setWithdrawStep] = useState<1 | 2>(1)

  const {
    data: wallet,
    isLoading: balanceLoading,
    isError,
    refetch
  } = useGetWalletBalance()
  const {
    data: transactions = [],
    isLoading: txLoading,
    refetch: refetchTx
  } = useGetWalletTransactions(1, 50)
  const {data: bankAccountRaw} = useGetBankAccount()

  const sendOtpMutation = useSendWithdrawalOtp()
  const makeWithdrawalMutation = useMakeWithdrawal()

  const bankAccount = useMemo(() => {
    const raw = bankAccountRaw as
      | {
          bank_account?: {
            bank_name?: string
            account_number?: string
            account_name?: string
          }
          bank_name?: string
          account_number?: string
          account_name?: string
        }
      | null
      | undefined
    const a = raw?.bank_account ?? raw
    if (!a?.account_number) return null
    return {
      bankName: a.bank_name || '',
      accountNumber: a.account_number || '',
      accountName: a.account_name || ''
    }
  }, [bankAccountRaw])

  const hasBankAccount = Boolean(bankAccount)

  const walletSummary = wallet as
    | {
        balance?: number
        total_earned?: number
        total_withdrawn?: number
        pending_withdrawals?: number
      }
    | undefined

  const availableBalance = walletSummary?.balance ?? 0
  const minAmount = 10
  const maxAmount = availableBalance

  const isLoading =
    (balanceLoading && walletSummary == null) ||
    (txLoading && transactions.length === 0)

  const withdrawFormik = useFormik({
    initialValues: {amount: '', otp: ''},
    validationSchema:
      withdrawStep === 1
        ? amountSchema
        : withdrawStep === 2
          ? otpSchema
          : undefined,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async values => {
      if (withdrawStep !== 2) return
      const amount = parseFloat(values.amount.replace(/[₦,\s]/g, ''))
      try {
        await makeWithdrawalMutation.mutateAsync({
          amount,
          otp: values.otp.replace(/\D/g, '')
        })
        toast.success(
          'Withdrawal submitted. Funds will reach your bank shortly.'
        )
        closeWithdrawModal()
      } catch (err: unknown) {
        const msg =
          err && typeof err === 'object' && 'message' in err
            ? String((err as {message?: string}).message)
            : 'Failed to process withdrawal. Please try again.'
        toast.error(msg)
      }
    }
  })

  const totalAmount =
    parseFloat(withdrawFormik.values.amount.replace(/[₦,\s]/g, '')) || 0

  const handleAmountChange = (text: string) => {
    const raw = text.replace(/[^\d.]/g, '')
    const formatted =
      raw === '' ? '' : formatCurrencyFields(raw.split('.')[0] ?? raw)
    withdrawFormik.setFieldValue('amount', formatted)
  }

  const handlePreset = (n: number) => {
    withdrawFormik.setFieldValue('amount', formatCurrencyFields(String(n)))
  }

  const handleContinue = async () => {
    if (withdrawStep !== 1) return
    await withdrawFormik.setFieldTouched('amount', true)
    const amount = totalAmount
    if (
      !withdrawFormik.values.amount ||
      amount < minAmount ||
      amount > maxAmount
    ) {
      return
    }
    try {
      await sendOtpMutation.mutateAsync({})
      toast.success('Enter the code we sent you.')
      withdrawFormik.setFieldValue('otp', '')
      withdrawFormik.setFieldTouched('otp', false)
      setWithdrawStep(2)
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as {message?: string}).message)
          : 'Failed to send OTP. Please try again.'
      toast.error(msg)
    }
  }

  const onWithdrawModalDismiss = () => {
    setWithdrawStep(1)
    withdrawFormik.resetForm({values: {amount: '', otp: ''}})
  }

  const closeWithdrawModal = () => {
    withdrawModalRef.current?.dismiss()
  }

  const handleWithdrawPress = () => {
    if (hasBankAccount) {
      withdrawModalRef.current?.present()
    } else {
      toast.error('Link a bank account in Integrations first.')
      router.push('/(auth)/(more)/integrations' as any)
    }
  }

  const amountErrorExtra = () => {
    if (!withdrawFormik.touched.amount) return undefined
    const num = totalAmount
    if (isNaN(num) || num === 0) return withdrawFormik.errors.amount as string
    if (num < minAmount) {
      return `Minimum is ${formatCurrency(minAmount, 'comma')}`
    }
    if (num > maxAmount) {
      return `Maximum is ${formatCurrency(maxAmount, 'comma')}`
    }
    return withdrawFormik.errors.amount as string | undefined
  }

  if (isError) {
    return (
      <PageError
        reload={async () => {
          await refetch()
          await refetchTx()
        }}
      />
    )
  }

  const earned = walletSummary?.total_earned
  const withdrawn = walletSummary?.total_withdrawn
  const pending = walletSummary?.pending_withdrawals

  const renderWithdrawFooter = () => (
    <Box flexDirection="row" gap={10}>
      {withdrawStep === 2 ? (
        <Box flex={1}>
          <Button
            variant="outline"
            label="Back"
            onPress={() => setWithdrawStep(1)}
          />
        </Box>
      ) : (
        <Box flex={1} />
      )}
      <Box flex={1}>
        {withdrawStep === 1 ? (
          <Button
            label={sendOtpMutation.isPending ? 'Sending…' : 'Continue'}
            loading={sendOtpMutation.isPending}
            disabled={
              !withdrawFormik.values.amount ||
              totalAmount < minAmount ||
              totalAmount > maxAmount ||
              sendOtpMutation.isPending
            }
            onPress={handleContinue}
          />
        ) : (
          <Button
            label={
              makeWithdrawalMutation.isPending ? 'Submitting…' : 'Confirm'
            }
            loading={makeWithdrawalMutation.isPending}
            disabled={
              !withdrawFormik.values.otp || makeWithdrawalMutation.isPending
            }
            onPress={() => withdrawFormik.handleSubmit()}
          />
        )}
      </Box>
    </Box>
  )

  return (
    <ScreenView navTitle="Wallet" alignNav="center" hasTopBanner={false}>
      <KeyboardAwareScrollView
        contentContainerStyle={[styles.scrollContent]}
        showsVerticalScrollIndicator={false}>
        <Container>
          <Box pt={24} pb={28}>
            <Box overflow="hidden">
              <Box>
                <Box
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  marginBottom={16}>
                  <Box flex={1} paddingRight={12}>
                    <Typography
                      variant="c2-medium"
                      color="neutral-600"
                      mb={8}
                      style={{letterSpacing: 0.8}}>
                      AVAILABLE BALANCE
                    </Typography>
                    <Typography
                      variant="h1-bold"
                      color="secondary-500"
                      style={{fontSize: 30, lineHeight: 38}}>
                      {isLoading
                        ? '—'
                        : formatCurrency(walletSummary?.balance ?? 0, 'comma')}
                    </Typography>
                  </Box>
                  <Box
                    width={52}
                    height={52}
                    borderRadius={16}
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor="light-primary"
                    borderWidth={1}
                    borderColor="stroke">
                    <AppIcon name="Wallet" size={26} color="#2554CF" />
                  </Box>
                </Box>

                <Box
                  flexDirection="row"
                  gap={10}
                  padding={14}
                  borderRadius={14}
                  style={{backgroundColor: 'rgba(255,255,255,0.85)'}}
                  borderWidth={1}
                  borderColor="stroke">
                  <Box flex={1}>
                    <Typography variant="c2" color="neutral-600" mb={4}>
                      Total earned
                    </Typography>
                    <Typography
                      variant="body-bold"
                      color="secondary-500"
                      numberOfLines={1}>
                      {isLoading && earned == null
                        ? '—'
                        : formatCurrency(earned ?? 0, 'short')}
                    </Typography>
                  </Box>
                  <Box width={1} style={{backgroundColor: STROKE}} />
                  <Box flex={1}>
                    <Typography variant="c2" color="neutral-600" mb={4}>
                      Withdrawn
                    </Typography>
                    <Typography
                      variant="body-bold"
                      color="secondary-500"
                      numberOfLines={1}>
                      {isLoading && withdrawn == null
                        ? '—'
                        : formatCurrency(withdrawn ?? 0, 'short')}
                    </Typography>
                  </Box>
                </Box>

                {pending != null && pending > 0 ? (
                  <Box
                    flexDirection="row"
                    alignItems="center"
                    gap={8}
                    marginTop={12}
                    padding={12}
                    borderRadius={12}
                    style={{backgroundColor: '#FFFBEB'}}
                    borderWidth={1}
                    borderColor="yellow-200">
                    <AppIcon name="Clock" size={18} color="#B45309" />
                    <Box flex={1}>
                      <Typography variant="c2-bold" style={{color: '#92400E'}}>
                        Pending settlement
                      </Typography>
                      <Typography variant="c2" style={{color: '#B45309'}}>
                        {formatCurrency(pending, 'comma')} in flight
                      </Typography>
                    </Box>
                  </Box>
                ) : null}

                <Box marginTop={18}>
                  <Button
                    label="Withdraw to bank"
                    onPress={handleWithdrawPress}
                    LeftIcon={<AppIcon name="Export" size={18} color="#fff" />}
                  />
                </Box>
              </Box>
            </Box>

            <SectionHeader
              eyebrow=""
              title="Transaction history"
              subtitle="Credits, debits, and withdrawals from your wallet."
            />

            {txLoading && transactions.length === 0 ? (
              <Box py={36} alignItems="center">
                <PushaActivityIndicator />
                <Typography variant="c1" color="neutral-600" mt={12}>
                  Loading your history…
                </Typography>
              </Box>
            ) : transactions.length === 0 ? (
              <Box
                padding={28}
                borderRadius={16}
                borderWidth={1}
                style={{
                  borderColor: STROKE,
                  borderStyle: 'dashed',
                  backgroundColor: '#FAFBFC'
                }}
                alignItems="center">
                <Box
                  width={56}
                  height={56}
                  borderRadius={28}
                  backgroundColor="neutral-100"
                  alignItems="center"
                  justifyContent="center"
                  marginBottom={14}>
                  <AppIcon name="DocumentText" size={28} color="#94A3B8" />
                </Box>
                <Typography
                  variant="body-bold"
                  color="secondary-500"
                  mb={6}
                  textAlign="center">
                  No transactions yet
                </Typography>
                <Typography
                  variant="c1"
                  color="neutral-600"
                  textAlign="center"
                  style={{lineHeight: 21}}>
                  When you receive payouts or withdraw, they will show up here
                  with full details.
                </Typography>
              </Box>
            ) : (
              <Box
                // style={{borderColor: STROKE, ...styles.listShadow}}
                overflow="hidden">
                {(transactions as WalletTransactionRow[]).map((tx, index) => {
                  const isCredit = (tx.type || '').toUpperCase() === 'CREDIT'
                  const title =
                    tx.narration ||
                    tx.description ||
                    tx.reference ||
                    'Transaction'
                  const dateShort = new Date(tx.created_at).toLocaleDateString(
                    undefined,
                    {month: 'short', day: 'numeric', year: 'numeric'}
                  )
                  const timeShort = new Date(tx.created_at).toLocaleTimeString(
                    undefined,
                    {hour: '2-digit', minute: '2-digit'}
                  )
                  const typeLabel = isCredit ? 'Credit' : 'Debit'
                  return (
                    <Box
                      key={tx.reference || tx.id || tx.created_at}
                      py={16}
                      flexDirection="row"
                      alignItems="center"
                      gap={14}
                      style={
                        index > 0
                          ? {
                              borderTopWidth: StyleSheet.hairlineWidth,
                              borderTopColor: STROKE
                            }
                          : undefined
                      }>
                      <Box
                        width={44}
                        height={44}
                        borderRadius={12}
                        alignItems="center"
                        justifyContent="center"
                        style={{
                          backgroundColor: isCredit
                            ? 'rgba(5, 150, 105, 0.12)'
                            : 'rgba(220, 38, 38, 0.1)'
                        }}>
                        <AppIcon
                          name={isCredit ? 'TrendingUp' : 'TrendingDown'}
                          size={20}
                          color={isCredit ? '#059669' : '#DC2626'}
                        />
                      </Box>
                      <Box flex={1} minWidth={0}>
                        <Box
                          flexDirection="row"
                          alignItems="center"
                          flexWrap="wrap"
                          gap={6}
                          mb={4}>
                          <Typography
                            variant="body-semibold"
                            color="secondary-500"
                            numberOfLines={2}
                            style={{flexShrink: 1}}>
                            {title}
                          </Typography>
                          <Badge
                            variant="light"
                            color={isCredit ? 'success' : 'error'}
                            label={typeLabel}
                          />
                          {tx.status ? (
                            <Badge
                              variant="light"
                              color={getStatusTone(tx.status)}
                              label={formatStatusShort(tx.status)}
                            />
                          ) : null}
                        </Box>
                        <Typography variant="c2" color="neutral-600">
                          {dateShort} · {timeShort}
                          {tx.reference ? ` · ${tx.reference}` : ''}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body-bold"
                        style={{
                          color: isCredit ? '#059669' : '#DC2626'
                        }}>
                        {isCredit ? '+' : '−'}
                        {formatCurrency(Math.abs(tx.amount), 'comma')}
                      </Typography>
                    </Box>
                  )
                })}
              </Box>
            )}
          </Box>
        </Container>
      </KeyboardAwareScrollView>

      <AppModal
        ref={withdrawModalRef}
        snapPoints={['70%']}
        onDismiss={onWithdrawModalDismiss}
        footerDivider
        header={
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography variant="h3-bold" color="secondary-500">
              Withdraw
            </Typography>
            <TouchableOpacity onPress={closeWithdrawModal} hitSlop={12}>
              <Typography variant="body-semibold" color="primary-100">
                Cancel
              </Typography>
            </TouchableOpacity>
          </Box>
        }
        footer={renderWithdrawFooter}>
        <Box marginBottom={8}>
          <Box flexDirection="row" gap={8} marginBottom={14}>
            <Box
              flex={1}
              height={4}
              borderRadius={2}
              style={{
                backgroundColor: withdrawStep >= 1 ? '#2554CF' : '#E2E8F0'
              }}
            />
            <Box
              flex={1}
              height={4}
              borderRadius={2}
              style={{
                backgroundColor: withdrawStep >= 2 ? '#2554CF' : '#E2E8F0'
              }}
            />
          </Box>
          <Typography variant="c2-medium" color="neutral-600" marginBottom={16}>
            {withdrawStep === 1
              ? 'Enter how much you want to move to your bank.'
              : 'Confirm the amount and enter your one-time code.'}
          </Typography>
        </Box>

        {withdrawStep === 1 ? (
          <Box gap={16}>
            <Box
              borderRadius={14}
              padding={14}
              borderWidth={1}
              style={{borderColor: STROKE, backgroundColor: PAGE_BG}}
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center">
              <Box>
                <Typography variant="c2" color="neutral-600">
                  You can withdraw up to
                </Typography>
                <Typography variant="h3-bold" color="secondary-500" mt={4}>
                  {formatCurrency(availableBalance, 'comma')}
                </Typography>
              </Box>
              <AppIcon name="Wallet" size={28} color="#94A3B8" />
            </Box>
            <TextField
              name="amount"
              label="Amount"
              keyboardType="decimal-pad"
              placeholder="0"
              value={withdrawFormik.values.amount}
              onChangeText={handleAmountChange}
              onBlur={withdrawFormik.handleBlur('amount')}
              error={amountErrorExtra()}
            />
            <Typography variant="c2" color="neutral-600">
              Min {formatCurrency(minAmount, 'comma')} · Max{' '}
              {formatCurrency(maxAmount, 'comma')}
            </Typography>
            <Box>
              <Typography variant="c2-medium" color="neutral-600" mb={10}>
                Quick amounts
              </Typography>
              <Box flexDirection="row" flexWrap="wrap" gap={10}>
                {PRESET_WITHDRAWAL_AMOUNTS.map(n => {
                  const selected = totalAmount === n
                  return (
                    <TouchableOpacity
                      key={n}
                      onPress={() => handlePreset(n)}
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 14,
                        borderRadius: 12,
                        borderWidth: 1.5,
                        borderColor: selected ? '#2554CF' : STROKE,
                        backgroundColor: selected ? '#EEF2FF' : '#FFFFFF',
                        ...Platform.select({
                          ios: {
                            shadowColor: '#0F172A',
                            shadowOffset: {width: 0, height: 1},
                            shadowOpacity: selected ? 0.08 : 0.04,
                            shadowRadius: 4
                          },
                          android: {elevation: selected ? 2 : 0}
                        })
                      }}>
                      <Typography
                        variant="c1-medium"
                        color={selected ? 'primary-100' : 'neutral-600'}>
                        {formatCurrency(n, 'comma')}
                      </Typography>
                    </TouchableOpacity>
                  )
                })}
              </Box>
            </Box>
          </Box>
        ) : (
          <Box gap={16}>
            {bankAccount ? (
              <LinearGradient
                colors={['#F8FAFC', '#FFFFFF']}
                style={{
                  borderRadius: 14,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: STROKE
                }}>
                <Box
                  flexDirection="row"
                  alignItems="center"
                  gap={10}
                  marginBottom={10}>
                  <Box
                    width={40}
                    height={40}
                    borderRadius={12}
                    backgroundColor="light-primary"
                    alignItems="center"
                    justifyContent="center">
                    <AppIcon name="Building" size={22} color="#2554CF" />
                  </Box>
                  <Box flex={1}>
                    <Typography variant="c2" color="neutral-600">
                      Sending to
                    </Typography>
                    <Typography variant="body-bold" color="secondary-500">
                      {bankAccount.bankName}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="c1" color="neutral-600">
                  {bankAccount.accountName}
                </Typography>
                <Typography variant="body-semibold" color="secondary-500" mt={4}>
                  {bankAccount.accountNumber}
                </Typography>
              </LinearGradient>
            ) : null}
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              paddingVertical={12}
              paddingHorizontal={12}
              borderRadius={12}
              style={{backgroundColor: PAGE_BG}}>
              <Typography variant="c1-medium" color="neutral-600">
                Withdrawal amount
              </Typography>
              <Typography variant="h3-bold" color="secondary-500">
                {formatCurrency(totalAmount, 'comma')}
              </Typography>
            </Box>
            <Box flexDirection="row" alignItems="flex-start" gap={10}>
              {/* <Box paddingTop={2}>
                <AppIcon name="security" size={20} color="#64748B" />
              </Box> */}
              <Typography
                variant="c1"
                color="neutral-600"
                numberOfLines={2}
                >
                We sent a verification code to your registered phone or email.
                Enter it below to complete the transfer.
              </Typography>
            </Box>
            <TextField
              name="otp"
              label="Verification code"
              keyboardType="number-pad"
              maxLength={8}
              placeholder="• • • • • •"
              value={withdrawFormik.values.otp}
              onChangeText={t =>
                withdrawFormik.setFieldValue('otp', t.replace(/\D/g, ''))
              }
              onBlur={withdrawFormik.handleBlur('otp')}
              error={
                withdrawFormik.touched.otp
                  ? (withdrawFormik.errors.otp as string | undefined)
                  : undefined
              }
            />
          </Box>
        )}
      </AppModal>
    </ScreenView>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 36
  }
})

export default Page
