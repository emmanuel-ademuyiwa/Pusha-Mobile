import React from 'react'

import {AppIcon} from '../app-icon'
import {Box} from '../box'
import {Button} from '../button'
import {Typography} from '../typography'

export interface QuantityStepperProps {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
}

export function QuantityStepper({
  value,
  min = 1,
  max,
  onChange
}: QuantityStepperProps) {
  const decrement = () => {
    if (value > min) onChange(value - 1)
  }

  const increment = () => {
    if (max === undefined || value < max) onChange(value + 1)
  }

  return (
    <Box flexDirection="row" alignItems="center" gap={20}>
      <Button
        iconButton
        iconSize="md"
        variant="tertiary"
        borderWidth={0}
        Icon={<AppIcon name="Minus" size={18} color="#45505F" />}
        onPress={decrement}
        disabled={value <= min}
      />
      <Typography
        variant="body-medium"
        color="gray-700"
        style={{minWidth: 16, textAlign: 'center'}}>
        {value}
      </Typography>
      <Button
        iconButton
        iconSize="md"
        variant="primary"
        borderWidth={0}
        Icon={<AppIcon name="Plus" size={18} color="#45505F" />}
        onPress={increment}
        disabled={max !== undefined && value >= max}
      />
    </Box>
  )
}

export default QuantityStepper
