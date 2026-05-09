import React, {FC} from 'react'
import {Animated, useWindowDimensions} from 'react-native'
import {Box} from '../ui'

interface Props {
  currentIndex?: number
  data: any
  scrollX: any
}

const ACTIVE_COLOR = '#2554cf'
const INACTIVE_COLOR = '#D0D9F5'

const OnboardingPaginator: FC<Props> = ({data, scrollX}) => {
  const {width} = useWindowDimensions()
  return (
    <Box flexDirection="row" alignItems="center" justifyContent="center">
      {data.map((_: unknown, i: number) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width]

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 22, 8],
          extrapolate: 'clamp',
        })

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.4, 1, 0.4],
          extrapolate: 'clamp',
        })

        const backgroundColor = scrollX.interpolate({
          inputRange,
          outputRange: [INACTIVE_COLOR, ACTIVE_COLOR, INACTIVE_COLOR],
          extrapolate: 'clamp',
        })

        return (
          <Animated.View
            key={i}
            style={{
              width: dotWidth,
              height: 8,
              borderRadius: 10,
              backgroundColor,
              opacity,
              marginHorizontal: 4,
            }}
          />
        )
      })}
    </Box>
  )
}

export default OnboardingPaginator
