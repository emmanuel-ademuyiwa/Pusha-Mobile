import {Box, Typography} from '@/components/ui'
import React from 'react'
import UserManagementItem from './user-management-item'

export interface SectionItem {
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
  /** One bordered card per row vs single grouped card with dividers. */
  layout?: 'cards' | 'grouped'
}

const UserManagementSection = ({
  title,
  items,
  layout = 'cards',
}: UserManagementSectionProps) => {
  return (
    <Box mb={16}>
      {title ? (
        <Typography
          variant="c1-medium"
          color="neutral-600"
          textTransform="uppercase"
          mb={8}>
          {title}
        </Typography>
      ) : null}
      {layout === 'grouped' ? (
        <Box
          backgroundColor="white"
          borderRadius={12}
          overflow="hidden"
          borderWidth={1}
          style={{borderColor: '#E9EAEB'}}>
          {items.map((item, index) => (
            <UserManagementItem
              key={item.id}
              {...item}
              iconWell="circle"
              showBottomDivider={index < items.length - 1}
            />
          ))}
        </Box>
      ) : (
        <Box>
          {items.map((item, index) => (
            <Box
              key={item.id}
              mb={index < items.length - 1 ? 8 : 0}
              backgroundColor="white"
              borderRadius={12}
              overflow="hidden"
              borderWidth={1}
              style={{borderColor: '#E9EAEB'}}>
              <UserManagementItem {...item} showBottomDivider={false} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default UserManagementSection
