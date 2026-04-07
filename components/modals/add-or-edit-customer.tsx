import {useQueryClient} from '@tanstack/react-query'
import React, {forwardRef, useEffect, useState} from 'react'

import {AppModal, Box, Button, TextField} from '@/components/ui'
import {API_STATUS} from '@/constants/ApiConstants'
import {QUERY_KEYS} from '@/constants/queryKeys'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import {Modal} from '@/types/modal'
import {errorHandler} from '@/utils/errorHandler'
import toast from '@/utils/toast'
import {useFormik} from 'formik'

interface AddOrEditCustomerProps {
  customerId?: string
  customer?: any // Product data for editing
  mode?: 'create' | 'edit'
  onSuccess?: () => void
}

const AddOrEditCustomer = forwardRef<Modal, AddOrEditCustomerProps>(
  (props, ref) => {
    const innerRef = useForwardedRef(ref)
    const queryClient = useQueryClient()
    const isEditMode = props.mode === 'edit' && props.customer
    // Local State
    const [submitApiState, setSubmitApiState] = useState<API_STATUS>(
      API_STATUS.IDLE
    )

    const handleCustomerSubmit = async (values: any) => {
      if (!values.name.trim()) {
        toast.info("Please enter customer's name")
        return
      }

      if (!values.phone.trim()) {
        toast.info('Please enter phone number')
        return
      }

      try {
        setSubmitApiState(API_STATUS.LOADING)

        const payload = {
          name: values.name,
          phone: values.phone,
          email: values.email
        }

        if (isEditMode) {
          // TODO: Implement edit API call with image upload
          // await api.products.updateProduct(props.customerId, payload)
          // toast.info('Product updated successfully')
        } else {
          // TODO: Implement create API call with image upload
          // await api.products.createProduct(payload)
          // toast.info('Product created successfully')
        }
        props.onSuccess?.()
        queryClient.invalidateQueries({queryKey: [QUERY_KEYS.CUSTOMER]}).then()

        if (isEditMode) {
          queryClient
            .invalidateQueries({
              queryKey: [QUERY_KEYS.CUSTOMER, props.customerId]
            })
            .then()
        }

        innerRef.current?.dismiss()

        // Reset form and images only if creating
        if (!isEditMode) {
          formik.resetForm()
        }

        setSubmitApiState(API_STATUS.SUCCESS)
      } catch (err) {
        setSubmitApiState(API_STATUS.ERROR)
        errorHandler(err)
      }
    }

    const renderFooter = () => (
      <Button
        label={!isEditMode ? 'Add New Customer' : 'Update Customer'}
        onPress={formik.handleSubmit}
        loading={submitApiState === API_STATUS.LOADING}
      />
    )

    // Initialize form with product data if editing
    useEffect(() => {
      if (isEditMode) {
        const customer = props.customer
        formik.setValues({
          name: customer.name || '',
          phone: customer.phone || '',
          email: customer.email || ''
        })
      }
    }, [isEditMode, props.customer])

    // Get clean other images (non-null)

    const formik = useFormik({
      initialValues: {
        name: '',
        phone: '',
        email: ''
      },
      validateOnMount: true,
      // validationSchema: productSchema,
      onSubmit: handleCustomerSubmit
    })

    // if (collectionsQuery.data) {

    return (
      <AppModal
        ref={innerRef}
        title={!isEditMode ? 'Add New Customer' : 'Update Customer'}
        snapPoints={[411]}
        footer={renderFooter}>
        <Box gap={16}>
          <TextField
            name="name"
            label="Customer name"
            placeholder="Enter name of your customer"
            value={formik.values.name}
            onChangeText={formik.handleChange('name')}
            readOnly={submitApiState === API_STATUS.LOADING}
          />

          <TextField
            label="Phone number"
            placeholder="8030000000"
            name="phone"
            textContentType="telephoneNumber"
            keyboardType="phone-pad"
            inputMode="numeric"
            onChangeText={text => {
              const cleanedText = text.replace(/\D/g, '').replace(' ', '')
              formik.setFieldValue('phone', cleanedText)
            }}
            blurAction={formik.setFieldTouched}
            value={formik.values.phone}
            error={
              formik.errors.phone && formik.touched.phone
                ? formik.errors.phone
                : ''
            }
            readOnly={submitApiState === API_STATUS.LOADING}
          />

          <TextField
            keyboardType="email-address"
            autoCapitalize="none"
            label="Email"
            name="email"
            placeholder="Enter customer's email address"
            textContentType="emailAddress"
            inputMode="email"
            onChangeText={formik.handleChange('email')}
            blurAction={formik.setFieldTouched}
            value={formik.values.email}
            error={
              formik.errors.email && formik.touched.email
                ? formik.errors.email
                : ''
            }
          />
        </Box>
      </AppModal>
    )
    // }

    // if (collectionsQuery.isLoading) {
    //   return (
    //     <Box
    //       flex={1}
    //       backgroundColor="white"
    //       alignItems="center"
    //       justifyContent="center">
    //       <PushaActivityIndicator />
    //     </Box>
    //   )
    // }

    // if (collectionsQuery.isError) {
    //   return (
    //     <Box
    //       flex={1}
    //       backgroundColor="white"
    //       alignItems="center"
    //       justifyContent="center">
    //       <DisplayState subText="Uh oh, an error was encountered" state="error">
    //         <TextAction
    //           textAlign="center"
    //           iconName="replace"
    //           iconPosition="start"
    //           // onPress={() => collectionsQuery.refetch()}
    //         >
    //           Try again
    //         </TextAction>
    //       </DisplayState>
    //     </Box>
    //   )
    // }
  }
)

// const CollectionsProductItem: FC<ProductCollectionsItemProps> = props => {
//   const initialState = () => {
//     const index = props.selectedCollections.findIndex(
//       selectedItem => selectedItem === props.collection._id
//     )

//     return index > -1
//   }
//   const [isChecked, setIsChecked] = useState(initialState())

//   function handleSetChecked(state: boolean) {
//     setIsChecked(state)
//     props.setItem(props.collection._id ?? '', state)
//   }

//   return (
//     <>
//       <Box flexDirection="row" height={44} flex={1} gap={8}>
//         <Box flex={1} gap={8} py={2} flexDirection="row">
//           <Box justifyContent="center">
//             <AppCheckBox value={isChecked} onValueChange={handleSetChecked} />
//           </Box>
//           <Box flexDirection="row" alignItems="center" maxWidth={200}>
//             <Typography variant="body" numberOfLines={2}>
//               {props.collection.name}
//             </Typography>
//           </Box>
//         </Box>
//       </Box>
//       {!props.isLast && <Divider />}
//     </>
//   )
// }

AddOrEditCustomer.displayName = 'AddOrEditCustomer'
export default AddOrEditCustomer
