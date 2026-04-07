import {api} from '@/api'
import {
  AppCheckBox,
  Box,
  Button,
  Container,
  MultiSelectField,
  TextArea,
  TextField,
  Typography
} from '@/components/ui'
import {KeyboardAwareScrollView} from '@/components/util/keyboard-aware-scroll-view'
import {errorHandler} from '@/utils/errorHandler'
import {getFromVault} from '@/utils/storage'
import {router} from 'expo-router'
import {useFormik} from 'formik'
import React from 'react'
import {Dimensions, StyleSheet, Text, TouchableOpacity} from 'react-native'
import * as Yup from 'yup'

interface Step1DetailsProps {
  handleNext: () => void
}

const SCREEN_WIDTH = Dimensions.get('window').width
const ITEM_WIDTH = (SCREEN_WIDTH - 32 - 16) / 3 // container padding (32) + 2 gaps (16)

const SELL_CATEGORIES = [
  {emoji: '👗', label: 'Fashion & Clothing', value: 'fashion_clothing'},
  {emoji: '💄', label: 'Beauty & Personal Care', value: 'beauty_personal_care'},
  {emoji: '🍱', label: 'Food & Drinks', value: 'food_drinks'},
  {emoji: '📱', label: 'Electronics & Gadgets', value: 'electronics_gadgets'},
  {
    emoji: '💍',
    label: 'Jewellery & Accessories',
    value: 'jewellery_accessories'
  },
  {emoji: '🏠', label: 'Home & Living', value: 'home_living'},
  {emoji: '💊', label: 'Health & Wellness', value: 'health_wellness'},
  {emoji: '🎨', label: 'Art & Crafts', value: 'art_crafts'},
  {emoji: '👶', label: 'Kids & Baby', value: 'kids_baby'},
  {emoji: '👕', label: 'Print & Merch', value: 'print_merch'},
  {emoji: '🌽', label: 'Farm Produce', value: 'farm_produce'},
  {emoji: '📦', label: 'Other', value: 'other'}
]

const DELIVERY_LOCATIONS = [
  {text: 'Nationwide (everywhere in Nigeria)', value: 'nationwide'},
  {text: 'Lagos', value: 'lagos'},
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

const PAYMENT_METHODS = [
  {label: 'Payment before delivery', value: 'before_delivery'},
  {label: 'Payment on delivery', value: 'on_delivery'}
]

type FormValues = {
  businessName: string
  industry: string
  sellWhat: string
  businessDescription: string
  businessAddress: string
  deliveryLocations: string[]
  paymentMethods: string[]
}

const schema = Yup.object().shape({
  businessName: Yup.string().required('Business name is required'),
  industry: Yup.string().required('Please select your industry'),
  businessDescription: Yup.string().required('Please describe your business'),
  businessAddress: Yup.string().required('Business address is required')
})

const Step1Details = ({handleNext}: Step1DetailsProps) => {
  const user = getFromVault('user') as any

  const formik = useFormik<FormValues>({
    initialValues: {
      businessName: '',
      industry: '',
      sellWhat: '',
      businessDescription: '',
      businessAddress: '',
      deliveryLocations: [],
      paymentMethods: []
    },
    // validationSchema: schema,
    onSubmit: async values => {
      try {
        // await api.merchants.setupBusiness({
        //   name: values.businessName.trim(),
        //   address: values.businessAddress.trim(),
        //   description: values.businessDescription.trim(),
        //   business_tags: values.industry,
        //   currency: 'NGN',
        //   country: 'Nigeria',
        //   email: user?.email,
        //   phone_number: user?.phone_number ?? undefined
        // })
        // handleNext()
        router.replace('/dashboard')
      } catch (err) {
        errorHandler(err)
      }
    }
  })

  const togglePaymentMethod = (value: string) => {
    const current = formik.values.paymentMethods
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    formik.setFieldValue('paymentMethods', next)
  }

  return (
    <>
      <KeyboardAwareScrollView>
        <Container>
          <Box mt={16} gap={20} pb={32}>
            <Box gap={4}>
              <Typography variant="h2-bold" color="secondary-500">
                Tell us about your business
              </Typography>
              <Typography variant="body" color="neutral-500">
                Your AI assistant uses this to introduce itself to every
                customer
              </Typography>
            </Box>

            {/* Business name */}
            <Box>
              <Typography variant="c1-medium" color="neutral-600" mb={6}>
                Business name{' '}
                <Typography variant="c1-medium" color="error-100">
                  *
                </Typography>
              </Typography>
              <TextField
                name="businessName"
                placeholder="e.g. Adaeze's Fashion Store"
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

            {/* Category grid */}
            <Box gap={8}>
              <Box>
                <Typography variant="c1-medium" color="neutral-600">
                  What do you sell?{' '}
                  <Typography variant="c1-medium" color="error-100">
                    *
                  </Typography>
                </Typography>
                <Typography variant="c1" color="neutral-400">
                  Select a category
                </Typography>
              </Box>
              <Box flexDirection="row" flexWrap="wrap" gap={8}>
                {SELL_CATEGORIES.map(cat => {
                  const isSelected = formik.values.industry === cat.value
                  return (
                    <TouchableOpacity
                      key={cat.value}
                      activeOpacity={0.7}
                      onPress={() => {
                        formik.setFieldValue('industry', cat.value)
                        if (cat.value !== 'other') {
                          formik.setFieldValue('sellWhat', '')
                        }
                      }}
                      style={[
                        styles.categoryItem,
                        isSelected && styles.categoryItemSelected
                      ]}>
                      <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                      <Text
                        style={[
                          styles.categoryLabel,
                          isSelected && styles.categoryLabelSelected
                        ]}>
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </Box>
              {formik.touched.industry && formik.errors.industry ? (
                <Typography variant="c1" color="error-100">
                  {formik.errors.industry}
                </Typography>
              ) : null}
              {formik.values.industry === 'other' && (
                <TextField
                  name="sellWhat"
                  placeholder="Describe what you sell e.g. handmade candles"
                  value={formik.values.sellWhat}
                  onChangeText={formik.handleChange('sellWhat')}
                  blurAction={formik.setFieldTouched}
                />
              )}
            </Box>

            {/* Business description */}
            <Box>
              <Typography variant="c1-medium" color="neutral-600" mb={4}>
                Business description{' '}
                <Typography variant="c1-medium" color="error-100">
                  *
                </Typography>
              </Typography>
              <Typography variant="c1" color="neutral-400" mb={6}>
                Your AI uses this to introduce your business to every customer
              </Typography>
              <TextArea
                name="businessDescription"
                placeholder={
                  "e.g. We sell premium women's fashion in Lagos — from casual everyday wear to elegant occasion outfits. We're known for our fast delivery, quality fabrics, and personal styling advice. Customers can shop online and get orders within 24–48 hours."
                }
                value={formik.values.businessDescription}
                onChangeText={formik.handleChange('businessDescription')}
                blurAction={formik.setFieldTouched}
                height={120}
                error={
                  formik.touched.businessDescription &&
                  formik.errors.businessDescription
                    ? formik.errors.businessDescription
                    : ''
                }
              />
            </Box>

            {/* Business address */}
            <Box>
              <Typography variant="c1-medium" color="neutral-600" mb={6}>
                Business address{' '}
                <Typography variant="c1-medium" color="error-100">
                  *
                </Typography>
              </Typography>
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

            {/* Delivery locations */}
            <Box>
              <Typography variant="c1-medium" color="neutral-600" mb={6}>
                Delivery locations
              </Typography>
              <MultiSelectField
                name="Delivery locations"
                placeholder="Select delivery locations"
                items={DELIVERY_LOCATIONS}
                value={formik.values.deliveryLocations}
                onChangeValue={values =>
                  formik.setFieldValue('deliveryLocations', values)
                }
              />
            </Box>

            {/* Payment preference */}
            <Box gap={10}>
              <Box>
                <Typography variant="c1-medium" color="neutral-600">
                  Payment preference
                </Typography>
                <Typography variant="c1" color="neutral-400">
                  How do you accept payment? Select all that apply.
                </Typography>
              </Box>
              {PAYMENT_METHODS.map(pm => {
                const isChecked = formik.values.paymentMethods.includes(
                  pm.value
                )
                return (
                  <TouchableOpacity
                    key={pm.value}
                    activeOpacity={0.7}
                    onPress={() => togglePaymentMethod(pm.value)}
                    style={[
                      styles.paymentItem,
                      isChecked && styles.paymentItemSelected
                    ]}>
                    <AppCheckBox
                      value={isChecked}
                      onValueChange={() => togglePaymentMethod(pm.value)}
                    />
                    <Typography
                      variant="body"
                      color={isChecked ? 'secondary-500' : 'neutral-600'}>
                      {pm.label}
                    </Typography>
                  </TouchableOpacity>
                )
              })}
            </Box>
          </Box>
        </Container>
      </KeyboardAwareScrollView>
      <Container>
        <Box mt={8}>
          <Button
            // hasLinearGradient
            label="Continue"
            loading={formik.isSubmitting}
            onPress={() => formik.handleSubmit()}
          />
        </Box>
      </Container>
    </>
  )
}

const styles = StyleSheet.create({
  categoryItem: {
    width: ITEM_WIDTH,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EDF2F8',
    backgroundColor: '#FFFFFF'
  },
  categoryItemSelected: {
    borderColor: '#2554C7',
    backgroundColor: '#EEF3FF'
  },
  categoryEmoji: {
    fontSize: 22,
    lineHeight: 28
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 15,
    color: '#45505F'
  },
  categoryLabelSelected: {
    color: '#2554C7'
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EDF2F8',
    backgroundColor: '#FFFFFF'
  },
  paymentItemSelected: {
    backgroundColor: '#F0F5FF',
    borderColor: '#2554C7'
  }
})

export default Step1Details
