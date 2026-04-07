import {
  CartProductQuantityAndPrice,
  ICart,
  ICartItem,
  IProduct,
  ProductStatus
} from '@baze-sdk/schema'
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
import uuid from 'react-native-uuid'

import {CreateOrderProduct} from '../../modules/orders/types'
import {getOptionNameByVariantAndOptionId} from '../../modules/orders/utils'

import {
  AppCheckBox,
  BZModal,
  BZPressable,
  BazeIcon,
  Box,
  Button,
  Divider,
  TextField,
  Typography
} from '@/components/ui'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import {Modal} from '@/types/modal'
import {cld} from '@/utils/cloudinary'
import {formatCurrency} from '@/utils/currency'

const imagePlaceholder = require('@assets/image-placeholder.png')

const CreateOrderProducts = forwardRef<
  Modal,
  {
    refetch: () => void
    products: IProduct[]
    selectedProducts: CreateOrderProduct[]
    onSelectProducts: (options: CreateOrderProduct[]) => void
    mode: 'create' | 'edit'
    cart?: ICart
  }
>((props, ref) => {
  const innerRef = useForwardedRef(ref)
  const [products, setProducts] = useState(props.products ?? [])
  const [selectedProducts, setSelectedProducts] = useState<
    CreateOrderProduct[]
  >([])

  const init = () => {
    setSelectedProducts(props.selectedProducts)
  }

  useEffect(() => {
    init()
  }, [props.selectedProducts])

  useEffect(() => {
    if (props.mode === 'create') return
    if (!props.cart) return

    const mapCartItemToOrderProduct = (
      item: ICartItem
    ): CreateOrderProduct | null => {
      const qnp = item.metadata?.snapshots.qnp as CartProductQuantityAndPrice
      const baseProduct = {
        id: item.product,
        isVariantProduct: qnp.hasVariants,
        productName: qnp.name,
        price: qnp.price,
        qty: item.quantity,
        qis: qnp.qis,
        image: qnp.images[0] ? cld.image(qnp.images[0].publicId).toURL() : null,
        key: uuid.v4()
      }

      if (!qnp.hasVariants) return baseProduct

      const product = props.products.find(p => p._id === item.product)
      if (!product) return null

      const qnpId = product.variantConfig.quantityAndPrice.find(
        v => v.uuid === qnp.qnpConfigId
      )

      return {
        ...baseProduct,
        optionName: qnp.variants?.map(v => v.option.name).join(' / '),
        qnpId: qnpId?._id
      }
    }

    const cartProducts = props.cart.items
      .map(mapCartItemToOrderProduct)
      .filter((product): product is CreateOrderProduct => Boolean(product))

    props.onSelectProducts(cartProducts)
  }, [])

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

  const addProductsToOrder = useCallback(async () => {
    props.onSelectProducts(selectedProducts)
    innerRef.current?.dismiss()
  }, [selectedProducts])

  const selectProduct = useCallback(
    (option: CreateOrderProduct) => {
      if (!option.isVariantProduct) {
        const isProductSelected = selectedProducts.find(e => e.id === option.id)

        if (isProductSelected) {
          setSelectedProducts(() => {
            return selectedProducts.filter(e => e.id !== option.id)
          })
        } else {
          setSelectedProducts(p => {
            return [
              ...p,
              {
                id: option.id,
                qty: option.qty,
                key: option.key,
                image: option.image,
                price: option.price,
                productName: option.productName,
                isVariantProduct: option.isVariantProduct,
                qis: option.qis
              }
            ]
          })
        }
      } else {
        const isProductSelected = selectedProducts.find(
          e => e.qnpId === option.qnpId
        )

        if (isProductSelected) {
          setSelectedProducts(() => {
            return selectedProducts.filter(e => e.qnpId !== option.qnpId)
          })
        } else {
          setSelectedProducts(p => {
            return [
              ...p,
              {
                id: option.id,
                qnpId: option.qnpId,
                qty: option.qty,
                key: option.key,
                image: option.image,
                price: option.price,
                productName: option.productName,
                isVariantProduct: option.isVariantProduct,
                optionName: option.optionName,
                qis: option.qis
              }
            ]
          })
        }
      }
    },
    [selectedProducts]
  )

  const renderFooter = useMemo(
    () => (
      <Box>
        <Button
          variant="secondary"
          label="Add to order"
          disabled={selectedProducts.length === 0}
          onPress={() => {
            addProductsToOrder()
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
      title="Add products to order"
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
                    isVariantProduct={Boolean(
                      product?.variantConfig?.quantityAndPrice.length
                    )}
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
    isVariantProduct: boolean
    selectedProducts: CreateOrderProduct[]
    onSelect: (option: CreateOrderProduct) => void
  }) => {
    const [expanded, setExpanded] = useState(false)
    const [isSelected, setIsSelected] = useState(false)
    const [selectedVariants, setSelectedVariants] = useState<string[]>([])

    useEffect(() => {
      if (!props.isVariantProduct) {
        const isProductSelected = props.selectedProducts.find(
          e => e.id === props.product._id
        )
        setIsSelected(!!isProductSelected)
      } else {
        const filteredSelectedVariants = props.selectedProducts.filter(
          e => e.id === props.product._id
        )

        // @ts-ignore
        setSelectedVariants(() => {
          return filteredSelectedVariants.map(e => e.qnpId)
        })
      }
    }, [props.selectedProducts])

    if (props.isVariantProduct) {
      return (
        <>
          <BZPressable onPress={() => setExpanded(!expanded)}>
            <Box flexDirection="row" gap={8} alignItems="center">
              {expanded ? (
                <BazeIcon name="dropdown" size={20} color="black" />
              ) : (
                <BazeIcon name="chevron-right" size={20} color="black" />
              )}

              <Box>
                {props.product.images.length ? (
                  <Image
                    placeholder={imagePlaceholder}
                    placeholderContentFit="cover"
                    source={cld.image(props.product.images[0].publicId).toURL()}
                    accessibilityIgnoresInvertColors
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: 8
                    }}
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
                  <Typography variant="c1" color="neutral-400">
                    {props.product.variantConfig.quantityAndPrice.length}{' '}
                    {props.product.variantConfig.quantityAndPrice.length > 1
                      ? 'options'
                      : 'option'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </BZPressable>

          <Box>
            {expanded && (
              <>
                <Box mt={8} ml={8}>
                  {props.product.variantConfig.quantityAndPrice.map(
                    (variant, idx) => (
                      <Pressable
                        accessibilityRole="button"
                        key={idx}
                        onPress={() => {
                          if (!variant.quantity) return
                          props.onSelect({
                            id: props.product._id as string,
                            isVariantProduct: props.isVariantProduct,
                            productName: props.product.name,
                            price: variant.discountedPrice ?? variant.price,
                            qis: variant.quantity,
                            qty: 1,
                            key: uuid.v4(),
                            optionName: variant.options
                              .map(option => {
                                return getOptionNameByVariantAndOptionId(
                                  option.variant,
                                  option.option,
                                  props.product.variantConfig.variants.config
                                )
                              })
                              .join(' / '),
                            qnpId: variant._id as string,
                            image:
                              props.product.images.length > 0
                                ? cld
                                    .image(props.product.images[0].publicId)
                                    .toURL()
                                : null
                          })
                        }}>
                        <Box
                          flexDirection="row"
                          gap={12}
                          alignItems="center"
                          mt={16}>
                          <AppCheckBox
                            value={selectedVariants.includes(
                              variant._id as string
                            )}
                            onValueChange={() =>
                              props.onSelect({
                                id: props.product._id as string,
                                isVariantProduct: props.isVariantProduct,
                                productName: props.product.name,
                                price: variant.discountedPrice ?? variant.price,
                                qis: variant.quantity,
                                qty: 1,
                                key: uuid.v4(),
                                optionName: variant.options
                                  .map(option => {
                                    return getOptionNameByVariantAndOptionId(
                                      option.variant,
                                      option.option,
                                      props.product.variantConfig.variants
                                        .config
                                    )
                                  })
                                  .join(' / '),
                                qnpId: variant._id as string,
                                image:
                                  props.product.images.length > 0
                                    ? cld
                                        .image(props.product.images[0].publicId)
                                        .toURL()
                                    : null
                              })
                            }
                            disabled={variant.quantity === 0}
                          />

                          <Box
                            flex={1}
                            flexDirection="row"
                            justifyContent="space-between"
                            gap={8}>
                            <Box
                              justifyContent="space-between"
                              gap={4}
                              flex={1}>
                              <Typography
                                variant="body-medium"
                                numberOfLines={1}>
                                {variant.options
                                  .map(option => {
                                    return getOptionNameByVariantAndOptionId(
                                      option.variant,
                                      option.option,
                                      props.product.variantConfig.variants
                                        .config
                                    )
                                  })
                                  .join(' / ')}
                              </Typography>
                              <Typography variant="c1" color="neutral-400">
                                {variant.quantity} in stock
                              </Typography>
                            </Box>
                            <Box width={100}>
                              {variant.discountedPrice && (
                                <Typography
                                  variant="c1-medium"
                                  textAlign="right">
                                  {formatCurrency(
                                    variant.discountedPrice,
                                    'comma'
                                  )}
                                </Typography>
                              )}
                              <Typography
                                variant="c1-medium"
                                textAlign="right"
                                textDecorationStyle="solid"
                                textDecorationLine={
                                  variant.discountedPrice
                                    ? 'line-through'
                                    : 'none'
                                }
                                color={
                                  variant.discountedPrice
                                    ? 'neutral-400'
                                    : 'neutral-700'
                                }>
                                {formatCurrency(variant.price, 'comma')}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Pressable>
                    )
                  )}
                </Box>
                <Divider marginTop={16} />
              </>
            )}
          </Box>
        </>
      )
    }

    // Product with no variants
    return (
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          if (props.product.quantity === 0) return
          props.onSelect({
            id: props.product._id as string,
            isVariantProduct: props.isVariantProduct,
            productName: props.product.name,
            price: props.product.price,
            qis: props.product.quantity,
            key: uuid.v4(),
            qty: 1,
            image:
              props.product.images.length > 0
                ? cld.image(props.product.images[0].publicId).toURL()
                : null
          })
        }}>
        <Box flexDirection="row" gap={12} alignItems="center">
          <AppCheckBox
            disabled={props.product.quantity === 0}
            value={isSelected}
            onValueChange={() =>
              props.onSelect({
                id: props.product._id as string,
                isVariantProduct: props.isVariantProduct,
                productName: props.product.name,
                price: props.product.discountedPrice ?? props.product.price,
                qis: props.product.quantity,
                key: uuid.v4(),
                qty: 1,
                image:
                  props.product.images.length > 0
                    ? cld.image(props.product.images[0].publicId).toURL()
                    : null
              })
            }
          />
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
              <Typography variant="c1" color="neutral-400">
                {props.product.quantity} in stock
              </Typography>
            </Box>
            <Box width={100}>
              {props.product.discountedPrice && (
                <Typography variant="c1-medium" textAlign="right">
                  {formatCurrency(props.product.discountedPrice, 'comma')}
                </Typography>
              )}
              <Typography
                variant="c1-medium"
                textAlign="right"
                textDecorationStyle="solid"
                textDecorationLine={
                  props.product.discountedPrice ? 'line-through' : 'none'
                }
                color={
                  props.product.discountedPrice ? 'neutral-400' : 'neutral-700'
                }>
                {formatCurrency(props.product.price, 'comma')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Pressable>
    )
  }
)

ProductItem.displayName = 'ProductItem'

CreateOrderProducts.displayName = 'CreateOrderProducts'
export default CreateOrderProducts
