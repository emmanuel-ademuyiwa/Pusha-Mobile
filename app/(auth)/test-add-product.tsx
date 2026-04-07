import {
  AppIcon,
  AppPressable,
  Box,
  Button,
  Container,
  Divider,
  ImageCropView,
  TextArea,
  TextField,
  Typography
} from '@/components/ui'
import {
  useProductActions,
  useProductDescription,
  useProductImages,
  useProductLoadingState,
  useProductName,
  useProductPrice,
  useProductQuantity,
  useProductVariantConfig
} from '@/store/productStore'
import * as FileSystem from 'expo-file-system'
import {Image} from 'expo-image'
import {router} from 'expo-router'
import {StatusBar} from 'expo-status-bar'
import {uniqueId} from 'lodash'
import React, {FC, useEffect, useState} from 'react'
import {Pressable} from 'react-native'
import {ScrollView} from 'react-native-gesture-handler'
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker'

import {KeyboardAwareScrollView} from '@/components/util/keyboard-aware-scroll-view'
import {ScreenView} from '@/components/util/screen-view'
import {useMediaPersmissions} from '@/hooks/useMediaPersmissions'
import {ImageInterface} from '@/types'
import {cld} from '@/utils/cloudinary'
import {formatCurrency} from '@/utils/currency'
import {formatIntegerFields, formatWholeNumber} from '@/utils/fields'

const imagePlaceholder = require('@/assets/image-placeholder.png')
interface CreateOrEditProductProps {
  mode: 'create' | 'edit'
  product?: any
}

const CreateOrEditProduct: FC<CreateOrEditProductProps> = props => {
  const productActions = useProductActions()
  const productName = useProductName()
  const productPrice = useProductPrice()
  const productLoadingState = useProductLoadingState()
  const images = useProductImages()
  const productDescription = useProductDescription()
  const productQuantity = useProductQuantity()
  const {variants, quantity} = useProductVariantConfig()
  const [imageCropperShown, setImageCropperShown] = useState(false)
  const {requestPermission} = useMediaPersmissions()

  const addProductVariants = () => {
    !productLoadingState.createOrEditProduct && router.navigate('/products')
  }

  const getVariantPriceRange = () => {
    const priceRange: number[] = []

    quantity.forEach((qty: any) =>
      priceRange.push(Number(qty.price.replace(/,/g, '')))
    )
    const maxAmount = formatCurrency(Math.max(...priceRange))
    const minAmount = formatCurrency(Math.min(...priceRange))

    if (maxAmount === minAmount) {
      return `Price: ${maxAmount}`
    } else {
      return `${minAmount} - ${maxAmount}`
    }
  }

  useEffect(() => {
    if (props.mode === 'edit' && props.product) {
      const productHasVariants =
        props.product.variantConfig &&
        props.product.variantConfig.quantityAndPrice.length > 0
      productActions.setProductId(props.product._id as string)
      productActions.setName(props.product.name)
      productActions.setPrice(formatIntegerFields(String(props.product.price)))
      productActions.setQuantity(
        formatWholeNumber(String(props.product.quantity))
      )
      productActions.setDescription(props.product.description)
      productActions.setStatus(props.product.status)
      productActions.setProductImages(
        props.product.images.map((image: any) => ({
          isUrlImage: true,
          image: cld.image(image.publicId).toURL(),
          isCropped: false,
          publicId: image.publicId,
          assetId: image.assetId
        }))
      )
      productHasVariants &&
        productActions.setVariantConfig({
          quantity: props.product.variantConfig.quantityAndPrice.map(
            (qty: any) => ({
              options: qty.options,
              quantity: formatWholeNumber(String(qty.quantity)),
              price: formatIntegerFields(String(qty.price)),
              uuid: qty.uuid
            })
          ),
          variants: props.product.variantConfig.variants.config
        })
    }
  }, [])

  useEffect(() => {
    return () => {
      images.length > 0 && deleteAllImages().then()
    }
  }, [])

  const imgDir = FileSystem.documentDirectory + 'product-images/'

  const ensureDirExists = async () => {
    const dirInfo = await FileSystem.getInfoAsync(imgDir)
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(imgDir, {intermediates: false})
    }
  }

  const selectImage = async () => {
    await requestPermission()
    try {
      const result = await ImagePicker.openPicker({
        multiple: true,
        maxFiles: 5 - images.length,
        compressImageMaxWidth: 1000,
        compressImageMaxHeight: 1000,
        cropping: true,
        cropperChooseText: 'crop'
      })

      await saveImages(result)
    } catch (err) {
      console.log(err)
    }
  }

  const saveImages = async (selectedImages: ImageOrVideo[]) => {
    await ensureDirExists()

    const fileNames = selectedImages.map(img => img.path.split('/').pop())

    const productImages: ImageInterface[] = []
    for (let i = 0; i < selectedImages.length; i++) {
      const img = selectedImages[i]
      const newUri = imgDir + fileNames[i]

      await FileSystem.copyAsync({
        from: img.path,
        to: newUri
      })
      productImages.push({image: newUri, isCropped: false, isUrlImage: false})
    }
    productActions.setProductImages([...images, ...productImages])
    setImageCropperShown(true)
  }

  const deleteImage = async (img: ImageInterface) => {
    if (img.isUrlImage) {
      productActions.setProductImages(
        images.filter((image: any) => image.image !== img.image)
      )
      return
    }
    const imgInfo = await FileSystem.getInfoAsync(img.image)
    if (imgInfo.exists) {
      await FileSystem.deleteAsync(img.image, {idempotent: true})
      productActions.setProductImages(
        images.filter((image: any) => image.image !== img.image)
      )
    }
  }

  const deleteAllImages = async () => {
    const dirInfo = await FileSystem.getInfoAsync(imgDir)
    if (dirInfo.exists) {
      await FileSystem.deleteAsync(imgDir, {idempotent: true})
    }
    productActions.setProductImages([])
  }

  const handleCloseCropper = async () => {
    await deleteAllImages()
    setImageCropperShown(false)
  }

  const handleCroppedImages = (imgs: ImageInterface[]) => {
    setImageCropperShown(false)

    productActions.setProductImages(imgs)
  }

  const ProductImages = React.useMemo(
    () => (
      <>
        {images.map((img: any) => {
          return (
            <Box
              height={90}
              justifyContent="flex-end"
              key={uniqueId('img')}
              mr={20}
              borderRadius={12}
              position="relative">
              <AppPressable
                position="absolute"
                height={20}
                width={20}
                borderRadius={12}
                top={0}
                right={-5}
                zIndex={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
                backgroundColor="black"
                onPress={() => deleteImage(img)}>
                <AppIcon name="Minus" size={18} color="white" />
              </AppPressable>

              <Box borderRadius={12} overflow="hidden">
                <Image
                  placeholder={imagePlaceholder}
                  placeholderContentFit="cover"
                  source={{uri: img.image}}
                  style={{width: 80, height: 80}}
                  accessibilityIgnoresInvertColors
                />
              </Box>
            </Box>
          )
        })}
      </>
    ),
    [images]
  )

  return (
    <ScreenView
      color={imageCropperShown ? 'black' : 'white'}
      hasTopBanner={false}
      title={props.mode === 'create' ? 'New product' : 'Edit Product'}>
      <KeyboardAwareScrollView>
        <Container>
          <Box overflow="hidden">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{overflow: 'visible', paddingVertical: 5}}>
              <Pressable
                accessibilityRole="button"
                style={{flexDirection: 'row'}}>
                {ProductImages}
                {images.length < 5 && (
                  <AppPressable marginRight={20} onPress={selectImage}>
                    <Box
                      height={80}
                      width={80}
                      borderRadius={12}
                      alignItems="center"
                      justifyContent="center"
                      style={{
                        borderWidth: 1,
                        borderColor: 'rgba(0, 0, 0, 0.16)',
                        borderStyle: 'dashed'
                      }}>
                      <AppIcon name="Add" size={24} color="#2C67F6" />
                    </Box>
                  </AppPressable>
                )}
              </Pressable>
            </ScrollView>
            {images.length < 5 && (
              <Typography variant="c1-medium" color="neutral-600" mt={4}>
                Add up to 5 images
              </Typography>
            )}
          </Box>
          <Box mt={24}>
            <TextField
              readOnly={productLoadingState.createOrEditProduct}
              label="Product name"
              name="Product name"
              onChangeText={e => productActions.setName(e)}
              value={productName}
            />
          </Box>
          {!variants.length ? (
            <Box mt={24}>
              <TextField
                readOnly={productLoadingState.createOrEditProduct}
                label="Unit price"
                name="Unit price"
                suffix="NGN"
                keyboardType="decimal-pad"
                onChangeText={e =>
                  productActions.setPrice(formatIntegerFields(e))
                }
                value={productPrice}
              />
            </Box>
          ) : (
            <Typography variant="h3-bold" mt={24}>
              {getVariantPriceRange()}
            </Typography>
          )}
          {!variants.length && (
            <Box mt={24}>
              <TextField
                readOnly={productLoadingState.createOrEditProduct}
                label="Available quantity"
                name="Available quantity"
                suffix="PCS"
                keyboardType="number-pad"
                onChangeText={e =>
                  productActions.setQuantity(formatWholeNumber(e))
                }
                value={productQuantity}
              />
            </Box>
          )}
        </Container>
        <Divider marginTop={24} />
        <Container flex={1}>
          <Box paddingVertical={20}>
            <AppPressable
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              onPress={addProductVariants}>
              <Box flexDirection="row" alignItems="center">
                <AppIcon name="Check" size={24} color="#80A6F9" />
                <Typography variant="body-medium" color="neutral-700" ml={8}>
                  {variants.length > 0 ? 'Edit' : 'Add'} product variants {'\n'}{' '}
                  <Typography color="neutral-500" variant="c1">
                    {variants.length
                      ? `${variants.length} variant${
                          variants.length > 1 ? 's' : ''
                        } added`
                      : 'e.g. Color, Size, Flavor'}
                  </Typography>
                </Typography>
              </Box>
              <AppIcon name="ChevronRight" size={24} color="#2C67F6" />
            </AppPressable>
          </Box>
        </Container>
        <Divider />
        <Container flex={1}>
          <Box mt={16}>
            <TextArea
              readOnly={productLoadingState.createOrEditProduct}
              label="Product description"
              name="Add product description"
              placeholder="Describe your product"
              onChangeText={productActions.setDescription}
              defaultValue={productDescription}
            />
          </Box>
        </Container>
      </KeyboardAwareScrollView>
      <Container>
        <Box mt={16}>
          <Button
            loading={productLoadingState.createOrEditProduct}
            variant="primary"
            onPress={() => productActions.createOrEditProduct(props.mode)}
            label={props.mode === 'create' ? 'Add product' : 'Save changes'}
          />
        </Box>
      </Container>

      {imageCropperShown && (
        <>
          <StatusBar style="light" animated />
          <ImageCropView
            onClose={handleCloseCropper}
            images={images}
            onCropImages={croppedImages => handleCroppedImages(croppedImages)}
          />
        </>
      )}
    </ScreenView>
  )
}

export default CreateOrEditProduct
