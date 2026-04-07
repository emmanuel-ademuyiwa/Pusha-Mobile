import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native'

interface TagSelectProps {
  options: Array<{label: string; value: string}>
  value?: string[]
  onChange?: (value: string[]) => void
}

export const TagSelect = ({options, value = [], onChange}: TagSelectProps) => {
  const toggle = (v: string) => {
    const next = value.includes(v) ? value.filter(x => x !== v) : [...value, v]
    onChange?.(next)
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        {options.map(opt => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.tag, value.includes(opt.value) ? styles.selected : null]}
            onPress={() => toggle(opt.value)}>
            <Text style={[styles.label, value.includes(opt.value) ? styles.selectedLabel : null]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {flexDirection: 'row', gap: 8, flexWrap: 'wrap'},
  tag: {paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#E9EAEB'},
  selected: {backgroundColor: '#2554C7', borderColor: '#2554C7'},
  label: {fontSize: 13, color: '#454A53'},
  selectedLabel: {color: '#fff'},
})

export default TagSelect
