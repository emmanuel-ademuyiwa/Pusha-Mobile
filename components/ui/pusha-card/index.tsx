import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

interface PushaCardProps {
  children?: React.ReactNode
  [key: string]: any
}

export const PushaCard = ({children}: PushaCardProps) => {
  return <View style={styles.card}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
})

export default PushaCard
