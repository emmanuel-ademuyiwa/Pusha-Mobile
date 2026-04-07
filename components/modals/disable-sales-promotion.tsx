import {SalesPromotionStatus} from '@baze-sdk/schema'
import {useQueryClient} from '@tanstack/react-query'
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

interface DisableSalesPromotionProps {
  type: 'Discount' | 'Voucher'
  id: string
}

const DisableSalesPromotionModal = forwardRef<
  Modal,
  DisableSalesPromotionProps
>((props, ref) => {
  const innerRef = useForwardedRef(ref)
  const storeId = useStoreId()
  const queryClient = useQueryClient()

  const [disableSalesPromotionApiState, setDisableSalesPromotionApiState] =
    useState<API_STATUS>(API_STATUS.IDLE)

  const handleDisableSalesPromotion = async () => {
    setDisableSalesPromotionApiState(API_STATUS.LOADING)

    try {
      const payload = {
        status: SalesPromotionStatus.disabled
      }

      await api.salesPromotions.updateSalesPromotion(storeId, props.id, payload)
      toast.info(`${props.type} disabled`)
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SALES_PROMOTION, storeId, props.id]
        }),
        queryClient.invalidateQueries({
          queryKey: [
            props.type === 'Discount'
              ? QUERY_KEYS.DISCOUNTS
              : QUERY_KEYS.VOUCHERS,
            storeId
          ]
        })
      ])
      setDisableSalesPromotionApiState(API_STATUS.SUCCESS)
      innerRef.current?.dismiss()
    } catch (err) {
      setDisableSalesPromotionApiState(API_STATUS.ERROR)
      errorHandler(err)
      toast.error('Failed to disable sales promotion')
    }
  }

  const renderFooter = () => (
    <Box>
      <Button
        variant="destructive-1"
        label="Yes, disable"
        onPress={handleDisableSalesPromotion}
        loading={disableSalesPromotionApiState === API_STATUS.LOADING}
      />
    </Box>
  )

  return (
    <BZModal
      panDownToClose={disableSalesPromotionApiState !== API_STATUS.LOADING}
      ref={innerRef}
      title={props.type === 'Discount' ? 'Disable discount' : 'Disable voucher'}
      snapPoints={[260]}
      footer={renderFooter}>
      <Typography color="neutral-600">
        Are you sure you want to disable this{' '}
        {props.type === 'Discount' ? 'discount' : 'voucher'}? It will no longer
        be available to your customers.
      </Typography>
    </BZModal>
  )
})

DisableSalesPromotionModal.displayName = 'DisableSalesPromotionModal'
export {DisableSalesPromotionModal}
