import { useQueryClient } from '@tanstack/react-query'
import * as FileSystem from 'expo-file-system'
import React, { forwardRef, useEffect, useRef, useState } from 'react'
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker'

import {
  AppIcon,
  AppModal,
  AppPressable,
  Box,
  Button,
  SearchableInput,
  SelectField,
  TextField,
  Typography
} from '@/components/ui'
import { API_STATUS } from '@/constants/ApiConstants'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useForwardedRef } from '@/hooks/useForwardedRef'
import { useMediaPersmissions } from '@/hooks/useMediaPersmissions'
import { useListCustomers } from '@/queries/customersQuery'
import {
  usePaymentsActions,
  usePaymentsLoadingState
} from '@/store/paymentsStore'
import { ImageInterface, SaleChannel } from '@/types'
import { Modal } from '@/types/modal'
import { errorHandler } from '@/utils/errorHandler'
import toast from '@/utils/toast'
import { useFormik } from 'formik'
import ProductSelectorModal from './product-selector-modal'

interface Product {
  id: string
  name: string
  price: number
  // Add other product properties as needed
}

interface ProductSaleData {
  unitsSold: string
  amount: string
}

interface AddNewSaleModalProps {
  onSuccess?: () => void
  availableProducts?: Product[]
}

const AddNewSaleModal = forwardRef<Modal, AddNewSaleModalProps>(
  (props, ref) => {
    const addProductModalRef = useRef<Modal>(null)
    const innerRef = useForwardedRef(ref)
    const queryClient = useQueryClient()
    const {requestPermission} = useMediaPersmissions()

    // Payments store
    const {createPayment} = usePaymentsActions()
    const {createPayment: isCreatingPayment} = usePaymentsLoadingState()

    // Customers data
    const {data: customersData, isLoading: isLoadingCustomers} = useListCustomers({
      limit: 100 // Get first 100 customers for the dropdown
    })

    // Local State
    const [submitApiState, setSubmitApiState] = useState<API_STATUS>(
      API_STATUS.IDLE
    )
    const [receipt, setReceipt] = useState<ImageInterface | null>(null)
    const [selectedProducts, setSelectedProducts] = useState<any[]>([])
    console.log("🚀 ~ selectedProducts:", selectedProducts)

    // Image handling for receipt
    const imgDir = FileSystem.documentDirectory + 'sale-receipts/'

    const ensureDirExists = async () => {
      const dirInfo = await FileSystem.getInfoAsync(imgDir)
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(imgDir, {intermediates: false})
      }
    }

    const selectReceiptImage = async () => {
      try {
        await requestPermission()
        const result = await ImagePicker.openPicker({
          multiple: false,
          compressImageMaxWidth: 1000,
          compressImageMaxHeight: 1000,
          cropping: true,
          cropperChooseText: 'crop'
        })

        await saveReceiptImage(result)
      } catch (err: any) {
        console.log('Image selection error:', err)
        if (err.code !== 'E_PICKER_CANCELLED') {
          toast.info('Failed to select receipt image. Please try again.')
        }
      }
    }

    const saveReceiptImage = async (selectedImage: ImageOrVideo) => {
      try {
        await ensureDirExists()

        const timestamp = Date.now()
        const randomId = Math.random().toString(36).substring(7)
        const extension = selectedImage.path.split('.').pop() || 'jpg'
        const fileName = `receipt_${timestamp}_${randomId}.${extension}`
        const newUri = imgDir + fileName

        try {
          await FileSystem.copyAsync({
            from: selectedImage.path,
            to: newUri
          })

          setReceipt({
            image: newUri,
            isCropped: true,
            isUrlImage: false
          })
        } catch (copyError) {
          console.log('Error copying image:', copyError)
          setReceipt({
            image: selectedImage.path,
            isCropped: true,
            isUrlImage: false
          })
        }
      } catch (err) {
        console.log('Error saving receipt image:', err)
        toast.info('Failed to save receipt image. Please try again.')
      }
    }

    const removeReceiptImage = async () => {
      if (receipt && !receipt.isUrlImage) {
        try {
          const imgInfo = await FileSystem.getInfoAsync(receipt.image)
          if (imgInfo.exists) {
            await FileSystem.deleteAsync(receipt.image, {idempotent: true})
          }
        } catch (err) {
          console.log('Error deleting receipt image:', err)
        }
      }
      setReceipt(null)
    }

    useEffect(() => {
      return () => {
        // Cleanup on unmount
        if (receipt && !receipt.isUrlImage) {
          FileSystem.deleteAsync(receipt.image, {idempotent: true}).catch(
            () => {}
          )
        }
      }
    }, [])

    const handleSaleSubmit = async (values: any) => {
      console.log('🚀 ~ handleSaleSubmit ~ values:', values)
      if (!values.customer_name.trim() && !values.customer_id) {
        toast.info("Please enter customer's name")
        return
      }

      if (!values.method) {
        toast.info('Please select a payment method')
        return
      }

      if (!values.status) {
        toast.info('Please select a payment status')
        return
      }

      if (selectedProducts.length === 0) {
        toast.info('Please select at least one product')
        return
      }

      // Validate product data
      for (let i = 0; i < values.products.length; i++) {
        const product = values.products[i]
        const productName = selectedProducts[i]?.name || `Product ${i + 1}`
        
        if (!product.unitsSold || !product.amount) {
          toast.info(`Please fill all fields for ${productName}`)
          return
        }
        
        // Validate that units sold and amount are valid numbers
        if (isNaN(parseInt(product.unitsSold)) || isNaN(parseFloat(product.amount))) {
          toast.info(`Please enter valid numbers for ${productName}`)
          return
        }
        
        // Validate positive numbers
        if (parseInt(product.unitsSold) <= 0 || parseFloat(product.amount) <= 0) {
          toast.info(`Please enter positive numbers for ${productName}`)
          return
        }
      }

      try {
        setSubmitApiState(API_STATUS.LOADING)

        // Calculate total amount
        const totalAmount = (values.products && values.products.length > 0) ? values.products.reduce(
          (sum: number, product: ProductSaleData) => {
            return sum + (parseFloat(product.amount) || 0)
          },
          0
        ) : 0

        // Create payment payload matching the API structure
        const paymentPayload = {
          customer_name: values.customer_name,
          ...(values.customer_id && {customer_id: values.customer_id}),
          ...(values.category &&
            !values.customer_id && {customer_name: values.customer_name}),
          amount: totalAmount,
          method: values.method,
          status: values.status,
          sale_channel: values.saleChannel,
          // Only include reference if payment method is transfer and reference is provided
          ...(values.method === 'TRANSFER' &&
            values.reference && {
              reference: values.reference
            }),
          sale_items: values.products.map(
            (product: ProductSaleData, index: number) => ({
              product_id: selectedProducts[index].id,
              quantity: parseInt(product.unitsSold) || 1,
              price: parseFloat(product.amount) || 0
            })
          )
        }

        console.log({paymentPayload})

        // Create payment using the payments store
        await createPayment(paymentPayload, () => {
          // Success callback
          props.onSuccess?.()

          // Invalidate related queries
          queryClient.invalidateQueries({queryKey: [QUERY_KEYS.PAYMENTS]})
          queryClient.invalidateQueries({queryKey: [QUERY_KEYS.SALES]})

          innerRef.current?.dismiss()

          // Reset form
          formik.resetForm()
          setSelectedProducts([])
          setReceipt(null)
        })

        setSubmitApiState(API_STATUS.SUCCESS)
      } catch (err) {
        setSubmitApiState(API_STATUS.ERROR)
        errorHandler(err)
      }
    }

    const renderFooter = () => (
      <Button
        label="Record sale"
        onPress={formik.handleSubmit}
        loading={isCreatingPayment || submitApiState === API_STATUS.LOADING}
      />
    )

    const formik = useFormik({
      initialValues: {
        customer_name: '',
        customer_id: '',
        status: '',
        method: '',
        reference: '',
        saleChannel: SaleChannel.instore,
        products: [
          {
            unitsSold: '',
            amount: ''
          }
        ] as ProductSaleData[],
        orderDate: new Date()
      },
      validateOnMount: true,
      onSubmit: handleSaleSubmit
    })

    // Initialize products data when selected products change
    useEffect(() => {
      if (selectedProducts.length > 0) {
        // Create fresh product data array matching selected products
        const productsData = selectedProducts.map(() => ({
          unitsSold: '',
          amount: ''
        }))
        formik.setFieldValue('products', productsData)
      } else {
        // Reset to single empty product
        formik.setFieldValue('products', [{ unitsSold: '', amount: '' }])
      }
    }, [selectedProducts.length])

    // Product selection handlers
    const handleProductSelect = (product: any) => {
      const isSelected = selectedProducts.some(p => p.id === product.id)
      if (isSelected) {
        setSelectedProducts(prev => prev.filter(p => p.id !== product.id))
      } else {
        setSelectedProducts(prev => [...prev, product])
      }
    }

    const handleProductSelectorDone = () => {
      if (selectedProducts.length === 0) {
        toast.info('Please select at least one product')
        return
      }
      addProductModalRef?.current?.dismiss()
    }

    // Simple function to update product data
    const updateProductField = (index: number, field: keyof ProductSaleData, value: string) => {
      const updatedProducts = [...formik.values.products]
      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]: value
      }
      formik.setFieldValue('products', updatedProducts)
    }

    // Format customers data for SearchableInput
    const customerOptions = React.useMemo(() => {
      if (!customersData?.records) return []
      
      return customersData.records.map((customer: any) => ({
        text: `${customer.first_name} ${customer.last_name}`.trim(),
        value: customer.id,
        subText: customer.email || customer.phone_number || '',
        customer: customer // Keep full customer object for reference
      }))
    }, [customersData])

    return (
      <AppModal
        ref={innerRef}
        shouldHavePadding={false}
        title={'Record New Sale'}
        snapPoints={['85%']}
        footer={renderFooter}>
        <Box gap={16}>
          <Box mx={24} gap={16}>
            
             <SearchableInput
            name="customer_name"
            label="Customer name"
            onChangeText={formik.handleChange('customer_name')}
            onChangeSelect={(value: string) => {
              // Find the selected customer
              const selectedCustomer = customerOptions.find((option: any) => option.value === value)
              if (selectedCustomer) {
                formik.setFieldValue('customer_id', selectedCustomer.value)
                formik.setFieldValue('customer_name', selectedCustomer.text)
              }
            }}
            placeholder={isLoadingCustomers ? 'Loading customers...' : 'Select or type customer name'}
            options={customerOptions}
          />

          </Box>

          {/* Product Selection */}
          <Box mx={24}>
            <Typography variant="body-medium" color="text-primary" mb={8}>
              Select product(s)
            </Typography>
            <AppPressable
              onPress={() => addProductModalRef?.current?.present()}>
              <Box
                borderWidth={1}
                borderColor="neutral-200"
                borderRadius={8}
                px={12}
                height={40}
                justifyContent="center">
                <Typography variant="body" color="neutral-800">
                  Select product(s)
                </Typography>
              </Box>
            </AppPressable>

            {selectedProducts?.length > 0 && (
              <Box
                mt={8}
                flexDirection="row"
                flexWrap="wrap"
                gap={8}
                rowGap={16}
                flex={1}>
                {selectedProducts?.map((product: any, index: number) => (
                  <Box
                    key={index}
                    flexDirection="row"
                    alignSelf="flex-start"
                    alignItems="center"
                    height={26}
                    bg="tertiary"
                    borderRadius={8}
                    py={4}
                    px={8}
                    gap={8}>
                    <Typography variant="c1" color="text-tertiary">
                      {product.name}
                    </Typography>

                    <AppPressable onPress={() => handleProductSelect(product)}>
                      <AppIcon name="X" size={12} color="#454A53" />
                    </AppPressable>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Product Details - All Products */}
          {selectedProducts.length > 0 && (
            <Box mx={24} gap={24}>
              {selectedProducts.map((product, index) => (
                <Box key={product.id} gap={16}>
                  {/* Product Header */}
                  <Box 
                    borderRadius={8} 
                    p={12}
                    borderWidth={1}
                    borderColor="primary-200">
                    <Typography variant="body-medium" color="text-primary" mb={4}>
                      {product.name}
                    </Typography>
                    <Typography variant="c2" color="text-tertiary">
                      Price: ₦{product.unit_price?.toLocaleString() || 'N/A'}
                    </Typography>
                  </Box>

                  {/* Product Fields */}
                  <Box flexDirection="row" flex={1} gap={16}>
                    <TextField
                      name={`products.${index}.unitsSold`}
                      label="No. of units sold"
                      keyboardType="phone-pad"
                      inputMode="numeric"
                      placeholder="Enter units"
                      value={formik.values.products[index]?.unitsSold || ''}
                      onChangeText={value => updateProductField(index, 'unitsSold', value)}
                      readOnly={submitApiState === API_STATUS.LOADING}
                    />
                    <TextField
                      name={`products.${index}.amount`}
                      label="Total amount"
                      keyboardType="phone-pad"
                      inputMode="numeric"
                      prefix="₦"
                      placeholder="Enter amount"
                      value={formik.values.products[index]?.amount || ''}
                      onChangeText={value => updateProductField(index, 'amount', value)}
                      readOnly={submitApiState === API_STATUS.LOADING}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* Default single product when none selected */}
          {selectedProducts.length === 0 && (
            <Box mx={24} gap={16}>
              <Box flexDirection="row" flex={1} gap={16}>
                <TextField
                  name="products.0.unitsSold"
                  label="No. of units sold"
                  keyboardType="phone-pad"
                  inputMode="numeric"
                  placeholder="Enter units"
                  value={formik.values.products[0]?.unitsSold || ''}
                  onChangeText={value => updateProductField(0, 'unitsSold', value)}
                  readOnly={submitApiState === API_STATUS.LOADING}
                />
                <TextField
                  name="products.0.amount"
                  label="Total amount"
                  keyboardType="phone-pad"
                  inputMode="numeric"
                  prefix="₦"
                  placeholder="Enter amount"
                  value={formik.values.products[0]?.amount || ''}
                  onChangeText={value => updateProductField(0, 'amount', value)}
                  readOnly={submitApiState === API_STATUS.LOADING}
                />
              </Box>
            </Box>
          )}

          <Box mx={24} gap={16}>
            {/* <SelectField
              snapPoints={[266]}
              items={[
                {text: 'In Store', value: SaleChannel.instore},
                {text: 'Online', value: SaleChannel.online}
              ]}
              search={false}
              placeholder="Select sale channel"
              name="saleChannel"
              label="Sale channel"
              value={formik.values.saleChannel}
              onChangeValue={value =>
                formik.setFieldValue('saleChannel', value)
              }
            /> */}

            <SelectField
              snapPoints={[266]}
              items={[
                {text: 'Cash', value: 'CASH'},
                {text: 'Transfer', value: 'TRANSFER'},
                {text: 'POS', value: 'POS'}
              ]}
              search={false}
              placeholder="Select payment method"
              name="method"
              label="Payment method"
              value={formik.values.method}
              onChangeValue={value => formik.setFieldValue('method', value)}
            />

            {/* Reference field - only show for transfer payments */}
            {formik.values.method === 'TRANSFER' && (
              <TextField
                name="reference"
                label="Transfer reference"
                placeholder="Enter transfer reference number"
                value={formik.values.reference}
                onChangeText={formik.handleChange('reference')}
                readOnly={submitApiState === API_STATUS.LOADING}
              />
            )}

            <SelectField
              snapPoints={[266]}
              items={[
                {text: 'Confirmed', value: 'CONFIRMED'},
                {text: 'Pending', value: 'PENDING'}
              ]}
              search={false}
              placeholder="Select payment status"
              name="status"
              label="Payment status"
              value={formik.values.status}
              onChangeValue={value => formik.setFieldValue('status', value)}
            />

            {/* <BZDatePicker
              label="Order date"
              placeholder="Select date of order"
              value={formik.values.orderDate}
              onConfirm={date => formik.setFieldValue('orderDate', date)}
              maximumDate={new Date()}
            /> */}
          </Box>
        </Box>

        {/* Product Selection Modal */}
        <ProductSelectorModal
          ref={addProductModalRef}
          selectedProducts={selectedProducts}
          onProductSelect={handleProductSelect}
          onDone={handleProductSelectorDone}
        />
      </AppModal>
    )
  }
)

AddNewSaleModal.displayName = 'AddNewSaleModal'
export default AddNewSaleModal
