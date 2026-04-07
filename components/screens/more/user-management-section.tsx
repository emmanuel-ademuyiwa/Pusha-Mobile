import {Box, Typography} from '@/components/ui'
import React from 'react'
import UserManagementItem from './user-management-item'

interface SectionItem {
  id: string
  title: string
  subtitle?: string
  icon?: string
  onPress?: () => void
  rightElement?: React.ReactNode
  destructive?: boolean
}

interface UserManagementSectionProps {
  title?: string
  items: SectionItem[]
}

const UserManagementSection = ({title, items}: UserManagementSectionProps) => {
  return (
    <Box mb={16}>
      {title ? (
        <Typography
          variant="c1-bold"
          color="neutral-600"
          textTransform="uppercase"
          px={16}
          mb={4}>
          {title}
        </Typography>
      ) : null}
      <Box
        backgroundColor="white"
        borderRadius={12}
        overflow="hidden"
        borderWidth={1}
        style={{borderColor: '#E9EAEB'}}>
        {items.map(item => (
          <UserManagementItem key={item.id} {...item} />
        ))}
      </Box>
    </Box>
  )
}

export default UserManagementSection
