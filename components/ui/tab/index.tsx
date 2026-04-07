import React from 'react'
import {TouchableOpacity, Text, StyleSheet} from 'react-native'

interface TabProps {
  label: string
  active?: boolean
  onPress?: () => void
}

export const Tab = ({label, active, onPress}: TabProps) => {
  return (
    <TouchableOpacity style={[styles.tab, active ? styles.activeTab : null]} onPress={onPress}>
      <Text style={[styles.label, active ? styles.activeLabel : null]}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  tab: {paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6},
  activeTab: {backgroundColor: '#EFF4FF'},
  label: {fontSize: 14, color: '#94A3B8'},
  activeLabel: {color: '#2554C7', fontWeight: '600'},
})

export default Tab
