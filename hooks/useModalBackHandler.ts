import {MutableRefObject, useCallback, useRef} from 'react'
import {BackHandler, NativeEventSubscription} from 'react-native'

import {Modal, ModalProps} from '@/types/modal'

export const useModalBackHandler = (
  modalRef: MutableRefObject<Modal | null>
) => {
  const backHandlerSubscriptionRef = useRef<NativeEventSubscription | null>(
    null
  )
  const handleModalPositionChange = useCallback<
    NonNullable<ModalProps['onChange']>
  >(
    index => {
      const isModalVisible = index >= 0
      if (isModalVisible && !backHandlerSubscriptionRef.current) {
        // set up the back handler if the modal is right in front of the user
        backHandlerSubscriptionRef.current = BackHandler.addEventListener(
          'hardwareBackPress',
          () => {
            modalRef.current?.dismiss()
            return true
          }
        )
      } else if (!isModalVisible) {
        backHandlerSubscriptionRef.current?.remove()
        backHandlerSubscriptionRef.current = null
      }
    },
    [modalRef, backHandlerSubscriptionRef]
  )
  return {handleModalPositionChange}
}
