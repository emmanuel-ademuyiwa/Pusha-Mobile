

import { HttpMethods } from '@/libs'
import { UseEndpoint } from '@/utils/api'

// Customer payload interface
export interface ICustomerPayload {
  first_name: string
  last_name: string
  gender: string
  phone_number: string
  email: string
  avatar: string
}

export default {
  // Get paginated list of customers
  listCustomers: (queryParams?: {
    page?: number
    limit?: number
    search?: string
    sort?: string
  }) => {
    return UseEndpoint({
      endpoint: '/customer',
      query: queryParams
    })
  },
  
  // Get customer information by ID
  getCustomer: (customerId: string) => {
    return UseEndpoint({
      endpoint: `/customer/${customerId}`
    })
  },
  
  // Create new customer
  createCustomer: (payload: ICustomerPayload) => {
    return UseEndpoint({
      endpoint: '/customer',
      method: HttpMethods.Post,
      payload
    })
  },
  
  // Update customer profile
  updateCustomer: (customerId: string, payload: ICustomerPayload) => {
    return UseEndpoint({
      endpoint: `/customer/${customerId}`,
      method: HttpMethods.Put,
      payload
    })
  },
  
}