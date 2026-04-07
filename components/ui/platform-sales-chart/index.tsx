import Box from '@/components/ui/box'
import Typography from '@/components/ui/typography'
import React from 'react'
import {Dimensions, StyleSheet} from 'react-native'
import {BarChart} from 'react-native-gifted-charts'

const {width: SCREEN_WIDTH} = Dimensions.get('window')

export interface BarItem {
  value: number
  label: string
  frontColor?: string
}

interface PlatformSalesChartProps {
  data?: BarItem[]
  period?: string
}

const formatYLabel = (val: string) => {
  const num = Number(val)
  if (num >= 1_000_000) return `₦${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `₦${(num / 1_000).toFixed(0)}k`
  if (num === 0) return '₦0'
  return `₦${num}`
}

export const PlatformSalesChart = ({data = []}: PlatformSalesChartProps) => {
  const hasData = data.some(d => d.value > 0)
  const rawMax = hasData ? Math.max(...data.map(d => d.value)) : 20_000
  const roundedMax = Math.ceil((rawMax * 1.25) / 1_000) * 1_000 || 20_000

  if (data.length === 0) {
    return (
      <Box
        height={160}
        alignItems="center"
        justifyContent="center"
        backgroundColor="neutral-100"
        borderRadius={8}>
        <Typography variant="c1" color="neutral-500">
          No data available
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <BarChart
        data={data.map(item => ({
          value: item.value,
          label: item.label,
          frontColor: item.frontColor ?? '#C7D7F5',
          topLabelComponent: () => null,
        }))}
        width={SCREEN_WIDTH - 120}
        height={160}
        barWidth={24}
        spacing={16}
        maxValue={roundedMax}
        noOfSections={4}
        barBorderRadius={4}
        formatYLabel={formatYLabel}
        yAxisTextStyle={styles.yAxisText}
        xAxisLabelTextStyle={styles.xAxisText}
        yAxisThickness={0}
        xAxisThickness={0}
        rulesColor="#F1F5F9"
        rulesType="solid"
        yAxisLabelWidth={44}
        isAnimated
      />
    </Box>
  )
}

const styles = StyleSheet.create({
  yAxisText: {color: '#94A3B8', fontSize: 10},
  xAxisText: {color: '#94A3B8', fontSize: 10},
})

export default PlatformSalesChart
