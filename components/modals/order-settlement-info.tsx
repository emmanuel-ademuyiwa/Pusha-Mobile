import {ISettlementOrderMeta, SettlementStatus} from '@baze-sdk/schema'
import dayjs from 'dayjs'
import {router} from 'expo-router'
import React, {forwardRef} from 'react'

import {ListItem} from '../shared/list-item'

import {
  BZModal,
  BZPressable,
  Badge,
  BazeIcon,
  Box,
  Divider,
  Typography
} from '@/components/ui'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import {Modal} from '@/types/modal'
import {formatCurrency} from '@/utils/currency'

type Props = {
  order: ISettlementOrderMeta
}

export const OrderSettlementInfoModal = forwardRef<Modal, Props>(
  (props, ref) => {
    const innerRef = useForwardedRef(ref)

    return (
      <BZModal ref={innerRef} snapPoints={[550]} title="Settlement details">
        <Box>
          <ListItem label="Customer" content={props.order.meta.customerName} />

          <Box
            marginTop={4}
            paddingVertical={10}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between">
            <Box>
              <Typography color="neutral-500">Order reference</Typography>
            </Box>
            <Box flexDirection="row" alignItems="center" gap={8}>
              <Typography color="neutral-700">
                {'#' + props.order.ref}
              </Typography>

              <BZPressable
                onPress={() => {
                  innerRef.current?.dismiss()
                  router.navigate(`/orders/${props.order.ref}`)
                }}>
                <BazeIcon name="chevron-right" size={20} color="#2C67F6" />
              </BZPressable>
            </Box>
          </Box>
          <Divider />

          <ListItem
            mt={4}
            label="Order total"
            content={formatCurrency(props.order.meta.amount, 'comma')}
          />
          <ListItem
            mt={4}
            label={`Transaction fees (${props.order.meta.bazeTransactionFee?.model})`}
            content={
              (props.order.meta.bazeTransactionFee?.amount as number) > 0
                ? '- ' +
                  formatCurrency(
                    props.order.meta.bazeTransactionFee?.amount as number,
                    'comma'
                  )
                : formatCurrency(0, 'comma')
            }
          />

          <Box
            marginTop={4}
            paddingVertical={10}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between">
            <Typography color="neutral-700" variant="body-bold">
              Amount settled
            </Typography>
            <Typography color="neutral-700" variant="body-bold">
              {formatCurrency(
                props.order.meta.amount -
                  (props.order.meta.bazeTransactionFee?.amount as number),
                'comma'
              )}
            </Typography>
          </Box>

          <Divider thickness={4} marginTop={8} />

          <ListItem
            mt={4}
            label="Payment date"
            content={dayjs(props.order.meta.orderdAt).format(
              'hh:mm A, MM/DD/YYYY'
            )}
          />
          {props.order.meta.status === SettlementStatus.settled && (
            <>
              <Box
                marginTop={4}
                paddingVertical={10}
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between">
                <Box>
                  <Typography color="neutral-500">Settlement status</Typography>
                </Box>
                <Badge color="success" label="Settled" />
              </Box>
              <Divider />
              <ListItem
                divider={false}
                mt={4}
                label="Settlement date"
                content={dayjs(props.order.meta.settledAt).format(
                  'hh:mm A, MM/DD/YYYY'
                )}
              />
            </>
          )}
          {props.order.meta.status === SettlementStatus.willRetry && (
            <Box
              marginTop={4}
              paddingVertical={10}
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between">
              <Box>
                <Typography color="neutral-500">Settlement status</Typography>
              </Box>
              <Badge color="neutral" label="Will retry" />
            </Box>
          )}
        </Box>
      </BZModal>
    )
  }
)

OrderSettlementInfoModal.displayName = 'OrderSettlementInfoModal'
