import * as Iconsax from 'iconsax-react-nativejs'
import type {IconProps} from 'iconsax-react-nativejs'
import React from 'react'

/** Lucide-style and ad-hoc names used in the app → Iconsax exports */
const LEGACY_ICON_NAMES = {
  Package: 'Box',
  Note2: 'Notepad2',
  Plus: 'Add',
  Search: 'SearchNormal',
  Bell: 'Notification',
  Users: 'People',
  ChevronRight: 'ArrowRight2',
  ChevronLeft: 'ArrowLeft2',
  ChevronDown: 'ArrowDown2',
  ClipboardList: 'ClipboardText',
  DollarSign: 'DollarCircle',
  CheckCircle: 'TickCircle',
  AlertCircle: 'Danger',
  CreditCard: 'Card',
  Trash2: 'Trash',
  Upload: 'DocumentUpload',
  X: 'CloseSquare',
  Info: 'InfoCircle',
  EyeOff: 'EyeSlash',
  Rocket: 'Flash',
  TrendingUp: 'TrendUp',
  TrendingDown: 'TrendDown',
  Globe: 'Global',
  MoreHorizontal: 'More',
  Mail: 'Sms',
  HelpCircle: 'MessageQuestion',
  construction: 'Building4',
  dropdown: 'ArrowDown2',
  search: 'SearchNormal',
  check: 'TickCircle',
  close: 'CloseSquare',
  crop_rotate: 'RotateRight',
  'delete-2': 'Trash',
  'info-fill': 'Information',
  'check-fill': 'TickCircle',
  'add-image': 'GalleryAdd',
  info: 'InfoCircle',
  security: 'Security',
  replace: 'Refresh'
} as const satisfies Record<string, keyof typeof Iconsax>

/** Known Iconsax export names plus legacy aliases (see `LEGACY_ICON_NAMES`). */
export type AppIconName = keyof typeof Iconsax | keyof typeof LEGACY_ICON_NAMES

export interface AppIconProps {
  name: string
  size: number
  color: string
  fill?: string
  variant?: IconProps['variant']
}

export function AppIcon(props: AppIconProps) {
  const {name, size, color, fill = 'transparent', variant = 'Outline'} = props
  const legacy = (LEGACY_ICON_NAMES as Record<string, keyof typeof Iconsax>)[name as string]
  const key = (legacy ?? name) as keyof typeof Iconsax
  // eslint-disable-next-line import/namespace -- dynamic Iconsax lookup by resolved name
  const Icon = Iconsax[key] as React.ComponentType<IconProps> | undefined
  if (!Icon) return null
  return <Icon color={color} fill={fill} size={size} variant={variant} />
}

export default AppIcon
