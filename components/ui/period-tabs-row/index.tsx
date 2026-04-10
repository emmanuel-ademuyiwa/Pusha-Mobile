import AppPressable from '../pressable'
import Box from '../box'
import Typography from '../typography'
import React from 'react'
import {ScrollView, StyleSheet} from 'react-native'

export interface PeriodTabItem<T extends string = string> {
  key: T
  label: string
}

export interface PeriodTabsRowProps<T extends string> {
  tabs: PeriodTabItem<T>[]
  selectedKey: T
  onSelect: (key: T) => void
  /** Extra control after tabs (e.g. “See all”). */
  trailing?: React.ReactNode
}

export function PeriodTabsRow<T extends string>({
  tabs,
  selectedKey,
  onSelect,
  trailing
}: PeriodTabsRowProps<T>) {
  return (
    
      <Box flexDirection='row' alignItems='center' justifyContent='space-between' mb={8}>
        <Box flexDirection="row" alignItems="center" gap={8} pb={4} pt={8}>
        {tabs.map(({key, label}) => (
          <AppPressable key={key} onPress={() => onSelect(key)}>
            <Box
              paddingHorizontal={8}
              borderRadius={8}
              alignItems="center"
              justifyContent="center"
              height={22}
              style={[styles.tab, selectedKey === key && styles.tabActive]}>
              <Typography
                variant="c1-medium"
                color={selectedKey === key ? 'white' : 'neutral-600'}>
                {label}
              </Typography>
            </Box>
          </AppPressable>
        ))}
      </Box>
        {trailing}
      </Box>
  )
}

const styles = StyleSheet.create({
  scroll: {marginBottom: 4},
  tab: {backgroundColor: '#F5F5F5'},
  tabActive: {backgroundColor: '#142952'}
})

export default PeriodTabsRow
