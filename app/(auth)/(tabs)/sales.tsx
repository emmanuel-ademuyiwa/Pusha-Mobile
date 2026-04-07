import {
  Box,
  Container,
  EmptyState,
  PageError,
  PushaActivityIndicator,
  AppIcon,
  Typography
} from '@/components/ui'
import {SalesItem} from '@/components/shared'
import {type ISaleOrder, useListSales} from '@/queries/salesQuery'
import {Modal} from '@/types/modal'
import {router} from 'expo-router'
import {StatusBar} from 'expo-status-bar'
import React, {useRef, useState, useMemo} from 'react'
import {
  SectionList,
  StyleSheet,
  TextInput,
  View,
  Text
} from 'react-native'
import {ScreenView} from '@/components/util/screen-view'

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

const STATS_CONFIG = [
  {
    key: 'total',
    label: 'Total Sales',
    bg: '#EEF2FF',
    valueColor: '#2554C7',
    labelColor: '#6B7280'
  },
  {
    key: 'completed',
    label: 'Paid Orders',
    bg: '#F0FFF4',
    valueColor: '#1FC16B',
    labelColor: '#6B7280'
  },
  {
    key: 'unpaid',
    label: 'Pending Payment',
    bg: '#FFF5F5',
    valueColor: '#D70015',
    labelColor: '#6B7280'
  }
]

const Sales = () => {
  const addSaleRef = useRef<Modal>(null)
  const [search, setSearch] = useState('')
  const {data: sales, isLoading, isError, refetch} = useListSales()

  const allItems: ISaleOrder[] = useMemo(() => sales?.records ?? [], [sales])

  const filteredItems: ISaleOrder[] = useMemo(() => {
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

  return (
    <ScreenView navTitle="Sales" alignNav="center" backButton={false} hasTopBanner={false} footerPadding={false}> 
      <StatusBar style="dark" animated />

      <Container>
        {/* Header row */}

        {/* Stats pills */}
        {!isLoading && (
          <Box flexDirection="row" gap={8} mb={16}>
            {STATS_CONFIG.map(cfg => (
              <View
                key={cfg.key}
                style={[styles.statPill, {backgroundColor: cfg.bg}]}>
                <Text style={[styles.statValue, {color: cfg.valueColor}]}>
                  {statsValues[cfg.key]}
                </Text>
                <Text style={[styles.statLabel, {color: cfg.labelColor}]}>
                  {cfg.label}
                </Text>
              </View>
            ))}
          </Box>
        )}

        {/* Search bar */}
        <View style={styles.searchBar}>
          <AppIcon name="Search" size={16} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
        </View>
      </Container>

      {isLoading ? (
        <Box flex={1} alignItems="center" justifyContent="center">
          <PushaActivityIndicator />
        </Box>
      ) : (
        <SectionList
          sections={sections}
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
          // ListHeaderComponent={
          //   <Container>
          //     <Box pt={14} pb={2}>
          //       <Typography variant="body-semibold" color="secondary-500">
          //         Recent Sales
          //       </Typography>
          //     </Box>
          //   </Container>
          // }
          ListEmptyComponent={
            <EmptyState
              title="No sales yet"
              description="Record your first sale to get started."
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
  statPill: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 4
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'InstrumentSans_700Bold'
  },
  statLabel: {
    fontSize: 11,
    textAlign: 'center',
    fontFamily: 'InstrumentSans_400Regular',
    lineHeight: 14
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E9EAEB',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 4
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#142952',
    fontFamily: 'InstrumentSans_400Regular',
    padding: 0
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 100
  }
})

export default Sales
