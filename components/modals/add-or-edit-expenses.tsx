import {useQueryClient} from '@tanstack/react-query'
// import * as FileSystem from 'expo-file-system'
import React, {forwardRef, useEffect, useState} from 'react'
// import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker'

import {
  AppModal,
  Box,
  Button,
  BZDatePicker,
  SearchableInput,
  SelectField,
  // SelectField,
  TextArea,
  TextField
} from '@/components/ui'
import {QUERY_KEYS} from '@/constants/queryKeys'
import {useForwardedRef} from '@/hooks/useForwardedRef'
// import {useMediaPersmissions} from '@/hooks/useMediaPersmissions'
// import {ImageInterface} from '@/types'
import {useListExpenseCategories} from '@/queries/expensesQuery'
import {
  useExpensesActions,
  useExpensesLoadingState
} from '@/store/expensesStore'
import {Modal} from '@/types/modal'
import toast from '@/utils/toast'
import {useFormik} from 'formik'
// import FileUploadBox from '../ui/file-upload-box/file-upload-box'

// interface Expense {
//   id: string
//   name: string
//   price: number
//   // Add other product properties as needed
// }

// interface ProductSaleData {
//   title: string
//   amount: string
//   unit: string
//   category: string
//   description: string
//   date: string
//   receipt: string
// }

interface AddNewExpenseModalProps {
  expenseId?: string
  expense?: any // Expense data for editing
  mode?: 'create' | 'edit'
  onSuccess?: () => void
}

const AddNewExpenseModal = forwardRef<Modal, AddNewExpenseModalProps>(
  (props, ref) => {
    const innerRef = useForwardedRef(ref)
    const queryClient = useQueryClient()
    // const {requestPermission} = useMediaPersmissions()
    const isEditMode = props.mode === 'edit' && props.expense
    const {data, isLoading: categoriesLoading} = useListExpenseCategories()
    const categoriesData = data?.records

    const [selectedCategory, setSelectedCategory] = useState<string>('')

    // Get expense actions and loading state
    const expensesActions = useExpensesActions()
    const loadingState = useExpensesLoadingState()

    // Local State
    // const [submitApiState, setSubmitApiState] = useState<API_STATUS>(
    //   API_STATUS.IDLE
    // )
    // const [receipt, setReceipt] = useState<ImageInterface | null>(null)

    // Image handling for receipt - commented out as not in payload
    // const imgDir = FileSystem.documentDirectory + 'expense-receipts/'
    // ... (receipt image handling functions commented out)

    // Initialize form with expense data if editing
    useEffect(() => {
      if (isEditMode && props.expense) {
        const expense = props.expense

        formik.setValues({
          // title: expense.title || '', // Not in payload - using notes instead
          amount: expense.amount?.toString() || '',
          category_id: expense.category_id || '',
          category: expense.category || '',
          // units: expense.units || '', // Not in payload
          notes: expense.notes || '',
          // receipt: expense.receipt || '', // Not in payload
          date: expense.date ? new Date(expense.date) : new Date()
        })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditMode, props.expense])

    const handleExpenseSubmit = async (values: any) => {
      if (!values.notes.trim()) {
        toast.info('Please enter expense notes')
        return
      }

      if (!values.amount.trim()) {
        toast.info('Please enter the amount')
        return
      }

      const payload = {
        category_id: values.category_id,
        // category: values.category,
        amount: Number(values.amount),
        notes: values.notes,
        date:
          values.date instanceof Date
            ? values.date.toISOString().split('T')[0]
            : values.date
      }

      const onSuccess = () => {
        // Invalidate expense queries
        queryClient.invalidateQueries({queryKey: [QUERY_KEYS.EXPENSES]})
        if (isEditMode) {
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.EXPENSES, props.expenseId]
          })
        }

        props.onSuccess?.()
        innerRef.current?.dismiss()

        // Reset form only if creating
        if (!isEditMode) {
          formik.resetForm()
        }
      }

      if (isEditMode && props.expenseId) {
        await expensesActions.updateExpense(props.expenseId, payload, onSuccess)
      } else {
        await expensesActions.createExpense(payload, onSuccess)
      }
    }

    const renderFooter = () => (
      <Button
        label={isEditMode ? 'Update Expense' : 'Save Expense'}
        onPress={formik.handleSubmit}
        loading={
          isEditMode ? loadingState.updateExpense : loadingState.createExpense
        }
      />
    )

    const formik = useFormik({
      initialValues: {
        // title: '', // Not in payload - using notes instead
        amount: '',
        category_id: '',
        category: '',
        // units: '', // Not in payload
        notes: '', // Used instead of description
        // receipt: null, // Not in payload
        date: new Date()
      },
      validateOnMount: true,
      onSubmit: handleExpenseSubmit
    })

    return (
      <AppModal
        ref={innerRef}
        title={isEditMode ? 'Update Expense' : 'Record New Expense'}
        snapPoints={['70%']}
        footer={renderFooter}>
        <Box gap={16}>
          {/* Title field commented out - not in payload, using notes instead */}
          {/* <TextField
            name="title"
            label="Title of expense"
            placeholder="Enter a title for your expense"
            value={formik.values.title}
            onChangeText={formik.handleChange('title')}
            readOnly={loadingState.createExpense || loadingState.updateExpense}
          /> */}

          <TextField
            name="amount"
            label="Amount"
            keyboardType="phone-pad"
            inputMode="numeric"
            placeholder="Enter expense amount"
            prefix="₦"
            value={formik.values.amount || ''}
            onChangeText={formik.handleChange('amount')}
            readOnly={loadingState.createExpense || loadingState.updateExpense}
          />

          <SearchableInput
            name="category"
            label="Category"
            onChangeText={formik.handleChange('category')}
            onChangeSelect={text => formik.setFieldValue('category_id', text)}
            placeholder={
              categoriesLoading ? 'Loading categories...' : 'Select a category'
            }
            options={
              categoriesData?.map((category: any) => ({
                value: category.id,
                text: category.name
              })) || []
            }
          />

         
          {/* <TextField
            name="category"
            label="Category Name"
            placeholder="Enter category name"
            value={formik.values.category_id}
            onChangeText={formik.handleChange('category_id')}
            readOnly={loadingState.createExpense || loadingState.updateExpense}
          /> */}
          {/* Units field commented out - not in payload */}
          {/* <TextField
            name="units"
            label="No. of units"
            keyboardType="phone-pad"
            inputMode="numeric"
            value={formik.values.units || ''}
            onChangeText={formik.handleChange('units')}
            readOnly={loadingState.createExpense || loadingState.updateExpense}
          /> */}

          <TextArea
            name={'notes'}
            label="Notes"
            placeholder="Enter expense notes"
            value={formik.values.notes}
            onChangeText={formik.handleChange('notes')}
            readOnly={loadingState.createExpense || loadingState.updateExpense}
          />

          {/* <BZDatePicker
            label="Expense date"
            placeholder="Select date of expense"
            value={formik.values.date}
            onDateChange={formik.handleChange('date')}
            disabled={loadingState.createExpense || loadingState.updateExpense}
          /> */}
          <BZDatePicker
            label="Expense date"
            placeholder="Select date of expense"
            value={formik.values.date}
            onConfirm={date => formik.setFieldValue('date', date)}
            maximumDate={new Date()}
          />

          {/* Receipt upload commented out - not in payload */}
          {/* <FileUploadBox
            value={receipt?.image || null}
            variant="full"
            label="Upload receipt (optional)"
            onChange={selectReceiptImage}
            onRemove={removeReceiptImage}
            showRemove={!!receipt}
          /> */}
        </Box>
      </AppModal>
    )
  }
)

AddNewExpenseModal.displayName = 'AddNewExpenseModal'
export default AddNewExpenseModal
