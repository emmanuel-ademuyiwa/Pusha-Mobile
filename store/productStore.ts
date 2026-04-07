import {QUERY_KEYS} from '@/constants/queryKeys'
import {queryClient} from '@/utils/queryClient'
import {router} from 'expo-router'
import {create} from 'zustand'

import api from '@/api'
import {userQuery} from '@/queries/userQueries'
import {
  ICloudinaryImage,
  ICreateProductPayload,
  ImageInterface,
  IProduct,
  ProductStatus,
  QuantityObject,
  VariantObject
} from '@/types'
import {cldOptions} from '@/utils/cloudinary'
import {errorHandler} from '@/utils/errorHandler'
import toast from '@/utils/toast'

interface VariantConfig {
  quantity: QuantityObject[]
  variants: VariantObject[]
}

interface ProductStore {
  id: string
  name: string
  price: string
  quantity: string
  description: string
  variantConfig: VariantConfig
  productImages: ImageInterface[]
  status: ProductStatus
  loadingState: {
    createOrEditProduct: boolean
  }
  unlistedProducts: IProduct[]
  actions: {
    setProductId: (id: string) => void
    setName: (name: string) => void
    setStatus: (status: ProductStatus) => void
    setPrice: (price: string) => void
    setQuantity: (quantity: string) => void
    setDescription: (description: string) => void
    setVariantConfig: (variant: VariantConfig) => void
    resetProductStore: () => void
    setProductImages: (images: ImageInterface[]) => void
    validateProduct: () => boolean
    createOrEditProduct: (mode: 'create' | 'edit') => Promise<void>
    setUnlistedProducts: (products: IProduct[]) => void
  }
}

const useProductStore = create<ProductStore>()((set, get) => {
  return {
    id: '',
    name: '',
    price: '',
    quantity: '',
    description: '',
    productImages: [],
    status: 'published' as any,
    loadingState: {
      createOrEditProduct: false
    },
    unlistedProducts: [],
    variantConfig: {
      quantity: [],
      variants: []
    },
    actions: {
      setProductId: (id: string) => set({id}),
      setName: (name: string) => set({name}),
      setPrice: (price: string) => {
        set(() => ({price}))
      },
      setStatus: (status: ProductStatus) => set({status}),
      setQuantity: (quantity: string) => {
        set(() => ({quantity}))
      },
      setDescription: (description: string) => {
        set(() => ({description}))
      },
      setVariantConfig: (variantConfig: VariantConfig) => {
        set(() => ({variantConfig}))
      },
      setProductImages: (productImages: ImageInterface[]) => {
        set(() => ({productImages}))
      },
      validateProduct: () => {
        const {name, price, quantity, variantConfig} = get()

        if (!name) {
          toast.info('Please add a name for this product')
          return false
        }
        if (!variantConfig.variants.length) {
          if (!price) {
            toast.info('Please add a price for this product')
            return false
          }
          if (Number(price) < 500) {
            toast.info('Minimum possible price is ₦500')
            return false
          }
          if (!quantity) {
            toast.info('Please add a quantity for this product')
            return false
          }
        }

        return true
      },
      createOrEditProduct: async (mode: string) => {
        const {
          productImages,
          name,
          price,
          quantity,
          description,
          variantConfig,
          actions
        } = get()
        if (!actions.validateProduct()) return

        try {
          set(state => ({
            loadingState: {...state.loadingState, createOrEditProduct: true}
          }))

          const {merchant} = await userQuery()

          const merchantId = merchant._id

          if (!merchantId) {
            toast.error('Merchant ID not found')
            return
          }

          const urlImages = productImages.filter(i =>
            i.image.includes('https://')
          )
          const formattedUrlImages = urlImages.map(i => {
            return {
              publicId: i.publicId,
              assetId: i.assetId
            } as ICloudinaryImage
          })
          const localImages = productImages.filter(
            i => !i.image.includes('https://')
          )

          const ImagePayload = []

          for (const image of localImages) {
            const payload = await cldOptions(
              image.image,
              `/${merchantId}/uploads/images/products`
            )

            ImagePayload.push(payload)
          }

          const imageApiCalls = ImagePayload.map(img => {
            return api.public.uploadImageToCloudinary(img)
          })

          const res = await Promise.all(imageApiCalls)

          const formattedLocalImages: ICloudinaryImage[] = res.map(
            (img: any) => {
              return {
                publicId: img.public_id,
                assetId: img.asset_id
              }
            }
          )

          let formattedPrice, formattedQuantity
          if (variantConfig.variants.length) {
            formattedPrice = 0
            formattedQuantity = 0
          } else {
            formattedPrice = parseFloat(price.replace(/,/g, ''))
            formattedQuantity = parseInt(quantity.replace(/,/g, ''), 10)
          }

          const formattedQuantityAndPrice = variantConfig.quantity.map(qty => {
            return {
              ...qty,
              quantity: parseInt(qty.quantity.replace(/,/g, ''), 10),
              price: parseFloat(qty.price.replace(/,/g, ''))
            }
          })

          const productPayload: ICreateProductPayload = {
            ...(variantConfig.variants.length && {
              variantConfig: {
                quantityAndPrice: formattedQuantityAndPrice,
                variants: {
                  config: variantConfig.variants,
                  hasDifferentPrices: !!variantConfig.variants.length
                }
              }
            }),
            store: '',
            // store: useStoreStore.getState().id,
            name: name.trim(),
            price: formattedPrice,
            status: get().status,
            quantity: formattedQuantity,
            description: description.trim(),
            images: [...formattedUrlImages, ...formattedLocalImages].length
              ? [...formattedUrlImages, ...formattedLocalImages]
              : undefined
          }

          if (mode === 'create') {
            await api.products.createProduct(productPayload)
            set(state => ({
              loadingState: {...state.loadingState, createOrEditProduct: false}
            }))

            toast.info('Product created successfully')
          } else {
            await api.products.updateProduct(get().id, productPayload)
            set(state => ({
              loadingState: {...state.loadingState, createOrEditProduct: false}
            }))

            toast.info('Product updated successfully')
            queryClient
              .invalidateQueries({
                queryKey: [QUERY_KEYS.PRODUCT, get().id]
              })
              .then()
          }

          queryClient
            .invalidateQueries({
              queryKey: [QUERY_KEYS.PRODUCTS, 'useStoreStore.getState().id']
            })
            .then()
          get().actions.resetProductStore()
          router.back()
        } catch (err) {
          set(state => ({
            loadingState: {...state.loadingState, createOrEditProduct: false}
          }))
          errorHandler(err)
        }
      },

      resetProductStore: () => {
        set(() => ({
          id: '',
          name: '',
          price: '',
          quantity: '',
          description: '',
          productImages: [],
          variantConfig: {
            quantity: [],
            variants: []
          }
        }))
      },
      setUnlistedProducts: (products: IProduct[]) => {
        set(() => ({unlistedProducts: products}))
      }
    }
  }
})

const useProductName = () => useProductStore(state => state.name)
const useProductPrice = () => useProductStore(state => state.price)
const useProductQuantity = () => useProductStore(state => state.quantity)
const useProductStatus = () => useProductStore(state => state.status)
const useUnlistedProducts = () =>
  useProductStore(state => state.unlistedProducts)
const useProductLoadingState = () =>
  useProductStore(state => state.loadingState)
const useProductImages = () => useProductStore(state => state.productImages)
const useProductDescription = () => useProductStore(state => state.description)
const useProductVariantConfig = () =>
  useProductStore(state => state.variantConfig)
const useProductActions = () => useProductStore(state => state.actions)

export {
  useProductActions,
  useProductDescription,
  useProductImages,
  useProductLoadingState,
  useProductName,
  useProductPrice,
  useProductQuantity,
  useProductStatus,
  useProductStore,
  useProductVariantConfig,
  useUnlistedProducts
}
