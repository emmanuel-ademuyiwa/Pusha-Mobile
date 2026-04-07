import {ICollection, IProduct} from '@baze-sdk/schema'
import {useQueryClient} from '@tanstack/react-query'
import {Image} from 'expo-image'
import {uniqueId} from 'lodash'
import React, {FC, forwardRef, useEffect, useState} from 'react'
import {Alert, Pressable} from 'react-native'

import {CollectionsProductItemProps} from '../../modules/products/types'

import api from '@/api'
import {
  AppCheckBox,
  BazeIcon,
  Box,
  Button,
  BZModal,
  DisplayState,
  PushaActivityIndicator,
  TextAction,
  TextField,
  Typography
} from '@/components/ui'
import {API_STATUS} from '@/constants/ApiConstants'
import {QUERY_KEYS} from '@/constants/queryKeys'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import {useProductsQuery} from '@/queries/productQueries'
import {useCollectionQuery} from '@/queries/storeQueries'
import {useStoreId} from '@/store/storeStore'
import {Modal} from '@/types/modal'
import {cld} from '@/utils/cloudinary'
import {errorHandler} from '@/utils/errorHandler'
import toast from '@/utils/toast'

const imagePlaceholder = require('@assets/image-placeholder.png')
interface EditCollectionModalProps {
  collection: ICollection
  collectionId: string
}

const EditCollectionModal = forwardRef<Modal, EditCollectionModalProps>(
  (props, ref) => {
    //
    const innerRef = useForwardedRef(ref)
    const queryClient = useQueryClient()
    const storeId = useStoreId()
    const collectionQuery = useCollectionQuery(props.collectionId)
    const productsQuery = useProductsQuery(storeId)

    useEffect(() => {
      if (collectionQuery.data) {
        const collectionProducts = collectionQuery.data.collection.products

        setSelectedProducts(
          (collectionProducts as IProduct[]).map(i => i._id) as string[]
        )
      }
    }, [collectionQuery.data])

    // Local State
    const [collectionName, setCollectionName] = useState<string>(
      props.collection.name
    )
    const [updateCollectionApiState, setUpdateCollectionApiState] =
      React.useState<API_STATUS>(API_STATUS.IDLE)

    const [selectedProducts, setSelectedProducts] = React.useState<string[]>([])

    // Actions

    const setCollectionProducts = (productId: string, isChecked: boolean) => {
      if (isChecked) {
        setSelectedProducts(prevState => [...prevState, productId])
      } else {
        const index = selectedProducts.findIndex(j => j === productId)

        if (index > -1) {
          setSelectedProducts(prevState =>
            prevState.filter(k => k !== productId)
          )
        }
      }
    }

    const handleCollectionUpdate = async () => {
      if (!collectionName) {
        Alert.alert('Error', 'Collection name is required')
      }

      try {
        setUpdateCollectionApiState(API_STATUS.LOADING)

        // IF Collection name changed
        if (collectionName !== collectionQuery.data?.collection.name) {
          await api.stores.editCollectionName(props.collectionId, {
            name: collectionName.trim()
          })

          await api.stores.editCollectionProducts(props.collectionId, {
            products: selectedProducts
          })
        } else {
          await api.stores.editCollectionProducts(props.collectionId, {
            products: selectedProducts
          })
        }

        toast.info('Collection updated successfully')
        queryClient
          .invalidateQueries({
            queryKey: [QUERY_KEYS.COLLECTION, props.collectionId]
          })
          .then()
        queryClient
          .invalidateQueries({
            queryKey: [QUERY_KEYS.COLLECTIONS, storeId]
          })
          .then()
        queryClient
          .invalidateQueries({
            queryKey: [QUERY_KEYS.PRODUCT]
          })
          .then()
        innerRef.current?.dismiss()

        setUpdateCollectionApiState(API_STATUS.SUCCESS)
      } catch (err) {
        setUpdateCollectionApiState(API_STATUS.ERROR)
        errorHandler(err)
      }
    }

    // Modal footer component
    const renderFooter = () => (
      <Box>
        <Button
          label="Save changes"
          onPress={handleCollectionUpdate}
          loading={updateCollectionApiState === API_STATUS.LOADING}
        />
      </Box>
    )

    return (
      <BZModal
        panDownToClose={updateCollectionApiState !== API_STATUS.LOADING}
        ref={innerRef}
        title="Edit Collection"
        snapPoints={['90%']}
        footerDivider
        footer={renderFooter}
        headerDivider
        header={
          <TextField
            name="Collection Name"
            label="Collection name"
            readOnly={updateCollectionApiState === API_STATUS.LOADING}
            value={collectionName}
            onChangeText={name => setCollectionName(name)}
          />
        }>
        <Pressable accessibilityRole="button" style={{flexGrow: 1}}>
          {/* Loading */}
          {productsQuery.data && (
            <>
              {productsQuery.data?.products.length > 0 && (
                <>
                  {productsQuery.data.products.map(p => (
                    <Box key={uniqueId()} mt={24}>
                      <CollectionsProductItem
                        product={p}
                        selectedProducts={selectedProducts}
                        setItem={setCollectionProducts}
                      />
                    </Box>
                  ))}
                </>
              )}
              {/* Success but no products yet */}
              {productsQuery.data?.products.length === 0 && (
                <Box flex={1} mt={80}>
                  <DisplayState
                    icon="product"
                    subText={`You have not added any products to \n this store.`}
                  />
                </Box>
              )}
            </>
          )}

          {productsQuery.isLoading && (
            <Box flex={1} alignItems="center" justifyContent="center">
              <PushaActivityIndicator />
            </Box>
          )}

          {productsQuery.isError && (
            <Box flex={1} alignItems="center" justifyContent="center">
              <DisplayState
                subText="Uh oh, an error was encountered"
                state="error">
                <TextAction
                  textAlign="center"
                  iconName="replace"
                  iconPosition="start"
                  onPress={() => productsQuery.refetch()}>
                  Try again
                </TextAction>
              </DisplayState>
            </Box>
          )}
        </Pressable>
      </BZModal>
    )
  }
)

const CollectionsProductItem: FC<CollectionsProductItemProps> = props => {
  const initialState = () => {
    const index = props.selectedProducts.findIndex(
      selectedItem => selectedItem === props.product._id
    )

    return index > -1
  }
  const [isChecked, setIsChecked] = useState(initialState())

  function handleSetChecked(state: boolean) {
    setIsChecked(state)
    props.setItem(props.product._id ?? '', state)
  }

  return (
    <Box flexDirection="row" height={48} flex={1} gap={8}>
      {props.product.images.length ? (
        <Image
          placeholder={imagePlaceholder}
          placeholderContentFit="cover"
          source={{uri: cld.image(props.product.images[0].publicId).toURL()}}
          style={{width: 48, height: 48, borderRadius: 8}}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <Box
          backgroundColor="neutral-200"
          height={48}
          width={48}
          borderRadius={8}
          alignItems="center"
          justifyContent="center">
          <BazeIcon name="product" size={20} color="#959CA7" />
        </Box>
      )}
      <Box
        flex={1}
        gap={12}
        py={2}
        flexDirection="row"
        justifyContent="space-between">
        <Box flexDirection="row" alignItems="center" maxWidth={200}>
          <Typography variant="body-medium" numberOfLines={2}>
            {props.product.name}
          </Typography>
        </Box>

        <Box justifyContent="center">
          <AppCheckBox value={isChecked} onValueChange={handleSetChecked} />
        </Box>
      </Box>
    </Box>
  )
}

EditCollectionModal.displayName = 'EditCollectionModal'
export default EditCollectionModal
