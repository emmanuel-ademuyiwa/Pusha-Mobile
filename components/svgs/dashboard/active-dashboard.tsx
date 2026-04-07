import React from 'react'
import Svg, {Path} from 'react-native-svg'

interface ActiveDashboardProps {
  size?: number
  color?: string
}

const ActiveDashboard = ({size = 24, color = '#2554C7'}: ActiveDashboardProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
        fill={color}
      />
      <Path
        d="M9 22V12h6v10"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default ActiveDashboard
