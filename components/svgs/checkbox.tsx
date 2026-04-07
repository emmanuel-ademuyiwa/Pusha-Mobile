import * as React from 'react'
import Svg, {Defs, G, Mask, Path, Rect, SvgProps} from 'react-native-svg'
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const CheckBox = (props: SvgProps) => (
  <Svg width={33} height={33} viewBox="0 0 33 33" fill="none" {...props}>
    <G filter="url(#filter0_d_101_2570)">
      <Mask
        id="path-1-outside-1_101_2570"
        maskUnits="userSpaceOnUse"
        x={4.5}
        y={2.91699}
        width={24}
        height={24}
        fill="black">
        <Rect fill="white" x={4.5} y={2.91699} width={24} height={24} />
        <Path d="M6.5 10.917C6.5 7.60328 9.18629 4.91699 12.5 4.91699H20.5C23.8137 4.91699 26.5 7.60328 26.5 10.917V18.917C26.5 22.2307 23.8137 24.917 20.5 24.917H12.5C9.18629 24.917 6.5 22.2307 6.5 18.917V10.917Z" />
      </Mask>
      <Path
        d="M12.5 4.91699V6.91699H20.5V4.91699V2.91699H12.5V4.91699ZM26.5 10.917H24.5V18.917H26.5H28.5V10.917H26.5ZM20.5 24.917V22.917H12.5V24.917V26.917H20.5V24.917ZM6.5 18.917H8.5V10.917H6.5H4.5V18.917H6.5ZM12.5 24.917V22.917C10.2909 22.917 8.5 21.1261 8.5 18.917H6.5H4.5C4.5 23.3353 8.08172 26.917 12.5 26.917V24.917ZM26.5 18.917H24.5C24.5 21.1261 22.7091 22.917 20.5 22.917V24.917V26.917C24.9183 26.917 28.5 23.3353 28.5 18.917H26.5ZM20.5 4.91699V6.91699C22.7091 6.91699 24.5 8.70785 24.5 10.917H26.5H28.5C28.5 6.49871 24.9183 2.91699 20.5 2.91699V4.91699ZM12.5 4.91699V2.91699C8.08172 2.91699 4.5 6.49871 4.5 10.917H6.5H8.5C8.5 8.70785 10.2909 6.91699 12.5 6.91699V4.91699Z"
        fill="white"
        mask="url(#path-1-outside-1_101_2570)"
      />
      <Path
        d="M14.8975 16.8545L12.8125 14.7695L12.1025 15.4745L14.8975 18.2695L20.8975 12.2695L20.1925 11.5645L14.8975 16.8545Z"
        fill="white"
        stroke="white"
      />
    </G>
    <Defs></Defs>
  </Svg>
)
export default CheckBox
