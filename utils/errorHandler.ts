import * as Sentry from '@sentry/react-native'
import axios from 'axios'

import {ApiResponse} from '@/libs'
import toast from './toast'

export function errorHandler(error: unknown) {
  console.log('Error captured:', error) // Log the error for debugging in development

  // Handle Axios errors
  if (axios.isAxiosError<ApiResponse<any>>(error)) {
    if (error.response) {
      const {status, data} = error.response
      const errorMessage = data?.message || 'An unknown error occurred'

      if (status >= 400 && status < 500) {
        if (__DEV__) {
          // console.error(error)
        }
        // Alert.alert('Error!', errorMessage)
        toast.error(errorMessage)
      } else if (status >= 500) {
        // Server-side errors (5xx)
        Sentry.captureException(error, {
          extra: {
            status,
            responseData: data
          }
        })
        // Alert.alert(
        //   'Server Error',
        //   'A server error occurred. Please try again later.'
        // )
        toast.error('A server error occurred. Please try again later.')
      } else {
        // Unexpected status codes
        Sentry.captureException(error, {
          extra: {
            status,
            responseData: data
          }
        })
        // Alert.alert('Error', errorMessage)
        toast.error(errorMessage)
      }
    } else if (error.request) {
      // No response received
      Sentry.captureException(error, {
        extra: {
          request: error.request
        }
      })
      // Alert.alert(
      //   'Network Error',
      //   'Unable to connect to the server. Please check your internet connection and try again.'
      // )
      toast.error(
        'Unable to connect to the server. Please check your internet connection and try again.'
      )
    } else {
      // Errors during request setup
      Sentry.captureException(error)
      // Alert.alert(
      //   'Request Error',
      //   'An unexpected error occurred while preparing the request. Please try again.'
      // )
      toast.error(
        'An unexpected error occurred while preparing the request. Please try again.'
      )
    }
  } else if (error instanceof Error) {
    // Generic JavaScript errors
    Sentry.captureException(error)
    // Alert.alert('Error', error.message || 'An unknown error occurred.')
    toast.error(error.message || 'An unknown error occurred.')
  } else {
    // Unknown error types
    Sentry.captureException(error, {
      extra: {
        context: 'Unknown error type'
      }
    })
    // Alert.alert(
    //   'Unknown Error',
    //   'An error occurred, but the details could not be determined.'
    // )
    toast.error('An error occurred, but the details could not be determined.')
  }
}

export function queryErrorHandler(error: unknown) {
  console.log('Error captured:', error) // Log the error for debugging in development

  // Handle Axios errors
  if (axios.isAxiosError<ApiResponse<any>>(error)) {
    if (error.response) {
      toast.error(error.response.data.message)
    } else if (error.request) {
      // No response received
      Sentry.captureException(error, {
        extra: {
          request: error.request
        }
      })
      toast.error(
        'Network error, Please check your internet connection and try again.'
      )
    } else {
      // Errors during request setup
      toast.error(
        'Network error, Please check your internet connection and try again.'
      )
    }
  } else {
    toast.error('An error occurred.')
  }
}
