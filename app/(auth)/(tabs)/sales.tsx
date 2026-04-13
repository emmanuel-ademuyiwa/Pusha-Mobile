import {
  Box,
  Container,
  EmptyState,
  PageError,
  PushaActivityIndicator,
  AppIcon,
  Typography,
  AppPressable
} from '@/components/ui'
import {SalesItem} from '@/components/shared'
import {type ISaleOrder, useListSales} from '@/queries/salesQuery'
import {Modal} from '@/types/modal'
import {router} from 'expo-router'
import {StatusBar} from 'expo-status-bar'
import React, {useRef, useState, useMemo} from 'react'
import {SectionList, StyleSheet, TextInput} from 'react-native'
import {ScreenView} from '@/components/util/screen-view'
import {theme} from '@/theme'
import type {ThemeColors} from '@/theme'

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

function formatSectionDate(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  const day = getOrdinal(d.getDate())
  const month = d.toLocaleString('en-US', {month: 'long'})
  const year = d.getFullYear()
  return `${day} ${month}, ${year}`
}

type StatConfig = {
  key: 'total' | 'completed' | 'unpaid'
  label: string
  bg: ThemeColors
  valueColor: ThemeColors
  labelColor: ThemeColors
}

const STATS_CONFIG: StatConfig[] = [
  {
    key: 'total',
    label: 'Total Sales',
    bg: 'light-primary',
    valueColor: 'primary-300',
    labelColor: 'neutral-600'
  },
  {
    key: 'completed',
    label: 'Paid Orders',
    bg: 'success-200',
    valueColor: 'green-200',
    labelColor: 'neutral-600'
  },
  {
    key: 'unpaid',
    label: 'Pending Payment',
    bg: 'error-300',
    valueColor: 'error-100',
    labelColor: 'neutral-600'
  }
]

type SalesStatFilter = null | 'completed' | 'unpaid'

const Sales = () => {
  const addSaleRef = useRef<Modal>(null)
  const [search, setSearch] = useState('')
  const [salesStatFilter, setSalesStatFilter] =
    useState<SalesStatFilter>(null)
  const {data: sales, isLoading, isError, refetch} = useListSales()

  const allItems: ISaleOrder[] = useMemo(() => sales?.records ?? [], [sales])

  const searchFiltered: ISaleOrder[] = useMemo(() => {
    if (!search.trim()) return allItems
    const q = search.trim().toLowerCase()
    return allItems.filter(item => {
      const customerName = [item.customer?.first_name, item.customer?.last_name]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      const productNames = item.sale_items
        .map(s => s.product_name.toLowerCase())
        .join(' ')
      return (
        item.order_id.toLowerCase().includes(q) ||
        customerName.includes(q) ||
        productNames.includes(q)
      )
    })
  }, [allItems, search])

  const filteredItems: ISaleOrder[] = useMemo(() => {
    if (salesStatFilter === 'completed') {
      return searchFiltered.filter(
        item => item.payment_status.toUpperCase() === 'PAID'
      )
    }
    if (salesStatFilter === 'unpaid') {
      return searchFiltered.filter(
        item => item.payment_status.toUpperCase() === 'PENDING'
      )
    }
    return searchFiltered
  }, [searchFiltered, salesStatFilter])

  const toggleSalesStat = (key: 'total' | 'completed' | 'unpaid') => {
    if (key === 'total') {
      setSalesStatFilter(null)
      return
    }
    if (key === 'completed') {
      setSalesStatFilter(prev => (prev === 'completed' ? null : 'completed'))
      return
    }
    setSalesStatFilter(prev => (prev === 'unpaid' ? null : 'unpaid'))
  }

  const totalRevenue = useMemo(
    () => allItems.reduce((sum, item) => sum + item.total_amount, 0),
    [allItems]
  )
  const paidCount = useMemo(
    () =>
      allItems.filter(item => item.payment_status.toUpperCase() === 'PAID')
        .length,
    [allItems]
  )
  const pendingCount = useMemo(
    () =>
      allItems.filter(item => item.payment_status.toUpperCase() === 'PENDING')
        .length,
    [allItems]
  )

  const statsValues: Record<string, string> = {
    total: `₦${Number(totalRevenue).toLocaleString()}`,
    completed: String(paidCount),
    unpaid: String(pendingCount)
  }

  const sections = useMemo(() => {
    const groups: Record<string, ISaleOrder[]> = {}
    filteredItems.forEach(item => {
      const key = item.sale_date
        ? new Date(item.sale_date).toDateString()
        : 'Unknown'
      if (!groups[key]) groups[key] = []
      groups[key].push(item)
    })
    return Object.entries(groups).map(([date, data]) => ({
      title: date === 'Unknown' ? 'Unknown Date' : formatSectionDate(date),
      data
    }))
  }, [filteredItems])

  if (isError) {
    return <PageError reload={() => refetch().then(() => {})} />
  }

  const listHeader = (
    <Container>
      <Box flexDirection="row" gap={8} mb={16}>
        {STATS_CONFIG.map(cfg => {
          const selected =
            (cfg.key === 'completed' && salesStatFilter === 'completed') ||
            (cfg.key === 'unpaid' && salesStatFilter === 'unpaid')
          const showStatBorder = cfg.key !== 'total' && selected
          const statBorderColor: ThemeColors | undefined =
            showStatBorder && cfg.key === 'completed'
              ? 'green-200'
              : showStatBorder && cfg.key === 'unpaid'
                ? 'error-100'
                : undefined
          return (
            <AppPressable
              key={cfg.key}
              flex={1}
              style={{minWidth: 0}}
              onPress={() =>
                toggleSalesStat(cfg.key as 'total' | 'completed' | 'unpaid')
              }>
              <Box
                alignSelf="stretch"
                borderRadius={12}
                paddingVertical={12}
                paddingHorizontal={10}
                alignItems="center"
                gap={4}
                backgroundColor={cfg.bg}
                borderWidth={showStatBorder ? 2 : 0}
                borderColor={statBorderColor ?? 'transparent'}>
                <Typography variant="h3-bold" color={cfg.valueColor}>
                  {statsValues[cfg.key]}
                </Typography>
                <Typography
                  variant="c2"
                  color={cfg.labelColor}
                  textAlign="center"
                  style={{lineHeight: 14, fontSize: 11}}>
                  {cfg.label}
                </Typography>
              </Box>
            </AppPressable>
          )
        })}
      </Box>

      <Box
        flexDirection="row"
        alignItems="center"
        backgroundColor="neutral-100"
        borderRadius={10}
        borderWidth={1}
        borderColor="stroke"
        paddingHorizontal={12}
        paddingVertical={10}
        gap={8}
        mb={4}>
        <AppIcon
          name="Search"
          size={16}
          color={theme.colors['neutral-500']}
        />
        <TextInput
          style={[
            styles.searchInput,
            {color: theme.colors['secondary-500']}
          ]}
          placeholder="Search products..."
          placeholderTextColor={theme.colors['neutral-500']}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
      </Box>
    </Container>
  )

  return (
    <ScreenView navTitle="Sales" backButton={false} hasTopBanner={false} footerPadding={false}> 
      <StatusBar style="dark" animated />

      {isLoading ? (
        <Box flex={1} alignItems="center" justifyContent="center">
          <PushaActivityIndicator />
        </Box>
      ) : (
        <SectionList
          style={styles.list}
          sections={sections}
          ListHeaderComponent={listHeader}
          keyExtractor={(item: any, i) => item?.id ?? String(i)}
          renderItem={({item}: {item: ISaleOrder}) => (
            <SalesItem
              item={item}
              onPress={() => router.push(`/(auth)/sales/${item.id}` as any)}
            />
          )}
          renderSectionHeader={({section}) => (
            <Container>
              <Box pt={14} pb={4}>
                <Typography variant="c1" color="neutral-500">
                  {section.title}
                </Typography>
              </Box>
            </Container>
          )}
          ListEmptyComponent={
            <EmptyState
              title="No sales yet"
              description={
                salesStatFilter || search.trim()
                  ? 'No sales match your search or filter.'
                  : 'Record your first sale to get started.'
              }
              actionText="Record Sale"
              onAction={() => addSaleRef.current?.present()}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
        />
      )}

      {/* <FloatingButton onPress={() => addSaleRef.current?.present()}>
        <AppIcon name="Plus" size={24} color="#fff" />
      </FloatingButton>

      <AddNewSale ref={addSaleRef} /> */}
    </ScreenView>
  )
}

const styles = StyleSheet.create({
  list: {
    flex: 1
  },
  recordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2554C7',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    gap: 5
  },
  recordBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'InstrumentSans_600SemiBold'
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'InstrumentSans_400Regular',
    padding: 0
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 100
  }
})

export default Sales
