import {BottomTabBarProps} from '@react-navigation/bottom-tabs'
import {Tabs} from 'expo-router'
import React from 'react'
import {Platform, StyleSheet, View} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

import {TabBarButton} from '@/components/ui/tab-bar-button'

const TABS = [
  {name: 'dashboard', icon: 'Home', selectedIcon: 'Home', text: 'Home'},
  {name: 'sales', icon: 'Chart', selectedIcon: 'Chart', text: 'Sales'},
  {
    name: 'products',
    icon: 'Notepad2',
    selectedIcon: 'Notepad2',
    text: 'Products'
  },
  {
    name: 'chats',
    icon: 'MessageCircle',
    selectedIcon: 'MessageCircle',
    text: 'Chats'
  },
  {
    name: 'more',
    icon: 'HamburgerMenu',
    selectedIcon: 'HamburgerMenu',
    text: 'More'
  }
] as const

const ACTIVE_COLOR = '#2554C7'
const INACTIVE_COLOR = '#777777'

const TabBar = ({state, navigation}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets()

  return (
    <View
      style={[
        styles.tabBar,
        {paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 16) : 8}
      ]}>
      {state.routes.map((route, index) => {
        const tab = TABS.find(t => t.name === route.name)
        if (!tab) return null

        const focused = state.index === index

        return (
          <TabBarButton
            key={route.key}
            tab={tab}
            accessibilityState={{selected: focused}}
            activeTintColor={ACTIVE_COLOR}
            inactiveTintColor={INACTIVE_COLOR}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true
              })
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name)
              }
            }}
          />
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E9EAEB',
    paddingTop: 8
  }
})

export default function TabLayout() {
  return (
    <Tabs
      tabBar={props => <TabBar {...props} />}
      screenOptions={{headerShown: false}}>
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="sales" />
      <Tabs.Screen name="products" />
      <Tabs.Screen name="chats" />
      <Tabs.Screen name="more" />
      {/* Customers remains accessible as a route but is not shown in the tab bar */}
      <Tabs.Screen name="customers" options={{href: null}} />
    </Tabs>
  )
}
