import { createTheme } from '@shopify/restyle'

import { button } from './button'
import { spacing } from './spacing'
import { text } from './text'

const palette = {
  // Base colors
  black: '#000000',
  white: '#FFFFFF',
  transparent: 'transparent',
  stroke: '#E9EAEB',
  'btn-border': '#FFFFFF0D',
  'light-blue': '#EDF2FF',

  'text-primary': '#454A53',
  'text-tertiary': '#757575',
  'gray-bg': '#F4F4F4',

  // Primary colors #FFFFFF0D

  'light-primary': '#EFF4FF',
  'primary-100': '#2554cf', // Main primary color
  'primary-200': '#4a6fd9', // Lighter primary
  'primary-300': '#2554C7', // Very light primary
  'primary-400': '#1D419B',
  'primary-disabled': '#a3b8f0', // Disabled state
  'secondary-500': '#142952',
  // Secondary colors
  'secondary-100': '#142952', // Main secondary color
  'secondary-200': '#1e3d75', // Lighter secondary
  'secondary-300': '#f0f4fa', // Very light secondary
  'secondary-400': '#214489',
  'secondary-disabled': '#8b9cb8', // Disabled state

  tertiary: '#F5F5F5',

  'gray-300': '#D0D5DD',
  'gray-700': '#344054',

  // Neutral colors
  'neutral-50':'#F2F2F2',
  'neutral-100': '#F5F5F5', // White
  'neutral-200': '#E8E8E8', // Very light gray
  'neutral-300': '#E5E9F0', // Light gray
  'neutral-400': '#CBD5E1', // Medium gray
  'neutral-500': '#94A3B8', // Gray
  'neutral-600': '#8E8E8E', // Dark gray
  'neutral-700': '#777777', // Dark blue (reusing secondary)
  'neutral-800': '#606060',
  'neutral-900': '#4A4A4A',
  'neutral-1000': '#333333',

  'green-200': '#1FC16B',
  'green-alpha': '#1FC16B1A',
  'yellow-200': '#DFB400',

  // Semantic colors
  'success-100': '#20B038',
  'success-200': '#F6FDF8',
  'caution-100': '#F0960F',
  'caution-200': '#FFD426',
  'caution-300': '#FFFBEB',
  'error-100': '#D70015',
  'error-200': '#FF3B30',
  'error-300': '#FFF5F6',
  'error-disabled': '#FF9A94',
  'red-alpha': '#FB37481A',
  'red-100': '#FB3748',
  'red-200': '#D00416'
}

export const theme = createTheme({
  colors: {...palette},
  spacing: {
    ...spacing
  },
  textVariants: {...text},
  buttonVariants: {...button}
})

export type Theme = typeof theme
export type ThemeColors = keyof typeof theme.colors
