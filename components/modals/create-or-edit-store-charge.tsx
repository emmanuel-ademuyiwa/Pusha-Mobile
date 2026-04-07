import {
  ICreateStoreFeePayload,
  IEditStoreFeePayload,
  IStoreFee,
  FeeType,
  ActiveOrInactive
} from '@baze-sdk/schema'
import React, {forwardRef, useEffect, useState} from 'react'

import {AmountPercentageSelect} from '../shared/amount-percentage-select'

import api from '@/api'
import {
  BZModal,
  BZSwitch,
  Box,
  Button,
  Divider,
  TextField,
  Typography
} from '@/components/ui'
import {API_STATUS} from '@/constants/ApiConstants'
import {QUERY_KEYS} from '@/constants/queryKeys'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import {Modal} from '@/types/modal'
import {errorHandler} from '@/utils/errorHandler'
import {formatIntegerFields, formatNumberField} from '@/utils/fields'
import {queryClient} from '@/utils/queryClient'
import toast from '@/utils/toast'

interface Props {
  mode: 'edit' | 'create'
  storeId: string
  fee?: IStoreFee
}

const CreateOrEditStoreChargeModal = forwardRef<Modal, Props>(
  ({mode, fee, storeId}, ref) => {
    const innerRef = useForwardedRef(ref)
    const [name, setName] = useState('')
    const [feeType, setFeeType] = useState<FeeType>(FeeType.fixed)
    const [amount, setAmount] = useState('')
    const [percentage, setPercentage] = useState<string>('')
    const [apiState, setApiState] = useState(API_STATUS.IDLE)
    const [isEnabled, setIsEnabled] = useState(true)

    const resetFields = () => {
      setName(mode === 'edit' && fee ? fee.name : '')
      setFeeType(mode === 'edit' && fee ? fee.type : FeeType.fixed)
      setIsEnabled(
        mode === 'edit' && fee ? fee.status === ActiveOrInactive.active : true
      )
      const amountOrPercentage = mode === 'edit' && fee ? fee.amount + '' : ''

      if (fee?.type === FeeType.fixed) {
        setAmount(formatIntegerFields(amountOrPercentage))
      } else {
        setPercentage(amountOrPercentage)
      }
    }

    useEffect(() => {
      resetFields()
    }, [mode, fee])

    const validatePayload = () => {
      if (!name.trim()) {
        toast.info('Please enter a name')
        return false
      }
      if (feeType === FeeType.fixed) {
        if (!amount.trim()) {
          toast.info('Please enter an amount')
          return false
        }
        const amountValue = parseInt(amount.replace(/,/g, ''), 10)
        if (amountValue <= 0) {
          toast.info('Amount must be greater than 0')
          return false
        }
      }
      if (feeType === FeeType.percentage) {
        if (!percentage.trim()) {
          toast.info('Please enter a percentage')
          return false
        }
        const percentageValue = parseFloat(percentage)
        if (percentageValue < 0 || percentageValue > 100) {
          toast.info('Percentage must be between 0 and 100')
          return false
        }
      }
      return true
    }

    // Handle adding or editing store charge
    const handleStoreCharge = async () => {
      if (!validatePayload()) return

      try {
        setApiState(API_STATUS.LOADING)

        if (mode === 'create') {
          const payload: ICreateStoreFeePayload = {
            name: name.trim(),
            amount:
              feeType === FeeType.fixed
                ? parseInt(amount.trim().replace(/,/g, ''), 10)
                : parseFloat(percentage.trim()),
            type: feeType
          }

          await api.stores.addStoreCharge(storeId, payload)
          await queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.USER],
            type: 'all'
          })
          toast.info('Added new store charge')

          innerRef.current?.dismiss()
        }

        if (mode === 'edit') {
          const payload: IEditStoreFeePayload = {
            fee: String(fee?._id),
            name: name.trim(),
            amount:
              feeType === FeeType.fixed
                ? parseInt(amount.trim().replace(/,/g, ''), 10)
                : parseFloat(percentage.trim()),
            type: feeType,
            status: isEnabled
              ? ActiveOrInactive.active
              : ActiveOrInactive.inactive
          }
          await api.stores.editStoreCharge(storeId, payload)
          await queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.USER],
            type: 'all'
          })
          toast.info('Store charge updated successfully')

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
              label="Save charge"
              loading={apiState === API_STATUS.LOADING}
              onPress={handleStoreCharge}
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
                onPress={handleStoreCharge}
              />
            </Box>
          </Box>
        )}
      </>
    )

    return (
      <BZModal
        panDownToClose={apiState !== API_STATUS.LOADING}
        ref={innerRef}
        title={mode === 'create' ? 'Add new charge' : 'Edit charge'}
        snapPoints={mode === 'edit' ? [540] : [440]}
        footer={renderFooter}
        onDismiss={resetFields}>
        <TextField
          name="Name"
          label="Name"
          value={name}
          onChangeText={setName}
        />

        <AmountPercentageSelect
          onSelect={type => setFeeType(type as FeeType)}
          selectedType={feeType}
        />

        {feeType === FeeType.fixed && (
          <TextField
            suffix="NGN"
            name="Amount"
            label="Amount"
            marginTop={20}
            value={amount}
            onChangeText={val => setAmount(formatIntegerFields(val))}
            keyboardType="decimal-pad"
          />
        )}
        {feeType === FeeType.percentage && (
          <TextField
            suffix="%"
            name="Percentage"
            label="Percentage"
            marginTop={20}
            value={percentage}
            onChangeText={val => setPercentage(formatNumberField(val))}
            keyboardType="decimal-pad"
          />
        )}

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
              <Typography variant="body-medium">
                Show this charge on my website
              </Typography>
            </Box>
          </>
        )}
      </BZModal>
    )
  }
)

CreateOrEditStoreChargeModal.displayName = 'CreateOrEditStoreChargeModal'
export default CreateOrEditStoreChargeModal
