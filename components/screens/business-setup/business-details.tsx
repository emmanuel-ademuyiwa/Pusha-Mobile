import {api} from '@/api'
import {
  Box,
  Button,
  Container,
  SelectField,
  TextArea,
  TextField,
  Typography
} from '@/components/ui'
import {KeyboardAwareScrollView} from '@/components/util/keyboard-aware-scroll-view'
import {errorHandler} from '@/utils/errorHandler'
import {getFromVault} from '@/utils/storage'
import {useFormik} from 'formik'
import React from 'react'
import * as Yup from 'yup'

interface BusinessDetailsProps {
  handleNext: () => void
}

type SelectItems = {text: string; value: string}[]

const businessTypes: SelectItems = [
  {text: 'Sole Proprietorship', value: 'sole'},
  {text: 'Partnership', value: 'partnership'},
  {text: 'Limited Liability', value: 'limited'},
  {text: 'Non-profit', value: 'nonprofit'}
]

const currencies: SelectItems = [
  {text: 'Nigerian Naira', value: 'NGN'},
  {text: 'US Dollar', value: 'USD'},
  {text: 'British Pound', value: 'GBP'}
]

const nigerianStates: SelectItems = [
  {text: 'Abia', value: 'abia'},
  {text: 'Adamawa', value: 'adamawa'},
  {text: 'Akwa Ibom', value: 'akwa_ibom'},
  {text: 'Anambra', value: 'anambra'},
  {text: 'Bauchi', value: 'bauchi'},
  {text: 'Bayelsa', value: 'bayelsa'},
  {text: 'Benue', value: 'benue'},
  {text: 'Borno', value: 'borno'},
  {text: 'Cross River', value: 'cross_river'},
  {text: 'Delta', value: 'delta'},
  {text: 'Ebonyi', value: 'ebonyi'},
  {text: 'Edo', value: 'edo'},
  {text: 'Ekiti', value: 'ekiti'},
  {text: 'Enugu', value: 'enugu'},
  {text: 'Federal Capital Territory (FCT)', value: 'fct'},
  {text: 'Gombe', value: 'gombe'},
  {text: 'Imo', value: 'imo'},
  {text: 'Jigawa', value: 'jigawa'},
  {text: 'Kaduna', value: 'kaduna'},
  {text: 'Kano', value: 'kano'},
  {text: 'Katsina', value: 'katsina'},
  {text: 'Kebbi', value: 'kebbi'},
  {text: 'Kogi', value: 'kogi'},
  {text: 'Kwara', value: 'kwara'},
  {text: 'Lagos', value: 'lagos'},
  {text: 'Nasarawa', value: 'nasarawa'},
  {text: 'Niger', value: 'niger'},
  {text: 'Ogun', value: 'ogun'},
  {text: 'Ondo', value: 'ondo'},
  {text: 'Osun', value: 'osun'},
  {text: 'Oyo', value: 'oyo'},
  {text: 'Plateau', value: 'plateau'},
  {text: 'Rivers', value: 'rivers'},
  {text: 'Sokoto', value: 'sokoto'},
  {text: 'Taraba', value: 'taraba'},
  {text: 'Yobe', value: 'yobe'},
  {text: 'Zamfara', value: 'zamfara'}
]

type FormValues = {
  businessName: string
  businessType: string
  businessAddress: string
  currency: string
  aiOrderThreshold: string
  city: string
  state: string
  businessTags: string
  description: string
}

const schema = Yup.object().shape({
  businessName: Yup.string().required('Business name is required'),
  businessType: Yup.string().required('Select business type'),
  businessAddress: Yup.string().required('Business address is required'),
  currency: Yup.string().required('Select currency'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  businessTags: Yup.string().required('Business tags are required'),
  description: Yup.string().required('Business description is required'),
  aiOrderThreshold: Yup.string()
    .optional()
    .test(
      'is-valid-number',
      'Threshold must be a valid amount',
      value => value == null || value === '' || !Number.isNaN(Number(value))
    )
    .test(
      'is-non-negative',
      'Threshold cannot be negative',
      value => value == null || value === '' || Number(value) >= 0
    )
})

const LabelField = ({label, required}: {label: string; required?: boolean}) => (
  <Typography variant="c1-medium" color="neutral-600" mb={6}>
    {label}
    {required && (
      <Typography variant="c1-medium" color="error-100">
        {' *'}
      </Typography>
    )}
  </Typography>
)

const BusinessDetails = ({handleNext}: BusinessDetailsProps) => {
  const user = getFromVault('user') as any

  const formik = useFormik<FormValues>({
    initialValues: {
      businessName: '',
      businessType: '',
      businessAddress: '',
      currency: 'NGN',
      aiOrderThreshold: '',
      city: '',
      state: '',
      businessTags: '',
      description: ''
    },
    validationSchema: schema,
    onSubmit: async values => {
      try {
        const payload = {
          name: values.businessName.trim(),
          address: values.businessAddress.trim(),
          city: values.city.trim(),
          state: values.state,
          country: 'Nigeria',
          currency: values.currency,
          business_tags: values.businessTags.trim(),
          description: values.description.trim(),
          email: user?.email,
          phone_number: user?.phone_number ?? undefined,
          ai_order_threshold:
            values.aiOrderThreshold === ''
              ? undefined
              : Number(values.aiOrderThreshold)
        }
        await api.merchants.setupBusiness(payload)
        handleNext()
      } catch (err) {
        errorHandler(err)
      }
    }
  })

  return (
    <>
      <KeyboardAwareScrollView>
        <Container>
          <Box mt={24} gap={16}>
            <Typography variant="h2-bold" color="secondary-500">
              A little about your business
            </Typography>

            <Box gap={12}>
              <Box>
                <LabelField label="Business name" required />
                <TextField
                  name="businessName"
                  placeholder="Enter your business name"
                  value={formik.values.businessName}
                  onChangeText={formik.handleChange('businessName')}
                  blurAction={formik.setFieldTouched}
                  error={
                    formik.touched.businessName && formik.errors.businessName
                      ? formik.errors.businessName
                      : ''
                  }
                />
              </Box>

              <Box>
                <LabelField label="Business type" required />
                <SelectField
                  name="businessType"
                  label="Business type"
                  placeholder="Select business type"
                  items={businessTypes}
                  value={formik.values.businessType}
                  onChangeValue={value =>
                    formik.setFieldValue('businessType', value ?? '')
                  }
                  search={false}
                />
                {formik.touched.businessType && formik.errors.businessType ? (
                  <Typography variant="c1" color="error-100" mt={4}>
                    {formik.errors.businessType}
                  </Typography>
                ) : null}
              </Box>

              <Box>
                <LabelField label="Business address" required />
                <TextField
                  name="businessAddress"
                  placeholder="Enter your business address"
                  value={formik.values.businessAddress}
                  onChangeText={formik.handleChange('businessAddress')}
                  blurAction={formik.setFieldTouched}
                  error={
                    formik.touched.businessAddress &&
                    formik.errors.businessAddress
                      ? formik.errors.businessAddress
                      : ''
                  }
                />
              </Box>

              <Box>
                <LabelField label="City" required />
                <TextField
                  name="city"
                  placeholder="Enter your business city"
                  value={formik.values.city}
                  onChangeText={formik.handleChange('city')}
                  blurAction={formik.setFieldTouched}
                  error={
                    formik.touched.city && formik.errors.city
                      ? formik.errors.city
                      : ''
                  }
                />
              </Box>

              <Box>
                <LabelField label="State" required />
                <SelectField
                  name="state"
                  label="State"
                  placeholder="Select state"
                  items={nigerianStates}
                  value={formik.values.state}
                  onChangeValue={value =>
                    formik.setFieldValue('state', value ?? '')
                  }
                  search
                />
                {formik.touched.state && formik.errors.state ? (
                  <Typography variant="c1" color="error-100" mt={4}>
                    {formik.errors.state}
                  </Typography>
                ) : null}
              </Box>

              <Box>
                <LabelField label="Business tags" required />
                <TextField
                  name="businessTags"
                  placeholder="e.g., retail, electronics, accessories"
                  value={formik.values.businessTags}
                  onChangeText={formik.handleChange('businessTags')}
                  blurAction={formik.setFieldTouched}
                  error={
                    formik.touched.businessTags && formik.errors.businessTags
                      ? formik.errors.businessTags
                      : ''
                  }
                />
              </Box>

              <Box>
                <LabelField label="Business description" required />
                <TextArea
                  name="description"
                  placeholder="Briefly describe what your business does, products, services, and key information..."
                  value={formik.values.description}
                  onChangeText={formik.handleChange('description')}
                  blurAction={formik.setFieldTouched}
                  height={100}
                  helperText="This information will be used by AI to provide accurate responses to your customers."
                  error={
                    formik.touched.description && formik.errors.description
                      ? formik.errors.description
                      : ''
                  }
                />
              </Box>

              <Box>
                <LabelField label="Currency" required />
                <SelectField
                  name="currency"
                  label="Currency"
                  placeholder="Select currency"
                  items={currencies}
                  value={formik.values.currency}
                  onChangeValue={value =>
                    formik.setFieldValue('currency', value ?? 'NGN')
                  }
                  search={false}
                />
                {formik.touched.currency && formik.errors.currency ? (
                  <Typography variant="c1" color="error-100" mt={4}>
                    {formik.errors.currency}
                  </Typography>
                ) : null}
              </Box>

              <Box>
                <LabelField label="AI order threshold" />
                <TextField
                  name="aiOrderThreshold"
                  placeholder="e.g. 50000"
                  keyboardType="numeric"
                  inputMode="numeric"
                  value={formik.values.aiOrderThreshold}
                  onChangeText={formik.handleChange('aiOrderThreshold')}
                  blurAction={formik.setFieldTouched}
                  helperText="Chats are transferred to a human when order amount reaches this threshold."
                  error={
                    formik.touched.aiOrderThreshold &&
                    formik.errors.aiOrderThreshold
                      ? formik.errors.aiOrderThreshold
                      : ''
                  }
                />
              </Box>
            </Box>
          </Box>
        </Container>
      </KeyboardAwareScrollView>
      <Container>
        <Box mt={8} >
          <Button
            // hasLinearGradient
            label="Go home"
            loading={formik.isSubmitting}
            onPress={() => formik.handleSubmit()}
          />
        </Box>
      </Container>
    </>
  )
}

export default BusinessDetails
