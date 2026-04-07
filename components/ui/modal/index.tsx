import React, {
  forwardRef,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import {Platform, Pressable} from 'react-native'
import {KeyboardEvents} from 'react-native-keyboard-controller'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

import Box from '../box'
import Divider from '../divider'
import Typography from '../typography'

import ModalKeyboardAwareScrollView from '@/components/util/modal-keyboard-aware-scroll-view'
import {useForwardedRef} from '@/hooks/useForwardedRef'
import {useModalBackHandler} from '@/hooks/useModalBackHandler'
import {Modal, ModalBackdrop} from '@/types/modal'

type Props = {
  title?: string
  snapPoints?: string[] | number[]
  footer?: React.FC
  header?: ReactNode
  headerDivider?: boolean
  footerDivider?: boolean
  onDismiss?: () => void
  panDownToClose?: boolean
}

const useSnapPoints = (snapPoints?: string[] | number[]) => {
  const snapPointsWithDefault = useMemo(
    () => snapPoints || ['35%', '50%', '75%'],
    [snapPoints]
  )

  const [isKeyboardActive, setIsKeyboardActive] = useState(false)

  useEffect(() => {
    const show = KeyboardEvents.addListener('keyboardWillShow', () =>
      setIsKeyboardActive(true)
    )
    const hide = KeyboardEvents.addListener('keyboardWillHide', () =>
      setIsKeyboardActive(false)
    )

    return () => {
      show.remove()
      hide.remove()
    }
  }, [])

  return {
    snapPoints: isKeyboardActive ? ['100%'] : snapPointsWithDefault,
    isKeyboardActive
  }
}

export const EUModal = forwardRef<Modal, PropsWithChildren<Props>>(
  (props, ref) => {
    const {panDownToClose = true} = props

    const insets = useSafeAreaInsets()
    const innerRef = useForwardedRef(ref)

    const renderBackdrop = useCallback(
      (backdropProps: any) => (
        <ModalBackdrop
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.6}
          pressBehavior={panDownToClose ? 'close' : 'none'}
          {...backdropProps}
        />
      ),
      [panDownToClose]
    )

    const {handleModalPositionChange} = useModalBackHandler(innerRef)

    const {snapPoints, isKeyboardActive} = useSnapPoints(props.snapPoints)

    return (
      <Modal
        enableDynamicSizing={false}
        android_keyboardInputMode="adjustResize"
        keyboardBlurBehavior="restore"
        style={{borderRadius: 12}}
        name={props.title || 'EUModal'}
        ref={innerRef}
        onChange={handleModalPositionChange}
        snapPoints={snapPoints}
        onDismiss={() => {
          props.onDismiss && props.onDismiss()
        }}
        enableDismissOnClose
        handleIndicatorStyle={{
          backgroundColor: '#DDDDDD',
          width: 32,
          height: 4,
          borderRadius: 2,
          marginTop: 12
        }}
        enablePanDownToClose={panDownToClose}
        backgroundStyle={{borderRadius: 12, backgroundColor: 'white'}}
        backdropComponent={renderBackdrop}>
        {isKeyboardActive && <Box height={50} />}
        {/* Title */}
        {props.title && (
          <Box paddingHorizontal={16} mb={16}>
            <Typography variant="h1-bold">{props.title}</Typography>
          </Box>
        )}
        {/* Header */}
        {props.header && (
          <Box paddingHorizontal={16} mb={props.title ? 16 : 0}>
            {props.header}
          </Box>
        )}
        {/* Header Divider */}
        {props.headerDivider && <Divider />}
        <ModalKeyboardAwareScrollView bottomOffset={62}>
          {/* Body */}

          <Box flex={1} px={16} mb={insets.bottom + 16}>
            <Pressable accessibilityRole="button" style={{flexGrow: 1}}>
              {props.children}
            </Pressable>
          </Box>
        </ModalKeyboardAwareScrollView>
        <Box mb={Platform.OS === 'ios' ? insets.bottom : 20}>
          {/*Footer Divider */}
          {props.footerDivider && <Divider />}

          {/* Footer */}
          <Box pt={16} px={16}>
            {props.footer && <props.footer />}
          </Box>
        </Box>
      </Modal>
    )
  }
)

EUModal.displayName = 'EUModal'
export default EUModal
