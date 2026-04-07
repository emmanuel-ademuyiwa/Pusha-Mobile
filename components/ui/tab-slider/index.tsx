import React, {useCallback, useRef, useState} from 'react'
import {
  Animated,
  Dimensions,
  FlatList,
  Pressable,
  ViewToken
} from 'react-native'

import Box from '../box'
import {Tabs} from '../tabs'

const {width} = Dimensions.get('screen')

interface TabItem {
  key: string
  title: string
  ref: React.RefObject<typeof Box>
  hasPaddingHorizontal?: boolean
}

interface TabSliderProps {
  tabItems: TabItem[]
  tabComponents: Record<string, React.ComponentType>
}

export function TabSlider({tabItems, tabComponents}: Readonly<TabSliderProps>) {
  const [activeIdx, setActiveIdx] = useState(0)
  const scrollX = useRef(new Animated.Value(0)).current
  const tabRef = useRef<FlatList>(null)

  const onItemPress = useCallback((itemIndex: number) => {
    tabRef?.current?.scrollToOffset({
      offset: itemIndex * width
    })
  }, [])

  const onViewableItemsChanged = useRef(
    ({viewableItems}: {viewableItems: ViewToken[]}) => {
      if (viewableItems.length > 0) {
        const index = viewableItems[0].index
        if (index !== null) {
          setActiveIdx(index)
        }
      }
    }
  ).current

  return (
    <Box marginTop={16} flex={1}>
      <Tabs
        scrollX={scrollX}
        itemPress={onItemPress}
        data={tabItems}
        idx={activeIdx}
      />
      <Animated.FlatList
        ref={tabRef}
        data={tabItems}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.key}
        bounces={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {
            useNativeDriver: false
          }
        )}
        renderItem={({item}) => {
          const TabComponent = tabComponents[item.key]
          const {hasPaddingHorizontal = true} = item
          return (
            <Box
              width={width}
              paddingHorizontal={hasPaddingHorizontal ? 16 : 0}
              marginTop={16}
              flex={1}>
              <Pressable accessibilityRole="button" style={{flexGrow: 1}}>
                <TabComponent />
              </Pressable>
            </Box>
          )
        }}
        onViewableItemsChanged={onViewableItemsChanged}
      />
    </Box>
  )
}
