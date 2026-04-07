import { useInfiniteQuery, UseInfiniteQueryOptions } from '@tanstack/react-query'
import { useMemo } from 'react'

interface PaginatedResponse<T> {
  records: T[]
  [key: string]: any
}

interface UseInfinitePaginationResult<T> {
  // Flattened data from all pages
  items: T[]
  // React Query states
  isLoading: boolean
  isError: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
  // Actions
  fetchNextPage: () => Promise<any>
  refetch: () => void
  // Raw data (if needed)
  data: any
}

/**
 * Reusable hook for infinite scroll pagination
 * 
 * Works with your existing API structure that returns { records: [...], ... }
 * 
 * @example
 * // In your query file (queries/productsQuery.ts)
 * export const useInfiniteProducts = (search?: string) => {
 *   return useInfinitePagination({
 *     queryKey: [QUERY_KEYS.PRODUCTS, 'infinite', search],
 *     queryFn: async ({ pageParam }) => {
 *       const response = await api.products.listProducts({
 *         page: pageParam,
 *         limit: 25,
 *         search: search || undefined
 *       })
 *       return response?.data?.data
 *     },
 *     limit: 25
 *   })
 * }
 * 
 * // In your component
 * const { items, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteProducts(searchQuery)
 */
export const useInfinitePagination = <T = any>(
  options: Omit<
    UseInfiniteQueryOptions<PaginatedResponse<T>, Error, PaginatedResponse<T>, PaginatedResponse<T>, any[], number>,
    'getNextPageParam' | 'initialPageParam'
  > & {
    limit: number
  }
): UseInfinitePaginationResult<T> => {
  const { limit, ...queryOptions } = options

  const query = useInfiniteQuery({
    ...queryOptions,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If we got a full page, there might be more
      const hasMore = lastPage?.records?.length === limit
      return hasMore ? allPages.length + 1 : undefined
    },
  })

  // Flatten all pages into a single array and remove duplicates
  const items = useMemo(() => {
    if (!query.data?.pages) return []
    
    const allItems = query.data.pages.flatMap((page: any) => page?.records || [])
    
    // Remove duplicates by ID
    const uniqueItems = allItems.filter((item: any, index: number, self: any[]) =>
      index === self.findIndex((t: any) => t?.id === item?.id)
    )
    
    return uniqueItems
  }, [query.data?.pages])

  return {
    items,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage ?? false,
    fetchNextPage: () => {
      if (query.hasNextPage && !query.isFetchingNextPage) {
        return query.fetchNextPage()
      }
      return Promise.resolve()
    },
    refetch: query.refetch,
    data: query.data
  }
}

