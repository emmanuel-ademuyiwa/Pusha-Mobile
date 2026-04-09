import AddOrEditCustomer from '@/components/modals/add-or-edit-customer'
import {FloatingButton} from '@/components/shared'
import {
  AppIcon,
  Avatar,
  Box,
  Container,
  EmptyState,
  PageError,
  PushaActivityIndicator,
  SearchField,
  Typography
} from '@/components/ui'
import {
  useCustomerPurchaseAggregates,
  useListCustomers
} from '@/queries/customersQuery'
import {formatCurrency} from '@/utils/currency'
import {Modal} from '@/types/modal'
import {router} from 'expo-router'
import {StatusBar} from 'expo-status-bar'
import React, {useEffect, useMemo, useRef, useState} from 'react'
import {FlatList, ScrollView, StyleSheet, TouchableOpacity} from 'react-native'
import {ScreenView} from '@/components/util/screen-view'

type CustomerRow = {
  id: string
  first_name?: string
  last_name?: string | null
  phone_number?: string | null
  email?: string | null
  avatar?: string | null
  stats: {
    totalPurchases: number
    outstanding: number
    lastPurchaseIso: string | null
  }
}

const customerDisplayName = (
  c: Pick<CustomerRow, 'first_name' | 'last_name'>
) => `${c.first_name ?? ''} ${c.last_name ?? ''}`.trim() || 'Customer'

const formatLastPurchase = (iso: string | null) => {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  } catch {
    return '—'
  }
}

const Customers = () => {
  const addCustomerRef = useRef<Modal>(null)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350)
    return () => clearTimeout(t)
  }, [search])

  const {data, isLoading, isError, refetch, isFetching} = useListCustomers({
    page: 1,
    limit: 200,
    search: debouncedSearch || undefined
  })

  const {data: aggregates, isLoading: aggLoading} =
    useCustomerPurchaseAggregates()

  const records = useMemo(() => {
    const raw = (data as {records?: unknown[]; data?: unknown[]})?.records
    const alt = (data as {data?: unknown[]})?.data
    const list = raw ?? alt ?? []
    return Array.isArray(list) ? list : []
  }, [data])

  const enriched: CustomerRow[] = useMemo(() => {
    const map = aggregates ?? new Map()
    return records.map((c: any) => {
      const id = c.id ?? c.customer_id
      const s = map.get(id)
      return {
        id,
        first_name: c.first_name,
        last_name: c.last_name,
        phone_number: c.phone_number,
        email: c.email,
        avatar: c.avatar,
        stats: s ?? {
          totalPurchases: 0,
          outstanding: 0,
          lastPurchaseIso: null
        }
      }
    })
  }, [records, aggregates])

  const bestBuyers = useMemo(
    () =>
      [...enriched]
        .filter(c => c.stats.totalPurchases > 0)
        .sort((a, b) => b.stats.totalPurchases - a.stats.totalPurchases)
        .slice(0, 8),
    [enriched]
  )

  const loading = isLoading || aggLoading

  if (isError) {
    return <PageError reload={() => refetch().then(() => {})} />
  }

  return (
    <ScreenView
      navTitle="Customers"
      alignNav="center"
      footerPadding={false}
      hasTopBanner={false}>
      <Container>
        <SearchField
          placeholder="Search customers..."
          query={search}
          onQueryChange={setSearch}
          suffix={
            <TouchableOpacity
              accessibilityRole="button"
              hitSlop={12}
              onPress={() => {}}>
              <AppIcon name="SlidersHorizontal" size={18} color="#94A3B8" />
            </TouchableOpacity>
          }
        />
      </Container>
      <StatusBar style="dark" animated />

      {loading && records.length === 0 ? (
        <Box flex={1} alignItems="center" justifyContent="center">
          <PushaActivityIndicator />
        </Box>
      ) : (
        <Box pt={12}>
          <FlatList
            data={enriched}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            refreshing={isFetching && !isLoading}
            onRefresh={() => refetch()}
            ListHeaderComponent={
              <Box mb={8}>
                <Typography variant="body-bold" color="secondary-500" mb={12}>
                  Best Buyers
                </Typography>
                {bestBuyers.length === 0 ? (
                  <Typography variant="c1" color="neutral-600" mb={16}>
                    No purchase history yet — your top spenders will appear
                    here.
                  </Typography>
                ) : (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: 8}}>
                    {bestBuyers.map((c, idx) => (
                      <TouchableOpacity
                        key={`best-${c.id}`}
                        activeOpacity={0.85}
                        style={{
                          marginRight: idx < bestBuyers.length - 1 ? 12 : 0
                        }}
                        onPress={() =>
                          router.push(`/(auth)/customers/${c.id}` as any)
                        }>
                        <Box
                          width={140}
                          backgroundColor="white"
                          borderRadius={12}
                          padding={12}
                          borderWidth={1}
                          style={{borderColor: '#E9EAEB'}}>
                          <Box mb={8}>
                            <Avatar
                              src={c.avatar ?? undefined}
                              name={customerDisplayName(c)}
                              size={40}
                            />
                          </Box>
                          <Typography
                            variant="c1-bold"
                            color="secondary-500"
                            numberOfLines={1}>
                            {`${c.first_name ?? ''} ${c.last_name ?? ''}`.trim()}
                          </Typography>
                          <Typography
                            variant="c2"
                            color="neutral-600"
                            mt={4}
                            numberOfLines={1}>
                            {c.phone_number || '—'}
                          </Typography>
                        </Box>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}

                <Typography
                  variant="body-bold"
                  color="secondary-500"
                  mt={20}
                  mb={12}>
                  All Customers
                </Typography>
              </Box>
            }
            renderItem={({item: c}) => (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push(`/(auth)/customers/${c.id}` as any)}>
                <Box
                  backgroundColor="white"
                  borderRadius={12}
                  borderWidth={1}
                  style={{borderColor: '#E9EAEB'}}
                  padding={14}
                  mb={10}>
                  <Box flexDirection="row" alignItems="center" gap={12} mb={12}>
                    <Avatar
                      src={c.avatar ?? undefined}
                      name={customerDisplayName(c)}
                      size={40}
                    />
                    <Box flex={1}>
                      <Typography
                        variant="body-bold"
                        color="secondary-500"
                        numberOfLines={1}>
                        {`${c.first_name ?? ''} ${c.last_name ?? ''}`.trim()}
                      </Typography>
                      <Typography
                        variant="c2"
                        color="neutral-600"
                        mt={2}
                        numberOfLines={1}>
                        {c.phone_number || c.email || '—'}
                      </Typography>
                    </Box>
                    <AppIcon name="ChevronRight" size={18} color="#94A3B8" />
                  </Box>

                  <Box
                    flexDirection="row"
                    justifyContent="space-between"
                    mb={8}>
                    <Typography variant="c1" color="neutral-600">
                      Total purchases
                    </Typography>
                    <Typography variant="c1-bold" color="secondary-500">
                      {formatCurrency(c.stats.totalPurchases, 'comma') ?? '₦0'}
                    </Typography>
                  </Box>
                  <Box
                    flexDirection="row"
                    justifyContent="space-between"
                    mb={8}>
                    <Typography variant="c1" color="neutral-600">
                      Outstanding debt
                    </Typography>
                    {c.stats.outstanding <= 0 ? (
                      <Typography variant="c1-bold" color="secondary-500">
                        NO
                      </Typography>
                    ) : (
                      <Typography variant="c1-bold" color="error-100">
                        {formatCurrency(c.stats.outstanding, 'comma')}
                      </Typography>
                    )}
                  </Box>
                  <Box flexDirection="row" justifyContent="space-between">
                    <Typography variant="c1" color="neutral-600">
                      Last purchase
                    </Typography>
                    <Typography variant="c1-bold" color="secondary-500">
                      {formatLastPurchase(c.stats.lastPurchaseIso)}
                    </Typography>
                  </Box>
                </Box>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              !loading ? (
                <EmptyState
                  title="No customers found"
                  description={
                    debouncedSearch
                      ? 'Try a different search.'
                      : 'Add your first customer to get started.'
                  }
                  actionText="Add Customer"
                  onAction={() => addCustomerRef.current?.present()}
                />
              ) : null
            }
            showsVerticalScrollIndicator={false}
          />
        </Box>
      )}

      <FloatingButton onPress={() => addCustomerRef.current?.present()}>
        <AppIcon name="Plus" size={24} color="#fff" />
      </FloatingButton>

      <AddOrEditCustomer ref={addCustomerRef} onSuccess={() => refetch()} />
    </ScreenView>
  )
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120
  }
})

export default Customers
