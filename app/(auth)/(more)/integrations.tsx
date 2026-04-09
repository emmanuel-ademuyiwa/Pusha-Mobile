import {
  AppIcon,
  Box,
  BZSwitch,
  Button,
  Container,
  PageError,
  PushaActivityIndicator,
  SelectField,
  TextField,
  Typography
} from '@/components/ui'
import type {SelectItems} from '@/components/ui/select-field'
import {KeyboardAwareScrollView} from '@/components/util/keyboard-aware-scroll-view'
import {ScreenView} from '@/components/util/screen-view'
import {api} from '@/api'
import {
  useCreateBankAccount,
  useGetBankAccount,
  useGetBanks,
  useSendBankAccountOtp
} from '@/queries/bankAccountQuery'
import {useGetBusiness, useSubmitKyc} from '@/queries/merchantQuery'
import {
  useBusinessIntegrations,
  useFacebookAuthUrl
} from '@/queries/socialsQuery'
import {toast} from '@/utils/toast'
import * as Clipboard from 'expo-clipboard'
import Constants from 'expo-constants'
import {useFormik} from 'formik'
import React, {useEffect, useMemo, useState} from 'react'
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native'
import {object, string} from 'yup'

type ChatIntegration = {
  id: string
  name: string
  description: string
  connected: boolean
  enabled: boolean
  comingSoon?: boolean
}

const INTEGRATIONS_STATIC = {
  sales: {
    id: 'sales',
    name: 'Sales',
    description: 'Enable AI to close sales for you',
    enabled: false
  },
  chat: [
    {
      id: 'facebook',
      name: 'Facebook',
      description:
        'Connect once with Facebook to enable Facebook, Instagram, and WhatsApp messaging integrations',
      comingSoon: false
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      description: 'Connect your TikTok business account',
      comingSoon: true
    },
    {
      id: 'webchat',
      name: 'Web Chat',
      description: 'Enable web chat on your website',
      comingSoon: false
    }
  ]
} as const

const defaultChatIntegrations: ChatIntegration[] = INTEGRATIONS_STATIC.chat.map(
  c => ({
    ...c,
    connected: false,
    enabled: false
  })
)

const defaultSalesEnabled: boolean = INTEGRATIONS_STATIC.sales.enabled

const kycSchema = object({
  bvn: string()
    .required('BVN is required')
    .matches(/^\d{11}$/, 'BVN must be exactly 11 digits')
})

function escapeHtmlAttr(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function maskAccountNumber(num: string) {
  return num.replace(/\d(?=\d{4})/g, '*')
}

function getIntegrationIcon(id: string): {name: string; color: string} {
  switch (id) {
    case 'facebook':
      return {name: 'People', color: '#1877F2'}
    case 'tiktok':
      return {name: 'Video', color: '#000000'}
    case 'webchat':
      return {name: 'Global', color: '#2554C7'}
    default:
      return {name: 'Message', color: '#2554C7'}
  }
}

const LIST_BORDER = '#E9EAEB'

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 32
  },
  mono: {
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace'
    }),
    fontSize: 11,
    lineHeight: 17,
    color: '#CBD5E1'
  }
})

function SurfaceGroup({children}: {children: React.ReactNode}) {
  return (
    <Box
      mb={20}
      borderRadius={12}
      borderWidth={1}
      style={{borderColor: LIST_BORDER}}
      backgroundColor="white"
      overflow="hidden">
      {children}
    </Box>
  )
}

function Hairline() {
  return <Box height={1} style={{backgroundColor: '#F5F5F5'}} />
}

function SectionTitle({title, subtitle}: {title: string; subtitle?: string}) {
  return (
    <Box mb={14}>
      <Typography variant="h3-bold" color="secondary-500">
        {title}
      </Typography>
      {subtitle ? (
        <Typography variant="c1" color="neutral-600" mt={6} style={{lineHeight: 21}}>
          {subtitle}
        </Typography>
      ) : null}
    </Box>
  )
}

function NoticeCard({title, body}: {title: string; body: string}) {
  return (
    <Box
      mb={16}
      padding={16}
      borderRadius={14}
      borderWidth={1}
      borderColor="stroke"
      backgroundColor="light-primary">
      <Typography variant="body-bold" color="primary-100" mb={6}>
        {title}
      </Typography>
      <Typography variant="c1" color="secondary-500" style={{lineHeight: 22}}>
        {body}
      </Typography>
    </Box>
  )
}

const Page = () => {
  const [salesEnabled, setSalesEnabled] = useState<boolean>(defaultSalesEnabled)
  const [chatIntegrations, setChatIntegrations] = useState<ChatIntegration[]>(
    defaultChatIntegrations
  )
  const [showBankAccountForm, setShowBankAccountForm] = useState(false)
  const [showOtpStep, setShowOtpStep] = useState(false)
  const [showKycForm, setShowKycForm] = useState(false)
  const [resolvedAccountName, setResolvedAccountName] = useState('')
  const [resolvingAccountName, setResolvingAccountName] = useState(false)

  const {
    data: integrationsData,
    isLoading: integrationsLoading,
    isError: integrationsError,
    refetch: refetchIntegrations
  } = useBusinessIntegrations()
  const {data: business} = useGetBusiness()
  const hasCompletedKyc = Boolean(
    (business as {kyc_verified?: boolean} | undefined)?.kyc_verified
  )
  const businessId = (business as {id?: string} | undefined)?.id ?? null
  const businessName = (business as {name?: string} | undefined)?.name ?? null

  const {
    data: bankAccount,
    isLoading: isBankAccountLoading,
    refetch: refetchBank
  } = useGetBankAccount()
  const {data: banksData, isLoading: isBanksLoading} = useGetBanks()

  const submitKycMutation = useSubmitKyc()
  const createBankAccountMutation = useCreateBankAccount()
  const sendOtpMutation = useSendBankAccountOtp()
  const facebookAuthUrlMutation = useFacebookAuthUrl()

  const mergedChatIntegrations = useMemo((): ChatIntegration[] => {
    const apiById = new Map(
      (integrationsData?.integrations ?? []).map(i => [
        i.id,
        {connected: i.connected, enabled: i.enabled ?? false}
      ])
    )
    return INTEGRATIONS_STATIC.chat.map(c => {
      const api = apiById.get(c.id)
      return {
        id: c.id,
        name: c.name,
        description: c.description,
        comingSoon: c.comingSoon,
        connected: api?.connected ?? false,
        enabled: api?.enabled ?? false
      }
    })
  }, [integrationsData?.integrations])

  const mergedSalesEnabled =
    integrationsData?.salesEnabled ?? defaultSalesEnabled

  useEffect(() => {
    if (integrationsData == null) return
    setChatIntegrations(mergedChatIntegrations)
    setSalesEnabled(mergedSalesEnabled)
  }, [integrationsData, mergedChatIntegrations, mergedSalesEnabled])

  const bankOptions: SelectItems = useMemo(() => {
    const raw = banksData as {records?: unknown[]} | unknown[] | undefined
    const list = Array.isArray(raw)
      ? raw
      : ((raw as {records?: unknown[]})?.records ?? [])
    if (!Array.isArray(list)) return []
    return list.map((b: unknown) => {
      const row = b as {name?: string; code?: string}
      return {
        text: row.name ?? '',
        value: row.code ?? ''
      }
    })
  }, [banksData])

  const bankAccountData = useMemo(() => {
    const raw = bankAccount as
      | {
          bank_account?: {
            bank_name?: string
            account_number?: string
            account_name?: string
            bank_code?: string
          }
          bank_name?: string
          account_number?: string
          account_name?: string
          bank_code?: string
        }
      | null
      | undefined
    const a = raw?.bank_account ?? raw
    if (!a?.account_number) return null
    return {
      bankName: a.bank_name || '',
      accountNumber: a.account_number || '',
      accountName: a.account_name || '',
      bankCode: a.bank_code || ''
    }
  }, [bankAccount])

  const hasBankAccount = Boolean(bankAccountData)

  const webchatWidgetOrigin =
    (Constants.expoConfig?.extra as {webchatWidgetOrigin?: string} | undefined)
      ?.webchatWidgetOrigin ?? 'https://pusha-web-app.vercel.app'

  const webchatScript = useMemo(() => {
    const idVal = businessId || 'YOUR_BUSINESS_ID'
    const nameVal = businessName
      ? escapeHtmlAttr(businessName)
      : 'YOUR_BUSINESS_NAME'
    return `<script src="${webchatWidgetOrigin}/webchat/widget.js" data-business-id="${idVal}" data-business-name="${nameVal}"></script>`
  }, [businessId, businessName, webchatWidgetOrigin])

  const kycFormik = useFormik({
    initialValues: {bvn: ''},
    validationSchema: kycSchema,
    onSubmit: async (values, {resetForm}) => {
      try {
        await submitKycMutation.mutateAsync({bvn: values.bvn})
        toast.success('KYC verification completed successfully!')
        setShowKycForm(false)
        resetForm()
      } catch (err: unknown) {
        const message =
          err && typeof err === 'object' && 'message' in err
            ? String((err as {message?: string}).message)
            : 'Failed to verify KYC. Please try again.'
        toast.error(message)
      }
    }
  })

  const bankFormik = useFormik({
    initialValues: {
      bankCode: bankAccountData?.bankCode || '',
      accountNumber: bankAccountData?.accountNumber || '',
      otp: ''
    },
    enableReinitialize: true,
    validate: values => {
      const errors: Record<string, string> = {}
      if (!values.bankCode) errors.bankCode = 'Bank is required'
      if (!values.accountNumber) {
        errors.accountNumber = 'Account number is required'
      } else {
        const digits = values.accountNumber.replace(/\D/g, '')
        if (digits.length < 10) {
          errors.accountNumber = 'Account number must be at least 10 digits'
        } else if (!/^\d+$/.test(digits)) {
          errors.accountNumber = 'Account number must contain only numbers'
        }
      }
      if (showOtpStep && !values.otp) {
        errors.otp = 'OTP is required'
      } else if (
        values.otp &&
        !/^\d{4,6}$/.test(values.otp.replace(/\D/g, ''))
      ) {
        errors.otp = 'OTP must be 4-6 digits'
      }
      return errors
    },
    onSubmit: async values => {
      const account_number = values.accountNumber.replace(/\D/g, '')
      try {
        if (!showOtpStep) {
          await sendOtpMutation.mutateAsync({})
          setShowOtpStep(true)
          toast.success('Please check your email for the OTP')
        } else {
          await createBankAccountMutation.mutateAsync({
            account_number,
            bank_code: values.bankCode,
            otp: values.otp.replace(/\D/g, '')
          })
          toast.success('Bank account created successfully')
          setShowBankAccountForm(false)
          setShowOtpStep(false)
          bankFormik.resetForm()
          setResolvedAccountName('')
          refetchBank()
        }
      } catch (err: unknown) {
        const message =
          err && typeof err === 'object' && 'message' in err
            ? String((err as {message?: string}).message)
            : 'Failed to create bank account. Please try again.'
        toast.error(message)
      }
    }
  })

  useEffect(() => {
    const acct = bankFormik.values.accountNumber.replace(/\D/g, '')
    const bank = bankFormik.values.bankCode
    if (acct.length < 10 || !bank || showOtpStep) {
      setResolvedAccountName('')
      setResolvingAccountName(false)
      return
    }
    const t = setTimeout(() => {
      setResolvingAccountName(true)
      api.bankAccount
        .resolveBankAccount({account_number: acct, bank_code: bank})
        .then(res => {
          const name = (res as {data?: {data?: {account_name?: string}}})?.data
            ?.data?.account_name
          setResolvedAccountName(name ?? '')
        })
        .catch(() => setResolvedAccountName(''))
        .finally(() => setResolvingAccountName(false))
    }, 500)
    return () => clearTimeout(t)
  }, [bankFormik.values.bankCode, bankFormik.values.accountNumber, showOtpStep])

  const handleChatToggle = (id: string) => {
    setChatIntegrations(prev =>
      prev.map(item =>
        item.id === id ? {...item, enabled: !item.enabled} : item
      )
    )
  }

  const handleCopyWebchatScript = async () => {
    try {
      await Clipboard.setStringAsync(webchatScript)
      toast.success('Webchat script copied to clipboard')
    } catch {
      toast.error('Could not copy. Try again.')
    }
  }

  const handleConnectFacebook = async () => {
    try {
      const url = await facebookAuthUrlMutation.mutateAsync()
      if (url) {
        const can = await Linking.canOpenURL(url)
        if (can) await Linking.openURL(url)
        else toast.error('Cannot open link')
      } else {
        toast.error('Could not get Facebook connect URL')
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as {message?: string}).message)
          : 'Failed to start Facebook connection'
      toast.error(message)
    }
  }

  if (integrationsError) {
    return <PageError reload={() => refetchIntegrations().then(() => {})} />
  }

  return (
    <ScreenView
      color="white"
      navTitle="Integrations"
      alignNav="center"
      hasTopBanner={false}>
      {integrationsLoading && !integrationsData ? (
        <Box flex={1} alignItems="center" justifyContent="center" py={48}>
          <PushaActivityIndicator />
        </Box>
      ) : (
        <KeyboardAwareScrollView contentContainerStyle={styles.page}>
          <Box paddingTop={24}>
            <Container>
              <Typography variant="c1" color="neutral-600" mb={20} style={{lineHeight: 22}}>
                Manage AI sales payouts and messaging channels for your business.
              </Typography>

              <SectionTitle
                title="Sales & settlement"
                subtitle="Enable AI sales, verify your identity, and link a bank account for settlements."
              />

              <SurfaceGroup>
                <Box padding={16}>
                <Box
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={14}>
                  <Box
                    flexDirection="row"
                    alignItems="center"
                    flex={1}
                    gap={14}>
                    <Box
                      width={52}
                      height={52}
                      borderRadius={16}
                      alignItems="center"
                      justifyContent="center"
                      backgroundColor="light-primary"
                      borderWidth={1}
                      borderColor="stroke">
                      <AppIcon name="Flash" size={26} color="#2554CF" />
                    </Box>
                    <Box flex={1}>
                      <Typography
                        variant="body-bold"
                        color="secondary-500"
                        mb={6}>
                        {INTEGRATIONS_STATIC.sales.name}
                      </Typography>
                      <Typography
                        variant="c1"
                        color="neutral-600"
                        style={{lineHeight: 21}}>
                        {INTEGRATIONS_STATIC.sales.description}
                      </Typography>
                    </Box>
                  </Box>
                  <BZSwitch
                    value={salesEnabled}
                    onValueChange={() => setSalesEnabled(s => !s)}
                  />
                </Box>
                </Box>

                {salesEnabled && (
                  <>
                    <Hairline />
                    <Box padding={16} backgroundColor="neutral-50">
                  <Box
                    flexDirection="row"
                    alignItems="flex-start"
                    gap={12}
                    mb={16}>
                    <Box
                      width={44}
                      height={44}
                      borderRadius={14}
                      alignItems="center"
                      justifyContent="center"
                      backgroundColor="success-200"
                      borderWidth={1}
                      borderColor="stroke">
                      <AppIcon name="CreditCard" size={22} color="#059669" />
                    </Box>
                    <Box flex={1}>
                      <Typography
                        variant="body-bold"
                        color="secondary-500"
                        mb={6}>
                        Settlement account
                      </Typography>
                      <Typography
                        variant="c1"
                        color="neutral-600"
                        style={{lineHeight: 21}}>
                        {hasCompletedKyc
                          ? 'Receive payouts from AI sales into your verified bank account.'
                          : 'Verify your identity first — then you can add a bank account.'}
                      </Typography>
                    </Box>
                  </Box>

                  {!showBankAccountForm && !showKycForm && hasCompletedKyc && (
                    <Box mb={12}>
                      {!isBankAccountLoading && (
                        <Button
                          label={
                            hasBankAccount ? 'Change account' : 'Add account'
                          }
                          size="sm"
                          onPress={() => {
                            setShowBankAccountForm(true)
                            setShowOtpStep(false)
                            bankFormik.resetForm()
                            setResolvedAccountName('')
                          }}
                          LeftIcon={
                            <AppIcon
                              name={hasBankAccount ? 'replace' : 'Plus'}
                              size={16}
                              color="#fff"
                            />
                          }
                        />
                      )}
                    </Box>
                  )}

                  {!hasCompletedKyc && !showKycForm && (
                    <Button
                      label="Complete KYC"
                      size="sm"
                      onPress={() => setShowKycForm(true)}
                      LeftIcon={
                        <AppIcon name="security" size={16} color="#fff" />
                      }
                    />
                  )}

                  {!hasCompletedKyc && showKycForm && (
                    <Box>
                      <NoticeCard
                        title="Identity verification"
                        body="Enter your 11-digit BVN. This is required before you can add a settlement account."
                      />
                      <TextField
                        name="bvn"
                        label="BVN (Bank Verification Number)"
                        placeholder="Enter your 11-digit BVN"
                        keyboardType="number-pad"
                        maxLength={11}
                        value={kycFormik.values.bvn}
                        onChangeText={kycFormik.handleChange('bvn')}
                        error={
                          kycFormik.touched.bvn
                            ? (kycFormik.errors.bvn as string | undefined)
                            : undefined
                        }
                        marginBottom={8}
                      />
                      <Typography variant="c2" color="neutral-600" mb={16}>
                        Used only for verification; handled securely.
                      </Typography>
                      <Box flexDirection="row" gap={12}>
                        <Box flex={1}>
                          <Button
                            variant="outline"
                            label="Cancel"
                            onPress={() => {
                              setShowKycForm(false)
                              kycFormik.resetForm()
                            }}
                          />
                        </Box>
                        <Box flex={1}>
                          <Button
                            label={
                              submitKycMutation.isPending
                                ? 'Verifying...'
                                : 'Verify KYC'
                            }
                            loading={submitKycMutation.isPending}
                            disabled={submitKycMutation.isPending}
                            onPress={() => kycFormik.handleSubmit()}
                          />
                        </Box>
                      </Box>
                    </Box>
                  )}

                  {hasCompletedKyc && (
                    <>
                      {isBankAccountLoading ? (
                        <Box alignItems="center" py={28}>
                          <PushaActivityIndicator />
                          <Typography variant="c1" color="neutral-600" mt={10}>
                            Loading bank account...
                          </Typography>
                        </Box>
                      ) : hasBankAccount &&
                        bankAccountData &&
                        !showBankAccountForm ? (
                        <Box
                          borderRadius={16}
                          padding={16}
                          style={{
                            backgroundColor: '#F6FDF9',
                            borderWidth: 1,
                            borderColor: '#BBF7D0'
                          }}>
                          <Box
                            flexDirection="row"
                            alignItems="center"
                            gap={8}
                            mb={14}>
                            <AppIcon
                              name="TickCircle"
                              size={20}
                              color="#16A34A"
                            />
                            <Typography
                              variant="c1-bold"
                              style={{color: '#15803D'}}>
                              Verified for payouts
                            </Typography>
                          </Box>
                          <Box
                            height={1}
                            style={{backgroundColor: '#D1FAE5'}}
                            mb={12}
                          />
                          <Box
                            flexDirection="row"
                            justifyContent="space-between"
                            py={6}>
                            <Typography variant="c1" color="neutral-600">
                              Bank
                            </Typography>
                            <Typography
                              variant="body-bold"
                              color="secondary-500"
                              textAlign="right"
                              flexShrink={1}
                              ml={12}>
                              {bankAccountData.bankName ||
                                bankOptions.find(
                                  b => b.value === bankAccountData.bankCode
                                )?.text ||
                                'N/A'}
                            </Typography>
                          </Box>
                          <Box
                            flexDirection="row"
                            justifyContent="space-between"
                            py={6}>
                            <Typography variant="c1" color="neutral-600">
                              Account no.
                            </Typography>
                            <Typography variant="c1-bold" color="secondary-500">
                              {maskAccountNumber(bankAccountData.accountNumber)}
                            </Typography>
                          </Box>
                          <Box
                            flexDirection="row"
                            justifyContent="space-between"
                            py={6}>
                            <Typography variant="c1" color="neutral-600">
                              Name
                            </Typography>
                            <Typography
                              variant="body-bold"
                              color="secondary-500"
                              textAlign="right"
                              flexShrink={1}
                              ml={12}>
                              {bankAccountData.accountName}
                            </Typography>
                          </Box>
                        </Box>
                      ) : showBankAccountForm ? (
                        <Box>
                          {showOtpStep && (
                            <NoticeCard
                              title="Check your email"
                              body="We sent a one-time code to your registered email. Enter it below to finish linking your account."
                            />
                          )}

                          <SelectField
                            name="bank"
                            label="Bank"
                            placeholder="Select bank"
                            items={bankOptions}
                            value={bankFormik.values.bankCode}
                            onChangeValue={val => {
                              bankFormik.setFieldValue('bankCode', val ?? '')
                              setResolvedAccountName('')
                            }}
                            loading={isBanksLoading}
                            search
                            marginBottom={16}
                          />

                          <TextField
                            name="accountNumber"
                            label="Account number"
                            keyboardType="number-pad"
                            value={bankFormik.values.accountNumber}
                            onChangeText={t =>
                              bankFormik.setFieldValue(
                                'accountNumber',
                                t.replace(/[^\d]/g, '')
                              )
                            }
                            error={
                              bankFormik.touched.accountNumber
                                ? bankFormik.errors.accountNumber
                                : undefined
                            }
                            marginBottom={12}
                          />

                          {resolvedAccountName ? (
                            <Box
                              padding={14}
                              borderRadius={14}
                              mb={16}
                              flexDirection="row"
                              alignItems="center"
                              gap={10}
                              style={{
                                backgroundColor: '#F0FDF4',
                                borderWidth: 1,
                                borderColor: '#BBF7D0'
                              }}>
                              <AppIcon
                                name="TickCircle"
                                size={18}
                                color="#16A34A"
                              />
                              <Typography
                                variant="body-semibold"
                                color="secondary-500"
                                flex={1}>
                                {resolvedAccountName}
                              </Typography>
                            </Box>
                          ) : null}

                          {resolvingAccountName && !showOtpStep ? (
                            <Typography
                              variant="c1"
                              color="neutral-600"
                              mb={12}>
                              Looking up account name…
                            </Typography>
                          ) : null}

                          {showOtpStep && (
                            <>
                              <TextField
                                name="otp"
                                label="OTP"
                                keyboardType="number-pad"
                                maxLength={6}
                                value={bankFormik.values.otp}
                                onChangeText={t =>
                                  bankFormik.setFieldValue(
                                    'otp',
                                    t.replace(/[^\d]/g, '')
                                  )
                                }
                                error={
                                  bankFormik.touched.otp
                                    ? bankFormik.errors.otp
                                    : undefined
                                }
                                helperText="Enter the OTP sent to your email"
                                marginBottom={8}
                              />
                              <TouchableOpacity
                                onPress={async () => {
                                  try {
                                    await sendOtpMutation.mutateAsync({})
                                    toast.success(
                                      'OTP resent — check your email'
                                    )
                                  } catch {
                                    toast.error('Failed to resend OTP')
                                  }
                                }}
                                disabled={sendOtpMutation.isPending}>
                                <Typography
                                  variant="c1-medium"
                                  color="primary-100">
                                  Resend OTP
                                </Typography>
                              </TouchableOpacity>
                              <Box height={16} />
                            </>
                          )}

                          <Box flexDirection="row" gap={12}>
                            <Box flex={1}>
                              <Button
                                variant="outline"
                                label="Cancel"
                                onPress={() => {
                                  setShowBankAccountForm(false)
                                  setShowOtpStep(false)
                                  bankFormik.resetForm()
                                  setResolvedAccountName('')
                                }}
                              />
                            </Box>
                            <Box flex={1}>
                              <Button
                                label={
                                  createBankAccountMutation.isPending ||
                                  sendOtpMutation.isPending
                                    ? showOtpStep
                                      ? 'Creating...'
                                      : 'Sending OTP...'
                                    : showOtpStep
                                      ? 'Create account'
                                      : 'Send OTP'
                                }
                                loading={
                                  createBankAccountMutation.isPending ||
                                  sendOtpMutation.isPending
                                }
                                disabled={
                                  createBankAccountMutation.isPending ||
                                  sendOtpMutation.isPending ||
                                  resolvingAccountName
                                }
                                onPress={() => bankFormik.handleSubmit()}
                              />
                            </Box>
                          </Box>
                        </Box>
                      ) : null}
                    </>
                  )}
                    </Box>
                  </>
                )}
              </SurfaceGroup>

              <SectionTitle
                title="Messaging"
                subtitle="One Meta connection covers Facebook, Instagram, and WhatsApp."
              />

              <SurfaceGroup>
                {chatIntegrations.map((integration, index) => {
                  const isComingSoon = Boolean(integration.comingSoon)
                  const isEnabled =
                    integration.enabled && integration.connected
                  const canConnect =
                    !isComingSoon &&
                    integration.id === 'facebook' &&
                    (!integration.connected || !integration.enabled)
                  const isConnecting = facebookAuthUrlMutation.isPending
                  const iconCfg = getIntegrationIcon(integration.id)

                  return (
                    <React.Fragment key={integration.id}>
                      {index > 0 ? <Hairline /> : null}
                      <Box padding={16}>
                        <Box flexDirection="row" alignItems="flex-start" gap={12}>
                          <Box
                            width={42}
                            height={42}
                            borderRadius={12}
                            alignItems="center"
                            justifyContent="center"
                            backgroundColor="neutral-100"
                            borderWidth={1}
                            borderColor="stroke">
                            <AppIcon
                              name={iconCfg.name}
                              size={22}
                              color={iconCfg.color}
                            />
                          </Box>
                          <Box flex={1} minWidth={0}>
                            <Box
                              flexDirection="row"
                              alignItems="flex-start"
                              justifyContent="space-between"
                              gap={10}>
                              <Box flex={1} minWidth={0}>
                                <Box
                                  flexDirection="row"
                                  alignItems="center"
                                  flexWrap="wrap"
                                  gap={6}
                                  mb={6}>
                                  <Typography
                                    variant="body-bold"
                                    color="secondary-500">
                                    {integration.name}
                                  </Typography>
                                  {isComingSoon ? (
                                    <Box
                                      px={8}
                                      py={3}
                                      borderRadius={100}
                                      style={{backgroundColor: '#FFF7ED'}}>
                                      <Typography
                                        variant="c2-medium"
                                        style={{color: '#C2410C'}}>
                                        Soon
                                      </Typography>
                                    </Box>
                                  ) : integration.connected ? (
                                    <Box
                                      px={8}
                                      py={3}
                                      borderRadius={100}
                                      style={{backgroundColor: '#ECFDF5'}}>
                                      <Typography
                                        variant="c2-medium"
                                        style={{color: '#15803D'}}>
                                        Live
                                      </Typography>
                                    </Box>
                                  ) : (
                                    <Box
                                      px={8}
                                      py={3}
                                      borderRadius={100}
                                      style={{backgroundColor: '#FEF2F2'}}>
                                      <Typography
                                        variant="c2-medium"
                                        style={{color: '#B91C1C'}}>
                                        Off
                                      </Typography>
                                    </Box>
                                  )}
                                </Box>
                                <Typography
                                  variant="c2"
                                  color="neutral-600"
                                  style={{lineHeight: 18}}>
                                  {integration.description}
                                </Typography>
                              </Box>
                              {canConnect ? (
                                <Button
                                  size="sm"
                                  label={isConnecting ? 'Connecting...' : 'Connect'}
                                  loading={isConnecting}
                                  disabled={isConnecting}
                                  onPress={handleConnectFacebook}
                                  LeftIcon={
                                    <AppIcon name="Share" size={16} color="#fff" />
                                  }
                                />
                              ) : (
                                <BZSwitch
                                  value={
                                    integration.connected
                                      ? integration.enabled
                                      : false
                                  }
                                  onValueChange={() =>
                                    handleChatToggle(integration.id)
                                  }
                                  disabled={
                                    !integration.connected || isComingSoon
                                  }
                                />
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                      {integration.id === 'webchat' && isEnabled ? (
                        <Box
                          borderTopWidth={1}
                          style={{borderTopColor: LIST_BORDER}}
                          backgroundColor="neutral-50"
                          padding={16}>
                          <Box
                            flexDirection="row"
                            alignItems="center"
                            gap={8}
                            mb={12}>
                            <AppIcon name="Global" size={18} color="#142952" />
                            <Typography variant="body-bold" color="secondary-500">
                              Website snippet
                            </Typography>
                          </Box>
                          <Typography variant="c2" color="neutral-600" mb={10}>
                            Paste before the closing {'</body>'} tag.
                          </Typography>
                          <Box
                            borderRadius={10}
                            padding={12}
                            mb={12}
                            style={{
                              backgroundColor: '#0F172A',
                              borderWidth: 1,
                              borderColor: '#1E293B'
                            }}>
                            <Text selectable style={styles.mono}>
                              {webchatScript}
                            </Text>
                          </Box>
                          <Button
                            label="Copy script"
                            variant="outline"
                            onPress={handleCopyWebchatScript}
                            LeftIcon={
                              <AppIcon name="ClipboardList" size={16} color="#142952" />
                            }
                          />
                        </Box>
                      ) : null}
                    </React.Fragment>
                  )
                })}
              </SurfaceGroup>
            </Container>
          </Box>
        </KeyboardAwareScrollView>
      )}
    </ScreenView>
  )
}

export default Page
