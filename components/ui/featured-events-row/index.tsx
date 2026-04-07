import {AppIcon, AppPressable, Box, Button, Typography} from '@/components/ui'
import {Image} from 'expo-image'
import React from 'react'
import {StyleSheet} from 'react-native'

const DEFAULT_EVENT_IMAGE_HEIGHT = 247
const DEFAULT_VENDOR_IMAGE_HEIGHT = 140

// ─── Event Card ───────────────────────────────────────────────────────────────

export type EventCardProps = {
  imageSource: number | {uri: string}
  title: string
  price: string
  imageWidth?: number | '100%'
  imageHeight?: number
  isLiked?: boolean
  onLikePress?: () => void
  onPress?: () => void
}

export function EventCard({
  imageSource,
  title,
  price,
  imageWidth,
  imageHeight = DEFAULT_EVENT_IMAGE_HEIGHT,
  isLiked = false,
  onLikePress,
  onPress
}: EventCardProps) {
  const imageStyle = {
    height: imageHeight,
    borderRadius: 12 as const,
    ...(imageWidth !== undefined ? {width: imageWidth} : {flex: 1 as const})
  }

  const content = (
    <Box flex={1}>
      <Box>
        <Image source={imageSource} style={imageStyle} contentFit="cover" />
        <AppPressable onPress={onLikePress} style={styles.likeButton}>
          <AppIcon
            name="Heart"
            size={16}
            color={isLiked ? '#E03' : '#45505F'}
          />
        </AppPressable>
      </Box>

      <Box mt={8}>
        <Typography variant="body-medium">{title}</Typography>
        <Box flexDirection="row" alignItems="center" mt={4} gap={4}>
          <Typography variant="c1" color="neutral-500">
            From
          </Typography>
          <Typography variant="c1-bold" color="neutral-1000">
            {price}
          </Typography>
        </Box>
      </Box>
    </Box>
  )

  if (onPress) {
    return (
      <Box flex={1}>
        <AppPressable onPress={onPress}>{content}</AppPressable>
      </Box>
    )
  }

  return content
}

// ─── Vendor Card ──────────────────────────────────────────────────────────────

export type VendorCardProps = {
  imageSource: number | {uri: string}
  title: string
  deliveryTime: string
  rating: number
  imageWidth?: number | '100%'
  imageHeight?: number
  isLiked?: boolean
  onLikePress?: () => void
  onPress?: () => void
}

export function VendorCard({
  imageSource,
  title,
  deliveryTime,
  rating,
  imageWidth,
  imageHeight = DEFAULT_VENDOR_IMAGE_HEIGHT,
  isLiked = false,
  onLikePress,
  onPress
}: VendorCardProps) {
  const imageStyle = {
    height: imageHeight,
    borderRadius: 12 as const,
    ...(imageWidth !== undefined
      ? {width: imageWidth}
      : {width: '100%' as const})
  }

  const content = (
    <Box>
      <Box>
        <Image source={imageSource} style={imageStyle} contentFit="cover" />
        <Box position="absolute" top={8} right={8}>
          <Button
            onPress={onLikePress}
            iconSize={'md'}
            iconButton
            variant="tertiary"
            Icon={
              <AppIcon
                name="Heart"
                size={16}
                fill={isLiked ? '#E03' : 'transparent'}
                color={isLiked ? '#E03' : '#45505F'}
              />
            }
          />
        </Box>
      </Box>

      <Box mt={4}>
        <Typography variant="body-bold" color="neutral-900">{title}</Typography>
        <Box flexDirection="row" alignItems="center" mt={4} gap={12}>
          <Box flexDirection="row" alignItems="center" gap={4}>
            <AppIcon name="Clock" size={14} color="#798390" />
            <Typography variant="c2-bold" color="gray-700">
              {deliveryTime}
            </Typography>
          </Box>
          <Box flexDirection="row" alignItems="center" gap={4}>
            <Typography variant='c2'>⭐</Typography>
            <Typography variant="c2-bold" color="gray-700">
              {rating.toFixed(1)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )

  if (onPress) {
    return <AppPressable onPress={onPress}>{content}</AppPressable>
  }

  return content
}

// ─── Featured Events Row (backwards-compatible) ───────────────────────────────

export type FeaturedEventItem = EventCardProps
export type ImageCardProps = EventCardProps

/** @deprecated Use EventCard directly */
export function ImageCard(props: EventCardProps) {
  return <EventCard {...props} />
}

type FeaturedEventsRowProps = {
  events: [EventCardProps, EventCardProps]
}

export function FeaturedEventsRow({events}: FeaturedEventsRowProps) {
  return (
    <Box flexDirection="row" gap={16} mt={12}>
      {events.map((event, index) => (
        <EventCard key={index} {...event} />
      ))}
    </Box>
  )
}

const styles = StyleSheet.create({
  likeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
