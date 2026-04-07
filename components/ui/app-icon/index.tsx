import * as LucideIcons from 'lucide-react-native'
import React from 'react'

type IconName = keyof typeof LucideIcons

export interface AppIconProps {
  name: IconName
  size: number
  color: string
  fill?: string
}

export function AppIcon(props: AppIconProps) {
  const {name, size, color, fill = 'transparent'} = props
  // eslint-disable-next-line import/namespace
  const Icon = LucideIcons[name] as LucideIcons.LucideIcon | undefined
  if (!Icon) return null
  return <Icon color={color} size={size} fill={fill} />
}

export default AppIcon
