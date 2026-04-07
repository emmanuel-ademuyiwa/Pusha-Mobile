import {
  Box,
  Button,
  Container,
  PageError,
  PushaActivityIndicator,
  Typography
} from '@/components/ui'
import {ScreenView} from '@/components/util/screen-view'
import {ProductBadge} from '@/components/screens/products/product-badge'
import {useGetProduct} from '@/queries/productsQuery'
import {Image} from 'expo-image'
import {router, useLocalSearchParams} from 'expo-router'
import React, {useState} from 'react'
import {ScrollView} from 'react-native'
import AddOrEditProduct from '@/components/modals/add-or-edit-product'
import {KeyboardAwareScrollView} from '@/components/util/keyboard-aware-scroll-view'

const Page = () => {
  const {productId} = useLocalSearchParams<{productId: string}>()
  const {
    data: product,
    isLoading,
    isError,
    refetch
  } = useGetProduct(productId ?? '')
  const [showEdit, setShowEdit] = useState(false)

  if (isError) return <PageError reload={refetch} />

  const p = product as any

  return (
    <ScreenView
      navTitle="Product Details"
      alignNav="center"
      hasTopBanner={false}>
      {isLoading ? (
        <Box flex={1} alignItems="center" justifyContent="center">
          <PushaActivityIndicator />
        </Box>
      ) : (
        <>
          <KeyboardAwareScrollView>
            <Box height={240} backgroundColor="neutral-100">
              {p?.images?.[0] ? (
                <Image
                  source={{uri: p.images[0]}}
                  style={{flex: 1}}
                  contentFit="cover"
                />
              ) : null}
            </Box>
            <Container>
              <Box mt={16} gap={12}>
                <Box
                  flexDirection="row"
                  alignItems="flex-start"
                  justifyContent="space-between">
                  <Typography
                    variant="h2-bold"
                    color="secondary-500"
                    style={{flex: 1}}>
                    {p?.name || 'Product'}
                  </Typography>
                  <ProductBadge type={p?.is_listed ? 'listed' : 'unlisted'} />
                </Box>
                <Typography variant="h2-bold" color="primary-100">
                  ₦{p?.price ? Number(p.price).toLocaleString() : '0'}
                </Typography>
                <Box flexDirection="row" gap={16}>
                  <Box>
                    <Typography variant="c1" color="neutral-600">
                      Stock
                    </Typography>
                    <Typography
                      variant="body-semibold"
                      color="secondary-500"
                      mt={2}>
                      {p?.stock ?? '—'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="c1" color="neutral-600">
                      Category
                    </Typography>
                    <Typography
                      variant="body-semibold"
                      color="secondary-500"
                      mt={2}>
                      {p?.category?.name || '—'}
                    </Typography>
                  </Box>
                </Box>
                {p?.description ? (
                  <Box>
                    <Typography variant="c1" color="neutral-600" mb={4}>
                      Description
                    </Typography>
                    <Typography variant="body" color="neutral-800">
                      {p.description}
                    </Typography>
                  </Box>
                ) : null}
              </Box>
            </Container>
          </KeyboardAwareScrollView>
          <Container>
            <Box mt={8}>
              <Button label="Edit Product" onPress={() => setShowEdit(true)} />
            </Box>
          </Container>
        </>
      )}
      <AddOrEditProduct
        show={showEdit}
        onClose={() => setShowEdit(false)}
        product={product}
      />
    </ScreenView>
  )
}

export default Page
