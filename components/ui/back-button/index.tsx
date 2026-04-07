import {useNavigation} from 'expo-router'
import React from 'react'

import AppIcon from '../app-icon'
import Button from '../button'
import {AppPressable} from '../pressable'
import {Typography} from '../typography'
import { Box } from '../box';
import { ThemeColors } from '@/theme';

interface BackButtonProps {
  customAction?: () => void,
  color?: ThemeColors
}

export const BackButton: React.FC<BackButtonProps> = ({customAction, color = 'white'}) => {
  const {goBack, canGoBack} = useNavigation()

  const handlePress = customAction || (canGoBack() ? goBack : undefined)

  if (!handlePress) return null

  return (
    <AppPressable onPress={handlePress}>
      <Box flexDirection="row" alignItems="center" gap={0}>
        <AppIcon name="ChevronLeft" size={24} color={color} />
        <Typography variant="h3-medium" color={color}>
          Back
        </Typography>
      </Box>
    </AppPressable>
  )
}

export default BackButton
