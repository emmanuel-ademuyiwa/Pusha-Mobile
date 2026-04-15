import {useQueryClient} from '@tanstack/react-query'
import * as FileSystem from 'expo-file-system'
import React, {forwardRef, useEffect, useState} from 'react'
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker'

import api from '@/api'
import {
  AppModal,
  Box,
  Button,
  TextField,
  Typography
} from '@/components/ui'
import {QUERY_KEYS} from '@/constants/queryKeys'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import {useMediaPersmissions} from '@/hooks/useMediaPersmissions'
import {userQuery} from '@/queries/userQueries'
import {
  useProductsActions,
  useProductsLoadingState
} from '@/store/productsStore'
import {ImageInterface} from '@/types'
import {Modal} from '@/types/modal'
import {cldOptions} from '@/utils/cloudinary'
import toast from '@/utils/toast'
import {useFormik} from 'formik'
import FileUploadBox from '../ui/file-upload-box/file-upload-box'

interface SaveEditProductModalProps {
  productId?: string
  product?: any // Product data for editing
  mode?: 'create' | 'edit'
  onSuccess?: () => void
}

const SaveEditProductModal = forwardRef<Modal, SaveEditProductModalProps>(
  (props, ref) => {
    const innerRef = useForwardedRef(ref)
    const queryClient = useQueryClient()
    const {requestPermission} = useMediaPersmissions()
    const productsActions = useProductsActions()
    const loadingState = useProductsLoadingState()
    const isEditMode = props.mode === 'edit' && props.product

    // Local State
    const [productCover, setProductCover] = useState<ImageInterface | null>(
      null
    )
    const [otherImages, setOtherImages] = useState<(ImageInterface | null)[]>([
      null,
      null,
      null,
      null
    ])

    const imgDir = FileSystem.documentDirectory + 'product-images/'

    const ensureDirExists = async () => {
      const dirInfo = await FileSystem.getInfoAsync(imgDir)
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(imgDir, {intermediates: false})
      }
    }

    const selectImage = async (
      imageType: 'cover' | 'other',
      index?: number
    ) => {
      try {
        const permissionStatus = await requestPermission()
        if (permissionStatus) {
          return
        }

        // Determine if this is bulk selection (no specific index) or single replacement
        const isBulkSelection = imageType === 'other' && index === undefined

        const result = await ImagePicker.openPicker({
          multiple: isBulkSelection, // Only allow multiple for bulk "Add Multiple" action
          compressImageMaxWidth: 800, // Reduce max width
          compressImageMaxHeight: 800, // Reduce max height
          compressImageQuality: 1, // 70% quality
          cropping: imageType === 'cover', // Only crop cover image
          cropperChooseText: 'crop'
        })

        if (isBulkSelection && Array.isArray(result)) {
          await saveMultipleImages(result)
        } else if (!Array.isArray(result)) {
          await saveImage(result, imageType, index)
        }
      } catch (err: any) {
        console.log('Image selection error:', err)
        if (err.code !== 'E_PICKER_CANCELLED') {
          toast.info('Failed to select image. Please try again.')
        }
      }
    }

    const saveMultipleImages = async (selectedImages: ImageOrVideo[]) => {
      try {
        await ensureDirExists()
        const newOtherImages = [...otherImages]
        let availableSlotIndex = 0

        for (const selectedImage of selectedImages) {
          // Find next available slot
          while (
            availableSlotIndex < 4 &&
            newOtherImages[availableSlotIndex] !== null
          ) {
            availableSlotIndex++
          }

          if (availableSlotIndex >= 4) {
            toast.info(
              'Maximum 4 additional images allowed (5 total including cover)'
            )
            break
          }

          // Generate unique filename
          const timestamp = Date.now() + availableSlotIndex
          const randomId = Math.random().toString(36).substring(7)
          const extension = selectedImage.path.split('.').pop() || 'jpg'
          const fileName = `product_${timestamp}_${randomId}.${extension}`
          const newUri = imgDir + fileName

          try {
            await FileSystem.copyAsync({
              from: selectedImage.path,
              to: newUri
            })

            const imageData: ImageInterface = {
              image: newUri,
              isCropped: false,
              isUrlImage: false
            }

            newOtherImages[availableSlotIndex] = imageData
            availableSlotIndex++
          } catch (copyError) {
            console.log('Error copying image:', copyError)
            // Use original path if copy fails
            const imageData: ImageInterface = {
              image: selectedImage.path,
              isCropped: false,
              isUrlImage: false
            }

            newOtherImages[availableSlotIndex] = imageData
            availableSlotIndex++
          }
        }

        setOtherImages(newOtherImages)
      } catch (err) {
        console.log('Error saving multiple images:', err)
        toast.info('Failed to save some images. Please try again.')
      }
    }

    const saveImage = async (
      selectedImage: ImageOrVideo,
      imageType: 'cover' | 'other',
      index?: number
    ) => {
      try {
        await ensureDirExists()

        // Generate unique filename
        const timestamp = Date.now()
        const randomId = Math.random().toString(36).substring(7)
        const extension = selectedImage.path.split('.').pop() || 'jpg'
        const fileName = `product_${timestamp}_${randomId}.${extension}`
        const newUri = imgDir + fileName

        try {
          await FileSystem.copyAsync({
            from: selectedImage.path,
            to: newUri
          })

          const imageData: ImageInterface = {
            image: newUri,
            isCropped: true,
            isUrlImage: false
          }

          if (imageType === 'cover') {
            setProductCover(imageData)
          } else if (imageType === 'other' && index !== undefined) {
            const newOtherImages = [...otherImages]
            newOtherImages[index] = imageData
            setOtherImages(newOtherImages)
          }
        } catch (copyError) {
          console.log('Error copying image:', copyError)
          // Use original path if copy fails
          const imageData: ImageInterface = {
            image: selectedImage.path,
            isCropped: true,
            isUrlImage: false
          }

          if (imageType === 'cover') {
            setProductCover(imageData)
          } else if (imageType === 'other' && index !== undefined) {
            const newOtherImages = [...otherImages]
            newOtherImages[index] = imageData
            setOtherImages(newOtherImages)
          }
        }
      } catch (err) {
        console.log('Error saving image:', err)
        toast.info('Failed to save image. Please try again.')
      }
    }

    const removeImage = async (
      imageType: 'cover' | 'other',
      index?: number
    ) => {
      if (imageType === 'cover' && productCover) {
        // Delete file if it's a local image
        if (!productCover.isUrlImage) {
          try {
            const imgInfo = await FileSystem.getInfoAsync(productCover.image)
            if (imgInfo.exists) {
              await FileSystem.deleteAsync(productCover.image, {
                idempotent: true
              })
            }
          } catch (err) {
            console.log('Error deleting cover image:', err)
          }
        }
        setProductCover(null)
      } else if (
        imageType === 'other' &&
        index !== undefined &&
        otherImages[index]
      ) {
        const imageToDelete = otherImages[index]
        if (imageToDelete && !imageToDelete.isUrlImage) {
          try {
            const imgInfo = await FileSystem.getInfoAsync(imageToDelete.image)
            if (imgInfo.exists) {
              await FileSystem.deleteAsync(imageToDelete.image, {
                idempotent: true
              })
            }
          } catch (err) {
            console.log('Error deleting other image:', err)
          }
        }
        const newOtherImages = [...otherImages]
        newOtherImages[index] = null
        setOtherImages(newOtherImages)
      }
    }

    const deleteAllImages = async () => {
      try {
        const dirInfo = await FileSystem.getInfoAsync(imgDir)
        if (dirInfo.exists) {
          await FileSystem.deleteAsync(imgDir, {idempotent: true})
        }
      } catch (err) {
        console.log('Error deleting all images:', err)
      }
      setProductCover(null)
      setOtherImages([null, null, null, null])
    }

    useEffect(() => {
      const cleanup = async () => {
        await deleteAllImages()
      }

      return () => {
        cleanup()
      }
    }, [])

    const handleProductSubmit = async (values: any) => {
      console.log('🚀 ~ handleProductSubmit ~ values:', values)
      if (!values.productName.trim()) {
        toast.info('Please enter product name')
        return
      }

      if (!values.sellingPrice.trim()) {
        toast.info('Please enter selling price')
        return
      }

      let payload
      try {
        // Upload images to Cloudinary first and get URLs
        const imageUrls = await uploadImagesToCloudinary()

        // Limit total images to prevent server overload
        const maxImages = 5 // Cover + 2 additional images to reduce payload
        const limitedImages = imageUrls.slice(0, maxImages)

        payload = {
          name: values.productName,
          description: values.brand?.trim()
            ? `Brand: ${values.brand.trim()}\n\nAdded from products page`
            : 'Added from products page',
          category: '',
          tags: [],
          unit_price: parseFloat(values.sellingPrice),
          discount_price: parseFloat(values.discountPrice) || 0,
          cost_price: 0,
          visible: true,
          quantity: 1,
          low_stock_alert: 0,
          images: limitedImages
        }
      } catch (error) {
        console.log('Error uploading images:', error)
        toast.info('Error uploading images. Please try again.')
        return
      }

      const onSuccess = () => {
        innerRef.current?.dismiss()
        queryClient.invalidateQueries({queryKey: [QUERY_KEYS.PRODUCTS]})

        if (isEditMode) {
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.PRODUCTS, props.productId]
          })
        }

        props.onSuccess?.()

        // Reset form and images only if creating
        if (!isEditMode) {
          formik.resetForm()
          setProductCover(null)
          setOtherImages([null, null, null, null])
        }
      }

      if (isEditMode && props.productId) {
        await productsActions.updateProduct(props.productId, payload, onSuccess)
      } else {
        await productsActions.createProduct(payload, onSuccess)
      }
    }

    const renderFooter = () => (
      <Button
        label={isEditMode ? 'Update product' : 'Save product'}
        onPress={formik.handleSubmit}
        loading={
          isEditMode ? loadingState.updateProduct : loadingState.createProduct
        }
      />
    )

    // Initialize form with product data if editing
    useEffect(() => {
      if (isEditMode && props.product) {
        const product = props.product

        const setFormValues = () => {
          formik.setValues({
            productName: product.name || '',
            brand: product.brand || '',
            sellingPrice: product.unit_price?.toString() || '',
            discountPrice: product.discount_price?.toString() || '',
            description: product.description || ''
          })
        }

        setFormValues()

        // Set images from existing product (URL images)
        if (product.images && product.images.length > 0) {
          // Set first image as cover
          setProductCover({
            image: product.images[0],
            isCropped: true,
            isUrlImage: true
          })
        }

        // Set remaining images as other images (skip first one as it's the cover)
        const existingOtherImages: (ImageInterface | null)[] = [
          null,
          null,
          null,
          null
        ]
        if (product.images && product.images.length > 1) {
          const remainingImages = product.images.slice(1, 5) // Skip first, max 4 additional
          remainingImages.forEach((img: string, index: number) => {
            if (index < 4) {
              existingOtherImages[index] = {
                image: img,
                isCropped: true,
                isUrlImage: true
              }
            }
          })
        }
        setOtherImages(existingOtherImages)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditMode, props.product])

    // Get clean other images (non-null)
    const getCleanOtherImages = () => {
      return otherImages.filter(img => img !== null) as ImageInterface[]
    }

    // Upload images to Cloudinary and return URLs
    const uploadImagesToCloudinary = async (): Promise<string[]> => {
      try {
        const {business_id} = await userQuery()
        const merchantId = business_id

        if (!merchantId) {
          throw new Error('Merchant ID not found')
        }

        const allImages = getAllImages()
        const localImages = allImages.filter(img => !img.isUrlImage)

        if (localImages.length === 0) {
          // Return existing URL images
          return allImages.map(img => img.image)
        }

        const imagePayloads = []
        for (const image of localImages) {
          const payload = await cldOptions(
            image.image,
            `/${merchantId}/uploads/images/products`
          )
          imagePayloads.push(payload)
        }

        const imageApiCalls = imagePayloads.map(img =>
          api.public.uploadImageToCloudinary(img)
        )

        const cloudinaryResponses = await Promise.all(imageApiCalls)

        // Combine existing URL images with newly uploaded ones
        const existingUrls = allImages
          .filter(img => img.isUrlImage)
          .map(img => img.image)

        const newUrls = cloudinaryResponses.map((response: any) => {
          // Ensure HTTPS URLs for security and to avoid mixed content issues
          return response.url?.replace('http://', 'https://') || response.url
        })

        return [...existingUrls, ...newUrls]
      } catch (error) {
        console.log('Error uploading images to Cloudinary:', error)
        throw error
      }
    }

    // Get all images for upload
    const getAllImages = () => {
      const allImages: ImageInterface[] = []
      if (productCover) allImages.push(productCover)
      allImages.push(...getCleanOtherImages())
      return allImages
    }

    const formik = useFormik({
      initialValues: {
        productName: '',
        brand: '',
        sellingPrice: '',
        discountPrice: '',
        description: ''
      },
      validateOnMount: true,
      // validationSchema: productSchema,
      onSubmit: handleProductSubmit
    })

    // if (collectionsQuery.data) {

    return (
      <AppModal
        ref={innerRef}
        title={isEditMode ? 'Edit Product' : 'Add New Product'}
        snapPoints={['85%']}
        footer={renderFooter}>
        <Box gap={16}>
          <TextField
            name="productName"
            label="Name of product"
            placeholder="Enter detailed name of your product"
            value={formik.values.productName}
            onChangeText={formik.handleChange('productName')}
            readOnly={loadingState.createProduct || loadingState.updateProduct}
          />

          <TextField
            name="brand"
            label="Brand"
            placeholder="Brand e.g. Adaeze Collection"
            value={formik.values.brand}
            onChangeText={formik.handleChange('brand')}
            readOnly={loadingState.createProduct || loadingState.updateProduct}
          />

          <FileUploadBox
            value={productCover?.image || null}
            variant="full"
            label="Upload product cover"
            onChange={() => selectImage('cover')}
            onRemove={() => removeImage('cover')}
            showRemove={!!productCover}
          />

          <Box>
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              mb={8}>
              <Typography variant="body-medium" color="text-primary">
                Other images (optional)
              </Typography>
            </Box>

            <Box flexDirection="row" gap={12}>
              {otherImages.map((image, index) => (
                <FileUploadBox
                  key={index}
                  value={image?.image || null}
                  onChange={() => selectImage('other', index)}
                  onRemove={() => removeImage('other', index)}
                  showRemove={!!image}
                />
              ))}
            </Box>
            <Typography variant="c1-medium" color="neutral-600" mt={4}>
              {getCleanOtherImages().length}/4 additional images • Tap
              &ldquo;Add Multiple&rdquo; to select up to 4 images (5 total max)
            </Typography>
          </Box>

          <TextField
            name="sellingPrice"
            label="Selling Price (₦)"
            placeholder="Enter price"
            keyboardType="phone-pad"
            inputMode="numeric"
            value={formik.values.sellingPrice}
            onChangeText={formik.handleChange('sellingPrice')}
            readOnly={loadingState.createProduct || loadingState.updateProduct}
          />

          <TextField
            name="discountPrice"
            label="Discount Price (₦)"
            placeholder="Enter discount price"
            keyboardType="phone-pad"
            inputMode="numeric"
            value={formik.values.discountPrice}
            onChangeText={formik.handleChange('discountPrice')}
            readOnly={loadingState.createProduct || loadingState.updateProduct}
          />

          <Typography variant="c1" color="neutral-600">
            This manual form now matches onboarding details.
          </Typography>
        </Box>
      </AppModal>
    )
    // }

    // if (collectionsQuery.isLoading) {
    //   return (
    //     <Box
    //       flex={1}
    //       backgroundColor="white"
    //       alignItems="center"
    //       justifyContent="center">
    //       <PushaActivityIndicator />
    //     </Box>
    //   )
    // }

    // if (collectionsQuery.isError) {
    //   return (
    //     <Box
    //       flex={1}
    //       backgroundColor="white"
    //       alignItems="center"
    //       justifyContent="center">
    //       <DisplayState subText="Uh oh, an error was encountered" state="error">
    //         <TextAction
    //           textAlign="center"
    //           iconName="replace"
    //           iconPosition="start"
    //           // onPress={() => collectionsQuery.refetch()}
    //         >
    //           Try again
    //         </TextAction>
    //       </DisplayState>
    //     </Box>
    //   )
    // }
  }
)

// const CollectionsProductItem: FC<ProductCollectionsItemProps> = props => {
//   const initialState = () => {
//     const index = props.selectedCollections.findIndex(
//       selectedItem => selectedItem === props.collection._id
//     )

//     return index > -1
//   }
//   const [isChecked, setIsChecked] = useState(initialState())

//   function handleSetChecked(state: boolean) {
//     setIsChecked(state)
//     props.setItem(props.collection._id ?? '', state)
//   }

//   return (
//     <>
//       <Box flexDirection="row" height={44} flex={1} gap={8}>
//         <Box flex={1} gap={8} py={2} flexDirection="row">
//           <Box justifyContent="center">
//             <AppCheckBox value={isChecked} onValueChange={handleSetChecked} />
//           </Box>
//           <Box flexDirection="row" alignItems="center" maxWidth={200}>
//             <Typography variant="body" numberOfLines={2}>
//               {props.collection.name}
//             </Typography>
//           </Box>
//         </Box>
//       </Box>
//       {!props.isLast && <Divider />}
//     </>
//   )
// }

SaveEditProductModal.displayName = 'SaveEditProductModal'
export default SaveEditProductModal
