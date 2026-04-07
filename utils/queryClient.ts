import AsyncStorage from '@react-native-async-storage/async-storage'
import {createAsyncStoragePersister} from '@tanstack/query-async-storage-persister'
import {QueryCache, QueryClient} from '@tanstack/react-query'

import {queryErrorHandler} from './errorHandler'

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any) => queryErrorHandler(error)
  }),
  defaultOptions: {
    queries: {
      gcTime: Infinity,
      staleTime: 1000 * 60 * 5, //5 minutes
      retry: false,
      networkMode: 'always'
    }
  }
})

export const clientPersister = createAsyncStoragePersister({
  storage: AsyncStorage
})
