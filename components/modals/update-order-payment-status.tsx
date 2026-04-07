import {
  IOrder,
  IStoreFee,
  IUpdateOrderPaymentStatusPayload,
  PaymentStatus
} from '@baze-sdk/schema'
import React, {forwardRef, useState} from 'react'

import api from '@/api'
import {BZModal, Box, Button, Typography} from '@/components/ui'
import {API_STATUS} from '@/constants/ApiConstants'
import {QUERY_KEYS} from '@/constants/queryKeys'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import {Modal} from '@/types/modal'
import {errorHandler} from '@/utils/errorHandler'
import {queryClient} from '@/utils/queryClient'
import toast from '@/utils/toast'

interface Props {
  mode: 'mark-as-paid' | 'mark-as-unpaid'
  order: IOrder
  storeId: string
  fee?: IStoreFee
}

const UpdatePaymentStatus = forwardRef<Modal, Props>(
  ({mode, order, storeId}, ref) => {
    const [apiState, setApiState] = useState(API_STATUS.IDLE)
    const innerRef = useForwardedRef(ref)

    const handleUpdatePaymentStatus = async () => {
      try {
        setApiState(API_STATUS.LOADING)
        const payload: IUpdateOrderPaymentStatusPayload = {
          order: order._id as string,
          paymentStatus:
            mode === 'mark-as-paid' ? PaymentStatus.paid : PaymentStatus.notPaid
        }

        await api.orders.updateOrderPaymentStatus(storeId, payload)

        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ORDER, storeId, order.ref],
          type: 'all'
        })
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ORDERS, storeId],
          type: 'all'
        })

        setApiState(API_STATUS.SUCCESS)
        toast.info(
          mode === 'mark-as-paid'
            ? 'Order marked as paid'
            : 'Order marked as unpaid'
        )
        innerRef.current?.dismiss()
      } catch (err) {
        errorHandler(err)
        setApiState(API_STATUS.ERROR)
        toast.error('Failed to update order payment status')
        innerRef.current?.dismiss()
      }
    }

    const renderFooter = () => (
      <>
        <Box>
          <Button
            variant="secondary"
            label={mode === 'mark-as-paid' ? 'Mark as paid' : 'Mark as unpaid'}
            loading={apiState === API_STATUS.LOADING}
            onPress={handleUpdatePaymentStatus}
          />
        </Box>
      </>
    )

    return (
      <BZModal
        panDownToClose={apiState !== API_STATUS.LOADING}
        ref={innerRef}
        title={
          mode === 'mark-as-paid'
            ? 'Mark order as paid?'
            : 'Mark order as unpaid?'
        }
        snapPoints={[250]}
        footer={renderFooter}>
        <Box>
          <Typography>
            {mode === 'mark-as-paid'
              ? 'Marking order as paid will update the payment status to paid and record the amount as part of your sales.'
              : 'Marking order as unpaid will update the payment status to unpaid and remove the amount from your sales.'}
          </Typography>
        </Box>
      </BZModal>
    )
  }
)

UpdatePaymentStatus.displayName = 'UpdatePaymentStatus'
export {UpdatePaymentStatus}
