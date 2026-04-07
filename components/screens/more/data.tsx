import React from 'react'

export interface MoreMenuItem {
  id: string
  title: string
  subtitle?: string
  icon: string
  route?: string
  action?: () => void
  badge?: string | number
}

export interface MoreMenuSection {
  title: string
  items: MoreMenuItem[]
}

export const MORE_MENU_SECTIONS: MoreMenuSection[] = [
  {
    title: 'Account',
    items: [
      {id: 'account-info', title: 'Account Information', icon: 'User', route: '/account-information'},
      {id: 'business-info', title: 'Business Information', icon: 'Building2', route: '/business-information'},
      {id: 'bank-details', title: 'Bank Details', icon: 'CreditCard', route: '/bank-details'},
      {id: 'change-passcode', title: 'Change Passcode', icon: 'Lock', route: '/change-passcode'},
    ],
  },
  {
    title: 'Business',
    items: [
      {id: 'customers', title: 'Customers', icon: 'Users', route: '/(auth)/(tabs)/customers'},
      {id: 'products', title: 'Products', icon: 'Package', route: '/products'},
      {id: 'transactions', title: 'Transactions', icon: 'ArrowLeftRight', route: '/transactions'},
      {id: 'expenses', title: 'Expenses', icon: 'Receipt', route: '/expenses'},
      {id: 'wallet', title: 'Wallet', icon: 'Wallet', route: '/wallet'},
      {id: 'subscriptions', title: 'Subscriptions', icon: 'Zap', route: '/subscriptions'},
    ],
  },
  {
    title: 'Growth',
    items: [
      {id: 'referrals', title: 'Referral Earnings', icon: 'Gift', route: '/referral-earnings'},
      {id: 'connect-socials', title: 'Connect Socials', icon: 'Share2', route: '/connect-socials'},
      {id: 'business-intelligence', title: 'Business Intelligence', icon: 'BarChart2', route: '/business-intelligence'},
    ],
  },
  {
    title: 'Support',
    items: [
      {id: 'support', title: 'Support', icon: 'HelpCircle', route: '/support'},
    ],
  },
]
