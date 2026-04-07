import {
  ActiveOrInactive,
  ICreateShippingFeePayload,
  IEditShippingFeePayload,
  IStoreShippingFee
} from '@baze-sdk/schema'
import React, {forwardRef, useEffect, useState} from 'react'

import api from '@/api'
import {
  BZModal,
  BZSwitch,
  Box,
  Button,
  Divider,
  TextArea,
  TextField,
  Typography
} from '@/components/ui'
import {API_STATUS} from '@/constants/ApiConstants'
import {QUERY_KEYS} from '@/constants/queryKeys'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import {Modal} from '@/types/modal'
import {errorHandler} from '@/utils/errorHandler'
import {formatIntegerFields} from '@/utils/fields'
import {queryClient} from '@/utils/queryClient'
import toast from '@/utils/toast'

interface Props {
  mode: 'edit' | 'create'
  storeId: string
  fee?: IStoreShippingFee
}

const CreateOrEditDeliveryFeeModal = forwardRef<Modal, Props>(
  ({mode, fee, storeId}, ref) => {
    const innerRef = useForwardedRef(ref)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState('')
    const [apiState, setApiState] = useState(API_STATUS.IDLE)
    const [isEnabled, setIsEnabled] = useState(true)

    const resetFields = () => {
      setName(mode === 'edit' && fee ? fee.name : '')
      setAmount(
        mode === 'edit' && fee ? formatIntegerFields(fee.amount + '') : ''
      )
      setDescription(mode === 'edit' && fee ? fee.description : '')
      setIsEnabled(
        mode === 'edit' && fee ? fee.status === ActiveOrInactive.active : true
      )
    }

    useEffect(() => {
      resetFields()
    }, [mode, fee])

    const validatePayload = () => {
      if (!name.trim()) {
        toast.info('Please enter a name')
        return false
      }
      if (!amount.trim()) {
        toast.info('Please enter an amount')
        return false
      }
      const amountValue = parseInt(amount.replace(/,/g, ''), 10)
      if (amountValue <= 0) {
        toast.info('Amount must be greater than 0')
        return false
      }
      return true
    }

    // Handle adding or editing delivery fee
    const handleDeliveryFee = async () => {
      if (!validatePayload()) return
      try {
        setApiState(API_STATUS.LOADING)

        if (mode === 'create') {
          const payload: ICreateShippingFeePayload = {
            name: name.trim(),
            description: description?.trim(),
            amount: parseInt(amount.trim().replace(/,/g, ''), 10)
          }

          await api.stores.addShippingFee(storeId, payload)
          await queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.USER],
            type: 'all'
          })
          toast.info('Added new delivery fee')
          resetFields()
          innerRef.current?.dismiss()
        }

        if (mode === 'edit') {
          const payload: IEditShippingFeePayload = {
            fee: String(fee?._id),
            name: name.trim(),
            description: description?.trim(),
            amount: parseInt(amount.trim().replace(/,/g, ''), 10),
            status: isEnabled
              ? ActiveOrInactive.active
              : ActiveOrInactive.inactive
          }
          await api.stores.editShippingFee(storeId, payload)
          await queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.USER],
            type: 'all'
          })
          toast.info('Delivery fee updated successfully')
          resetFields()
          innerRef.current?.dismiss()
        }
        setApiState(API_STATUS.SUCCESS)
      } catch (err) {
        errorHandler(err)
        setApiState(API_STATUS.ERROR)
      }
    }

    const renderFooter = () => (
      <>
        {mode === 'create' ? (
          <Box>
            <Button
              label="Save fee"
              loading={apiState === API_STATUS.LOADING}
              onPress={handleDeliveryFee}
            />
          </Box>
        ) : (
          <Box flexDirection="row" gap={8}>
            <Box flex={1}>
              <Button
                label="Cancel"
                variant="tertiary"
                onPress={() => {
                  if (apiState !== API_STATUS.LOADING) {
                    innerRef.current?.dismiss()
                  }
                }}
              />
            </Box>
            <Box flex={1}>
              <Button
                label="Save changes"
                loading={apiState === API_STATUS.LOADING}
                onPress={handleDeliveryFee}
              />
            </Box>
          </Box>
        )}
      </>
    )

    return (
      <BZModal
        panDownToClose={apiState !== API_STATUS.LOADING}
        onDismiss={resetFields}
        ref={innerRef}
        title={
          mode === 'create' ? 'Add a new delivery fee' : 'Edit delivery fee'
        }
        snapPoints={mode === 'edit' ? [600] : [500]}
        footer={renderFooter}>
        <TextField
          name="Name"
          label="Name"
          value={name}
          onChangeText={setName}
        />
        <TextArea
          name="Description"
          label="Description"
          marginTop={20}
          defaultValue={description}
          onChangeText={e => setDescription(e)}
        />
        <TextField
          name="Amount"
          label="Amount"
          suffix="NGN"
          marginTop={20}
          value={amount}
          onChangeText={val => setAmount(formatIntegerFields(val))}
          keyboardType="decimal-pad"
        />
        {mode === 'edit' && (
          <>
            <Divider marginTop={24} />
            <Box marginTop={24} flexDirection="row" alignItems="center" gap={8}>
              <BZSwitch
                value={isEnabled}
                onValueChange={() => {
                  setIsEnabled(!isEnabled)
                }}
              />
              <Typography variant="body-medium">Enable this fee</Typography>
            </Box>
          </>
        )}
      </BZModal>
    )
  }
)

CreateOrEditDeliveryFeeModal.displayName = 'CreateOrEditDeliveryFeeModal'
export default CreateOrEditDeliveryFeeModal
