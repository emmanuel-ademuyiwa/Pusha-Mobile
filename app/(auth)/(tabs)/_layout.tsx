import Ionicons from '@expo/vector-icons/Ionicons'
import {NativeTabs} from 'expo-router/unstable-native-tabs'
import React from 'react'

const ACTIVE_COLOR = '#2554C7'
const INACTIVE_COLOR = '#777777'

/** Outline icons — lighter weight than Material Community; swap names anytime to taste */
const TABS = [
  {name: 'dashboard' as const, label: 'Home', icon: 'home-outline' as const},
  {name: 'sales' as const, label: 'Sales', icon: 'stats-chart-outline' as const},
  {name: 'products' as const, label: 'Products', icon: 'cube-outline' as const},
  {name: 'chats' as const, label: 'Chats', icon: 'chatbubbles-outline' as const},
  {name: 'more' as const, label: 'More', icon: 'reorder-three-outline' as const}
]

export default function TabLayout() {
  return (
    <NativeTabs
      tintColor={ACTIVE_COLOR}
      iconColor={{default: INACTIVE_COLOR, selected: ACTIVE_COLOR}}
      labelStyle={{
        default: {color: INACTIVE_COLOR, fontWeight: '400'},
        selected: {color: ACTIVE_COLOR, fontWeight: '700'}
      }}
      backgroundColor="#fff"
      shadowColor="#E9EAEB">
      {TABS.map(tab => (
        <NativeTabs.Trigger key={tab.name} name={tab.name}>
          <NativeTabs.Trigger.Icon
            renderingMode="template"
            // expo-router awaits Promise<ImageSource> at runtime (types omit Promise)
            src={Ionicons.getImageSource(tab.icon, 24, 'white') as never}
          />
          <NativeTabs.Trigger.Label>{tab.label}</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  )
}
