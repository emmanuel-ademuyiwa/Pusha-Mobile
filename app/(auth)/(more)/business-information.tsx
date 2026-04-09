import {
  Box,
  Button,
  Container,
  PageError,
  PushaActivityIndicator,
  SelectField,
  TextArea,
  TextField,
  Typography
} from '@/components/ui'
import type {SelectItems} from '@/components/ui/select-field'
import {KeyboardAwareScrollView} from '@/components/util/keyboard-aware-scroll-view'
import {ScreenView} from '@/components/util/screen-view'
import type {ISetupBusinessPayload} from '@/api/merchantsRespository'
import {useGetBusiness, useUpdateBusiness} from '@/queries/merchantQuery'
import {useGetUserProfile} from '@/queries/userQuery'
import {toast} from '@/utils/toast'
import React, {useMemo} from 'react'
import {useFormik} from 'formik'

const CURRENCY_ITEMS: SelectItems = [
  {text: 'Nigerian naira (NGN)', value: 'NGN'},
  {text: 'US Dollar (USD)', value: 'USD'},
  {text: 'British Pound (GBP)', value: 'GBP'}
]

const Page = () => {
  const {data: business, isLoading, isError, refetch} = useGetBusiness()
  const {data: user} = useGetUserProfile()
  const updateBusiness = useUpdateBusiness()

  const u = user as {email?: string; phone_number?: string} | undefined

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: (business as {name?: string})?.name ?? '',
      email: u?.email ?? '',
      phone_number: u?.phone_number ?? '',
      address: (business as {address?: string})?.address ?? '',
      city: (business as {city?: string})?.city ?? '',
      state: (business as {state?: string})?.state ?? '',
      country: (business as {country?: string})?.country ?? 'Nigeria',
      currency: (business as {currency?: string})?.currency ?? 'NGN',
      business_tags: (business as {business_tags?: string})?.business_tags ?? '',
      description: (business as {description?: string})?.description ?? '',
      ai_order_threshold:
        (business as {ai_order_threshold?: number})?.ai_order_threshold != null
          ? String((business as {ai_order_threshold?: number}).ai_order_threshold)
          : ''
    },
    onSubmit: async values => {
      const payload: ISetupBusinessPayload = {
        name: values.name.trim(),
        address: values.address.trim(),
        city: values.city.trim(),
        state: values.state.trim(),
        country: values.country.trim() || 'Nigeria',
        currency: values.currency,
        business_tags: values.business_tags.trim(),
        description: values.description.trim(),
        email: values.email.trim(),
        phone_number: values.phone_number.trim() || undefined,
        ai_order_threshold:
          values.ai_order_threshold.trim() === ''
            ? undefined
            : Number(values.ai_order_threshold)
      }
      try {
        await updateBusiness.mutateAsync(payload)
        toast.success('Business information saved')
        refetch()
      } catch {
        toast.error('Could not save. Try again.')
      }
    }
  })

  const currencyValue = useMemo(
    () =>
      CURRENCY_ITEMS.some(i => i.value === formik.values.currency)
        ? formik.values.currency
        : 'NGN',
    [formik.values.currency]
  )

  if (isError) {
    return <PageError reload={() => refetch().then(() => {})} />
  }

  return (
    <ScreenView navTitle="Business Information" alignNav="center" hasTopBanner={false}>
      {isLoading && !business ? (
        <Box flex={1} alignItems="center" justifyContent="center">
          <PushaActivityIndicator />
        </Box>
      ) : (
        <KeyboardAwareScrollView>
          <Container>
            <Typography variant="c1" color="neutral-600" mb={16}>
              Update your business details. This information is shown to customers where
              applicable.
            </Typography>

            <TextField
              name="name"
              label="Business name"
              value={formik.values.name}
              onChangeText={formik.handleChange('name')}
              marginBottom={16}
            />
            <TextField
              name="email"
              label="Business email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formik.values.email}
              onChangeText={formik.handleChange('email')}
              marginBottom={16}
            />
            <TextField
              name="phone_number"
              label="Phone number"
              keyboardType="phone-pad"
              value={formik.values.phone_number}
              onChangeText={formik.handleChange('phone_number')}
              marginBottom={16}
            />
            <TextField
              name="address"
              label="Address"
              value={formik.values.address}
              onChangeText={formik.handleChange('address')}
              marginBottom={16}
            />
            <TextField
              name="city"
              label="City"
              value={formik.values.city}
              onChangeText={formik.handleChange('city')}
              marginBottom={16}
            />
            <TextField
              name="state"
              label="State / region"
              value={formik.values.state}
              onChangeText={formik.handleChange('state')}
              marginBottom={16}
            />
            <TextField
              name="country"
              label="Country"
              value={formik.values.country}
              onChangeText={formik.handleChange('country')}
              marginBottom={16}
            />

            <SelectField
              name="currency"
              label="Currency"
              placeholder="Select currency"
              items={CURRENCY_ITEMS}
              value={currencyValue}
              onChangeValue={val => formik.setFieldValue('currency', val)}
              marginBottom={16}
            />

            <TextField
              name="business_tags"
              label="Business tags"
              placeholder="e.g. retail, fashion"
              value={formik.values.business_tags}
              onChangeText={formik.handleChange('business_tags')}
              marginBottom={16}
            />

            <TextArea
              name="description"
              label="Description"
              value={formik.values.description}
              onChangeText={formik.handleChange('description')}
              marginBottom={16}
            />

            <TextField
              name="ai_order_threshold"
              label="AI order threshold (optional)"
              keyboardType="numeric"
              value={formik.values.ai_order_threshold}
              onChangeText={formik.handleChange('ai_order_threshold')}
              marginBottom={24}
            />

            <Button
              variant="tertiary"
              label="Save"
              loading={updateBusiness.isPending}
              disabled={updateBusiness.isPending}
              onPress={() => formik.handleSubmit()}
            />
          </Container>
        </KeyboardAwareScrollView>
      )}
    </ScreenView>
  )
}

export default Page
