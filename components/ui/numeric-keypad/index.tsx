import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'

interface NumericKeypadProps {
  onKeyPress: (val: string) => void
  onDelete: () => void
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del']

const NumericKeypad = ({onKeyPress, onDelete}: NumericKeypadProps) => {
  return (
    <View style={styles.container}>
      {KEYS.map((key, i) => (
        <TouchableOpacity
          key={i}
          style={[styles.key, !key ? styles.empty : null]}
          onPress={() => {
            if (key === 'del') return onDelete()
            if (key) return onKeyPress(key)
          }}
          disabled={!key}>
          <Text style={styles.keyText}>{key === 'del' ? '⌫' : key}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    rowGap: 8,
    columnGap: 0,
  },
  key: {
    width: '33.33%',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  empty: {
    opacity: 0,
  },
  keyText: {
    fontSize: 24,
    color: '#142952',
    fontWeight: '500',
  },
})

export default NumericKeypad
