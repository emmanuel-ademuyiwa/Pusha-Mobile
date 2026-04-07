import React, {FC} from 'react'

import Box from '../box'
import Typography from '../typography'

interface BadgeProps {
  variant?: 'heavy' | 'light'
  color?: 'neutral' | 'success' | 'blue' | 'purple' | 'error' | 'caution'
  label: string
}

export const Badge: FC<BadgeProps> = props => {
  const {variant = 'heavy', color = 'neutral', label} = props

  const getColors = () => {
    switch (variant) {
      case 'heavy': {
        if (color === 'neutral') {
          return {bg: 'neutral-500', text: 'white'}
        } else if (color === 'blue') {
          return {bg: 'primary-100', text: 'white'}
        } else if (color === 'error') {
          return {bg: 'error-100', text: 'white'}
        } else if (color === 'purple') {
          return {bg: 'secondary-100', text: 'white'}
        }
        if (color === 'caution') {
          return {bg: 'caution-200', text: 'black'}
        } else {
          return {bg: 'success-100', text: 'white'}
        }
      }
      case 'light': {
        if (color === 'neutral') {
          return {bg: 'neutral-200', text: 'neutral-500'}
        } else if (color === 'blue') {
          return {bg: 'light-primary', text: 'primary-100'}
        } else if (color === 'error') {
          return {bg: 'error-300', text: 'error-100'}
        } else if (color === 'purple') {
          return {bg: 'secondary-300', text: 'secondary-100'}
        } else if (color === 'caution') {
          return {bg: 'caution-300', text: 'caution-100'}
        } else {
          return {bg: 'success-200', text: 'success-100'}
        }
      }
      default: {
        return {bg: 'neutral-500', text: 'white'}
      }
    }
  }
  return (
    <Box
      borderRadius={4}
      paddingHorizontal={8}
      height={20}
      backgroundColor={getColors().bg as any}
      justifyContent="center">
      <Typography variant="c2-bold" color={getColors().text as any}>
        {label}
      </Typography>
    </Box>
  )
}

export default Badge
