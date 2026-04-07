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
}

const UserManagementItem = ({
  title,
  subtitle,
  icon,
  onPress,
  rightElement,
  destructive,
}: UserManagementItemProps) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Box
        flexDirection="row"
        alignItems="center"
        py={16}
        px={16}
        borderBottomWidth={1}
        style={{borderBottomColor: '#F5F5F5'}}>
        {icon ? (
          <Box
            width={40}
            height={40}
            borderRadius={20}
            backgroundColor="neutral-100"
            alignItems="center"
            justifyContent="center"
            mr={12}>
            <AppIcon name={icon as any} size={20} color={destructive ? '#D70015' : '#454A53'} />
          </Box>
        ) : null}
        <Box flex={1}>
          <Typography
            variant="body-semibold"
            color={destructive ? 'error-100' : 'secondary-500'}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="c1" color="neutral-600" mt={2}>
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        {rightElement || (
          <AppIcon name="ChevronRight" size={18} color="#94A3B8" />
        )}
      </Box>
    </TouchableOpacity>
  )
}

export default UserManagementItem
