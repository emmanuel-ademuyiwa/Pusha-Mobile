import {
  Box,
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
  useGetBanks,
  useSendBankAccountOtp
} from '@/queries/bankAccountQuery'
import {toast} from '@/utils/toast'
import {router} from 'expo-router'
import React, {useEffect, useMemo, useState} from 'react'
import {TouchableOpacity} from 'react-native'
import {useFormik} from 'formik'

const Page = () => {
  const {data: banksData, isLoading: banksLoading, isError, refetch} =
    useGetBanks()
  const sendOtp = useSendBankAccountOtp()
  const createAccount = useCreateBankAccount()

  const [showOtp, setShowOtp] = useState(false)
  const [resolvedName, setResolvedName] = useState('')

  const bankItems: SelectItems = useMemo(() => {
    const raw = banksData as {records?: unknown[]} | unknown[] | undefined
    const list = Array.isArray(raw)
      ? raw
      : (raw as {records?: unknown[]})?.records ?? []
    if (!Array.isArray(list)) return []
    return list.map((b: {name?: string; code?: string}) => ({
      text: b.name ?? 'Bank',
      value: b.code ?? ''
    }))
  }, [banksData])

  const formik = useFormik({
    initialValues: {
      bankCode: '',
      accountNumber: '',
      otp: ''
    },
    validate: values => {
      const errors: Record<string, string> = {}
      if (!values.bankCode) errors.bankCode = 'Select a bank'
      if (!values.accountNumber) errors.accountNumber = 'Required'
      else if (values.accountNumber.replace(/\D/g, '').length < 10) {
        errors.accountNumber = 'Enter a valid account number'
      }
      if (showOtp && !values.otp) errors.otp = 'Enter the OTP'
      return errors
    },
    onSubmit: async values => {
      const account_number = values.accountNumber.replace(/\D/g, '')
      try {
        if (!showOtp) {
          await sendOtp.mutateAsync({})
          setShowOtp(true)
          toast.success('OTP sent to your email')
        } else {
          await createAccount.mutateAsync({
            account_number,
            bank_code: values.bankCode,
            otp: values.otp.trim()
          })
          toast.success('Bank account saved')
          formik.resetForm()
          setShowOtp(false)
          setResolvedName('')
          router.back()
        }
      } catch {
        toast.error('Something went wrong. Try again.')
      }
    }
  })

  useEffect(() => {
    const acct = formik.values.accountNumber.replace(/\D/g, '')
    const bank = formik.values.bankCode
    if (acct.length < 10 || !bank || showOtp) {
      setResolvedName('')
      return
    }
    const t = setTimeout(async () => {
      try {
        const res = await api.bankAccount.resolveBankAccount({
          account_number: acct,
          bank_code: bank
        })
        const name = (res as {data?: {data?: {account_name?: string}}})?.data
          ?.data?.account_name
        setResolvedName(name ?? '')
      } catch {
        setResolvedName('')
      }
    }, 500)
    return () => clearTimeout(t)
  }, [formik.values.accountNumber, formik.values.bankCode, showOtp])

  if (isError) {
    return <PageError reload={() => refetch().then(() => {})} />
  }

  return (
    <ScreenView
      navTitle={showOtp ? 'Verify OTP' : 'Add Bank Account'}
      alignNav="center"
      hasTopBanner={false}>
      {banksLoading && bankItems.length === 0 ? (
        <Box flex={1} alignItems="center" justifyContent="center">
          <PushaActivityIndicator />
        </Box>
      ) : (
        <KeyboardAwareScrollView>
          <Container>
            <Typography variant="c1" color="neutral-600" mb={16}>
              {showOtp
                ? 'Enter the OTP sent to your registered email, then confirm.'
                : 'Choose your bank and enter your account number. We will verify the account name before you continue.'}
            </Typography>

            {!showOtp ? (
              <>
                <SelectField
                  name="bank"
                  label="Bank"
                  placeholder="Select bank"
                  items={bankItems}
                  value={formik.values.bankCode}
                  onChangeValue={val => formik.setFieldValue('bankCode', val)}
                  loading={banksLoading}
                  marginBottom={16}
                />
                <TextField
                  name="accountNumber"
                  label="Account number"
                  keyboardType="number-pad"
                  value={formik.values.accountNumber}
                  onChangeText={t =>
                    formik.setFieldValue('accountNumber', t.replace(/[^\d]/g, ''))
                  }
                  error={formik.errors.accountNumber}
                  marginBottom={8}
                />
                {resolvedName ? (
                  <Box mb={16}>
                    <Typography variant="c1" color="neutral-600">
                      Account name
                    </Typography>
                    <Typography variant="body-semibold" color="secondary-500" mt={4}>
                      {resolvedName}
                    </Typography>
                  </Box>
                ) : (
                  <Box mb={16} />
                )}
              </>
            ) : (
              <TextField
                name="otp"
                label="OTP"
                keyboardType="number-pad"
                value={formik.values.otp}
                onChangeText={formik.handleChange('otp')}
                marginBottom={24}
              />
            )}

            <Button
              label={showOtp ? 'Verify & save' : 'Send OTP'}
              loading={sendOtp.isPending || createAccount.isPending}
              disabled={sendOtp.isPending || createAccount.isPending}
              onPress={() => formik.handleSubmit()}
            />

            {showOtp ? (
              <Box mt={12} alignItems="center">
                <TouchableOpacity
                  onPress={() => {
                    setShowOtp(false)
                    formik.setFieldValue('otp', '')
                  }}>
                  <Typography variant="c1-medium" color="primary-100">
                    ← Edit bank details
                  </Typography>
                </TouchableOpacity>
              </Box>
            ) : null}
          </Container>
        </KeyboardAwareScrollView>
      )}
    </ScreenView>
  )
}

export default Page
