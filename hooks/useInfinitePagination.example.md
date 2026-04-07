# useInfinitePagination Hook

A reusable React Query-based hook for infinite scroll pagination that works with your existing API structure.

## Features

✅ **Pure React Query** - All state managed in cache, zero local state  
✅ **Infinite Scroll** - Automatically loads more on scroll  
✅ **Debounced Search** - Built-in search support  
✅ **TypeScript** - Fully typed  
✅ **Works with Existing APIs** - Designed for your `{records: [...]}` response structure  
✅ **Reusable** - Use across all list screens

## How It Works

The hook uses React Query's `useInfiniteQuery` under the hood and:

1. Automatically flattens all pages into a single `items` array
2. Determines if more pages exist based on your `limit`
3. Provides `fetchNextPage()` to load more
4. Caches everything in React Query's cache

## Usage

### Step 1: Create Infinite Query Hook

In your query file (e.g., `queries/productsQuery.ts`):

```typescript
import {useInfinitePagination} from '@/hooks/useInfinitePagination'
import {api} from '@/api'
import {QUERY_KEYS} from '@/constants/queryKeys'

export const useInfiniteProducts = (search?: string, limit: number = 25) => {
  return useInfinitePagination({
    queryKey: [QUERY_KEYS.PRODUCTS, 'infinite', search],
    queryFn: async ({pageParam}) => {
      const response = await api.products.listProducts({
        page: pageParam,
        limit,
        search: search || undefined
      })
      return response?.data?.data // Returns { records: [...], ...other }
    },
    limit,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10
  })
}
```

### Step 2: Use in Component

```typescript
const Page = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Get paginated data
  const {
    items,              // Flattened array of all products from all pages
    isLoading,          // Initial loading state
    isFetchingNextPage, // Loading next page
    hasNextPage,        // True if more pages available
    fetchNextPage,      // Function to load more
    refetch             // Refetch all data
  } = useInfiniteProducts(debouncedSearch, 25)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Handle scroll
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  return (
    <ScrollView
      onScroll={({nativeEvent}) => {
        const isCloseToBottom =
          nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
          nativeEvent.contentSize.height - 100

        if (isCloseToBottom) {
          handleLoadMore()
        }
      }}
      scrollEventThrottle={800}>

      {items.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}

      {isFetchingNextPage && <LoadingSpinner />}

      {!hasNextPage && items.length > 0 && <EndIndicator />}
    </ScrollView>
  )
}
```

## Examples for Different Screens

### Products (Already Implemented)

```typescript
export const useInfiniteProducts = (search?: string, limit = 25) => {
  return useInfinitePagination({
    queryKey: [QUERY_KEYS.PRODUCTS, 'infinite', search],
    queryFn: async ({pageParam}) => {
      const response = await api.products.listProducts({
        page: pageParam,
        limit,
        search: search || undefined
      })
      return response?.data?.data
    },
    limit
  })
}
```

### Customers

```typescript
export const useInfiniteCustomers = (search?: string, limit = 50) => {
  return useInfinitePagination({
    queryKey: [QUERY_KEYS.CUSTOMERS, 'infinite', search],
    queryFn: async ({pageParam}) => {
      const response = await api.customers.listCustomers({
        page: pageParam,
        limit,
        search: search || undefined
      })
      return response?.data?.data
    },
    limit
  })
}
```

### Chats

```typescript
export const useInfiniteChats = (filters?: any, limit = 50) => {
  return useInfinitePagination({
    queryKey: [QUERY_KEYS.CHATS, 'infinite', filters],
    queryFn: async ({pageParam}) => {
      const response = await api.chats.getChats({
        page: pageParam,
        limit,
        ...filters
      })
      return response?.data?.data
    },
    limit
  })
}
```

### Sales

```typescript
export const useInfiniteSales = (filters?: any, limit = 30) => {
  return useInfinitePagination({
    queryKey: [QUERY_KEYS.SALES, 'infinite', filters],
    queryFn: async ({pageParam}) => {
      const response = await api.sales.listSales({
        page: pageParam,
        limit,
        ...filters
      })
      return response?.data?.data
    },
    limit
  })
}
```

## API Requirements

Your API endpoints must:

1. Accept `page` and `limit` query parameters
2. Return data in format: `{ records: [...], ...other }`
3. Return full page when more data exists, less than full page when at end

## Benefits Over Manual State

### ❌ Manual State (Old Way)

```typescript
const [products, setProducts] = useState([])
const [currentPage, setCurrentPage] = useState(1)
const [hasMore, setHasMore] = useState(true)

useEffect(() => {
  // Complex logic to append/replace
  if (currentPage === 1) {
    setProducts(data)
  } else {
    setProducts(prev => [...prev, ...data])
  }
}, [data, currentPage])
```

### ✅ React Query Cache (New Way)

```typescript
const {items, fetchNextPage, hasNextPage} = useInfiniteProducts(search, 25)
// That's it! Everything managed by React Query cache
```

## Troubleshooting

### Duplicate Items

If you see duplicates, check:

1. Is `handleLoadMore` called multiple times? (Add ref lock)
2. Is your API returning duplicate IDs?
3. Check console for `fetchNextPage` calls

### Not Loading More

Check:

1. `hasNextPage` is true
2. `isFetchingNextPage` is false
3. Scroll detection is triggering
4. API returns exactly `limit` items per page

### Search Not Working

Ensure:

1. Search term in `queryKey`
2. Debounced search value passed to hook
3. API endpoint supports search parameter
