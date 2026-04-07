import {useQueryClient} from '@tanstack/react-query'
import React, {forwardRef} from 'react'

import api from '@/api'
import {BZModal, Button, TextArea} from '@/components/ui'
import {API_STATUS} from '@/constants/ApiConstants'
import {QUERY_KEYS} from '@/constants/queryKeys'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import {Modal} from '@/types/modal'
import {errorHandler} from '@/utils/errorHandler'
import toast from '@/utils/toast'

interface Props {
  customerId: string
}

const CustomerNoteModal = forwardRef<Modal, Props>((props, ref) => {
  const innerRef = useForwardedRef(ref)
  const [note, setNote] = React.useState('')
  const queryClient = useQueryClient()
  const [createNoteApiState, setCreateNoteApiState] =
    React.useState<API_STATUS>(API_STATUS.IDLE)

  const handleCreateNote = async () => {
    try {
      setCreateNoteApiState(API_STATUS.LOADING)

      await api.customers.createCustomerNote(props.customerId, {
        note: note.trim()
      })

      innerRef.current?.dismiss()
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CUSTOMER, props.customerId]
      })
      setNote('')
      toast.info('Note added successfully')

      setCreateNoteApiState(API_STATUS.SUCCESS)
      innerRef.current?.dismiss()
    } catch (err) {
      setCreateNoteApiState(API_STATUS.ERROR)
      errorHandler(err)
    }
  }

  const renderFooter = () => (
    <Button
      variant="secondary"
      label="Save"
      disabled={!note}
      loading={createNoteApiState === API_STATUS.LOADING}
      onPress={handleCreateNote}
    />
  )

  return (
    <BZModal
      panDownToClose={createNoteApiState !== API_STATUS.LOADING}
      snapPoints={[500]}
      ref={innerRef}
      title="Add customer note"
      footer={renderFooter}>
      <TextArea
        readOnly={createNoteApiState === API_STATUS.LOADING}
        name="Customer note"
        placeholder="Add note..."
        defaultValue={note}
        onChangeText={setNote}
      />
    </BZModal>
  )
})

CustomerNoteModal.displayName = 'CustomerNoteModal'
export default CustomerNoteModal
