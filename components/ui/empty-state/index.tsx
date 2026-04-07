import React from 'react'
import {Box} from '../box'
import {Typography} from '../typography'
import {Button} from '../button'

interface EmptyStateProps {
  title: string
  description?: string
  actionText?: string
  onAction?: () => void
  icon?: React.ReactNode
}

export const EmptyState = ({title, description, actionText, onAction}: EmptyStateProps) => (
  <Box flex={1} alignItems="center" justifyContent="center" p={24}>
    <Typography variant="h2-bold" color="neutral-900" textAlign="center">
      {title}
    </Typography>
    {description ? (
      <Typography variant="body" color="neutral-600" textAlign="center" mt={8}>
        {description}
      </Typography>
    ) : null}
    {actionText && onAction ? (
      <Box mt={16} width={160}>
        <Button label={actionText} onPress={onAction} />
      </Box>
    ) : null}
  </Box>
)

export default EmptyState
