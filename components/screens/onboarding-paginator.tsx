import React, {FC} from 'react'
import {Animated, useWindowDimensions} from 'react-native'
import {Box} from '../ui'

interface Props {
  currentIndex: number
  data: any
  scrollX: any
}

const OnboardingPaginator: FC<Props> = ({currentIndex, data, scrollX}) => {
  const {width} = useWindowDimensions()
  return (
    <Box flexDirection="row" alignItems="center" justifyContent="center">
      {data.map((_: unknown, i: number) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width]
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [6, 24, 6],
          extrapolate: 'clamp'
        })

        return (
          <Animated.View
            key={i}
            style={{
              width: dotWidth,
              height: 6,
              borderRadius: 5,
              backgroundColor: currentIndex === i ? '#6589E2' : '#E8E8E8',
              marginHorizontal: 1
            }}
          />
        )
      })}
    </Box>
  )
}

export default OnboardingPaginator
