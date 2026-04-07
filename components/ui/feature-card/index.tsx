import {AppPressable, Box, Typography} from '@/components/ui'
import type {ReactNode} from 'react'

type FeatureCardProps = {
  bgColor: string
  icon: ReactNode
  label: string
  onPress: () => void
  fontVariant?: 'c1' | 'c2' | 'c2-bold'
}

export function FeatureCard({
  bgColor,
  icon,
  label,
  onPress,
  fontVariant = 'c2-bold'
}: FeatureCardProps) {
  return (
    <AppPressable onPress={onPress}>
      <Box justifyContent="center" alignItems="center" gap={4}>
        <Box
          style={{backgroundColor: bgColor}}
          width={72}
          height={72}
          bg="gray-100"
          overflow="hidden"
          alignItems="center"
          justifyContent="center"
          borderRadius={12}>
          <Box>{icon}</Box>
        </Box>
        <Typography variant={fontVariant} maxWidth={72} textAlign="center">
          {label}
        </Typography>
      </Box>
    </AppPressable>
  )
}
