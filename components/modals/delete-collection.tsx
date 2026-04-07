import {useQueryClient} from '@tanstack/react-query'
import {router} from 'expo-router'
import React, {forwardRef, useState} from 'react'

import api from '@/api'
import {Box, Button, BZModal, Typography} from '@/components/ui'
import {API_STATUS} from '@/constants/ApiConstants'
import {QUERY_KEYS} from '@/constants/queryKeys'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import {useStoreId} from '@/store/storeStore'
import {Modal} from '@/types/modal'
import {errorHandler} from '@/utils/errorHandler'
import toast from '@/utils/toast'

interface DeleteCollectionModalProps {
  collectionId: string
}

const DeleteCollectionModal = forwardRef<Modal, DeleteCollectionModalProps>(
  (props, ref) => {
    const innerRef = useForwardedRef(ref)
    const storeId = useStoreId()
    const queryClient = useQueryClient()

    const [deleteCollectionApiState, setDeleteCollectionApiState] =
      useState<API_STATUS>(API_STATUS.IDLE)

    const handleDeleteCollection = async () => {
      setDeleteCollectionApiState(API_STATUS.LOADING)

      try {
        await api.stores.deleteCollection(props.collectionId)
        toast.info('Collection deleted')
        queryClient
          .invalidateQueries({
            queryKey: [QUERY_KEYS.COLLECTIONS, storeId]
          })
          .then()
        queryClient
          .invalidateQueries({
            queryKey: [QUERY_KEYS.PRODUCT, storeId]
          })
          .then()
        router.back()
        setDeleteCollectionApiState(API_STATUS.SUCCESS)
        innerRef.current?.dismiss()
      } catch (err) {
        setDeleteCollectionApiState(API_STATUS.ERROR)
        errorHandler(err)
        toast.error('Failed to delete collection')
      }
    }

    const renderFooter = () => (
      <Box>
        <Button
          variant="destructive-1"
          label="Yes, delete"
          onPress={handleDeleteCollection}
          loading={deleteCollectionApiState === API_STATUS.LOADING}
        />
      </Box>
    )

    return (
      <BZModal
        panDownToClose={deleteCollectionApiState !== API_STATUS.LOADING}
        ref={innerRef}
        title="Delete collection"
        snapPoints={[260]}
        footer={renderFooter}>
        <Typography color="neutral-600">
          Are you sure you want to delete this collection? It will no longer
          reflect on your online store.
        </Typography>
      </BZModal>
    )
  }
)

DeleteCollectionModal.displayName = 'DeleteCollectionModal'
export default DeleteCollectionModal
