import {Box} from '@/components/ui/box'
import {Typography} from '@/components/ui/typography'
import {KeyboardAwareScrollView} from '@/components/util/keyboard-aware-scroll-view'
import {format, isToday, isValid, isYesterday, parseISO} from 'date-fns'
import React from 'react'

interface GroupedByDateProps {
  data: any[]
  dateKey: string
  renderItem: (item: any) => React.ReactNode
  ListEmptyComponent?: React.ReactNode
  ListHeaderComponent?: React.ReactNode
}

interface Section {
  date: string
  items: any[]
}

const groupByDate = (data: any[], dateKey: string): Section[] => {
  const groups: Record<string, any[]> = {}
  data.forEach(item => {
    try {
      const raw = item[dateKey]
      const date = typeof raw === 'string' ? parseISO(raw) : new Date(raw)
      const key = isValid(date) ? format(date, 'yyyy-MM-dd') : 'Unknown'
      if (!groups[key]) groups[key] = []
      groups[key].push(item)
    } catch {
      if (!groups['Unknown']) groups['Unknown'] = []
      groups['Unknown'].push(item)
    }
  })
  return Object.entries(groups).map(([date, items]) => ({date, items}))
}

const formatHeader = (dateStr: string): string => {
  if (dateStr === 'Unknown') return 'Unknown Date'
  try {
    const date = parseISO(dateStr)
    if (isToday(date)) return 'Today'
    if (isYesterday(date)) return 'Yesterday'
    return format(date, 'MMMM d, yyyy')
  } catch {
    return dateStr
  }
}

const GroupedByDate = ({
  data,
  dateKey,
  renderItem,
  ListEmptyComponent,
  ListHeaderComponent,
}: GroupedByDateProps) => {
  const grouped = groupByDate(data, dateKey)

  return (
    <KeyboardAwareScrollView>
      {ListHeaderComponent ?? null}
      {grouped.length === 0
        ? (ListEmptyComponent ?? null)
        : grouped.map(section => (
            <Box key={section.date}>
              <Box  paddingVertical={8}>
                <Typography variant="c2" color="neutral-500">
                  {formatHeader(section.date)}
                </Typography>
              </Box>
              {section.items.map((row: any, idx: number) => (
                <Box key={row?.id ?? idx}>{renderItem(row)}</Box>
              ))}
            </Box>
          ))}
    </KeyboardAwareScrollView>
  )
}

export default GroupedByDate
