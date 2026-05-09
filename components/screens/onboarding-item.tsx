import onboardingSlides from '@/utils/onboarding-slides'
import {Image, ImageBackground} from 'expo-image'
import React, {FC, useMemo} from 'react'
import {Animated, Platform, useWindowDimensions} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import OnboardSalesOverview from '../svgs/onboard-sales-overview'
import Oboard3 from '../svgs/onboard2'
import Onboard2Illustration from '../svgs/onboard2illustration'
import Socials from '../svgs/socials'
import {Box, Button, TextAction, Typography} from '../ui'
import OnboardingPaginator from './onboarding-paginator'

interface Props {
  item: {
    id: string
    title: string
    description: string
    image: any
    buttonLabel: string
  }
  index: number
  scrollX: Animated.Value
  scrollTo: () => void
  scrollBack: () => void
}

const img = {
  bg: require('../../assets/onboard-bg.png')
}

const OnboardingItem: FC<Props> = ({item, index, scrollX, scrollTo}) => {
  const insets = useSafeAreaInsets()
  const {width, height} = useWindowDimensions()

  const inputRange = useMemo(
    () => [(index - 1) * width, index * width, (index + 1) * width],
    [index, width]
  )

  const animations = useMemo(() => ({
    slideOpacity: scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    }),
    titleScale: scrollX.interpolate({
      inputRange,
      outputRange: [0.92, 1, 0.92],
      extrapolate: 'clamp',
    }),
    contentTranslateY: scrollX.interpolate({
      inputRange,
      outputRange: [36, 0, -36],
      extrapolate: 'clamp',
    }),
    imageTranslateX: scrollX.interpolate({
      inputRange,
      outputRange: [width * 0.08, 0, -width * 0.08],
      extrapolate: 'clamp',
    }),
  }), [scrollX, inputRange, width])

  const slideImageHeight = Math.round(height * 0.5)

  const getSlideSpecificContent = () => {
    switch (item.id) {
      case '1':
        return (
          <>
            <Box mb={50} ml={12}>
              <OnboardSalesOverview />
            </Box>
            <Box position="absolute" bottom={32} left={20} zIndex={60}>
              <Socials />
            </Box>
          </>
        )
      case '2':
        return (
          <Box mb={50} ml={8}>
            <Onboard2Illustration />
          </Box>
        )
      case '3':
        return (
          <Box mb={50} ml={8}>
            <Oboard3 />
          </Box>
        )
      default:
        return null
    }
  }

  const getImageStyle = () => {
    if (item.id === '3') {
      return {
        height: 398,
        width: width,
        position: 'absolute' as const,
        bottom: 0,
        zIndex: 30,
        right: -30,
      }
    }
    return {
      height: 353,
      width: width,
      position: 'absolute' as const,
      bottom: 0,
      zIndex: 30,
    }
  }

  return (
    <Box flex={1} bg="white">
      <Animated.View style={{flex: 1, opacity: animations.slideOpacity}}>
        {/* Image section */}
        <Box style={{height: slideImageHeight}}>
          <ImageBackground source={img.bg} style={{flex: 1}}>
            <Animated.View
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'flex-end',
                paddingBottom: 40,
                transform: [{translateX: animations.imageTranslateX}],
              }}>
              <Image
                source={item.image}
                contentFit={item.id === '3' ? 'contain' : 'cover'}
                style={getImageStyle()}
              />
              {getSlideSpecificContent()}
            </Animated.View>
          </ImageBackground>
        </Box>

        {/* Content section */}
        <Animated.View
          style={{
            flex: 1,
            flexDirection: 'column',
            padding: 24,
            paddingTop: 28,
            backgroundColor: 'white',
            paddingBottom:
              Platform.OS === 'android'
                ? Math.round(insets.bottom) + 16
                : Math.round(insets.bottom),
            transform: [{translateY: animations.contentTranslateY}],
          }}>
          <OnboardingPaginator data={onboardingSlides} scrollX={scrollX} />

          <Animated.View
            style={{
              flex: 1,
              transform: [{scale: animations.titleScale}],
              justifyContent: item.id === '3' ? 'space-between' : 'flex-start',
            }}>
            <Box alignItems="center" bg="white" mt={20}>
              <Typography
                fontSize={40}
                lineHeight={40}
                fontWeight={700}
                mb={16}
                maxWidth={327}
                color="primary-400"
                variant="dahlia-bold"
                textAlign="center">
                {item.title}
              </Typography>

              <Typography
                lineHeight={22}
                color="secondary-500"
                maxWidth={327}
                variant="body"
                textAlign="center">
                {item.description}
              </Typography>
            </Box>

            {item.id === '3' && (
              <Button hasLinearGradient label="Get Started" onPress={scrollTo} />
            )}
          </Animated.View>

          {item.id !== '3' && (
            <Box
              alignItems="center"
              position="absolute"
              left={0}
              right={0}
              bottom={
                Platform.OS === 'android'
                  ? Math.round(insets.bottom) + 16
                  : Math.round(insets.bottom)
              }>
              <TextAction
                color="neutral-700"
                variant="c1-bold"
                onPress={scrollTo}
                iconPosition="end"
                justifyContent="center"
                iconColor="#888888"
                iconName={'ArrowRight2'}
                textAlign="center">
                Swipe
              </TextAction>
            </Box>
          )}
        </Animated.View>
      </Animated.View>
    </Box>
  )
}

export default React.memo(OnboardingItem)
