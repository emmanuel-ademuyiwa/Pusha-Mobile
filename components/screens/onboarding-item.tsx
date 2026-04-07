import onboardingSlides from '@/utils/onboarding-slides'
import { Image, ImageBackground } from 'expo-image'
import React, { FC, useMemo } from 'react'
import { Animated, Platform, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import OnboardSalesOverview from '../svgs/onboard-sales-overview'
import Oboard3 from '../svgs/onboard2'
import Onboard2Illustration from '../svgs/onboard2illustration'
import Socials from '../svgs/socials'
import { Box, Button, TextAction, Typography } from '../ui'
import OnboardingPaginator from './onboarding-paginator'

interface Props {
  item: {
    id: string
    title: string
    description: string
    image: any
    buttonLabel: string
  }
  index: number // The index of this specific item
  currentIndex: number
  scrollX: Animated.Value
  scrollTo: () => void
  scrollBack: () => void
}

const img = {
  bg: require('../../assets/onboard-bg.png')
}

const OnboardingItem: FC<Props> = ({
  item,
  index,
  currentIndex,
  scrollX,
  scrollTo,
  scrollBack
}) => {
  const insets = useSafeAreaInsets()
  const {width, height} = useWindowDimensions()

  // Create animated values based on scroll position
  const inputRange = useMemo(() => [(index - 1) * width, index * width, (index + 1) * width], [index, width])

  // Animation values for each slide
  const animations = useMemo(() => {
    return {
      // Slide opacity animation
      slideOpacity: scrollX.interpolate({
        inputRange,
        outputRange: [0, 1, 0],
        extrapolate: 'clamp'
      }),

      // Text animations
      titleScale: scrollX.interpolate({
        inputRange,
        outputRange: [0.9, 1, 0.9],
        extrapolate: 'clamp'
      }),

      // Content translate animation
      contentTranslateY: scrollX.interpolate({
        inputRange,
        outputRange: [50, 0, 50],
        extrapolate: 'clamp'
      })
    }
  }, [scrollX, inputRange])

  // Render slide content with consistent structure
  const renderSlideContent = () => {
    const slideImageHeight = Math.round(height * 0.5)
    const slideContentHeight = Math.round(height * 0.5)
    
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
      switch (item.id) {
        case '3':
          return {
            height: 398,
            width: width,
            position: 'absolute' as const,
            bottom: 0,
            zIndex: 30,
            right: -30
          }
        default:
          return {
            height: 353,
            width: width,
            position: 'absolute' as const,
            bottom: 0,
            zIndex: 30
          }
      }
    }

    return (
      <Animated.View style={{ flex: 1, opacity: animations.slideOpacity }}>
        {/* Top Image Section */}
        <Box flex={1}>
          <ImageBackground
            source={img.bg}
            style={{width, height: slideImageHeight}}>
            <Box
              flex={1}
              flexDirection="column"
              justifyContent="flex-end"
              pb={40}
              width="100%">
              <Image
                source={item.image}
                contentFit={item.id === '3' ? 'contain' : 'cover'}
                style={getImageStyle()}
              />
              {getSlideSpecificContent()}
            </Box>
          </ImageBackground>
        </Box>

        {/* Bottom Content Section */}
        <Animated.View
          style={{
            width: '100%',
            flexDirection: 'column',
            padding: 24,
            backgroundColor: 'white',
            paddingBottom: Platform.OS === 'android' ? Math.round(insets.bottom) + 16 : Math.round(insets.bottom),
            flex: 1,
            height: slideContentHeight,
            transform: [{ translateY: animations.contentTranslateY }]
          }}>
          <OnboardingPaginator
            currentIndex={currentIndex}
            data={onboardingSlides}
            scrollX={scrollX}
          />
          
          <Animated.View
            style={{
              transform: [{ scale: animations.titleScale }],
              justifyContent: item.id === '3' ? 'space-between' : 'flex-start',
              flex: 1
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

            {/* Show button only on last slide */}
            {item.id === '3' && (
              <Button
                hasLinearGradient
                label="Get Started"
                onPress={scrollTo}
              />
            )}
          </Animated.View>

          {/* Show swipe indicator on first two slides */}
          {item.id !== '3' && (
            <Box
              alignItems="center"
              position="absolute"
              left={0}
              right={0}
              bottom={Platform.OS === 'android' ? Math.round(insets.bottom) + 16 : Math.round(insets.bottom)}>
              <TextAction
                color="neutral-700"
                variant="c1"
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
    )
  }

  return (
    <Box flex={1} bg="white">
      {renderSlideContent()}
    </Box>
  )
}

export default React.memo(OnboardingItem)

