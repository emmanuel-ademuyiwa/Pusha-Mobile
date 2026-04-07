import {IProduct, ProductStatus} from '@baze-sdk/schema'
import {Image} from 'expo-image'
import Fuse from 'fuse.js'
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import {Pressable} from 'react-native'

import {
  AppCheckBox,
  BZModal,
  BazeIcon,
  Box,
  Button,
  TextField,
  Typography
} from '@/components/ui'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import {Modal} from '@/types/modal'
import {cld} from '@/utils/cloudinary'

const imagePlaceholder = require('@assets/image-placeholder.png')

const CreateDiscountProducts = forwardRef<
  Modal,
  {
    products: IProduct[]
    selectedProducts: string[]
    onSelectProducts: (options: string[]) => void

    mode: 'create' | 'edit'
  }
>((props, ref) => {
  const innerRef = useForwardedRef(ref)
  const [products, setProducts] = useState(props.products ?? [])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const init = () => {
    setSelectedProducts(props.selectedProducts)
  }

  useEffect(() => {
    init()
  }, [props.selectedProducts])

  const fuse = useMemo(
    () =>
      new Fuse(props.products ?? [], {
        keys: ['name']
      }),
    [props.products]
  )

  const handleSearch = useCallback(
    (searchText: string) => {
      if (searchText.length === 0) {
        setProducts(props.products ?? [])
        return
      }

      setProducts(fuse.search(searchText).map(result => result.item))
    },
    [fuse, props.products]
  )

  const selectProduct = useCallback((productId: string) => {
    setSelectedProducts(p => {
      if (p.includes(productId)) {
        return p.filter(e => e !== productId)
      }
      return [...p, productId]
    })
  }, [])

  const renderFooter = useMemo(
    () => (
      <Box>
        <Button
          variant="primary"
          label="Add to order"
          disabled={selectedProducts.length === 0}
          onPress={() => {
            props.onSelectProducts(selectedProducts)
            innerRef.current?.dismiss()
          }}
        />
      </Box>
    ),
    [selectedProducts]
  )

  return (
    <BZModal
      header={
        <TextField
          onChangeText={handleSearch}
          name="Search"
          placeholder="Search"
          suffix={<BazeIcon name="search" size={20} color="#959CA7" />}
        />
      }
      headerDivider
      footerDivider
      title="Select products"
      ref={innerRef}
      snapPoints={['90%']}
      footer={() => renderFooter}
      onDismiss={init}>
      <Box flex={1} mb={56}>
        <Pressable accessibilityRole="button" style={{flex: 1}}>
          <Box pt={16}>
            {products
              .filter(p => p.status === ProductStatus.published)
              .map((product, idx) => (
                <Box key={idx} mt={idx === 0 ? 0 : 24}>
                  <ProductItem
                    product={product}
                    selectedProducts={selectedProducts}
                    onSelect={selectProduct}
                  />
                </Box>
              ))}
          </Box>
        </Pressable>
      </Box>
    </BZModal>
  )
})

const ProductItem = memo(
  (props: {
    product: IProduct

    selectedProducts: string[]
    onSelect: (option: string) => void
  }) => {
    const [isSelected, setIsSelected] = useState(false)

    useEffect(() => {
      setIsSelected(
        props.selectedProducts.includes(props.product._id as string)
      )
    }, [props.selectedProducts])

    // Product with no variants
    return (
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          props.onSelect(props.product._id as string)
        }}>
        <Box flexDirection="row" gap={12} alignItems="center">
          <Box>
            {props.product.images.length ? (
              <Image
                placeholder={imagePlaceholder}
                placeholderContentFit="cover"
                source={cld.image(props.product.images[0].publicId).toURL()}
                accessibilityIgnoresInvertColors
                style={{height: 40, width: 40, borderRadius: 8}}
              />
            ) : (
              <Box
                height={40}
                width={40}
                borderRadius={8}
                bg="neutral-100"
                alignItems="center"
                justifyContent="center">
                <BazeIcon name="product" size={20} color="#798390" />
              </Box>
            )}
          </Box>
          <Box
            flex={1}
            flexDirection="row"
            justifyContent="space-between"
            gap={8}>
            <Box justifyContent="space-between" gap={4} flex={1}>
              <Typography variant="body-medium" numberOfLines={1}>
                {props.product.name}
              </Typography>
            </Box>
            <Box width={100} alignItems="flex-end">
              <AppCheckBox
                value={isSelected}
                onValueChange={() =>
                  props.onSelect(props.product._id as string)
                }
              />
            </Box>
          </Box>
        </Box>
      </Pressable>
    )
  }
)

ProductItem.displayName = 'ProductItem'

CreateDiscountProducts.displayName = 'CreateDiscountProducts'
export default CreateDiscountProducts
