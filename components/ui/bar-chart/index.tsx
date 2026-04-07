import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

interface BarChartProps {
  data?: any[]
  [key: string]: any
}

export const BarChart = (_props: BarChartProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Chart</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {height: 200, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F5F5', borderRadius: 8},
  placeholder: {color: '#94A3B8'},
})

export default BarChart
