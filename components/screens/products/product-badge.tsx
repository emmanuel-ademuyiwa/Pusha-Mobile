import Box from '@/components/ui/box'
import Typography from '@/components/ui/typography'
import React from 'react'

type BadgeType = 'available' | 'unavailable' | string

interface ProductBadgeProps {
  type: BadgeType
  label?: string
}

const BADGE_CONFIG: Record<string, {bg: string; textColor: any; label: string}> = {
  available:   {bg: '#1FC16B', textColor: 'white', label: 'Available'},
  unavailable: {bg: '#D70015', textColor: 'white', label: 'Unavailable'},
}

export const ProductBadge = ({type, label}: ProductBadgeProps) => {
  const cfg = BADGE_CONFIG[type] ?? {bg: '#94A3B8', textColor: 'white', label: type}
  return (
    <Box
      paddingHorizontal={8}
      paddingVertical={4}
      borderRadius={20}
      style={{backgroundColor: cfg.bg}}>
      <Typography variant="c2-bold" color={cfg.textColor}>
        {label ?? cfg.label}
      </Typography>
    </Box>
  )
}

export default ProductBadge
