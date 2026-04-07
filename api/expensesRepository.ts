import {HttpMethods} from '@/libs'
import {ICreateExpensePayload, ICreateExpenseCategoryPayload} from '@/types'
import {UseEndpoint} from '@/utils/api'

export default {
  // Expenses endpoints
  listExpenses: (query?: {
    page?: number
    limit?: number
    category_id?: string
    date_from?: string
    date_to?: string
  }) => {
    return UseEndpoint({
      clientType: 'auth',
      endpoint: '/expenses',
      method: HttpMethods.Get,
      query
    })
  },

  createExpense: (payload: ICreateExpensePayload) => {
    return UseEndpoint({
      clientType: 'auth',
      endpoint: '/expenses',
      method: HttpMethods.Post,
      payload
    })
  },

  getExpense: (expenseId: string) => {
    return UseEndpoint({
      clientType: 'auth',
      endpoint: `/expenses/${expenseId}`,
      method: HttpMethods.Get
    })
  },

  updateExpense: (expenseId: string, payload: ICreateExpensePayload) => {
    return UseEndpoint({
      clientType: 'auth',
      endpoint: `/expenses/${expenseId}`,
      method: HttpMethods.Put,
      payload
    })
  },

  deleteExpense: (expenseId: string) => {
    return UseEndpoint({
      clientType: 'auth',
      endpoint: `/expenses/${expenseId}`,
      method: HttpMethods.Delete
    })
  },

  // Expense categories endpoints
  listExpenseCategories: () => {
    return UseEndpoint({
      clientType: 'auth',
      endpoint: '/expense-categories',
      method: HttpMethods.Get
    })
  },

  createExpenseCategory: (payload: ICreateExpenseCategoryPayload) => {
    return UseEndpoint({
      clientType: 'auth',
      endpoint: '/expense-categories',
      method: HttpMethods.Post,
      payload
    })
  },

  updateExpenseCategory: (categoryId: string, payload: ICreateExpenseCategoryPayload) => {
    return UseEndpoint({
      clientType: 'auth',
      endpoint: `/expense-categories/${categoryId}`,
      method: HttpMethods.Put,
      payload
    })
  }
}