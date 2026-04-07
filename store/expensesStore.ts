import {api} from '@/api'
import {create} from 'zustand'

import {QUERY_KEYS} from '@/constants/queryKeys'
import {ICreateExpenseCategoryPayload, ICreateExpensePayload} from '@/types'
import {errorHandler} from '@/utils/errorHandler'
import {queryClient} from '@/utils/queryClient'
import toast from '@/utils/toast'

type ExpensesStoreType = {
  loadingState: {
    createExpense: boolean
    updateExpense: boolean
    deleteExpense: boolean
    createExpenseCategory: boolean
    updateExpenseCategory: boolean
  }
  actions: ExpensesActions
}

type ExpensesActions = {
  createExpense: (
    payload: ICreateExpensePayload,
    onSuccess?: (expense: any) => void
  ) => Promise<void>
  updateExpense: (
    expenseId: string,
    payload: ICreateExpensePayload,
    onSuccess?: (expense: any) => void
  ) => Promise<void>
  deleteExpense: (expenseId: string, onSuccess?: () => void) => Promise<void>
  createExpenseCategory: (
    payload: ICreateExpenseCategoryPayload,
    onSuccess?: (category: any) => void
  ) => Promise<void>
  updateExpenseCategory: (
    categoryId: string,
    payload: ICreateExpenseCategoryPayload,
    onSuccess?: (category: any) => void
  ) => Promise<void>
  resetStore: () => void
}

const useExpensesStore = create<ExpensesStoreType>()(set => {
  return {
    loadingState: {
      createExpense: false,
      updateExpense: false,
      deleteExpense: false,
      createExpenseCategory: false,
      updateExpenseCategory: false
    },
    actions: {
      createExpense: async (payload, onSuccess) => {
        try {
          set(state => ({
            loadingState: {...state.loadingState, createExpense: true}
          }))

          const response = await api.expenses.createExpense(payload)

          if (response?.data?.data) {
            toast.success('Expense created successfully!')

            // Invalidate related queries to refresh data
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.EXPENSES]
            })

            if (onSuccess) {
              onSuccess(response.data.data)
            }
          }

          set(state => ({
            loadingState: {...state.loadingState, createExpense: false}
          }))
        } catch (err) {
          console.log({err})

          set(state => ({
            loadingState: {...state.loadingState, createExpense: false}
          }))
          errorHandler(err)
        }
      },

      updateExpense: async (expenseId, payload, onSuccess) => {
        try {
          set(state => ({
            loadingState: {...state.loadingState, updateExpense: true}
          }))

          const response = await api.expenses.updateExpense(expenseId, payload)

          if (response?.data?.data) {
            toast.success('Expense updated successfully!')

            // Invalidate related queries to refresh data
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.EXPENSES]
            })
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.EXPENSE, expenseId]
            })

            if (onSuccess) {
              onSuccess(response.data.data)
            }
          }

          set(state => ({
            loadingState: {...state.loadingState, updateExpense: false}
          }))
        } catch (err) {
          set(state => ({
            loadingState: {...state.loadingState, updateExpense: false}
          }))
          errorHandler(err)
        }
      },

      deleteExpense: async (expenseId, onSuccess) => {
        try {
          set(state => ({
            loadingState: {...state.loadingState, deleteExpense: true}
          }))

          await api.expenses.deleteExpense(expenseId)

          toast.success('Expense deleted successfully!')

          // Invalidate related queries to refresh data
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.EXPENSES]
          })
          queryClient.removeQueries({
            queryKey: [QUERY_KEYS.EXPENSE, expenseId]
          })

          if (onSuccess) {
            onSuccess()
          }

          set(state => ({
            loadingState: {...state.loadingState, deleteExpense: false}
          }))
        } catch (err) {
          set(state => ({
            loadingState: {...state.loadingState, deleteExpense: false}
          }))
          errorHandler(err)
        }
      },

      createExpenseCategory: async (payload, onSuccess) => {
        try {
          set(state => ({
            loadingState: {...state.loadingState, createExpenseCategory: true}
          }))

          const response = await api.expenses.createExpenseCategory(payload)

          if (response?.data?.data) {
            toast.success('Expense category created successfully!')

            // Invalidate related queries to refresh data
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.EXPENSE_CATEGORIES]
            })

            if (onSuccess) {
              onSuccess(response.data.data)
            }
          }

          set(state => ({
            loadingState: {...state.loadingState, createExpenseCategory: false}
          }))
        } catch (err) {
          set(state => ({
            loadingState: {...state.loadingState, createExpenseCategory: false}
          }))
          errorHandler(err)
        }
      },

      updateExpenseCategory: async (categoryId, payload, onSuccess) => {
        try {
          set(state => ({
            loadingState: {...state.loadingState, updateExpenseCategory: true}
          }))

          const response = await api.expenses.updateExpenseCategory(
            categoryId,
            payload
          )

          if (response?.data?.data) {
            toast.success('Expense category updated successfully!')

            // Invalidate related queries to refresh data
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.EXPENSE_CATEGORIES]
            })

            if (onSuccess) {
              onSuccess(response.data.data)
            }
          }

          set(state => ({
            loadingState: {...state.loadingState, updateExpenseCategory: false}
          }))
        } catch (err) {
          set(state => ({
            loadingState: {...state.loadingState, updateExpenseCategory: false}
          }))
          errorHandler(err)
        }
      },

      resetStore: () => {
        set(() => ({
          loadingState: {
            createExpense: false,
            updateExpense: false,
            deleteExpense: false,
            createExpenseCategory: false,
            updateExpenseCategory: false
          }
        }))
      }
    }
  }
})

// Export selective hooks for optimal re-renders
export const useExpensesActions = () => useExpensesStore(state => state.actions)
export const useExpensesLoadingState = () =>
  useExpensesStore(state => state.loadingState)

export default useExpensesStore
