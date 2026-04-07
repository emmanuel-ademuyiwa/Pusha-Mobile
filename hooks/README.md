# Reusable Pagination Hook

## Overview

I've created a production-ready, reusable infinite scroll pagination hook that:

- ✅ Uses React Query cache (no local state)
- ✅ Works with your existing API structure
- ✅ Supports debounced search
- ✅ Prevents duplicate fetches
- ✅ Fully TypeScript typed
- ✅ Can be used across all screens

## Files Created/Modified

### New Files

1. **`hooks/useInfinitePagination.ts`** - The reusable hook
2. **`hooks/useInfinitePagination.example.md`** - Comprehensive documentation

### Modified Files

1. **`api/productsRepository.ts`** - Added pagination params
2. **`queries/productsQuery.ts`** - Added `useInfiniteProducts`
3. **`app/(auth)/(more)/products.tsx`** - Implemented infinite scroll

## Quick Start

### 1. Create infinite query in your query file:

```typescript
// queries/customersQuery.ts
import {useInfinitePagination} from '@/hooks/useInfinitePagination'

export const useInfiniteCustomers = (search?: string) => {
  return useInfinitePagination({
    queryKey: [QUERY_KEYS.CUSTOMERS, 'infinite', search],
    queryFn: async ({pageParam}) => {
      const response = await api.customers.listCustomers({
        page: pageParam,
        limit: 50,
        search: search || undefined
      })
      return response?.data?.data
    },
    limit: 50
  })
}
```

### 2. Use in your component:

```typescript
const { items, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useInfiniteCustomers(searchQuery)

// Render items
items.map(item => <ItemCard key={item.id} item={item} />)

// Show loading spinner
{isFetchingNextPage && <LoadingSpinner />}

// Load more on scroll
if (isCloseToBottom) {
  fetchNextPage()
}
```

## How It Works

1. **React Query manages everything** - All pages cached, no manual state
2. **Flattens pages automatically** - Returns single `items` array
3. **Smart pagination** - Knows when to stop based on your limit
4. **Prevents duplicates** - Built-in protection against double-fetching

## Benefits

| Old Approach (Manual State) | New Approach (React Query Cache) |
| --------------------------- | -------------------------------- |
| `useState` for items        | ✅ Cache handles it              |
| `useState` for currentPage  | ✅ Query handles it              |
| `useState` for hasMore      | ✅ Auto-calculated               |
| Manual append/replace logic | ✅ Automatic                     |
| Complex useEffect chains    | ✅ Single hook call              |
| Bug-prone                   | ✅ Bulletproof                   |

## Implementation Status

- ✅ **Products Screen** - Fully implemented with infinite scroll
- 🔄 **Other Screens** - Ready to use the hook (just copy pattern)

## Next Steps

To add pagination to other screens:

1. Copy the pattern from `queries/productsQuery.ts`
2. Create `useInfiniteXYZ` for your resource
3. Use in your component like products page
4. That's it!

See `useInfinitePagination.example.md` for detailed examples.
