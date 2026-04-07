import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'

interface SegmentedTabProps {
  tabs: string[]
  selectedIndex: number
  onChange: (index: number) => void
  pages: React.ReactNode[]
}

export const SegmentedTab = ({tabs, selectedIndex, onChange, pages}: SegmentedTabProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.tab, selectedIndex === i ? styles.activeTab : null]}
            onPress={() => onChange(i)}>
            <Text style={[styles.tabText, selectedIndex === i ? styles.activeTabText : null]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.page}>{pages[selectedIndex]}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {flex: 1},
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    margin: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#142952',
    fontWeight: '600',
  },
  page: {flex: 1},
})

export default SegmentedTab
