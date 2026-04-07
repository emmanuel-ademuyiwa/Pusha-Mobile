import {useQueryClient} from '@tanstack/react-query'
import React, {forwardRef, useEffect} from 'react'

import {AppModal, Box, Button, TextField} from '@/components/ui'
import {QUERY_KEYS} from '@/constants/queryKeys'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import {
  useExpensesActions,
  useExpensesLoadingState
} from '@/store/expensesStore'
import {
  useProductsActions,
  useProductsLoadingState
} from '@/store/productsStore'
import {Modal} from '@/types/modal'
import toast from '@/utils/toast'
import {useFormik} from 'formik'

export type CategoryType = 'product' | 'expense'

interface AddOrEditCategoryProps {
  categoryId?: string
  category?: any // Category data for editing
  mode?: 'create' | 'edit'
  type: CategoryType // Required: specify if this is for products or expenses
  onSuccess?: () => void
}

const AddOrEditCategory = forwardRef<Modal, AddOrEditCategoryProps>(
  (props, ref) => {
    const innerRef = useForwardedRef(ref)
    const queryClient = useQueryClient()

    // Conditionally use the appropriate store based on type
    const productsActions = useProductsActions()
    const productsLoadingState = useProductsLoadingState()
    const expensesActions = useExpensesActions()
    const expensesLoadingState = useExpensesLoadingState()

    const isProductCategory = props.type === 'product'
    const isExpenseCategory = props.type === 'expense'
    const isEditMode = props.mode === 'edit' && props.category

    // Get the appropriate actions and loading state based on type
    const actions = isProductCategory ? productsActions : expensesActions
    const createLoading = isProductCategory
      ? productsLoadingState.createCategory
      : expensesLoadingState.createExpenseCategory
    const updateLoading = isProductCategory
      ? false
      : expensesLoadingState.updateExpenseCategory // Product category update not yet available

    const handleCategorySubmit = async (values: any) => {
      if (!values.name.trim()) {
        toast.info('Please enter category name')
        return
      }

      // if (!values.description.trim()) {
      //   toast.info('Please enter category description')
      //   return
      // }

      const payload = {
        name: values.name.trim()
      }

      const onSuccess = () => {
        // Invalidate the appropriate query keys based on category type
        if (isProductCategory) {
          queryClient.invalidateQueries({queryKey: [QUERY_KEYS.CATEGORIES]})
          if (isEditMode) {
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.CATEGORIES, props.categoryId]
            })
          }
        } else if (isExpenseCategory) {
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.EXPENSE_CATEGORIES]
          })
          if (isEditMode) {
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.EXPENSE_CATEGORIES, props.categoryId]
            })
          }
        }

        props.onSuccess?.()
        innerRef.current?.dismiss()

        // Reset form only if creating
        if (!isEditMode) {
          formik.resetForm()
        }
      }

      if (isEditMode && props.categoryId) {
        // Call the appropriate update action based on category type
        if (isProductCategory) {
          // TODO: Add updateCategory action to products store when endpoint is available
          toast.info('Product category edit functionality coming soon')
        } else if (isExpenseCategory) {
          await expensesActions.updateExpenseCategory(
            props.categoryId,
            payload,
            onSuccess
          )
        }
      } else {
        // Call the appropriate create action based on category type
        if (isProductCategory) {
          await productsActions.createCategory(payload, onSuccess)
        } else if (isExpenseCategory) {
          await expensesActions.createExpenseCategory(payload, onSuccess)
        }
      }
    }

    const renderFooter = () => (
      <Button
        label={
          isEditMode
            ? `Update ${props.type} category`
            : `Save ${props.type} category`
        }
        onPress={formik.handleSubmit}
        loading={isEditMode ? updateLoading : createLoading}
      />
    )

    // Initialize form with category data if editing
    useEffect(() => {
      if (isEditMode && props.category) {
        const category = props.category

        formik.setValues({
          name: category.name || '',
          description: category.description || ''
        })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditMode, props.category])

    const formik = useFormik({
      initialValues: {
        name: '',
        description: ''
      },
      validateOnMount: true,
      onSubmit: handleCategorySubmit
    })

    return (
      <AppModal
        ref={innerRef}
        title={isEditMode ? 'Edit Category' : 'Add New Category'}
        snapPoints={['50%']}
        footer={renderFooter}>
        <Box gap={16}>
          <TextField
            name="name"
            label="Category Name"
            placeholder="Enter category name"
            value={formik.values.name}
            onChangeText={formik.handleChange('name')}
            readOnly={createLoading}
          />
        </Box>
      </AppModal>
    )
  }
)

AddOrEditCategory.displayName = 'AddOrEditCategory'
export default AddOrEditCategory
