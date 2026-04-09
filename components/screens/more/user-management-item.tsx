import {AppIcon, Box, Typography} from '@/components/ui'
import React from 'react'
import {TouchableOpacity} from 'react-native'

interface UserManagementItemProps {
  title: string
  subtitle?: string
  icon?: string
  onPress?: () => void
  rightElement?: React.ReactNode
  destructive?: boolean
  /** When false, no bottom divider (e.g. standalone card rows). */
  showBottomDivider?: boolean
  /** Rounded square icon well vs circle (grouped lists). */
  iconWell?: 'roundedSquare' | 'circle'
}

const UserManagementItem = ({
  title,
  subtitle,
  icon,
  onPress,
  rightElement,
  destructive,
  showBottomDivider = true,
  iconWell = 'roundedSquare',
}: UserManagementItemProps) => {
  const iconRadius = iconWell === 'circle' ? 20 : 8
  const iconBg = destructive ? 'error-300' : 'neutral-100'

  const row = (
    <Box
      flexDirection="row"
      alignItems="center"
      py={16}
      px={16}
      height={64}
      borderBottomWidth={showBottomDivider ? 1 : 0}
      style={{borderBottomColor: '#F5F5F5'}}>
      {icon ? (
        <Box
          width={40}
          height={40}
          borderRadius={iconRadius}
          backgroundColor={iconBg}
          alignItems="center"
          justifyContent="center"
          mr={12}>
          <AppIcon name={icon as any} size={20} color={destructive ? '#D70015' : '#454A53'} />
        </Box>
      ) : null}
      <Box flex={1}>
        <Typography variant="body-semibold" color="secondary-500">
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="c1" color="neutral-600" mt={2}>
            {subtitle}
          </Typography>
        ) : null}
      </Box>
      {rightElement ?? <AppIcon name="ChevronRight" size={18} color="#94A3B8" />}
    </Box>
  )

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {row}
      </TouchableOpacity>
    )
  }

  return <Box>{row}</Box>
}

export default UserManagementItem
