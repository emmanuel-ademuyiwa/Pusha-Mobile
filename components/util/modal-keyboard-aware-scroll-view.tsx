import {
  SCROLLABLE_TYPE,
  createBottomSheetScrollableComponent,
  type BottomSheetScrollViewMethods
} from '@gorhom/bottom-sheet'
import type {BottomSheetScrollViewProps} from '@gorhom/bottom-sheet/src/components/bottomSheetScrollable/types'
import {memo} from 'react'
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps
} from 'react-native-keyboard-controller'
import Reanimated from 'react-native-reanimated'

const AnimatedScrollView =
  Reanimated.createAnimatedComponent<KeyboardAwareScrollViewProps>(
    KeyboardAwareScrollView
  )
const ModalScrollViewComponent = createBottomSheetScrollableComponent<
  BottomSheetScrollViewMethods,
  BottomSheetScrollViewProps
>(SCROLLABLE_TYPE.SCROLLVIEW, AnimatedScrollView)
const ModalKeyboardAwareScrollView = memo(ModalScrollViewComponent)

ModalKeyboardAwareScrollView.displayName = 'ModalKeyboardAwareScrollView'

export default ModalKeyboardAwareScrollView as (
  props: BottomSheetScrollViewProps & KeyboardAwareScrollViewProps
) => ReturnType<typeof ModalKeyboardAwareScrollView>
