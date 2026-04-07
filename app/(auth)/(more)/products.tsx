import {AppIcon, Box, Container, EmptyState, PageError, PushaActivityIndicator, Typography} from '@/components/ui'
import {ScreenView} from '@/components/util/screen-view'
import {FloatingButton} from '@/components/shared'
import Product from '@/components/screens/products/product'
import {useListProducts} from '@/queries/productsQuery'
import React, {useState} from 'react'
import {FlatList} from 'react-native'
import AddOrEditProduct from '@/components/modals/add-or-edit-product'

const Page = () => {
  const [showAdd, setShowAdd] = useState(false)
  const {data, isLoading, isError, refetch} = useListProducts()
  const products = (data as any)?.data ?? data ?? []

  if (isError) return <PageError reload={refetch} />

  return (
    <ScreenView navTitle="Products" alignNav="center" hasTopBanner={false}>
      {isLoading ? (
        <Box flex={1} alignItems="center" justifyContent="center"><PushaActivityIndicator /></Box>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item: any, i) => item?.id ?? String(i)}
          renderItem={({item}) => <Box p={8}><Product item={item} /></Box>}
          numColumns={2}
          ListEmptyComponent={<EmptyState title="No products" description="Add your first product to get started." actionText="Add Product" onAction={() => setShowAdd(true)} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1, padding: 8}}
        />
      )}
      <FloatingButton onPress={() => setShowAdd(true)}>
        <AppIcon name="Plus" size={24} color="#fff" />
      </FloatingButton>
      <AddOrEditProduct show={showAdd} onClose={() => setShowAdd(false)} />
    </ScreenView>
  )
}

export default Page
