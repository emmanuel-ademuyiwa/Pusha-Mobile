import {
  AppIcon,
  AppModal,
  AppPressable,
  Box,
  Button,
  DisplayState,
  PageError,
  PushaActivityIndicator,
  TextField,
  Typography
} from '@/components/ui'
import { useForwardedRef } from '@/hooks/useForwardedRef'
import { ProductStatus } from '@/libs'
import { useInfiniteProducts } from '@/queries/productsQuery'
import { Modal } from '@/types/modal'
import { Image } from 'expo-image'
import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, ScrollView } from 'react-native'
import ProductBadge from '../screens/products/product-badge'
import CheckBox from '../svgs/checkbox'

interface ProductSelectorModalProps {
  selectedProducts: any[]
  onProductSelect: (product: any) => void
  onDone: () => void
}

const ProductSelectorModal = forwardRef<Modal, ProductSelectorModalProps>(
  (props, ref) => {
    const innerRef = useForwardedRef(ref)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [debouncedSearch, setDebouncedSearch] = useState<string>('')
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const isFetchingRef = useRef(false)

    // Use infinite pagination with search
    const {
      items: productsData,
      isLoading,
      isError,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      refetch
    } = useInfiniteProducts(debouncedSearch, 30)

    // Debounce search input
    useEffect(() => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
        setDebouncedSearch(searchQuery)
      }, 500)

      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
        }
      }
    }, [searchQuery])

    const handleSearch = useCallback((searchText: string) => {
      setSearchQuery(searchText)
    }, [])

    const handleLoadMore = useCallback(() => {
      if (hasNextPage && !isFetchingNextPage && !isFetchingRef.current) {
        isFetchingRef.current = true
        fetchNextPage().finally(() => {
          isFetchingRef.current = false
        })
      }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    const renderContent = () => {
      if (isLoading) {
        return (
          <Box alignItems="center" justifyContent="center" flex={1} py={40}>
            <PushaActivityIndicator />
          </Box>
        )
      }

      if (isError) {
        return (
          <Box flex={1}>
            <PageError reload={refetch} />
          </Box>
        )
      }

      if (!productsData || productsData.length === 0) {
        return (
          <Box flex={1} alignItems="center" justifyContent="center" py={40}>
            <DisplayState
              icon="BoxSearch"
              subText={
                searchQuery
                  ? 'No products found matching your search.'
                  : 'No products available to select.'
              }
            />
          </Box>
        )
      }

      return (
        <ScrollView
          onScroll={({nativeEvent}) => {
            const {layoutMeasurement, contentOffset, contentSize} = nativeEvent
            const paddingToBottom = 100
            const isCloseToBottom =
              layoutMeasurement.height + contentOffset.y >=
              contentSize.height - paddingToBottom

            if (isCloseToBottom && !isFetchingNextPage) {
              handleLoadMore()
            }
          }}
          scrollEventThrottle={800}
          showsVerticalScrollIndicator={false}>
          <Box
            flexDirection="row"
            flexWrap="wrap"
            gap={0}
            rowGap={16}
            justifyContent="space-between"
            flex={1}>
            {productsData?.map((product: any, i: number) => (
            <AppPressable
              key={product.id || i}
              width={'49%'}
              onPress={() => props?.onProductSelect(product)}>
              <Box position="relative">
                <ProductBadge
                  status={
                    product.quantity > 0
                      ? ProductStatus.inStock
                      : product?.quantity < 6
                        ? ProductStatus.lowStock
                        : ProductStatus.outOfStock
                  }
                />
                <Box
                  height={154}
                  width={'100%'}
                  borderRadius={8}
                  bg="tertiary"
                  borderWidth={1}
                  overflow="hidden"
                  borderColor="neutral-200">
                  <Image
                    source={
                      product?.images?.[0]?.url || product?.images?.[0] || ''
                    }
                    style={{height: 154, width: '100%'}}
                    contentFit="cover"
                  />
                </Box>
                <Typography
                  mt={8}
                  variant="body-semibold"
                  color="secondary-500"
                  numberOfLines={2}>
                  {product.name}
                </Typography>
                <Typography mt={4} variant="c1" color="secondary-500">
                  Qty: {product.quantity || 0}
                </Typography>
                <Typography mt={4} variant="c1-semibold" color="secondary-500">
                  ₦{product.unit_price?.toLocaleString() || '0'}
                </Typography>
              </Box>

              {props?.selectedProducts?.some(p => p.id === product.id) && (
                <Box
                  position="absolute"
                  // bg="" // Semi-transparent overlay
                  top={0}
                  left={0}
                  right={0}
                  bottom={0} // Add bottom to cover entire card
                  borderRadius={8} // Match the image border radius
                  height={154}
                  p={8}
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                  }}>
                  <Box
                    width={24}
                    height={24}
                    alignItems="center"
                    justifyContent="center">
                    <CheckBox />
                  </Box>
                </Box>
              )}
            </AppPressable>
          ))}
          </Box>

          {/* Loading spinner at bottom */}
          {isFetchingNextPage && (
            <Box py={16} alignItems="center">
              <ActivityIndicator size="small" />
            </Box>
          )}

          {/* End indicator */}
          {!hasNextPage && productsData.length > 0 && (
            <Box py={16} alignItems="center">
              <Box opacity={0.5}>
                <AppIcon name="TickCircle" size={24} color="#A4A4A4" />
              </Box>
            </Box>
          )}
        </ScrollView>
      )
    }

    return (
      <AppModal
        ref={innerRef}
        title={'Select Products'}
        snapPoints={['90%']}
        footer={() => (
          <Button
            label={`Done (${props?.selectedProducts.length} selected)`}
            onPress={() => {
              props?.onDone()
              innerRef?.current?.dismiss()
            }}
            disabled={props?.selectedProducts.length === 0}
          />
        )}>
        {/* Search field */}
        <Box mb={16}>
          <TextField
            name="Search"
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search products..."
            prefix={
              <AppIcon name="SearchNormal" size={20} color="#A4A4A4" />
            }
          />
        </Box>

        {renderContent()}
      </AppModal>
    )
  }
)

ProductSelectorModal.displayName = 'ProductSelectorModal'
export default ProductSelectorModal
