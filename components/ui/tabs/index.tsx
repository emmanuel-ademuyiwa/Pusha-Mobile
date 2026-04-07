import React, {forwardRef, useEffect, useRef, useState} from 'react'
import {Animated, Dimensions, Pressable} from 'react-native'

import {Box} from '../box'
import {Typography} from '../typography'

const {width} = Dimensions.get('screen')

const Tab = forwardRef(({item, itemPress, children}: any, ref: any) => {
  return (
    <Pressable
      accessibilityRole="button"
      key={item.key}
      style={{zIndex: 1000}}
      onPress={itemPress}>
      <Box
        ref={ref}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 5
        }}>
        {children}
      </Box>
    </Pressable>
  )
})

Tab.displayName = 'Tab'

const Indicator = ({measures, scrollX, data}: any) => {
  const inputRange = data.map((_: any, index: number) => index * width)

  const indicatorWidth = scrollX.interpolate({
    inputRange,
    outputRange: measures.map((measure: any) => measure.width)
  })

  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: measures.map((measure: any, index: number) => {
      return measure.x

      // if (index === 0) {
      //   return measure.x
      // } else {
      //   return measure.x
      // }
    })
  })

  return (
    <Animated.View
      style={{
        position: 'absolute',
        backgroundColor: '#2C67F6',
        height: 2,
        width: indicatorWidth,
        bottom: 0,
        borderRadius: 4,
        transform: [
          {
            translateX
          }
        ]
      }}
    />
  )
}

export const Tabs = ({scrollX, itemPress, data, idx}: any) => {
  const [measures, setMeasures] = useState<any>([])
  const [trigger, setTrigger] = useState<boolean>(false)
  const [count, setCount] = useState<number>(0)
  const containerRef = useRef<typeof Box>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const m: any = []
    data.forEach((item: any) => {
      item.ref.current?.measureLayout(
        containerRef.current || 0,
        (x: any, y: any, tabWidth: any, height: any) => {
          m.push({
            x,
            y,
            width: tabWidth,
            height
          })

          if (m.length === data.length) {
            setMeasures(m)
          }
        }
      )
    })
  }, [data, trigger])

  useEffect(() => {
    setActive(idx)
  }, [idx])

  if (measures.length > 0 && measures[0].height === 0 && count === 0) {
    setTrigger(value => !value)
    setCount(1)
  }

  const setTab = (index: number) => {
    setActive(index)
    itemPress(index)
  }

  return (
    <Box ref={containerRef}>
      <Box
        position="relative"
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-start"
        paddingHorizontal={16}
        gap={32}
        borderBottomWidth={1}
        height={32}
        style={{
          borderBottomColor: '#EBEBEB'
        }}>
        {data.map((item: any, index: number) => {
          return (
            <Tab
              key={item.key}
              item={item}
              ref={item.ref}
              itemPress={() => setTab(index)}>
              <Typography
                variant="c1-bold"
                color={active === index ? 'primary-100' : 'neutral-500'}>
                {item.title}
              </Typography>
            </Tab>
          )
        })}

        {measures.length > 0 && (
          <Indicator measures={measures} scrollX={scrollX} data={data} />
        )}
      </Box>
    </Box>
  )
}
