import {AppIcon} from '@/components/ui/app-icon'
import Box from '@/components/ui/box'
import Typography from '@/components/ui/typography'
import React from 'react'
import {Pressable} from 'react-native'

interface StatsCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  changePercent?: number
  changeSuffix?: string
  /** When set, shows a red attention line instead of % trend (e.g. low stock / pending). */
  attentionLabel?: string
  /** When set, the card is tappable (e.g. navigate to a detail screen). */
  onPress?: () => void
}

export const StatsCard = ({
  title,
  value,
  icon,
  trend,
  changePercent,
  changeSuffix = 'from yesterday',
  attentionLabel,
  onPress,
}: StatsCardProps) => {
  const iconColor = trend === 'up' ? '#1FC16B' : trend === 'down' ? '#D70015' : '#94A3B8'
  const trendTextColor =
    trend === 'up' ? 'green-200' : trend === 'down' ? 'error-100' : 'neutral-500'

  const inner = (
    <Box
      backgroundColor="white"
      borderRadius={12}
      padding={14}
      flex={1}
      borderWidth={1}
      style={{borderColor: '#E9EAEB'}}>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        mb={8}>
        <Typography variant="c1" color="neutral-600">
          {title}
        </Typography>
        {icon ?? null}
      </Box>

      <Typography variant="h2-bold" color="secondary-500" mb={6} numberOfLines={1}>
        {value}
      </Typography>

      {attentionLabel ? (
        <Typography variant="c2-bold" color="error-100">
          {attentionLabel}
        </Typography>
      ) : changePercent !== undefined && trend ? (
        <Box flexDirection="row" alignItems="center" gap={4}>
          <AppIcon
            name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'}
            size={12}
            color={iconColor}
          />
          <Typography variant="c2-bold" color={trendTextColor as any}>
            {trend === 'up' ? '+' : ''}
            {changePercent}% {changeSuffix}
          </Typography>
        </Box>
      ) : null}
    </Box>
  )

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({pressed}) => [{flex: 1, opacity: pressed ? 0.92 : 1}]}>
        {inner}
      </Pressable>
    )
  }

  return inner
}

export default StatsCard
