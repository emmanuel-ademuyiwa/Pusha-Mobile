import { useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, useWindowDimensions } from 'react-native'
import slides from '../../utils/onboarding-slides'

import OnboardingItem from '@/components/screens/onboarding-item'
import { Box } from '@/components/ui'
import { useAuthActions } from '@/store/authStore'
import { StatusBar } from 'expo-status-bar'
import { FlatList } from 'react-native-gesture-handler'

const Page = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const scrollX = useRef(new Animated.Value(0)).current
  const slidesRef = useRef<FlatList>(null)
  const {width} = useWindowDimensions()

  const router = useRouter()
  const authActions = useAuthActions()

  useEffect(() => {
    authActions.resetStore()
  }, [authActions])

  const viewableItemsChanged = ({viewableItems}: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index)
    }
  }

  const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef?.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true
      })
    } else {
      router.push('/signup')
    }
  }

  const scrollBack = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1
      slidesRef?.current?.scrollToIndex({
        index: newIndex,
        animated: true
      })
    }
  }

  return (
    <Box flex={1} bg="white">
      <StatusBar style="dark" animated />
      
      <FlatList
        ref={slidesRef}
        data={slides}
        renderItem={({item, index}) => (
          <Box width={width}>
            <OnboardingItem
              item={item}
              index={index}
              scrollX={scrollX}
              scrollTo={scrollTo}
              scrollBack={scrollBack}
            />
          </Box>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={item => item.id}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {
            useNativeDriver: false
          }
        )}
        scrollEventThrottle={16}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    </Box>
  )
}
export default Page
