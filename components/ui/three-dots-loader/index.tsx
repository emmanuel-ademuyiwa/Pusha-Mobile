import React, {useEffect, useState} from 'react'
import {Animated, StyleSheet} from 'react-native'

import {Box} from '../box'

export interface ThreeDotsLoaderProps {
  size?: number
  background?: string
  activeBackground?: string
  dotMargin?: number
  animationDuration?: number
  animationScale?: number
}

export interface DotProps {
  size: number
  background: string
  activeBackground: string
  dotMargin: number
  animationDuration: number
  animationScale: number
  active: boolean
}

const SIZE = 8
const MARGIN = 4
const BG = 'rgba(255, 255, 255, 0.5)'
const ACTIVE_BG = '#FFFFFF'
const dots = [1, 2, 3]
const INTERVAL = 150
const ANIMATION_DURATION = 300
const ANIMATION_SCALE = 1.2

export function ThreeDotsLoader(props: Readonly<ThreeDotsLoaderProps>) {
  const [active, setActive] = useState(1)

  const {
    size = SIZE,
    background = BG,
    activeBackground = ACTIVE_BG,
    dotMargin = MARGIN,
    animationDuration = ANIMATION_DURATION,
    animationScale = ANIMATION_SCALE
  } = props

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(prevState => (prevState > 2 ? 1 : prevState + 1))
    }, INTERVAL)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <Box style={styles.main}>
      {dots.map(i => (
        <Dot
          size={size}
          background={background}
          dotMargin={dotMargin}
          animationDuration={animationDuration}
          animationScale={animationScale}
          activeBackground={activeBackground}
          active={i === active}
          key={i}
        />
      ))}
    </Box>
  )
}

function Dot(props: Readonly<DotProps>) {
  const {active, size, background, activeBackground, dotMargin} = props

  const [scale] = useState(new Animated.Value(1))

  const style = {
    height: size,
    width: size,
    borderRadius: size / 2,
    marginHorizontal: dotMargin,
    backgroundColor: active ? activeBackground : background
  }

  const scaleDown = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: props.animationDuration,
      useNativeDriver: true
    }).start()
  }

  const scaleUp = () => {
    Animated.timing(scale, {
      toValue: props.animationScale,
      duration: props.animationDuration,
      useNativeDriver: true
    }).start()
  }

  if (props.active) {
    scaleUp()
  } else {
    scaleDown()
  }

  return <Animated.View style={[style, {transform: [{scale}]}]} />
}

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default ThreeDotsLoader
