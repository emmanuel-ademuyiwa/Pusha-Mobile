import AddOrEditProduct from '@/components/modals/add-or-edit-product'
import Product from '@/components/screens/products/product'
import {
  AppIcon,
  Box,
  Button,
  Container,
  EmptyState,
  PageError,
  PushaActivityIndicator,
  Typography
} from '@/components/ui'
import {AppView} from '@/components/ui/app-view'
import {SearchField} from '@/components/ui/search-field'
import {useListProducts, type IProduct} from '@/queries/productsQuery'
import {StatusBar} from 'expo-status-bar'
import {Modal} from '@/types/modal'
import React, {useMemo, useRef, useState} from 'react'
import {FlatList, TouchableOpacity} from 'react-native'
import {ScreenView} from '@/components/util/screen-view'

const Products = () => {
  const addProductRef = useRef<Modal>(null)
  const [search, setSearch] = useState('')

  const {data, isLoading, isError, refetch} = useListProducts()
  const allProducts: IProduct[] = useMemo(() => data?.records ?? [], [data])

  const filtered = useMemo(() => {
    if (!search.trim()) return allProducts
    const q = search.toLowerCase()
    return allProducts.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        (p.brand ?? '').toLowerCase().includes(q)
    )
  }, [allProducts, search])

  // Stats
  const total = allProducts.length
  const available = allProducts.filter(p => p.is_available).length
  const unavailable = allProducts.filter(p => !p.is_available).length

  if (isError) return <PageError reload={() => refetch().then(() => {})} />
  return (
    <ScreenView
      headerAction={
        <Box
          pt={16}
          pb={12}
          flex={1}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Typography variant="h2-bold" color="secondary-500">
            Product
          </Typography>
          {/* <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => addProductRef.current?.present()}>
            <Box
              flexDirection="row"
              alignItems="center"
              gap={6}
              paddingHorizontal={14}
              paddingVertical={9}
              borderRadius={20}
              backgroundColor="primary-100">
              <AppIcon name="Plus" size={14} color="#fff" />
              <Typography variant="c1-medium" color="white">
                Add New Product
              </Typography>
            </Box>
          </TouchableOpacity> */}
          <Button size="sm" label="Add New Product" LeftIcon={<AppIcon name="Plus" size={14} color="#fff" />} onPress={() => addProductRef.current?.present()} />
        </Box>
      }
      hasTopBanner={false}
      backButton={false}
      footerPadding={false}>
      <StatusBar style="dark" animated />

      <Container>
        {/* ── Header ── */}

        {/* ── Stats row ── */}
        {!isLoading && (
          <Box flexDirection="row" gap={8} mb={16}>
            <Box
              flex={1}
              alignItems="center"
              paddingVertical={10}
              borderRadius={10}
              backgroundColor="neutral-100">
              <Typography variant="h3-bold" color="secondary-500">
                {total}
              </Typography>
              <Typography variant="c2" color="neutral-600" mt={2}>
                Total Products
              </Typography>
            </Box>
            <Box
              flex={1}
              alignItems="center"
              paddingVertical={10}
              borderRadius={10}
              style={{backgroundColor: '#F6FDF8'}}>
              <Typography variant="h3-bold" style={{color: '#20B038'}}>
                {available}
              </Typography>
              <Typography variant="c2" color="neutral-600" mt={2}>
                Available
              </Typography>
            </Box>
            <Box
              flex={1}
              alignItems="center"
              paddingVertical={10}
              borderRadius={10}
              style={{backgroundColor: '#FFF5F6'}}>
              <Typography variant="h3-bold" style={{color: '#D70015'}}>
                {unavailable}
              </Typography>
              <Typography variant="c2" color="neutral-600" mt={2}>
                Unavailable
              </Typography>
            </Box>
          </Box>
        )}

        {/* ── Search ── */}
        <Box mb={12}>
          <SearchField
            placeholder="Search products..."
            query={search}
            onQueryChange={setSearch}
          />
        </Box>
      </Container>

      {/* ── Grid ── */}
      {isLoading ? (
        <Box flex={1} alignItems="center" justifyContent="center">
          <PushaActivityIndicator />
        </Box>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item, i) => item?.id ?? String(i)}
          renderItem={({item}: {item: IProduct}) => (
            <Box flex={1} p={6}>
              <Product item={item} />
            </Box>
          )}
          numColumns={2}
          columnWrapperStyle={{paddingHorizontal: 10}}
          ListEmptyComponent={
            <EmptyState
              title="No products found"
              description={
                search
                  ? 'Try a different search term.'
                  : 'Add your first product to get started.'
              }
              actionText="Add Product"
              onAction={() => addProductRef.current?.present()}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1, paddingBottom: 24}}
        />
      )}

      <AddOrEditProduct ref={addProductRef} />
    </ScreenView>
  )
}

export default Products
