import {StatsCard} from '@/components/shared/stats-card'
import {
  AppIcon,
  Box,
  Container,
  PageError,
  PeriodFilter,
  PeriodTabsRow,
  PushaActivityIndicator,
  Typography
} from '@/components/ui'
import {PlatformSalesChart, BarItem} from '@/components/ui/platform-sales-chart'
import {ScreenView} from '@/components/util/screen-view'
import {DashboardFilter} from '@/libs'
import {
  useDashboardStats,
  usePeriodProfit,
  useTopProducts
} from '@/queries/analyticsQuery'
import {useListCustomers} from '@/queries/customersQuery'
import {useListProducts} from '@/queries/productsQuery'
import {ISaleOrder} from '@/queries/salesQuery'
import {formatCurrency} from '@/utils/currency'
import {api} from '@/api'
import {useQuery} from '@tanstack/react-query'
import {Image} from 'expo-image'
import {router} from 'expo-router'
import {StatusBar} from 'expo-status-bar'
import React, {useMemo, useState} from 'react'
import {TouchableOpacity} from 'react-native'
import {KeyboardAwareScrollView} from '@/components/util/keyboard-aware-scroll-view'

type MainPeriod = 'today' | 'this-week' | 'this-month'

const PERIOD_TABS: {key: MainPeriod; label: string}[] = [
  {key: 'today', label: 'Today'},
  {key: 'this-week', label: 'This week'},
  {key: 'this-month', label: 'This month'}
]

const WEEK_DAYS = [
  {key: 'sunday', label: 'S'},
  {key: 'monday', label: 'M'},
  {key: 'tuesday', label: 'T'},
  {key: 'wednesday', label: 'W'},
  {key: 'thursday', label: 'TH'},
  {key: 'friday', label: 'F'},
  {key: 'saturday', label: 'S'}
]

const getPeriodRange = (period: MainPeriod | DashboardFilter) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  switch (period) {
    case 'today':
    case DashboardFilter.today:
      return {
        start: today.toISOString(),
        end: new Date(today.getTime() + 86_400_000 - 1).toISOString()
      }
    case 'this-week':
    case DashboardFilter.thisWeek:
      return {
        start: new Date(
          today.getTime() - today.getDay() * 86_400_000
        ).toISOString(),
        end: new Date(
          new Date(today.getTime() - today.getDay() * 86_400_000).getTime() +
            7 * 86_400_000 -
            1
        ).toISOString()
      }
    case 'this-month':
    case DashboardFilter.thisMonth:
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
        end: new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59
        ).toISOString()
      }
    case DashboardFilter.allTime:
      return {start: undefined, end: undefined}
    default:
      return {start: undefined, end: undefined}
  }
}

const getPrevRange = (period: MainPeriod) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  switch (period) {
    case 'today': {
      const y = new Date(today.getTime() - 86_400_000)
      return {
        start: y.toISOString(),
        end: new Date(y.getTime() + 86_400_000 - 1).toISOString()
      }
    }
    case 'this-week': {
      const startLastWeek = new Date(
        today.getTime() - (today.getDay() + 7) * 86_400_000
      )
      return {
        start: startLastWeek.toISOString(),
        end: new Date(
          startLastWeek.getTime() + 7 * 86_400_000 - 1
        ).toISOString()
      }
    }
    case 'this-month':
      return {
        start: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString(),
        end: new Date(
          now.getFullYear(),
          now.getMonth(),
          0,
          23,
          59,
          59
        ).toISOString()
      }
    default:
      return {start: undefined, end: undefined}
  }
}

const buildBarData = (salesData: any, period: string): BarItem[] => {
  const todayDow = new Date().getDay()

  if (period === 'today' || period === 'this-week') {
    return WEEK_DAYS.map((day, i) => ({
      value: salesData?.[day.key] ?? 0,
      label: day.label,
      frontColor: i === todayDow ? '#2554CF' : '#C7D7F5'
    }))
  }

  if (period === 'this-month') {
    const weekly = salesData?.weekly ?? {}
    return ['week1', 'week2', 'week3', 'week4'].map((wk, i) => ({
      value: weekly[wk] ?? 0,
      label: `W${i + 1}`,
      frontColor: '#C7D7F5'
    }))
  }

  return WEEK_DAYS.map(day => ({
    value: salesData?.[day.key] ?? 0,
    label: day.label,
    frontColor: '#C7D7F5'
  }))
}

const getChangeSuffix = (period: MainPeriod) => {
  if (period === 'today') return 'from yesterday'
  if (period === 'this-week') return 'from last week'
  return 'from last month'
}

const formatYmd = (iso?: string) =>
  iso ? new Date(iso).toISOString().split('T')[0] : undefined

const buildTopChannels = (orders: ISaleOrder[]) => {
  const map = new Map<string, {orders: number; revenue: number}>()
  orders.forEach(sale => {
    const key = (sale.sale_channel ?? 'other').toLowerCase()
    const existing = map.get(key) ?? {orders: 0, revenue: 0}
    map.set(key, {
      orders: existing.orders + 1,
      revenue: existing.revenue + (sale.total_amount ?? 0)
    })
  })
  return Array.from(map.entries())
    .map(([key, data]) => ({
      channel: key.charAt(0).toUpperCase() + key.slice(1),
      channelKey: key,
      ...data
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
}

const getChannelIcon = (channel: string): string => {
  const c = channel.toLowerCase()
  if (c === 'whatsapp') return 'MessageCircle'
  if (c === 'webchat' || c === 'web') return 'Globe'
  if (c === 'instagram') return 'Instagram'
  return 'ShoppingCart'
}

const getChannelColor = (channel: string): string => {
  const c = channel.toLowerCase()
  if (c === 'whatsapp') return '#25D366'
  if (c === 'webchat' || c === 'web') return '#2554CF'
  if (c === 'instagram') return '#E1306C'
  return '#94A3B8'
}

const Page = () => {
  const [mainPeriod, setMainPeriod] = useState<MainPeriod>('today')
  const [chartPeriod, setChartPeriod] = useState<DashboardFilter>(
    DashboardFilter.today
  )
  const [listsPeriod, setListsPeriod] = useState<DashboardFilter>(
    DashboardFilter.thisWeek
  )

  const currentRange = useMemo(() => getPeriodRange(mainPeriod), [mainPeriod])
  const prevRange = useMemo(() => getPrevRange(mainPeriod), [mainPeriod])
  const chartRange = useMemo(() => getPeriodRange(chartPeriod), [chartPeriod])
  const listsRange = useMemo(() => getPeriodRange(listsPeriod), [listsPeriod])

  const {
    data: stats,
    isLoading: statsLoading,
    isError,
    refetch
  } = useDashboardStats({
    period: mainPeriod,
    date_from: currentRange.start,
    date_to: currentRange.end
  })

  const {data: prevStats} = useDashboardStats({
    period: mainPeriod,
    date_from: prevRange.start,
    date_to: prevRange.end
  })

  const {data: chartStats} = useDashboardStats({
    period: chartPeriod,
    date_from: chartRange.start,
    date_to: chartRange.end
  })

  const {data: totalProfit, isLoading: profitLoading} = usePeriodProfit({
    period: mainPeriod,
    date_from: currentRange.start,
    date_to: currentRange.end
  })

  const {data: prevProfit} = usePeriodProfit({
    period: mainPeriod,
    date_from: prevRange.start,
    date_to: prevRange.end
  })

  const {data: topProducts} = useTopProducts({
    period: listsPeriod,
    limit: 5,
    date_from: listsRange.start,
    date_to: listsRange.end,
    mode: 'top'
  })

  const {data: leastProducts} = useTopProducts({
    period: listsPeriod,
    limit: 5,
    date_from: listsRange.start,
    date_to: listsRange.end,
    mode: 'least'
  })

  const {data: customersData} = useListCustomers({page: 1, limit: 1})
  const customerCount: number | null = customersData?.pagination?.total ?? null

  const {data: productsList, isLoading: productsLoading} = useListProducts({
    page: 1,
    limit: 200
  })

  const {data: channelSalesRecords = [], isLoading: channelSalesLoading} =
    useQuery({
      queryKey: ['bi-channel-sales', listsRange.start, listsRange.end] as const,
      queryFn: async () => {
        const response = await api.sales.listSales({
          date_range: {
            start: formatYmd(listsRange.start),
            end: formatYmd(listsRange.end)
          },
          limit: 500
        })
        return (response?.data?.data?.records ?? []) as ISaleOrder[]
      }
    })

  const lowStockProducts = useMemo(() => {
    const records = productsList?.records ?? []
    return records
      .filter((p: any) => {
        const q = Number(p.quantity ?? 0)
        const alert = Number(p.low_stock_alert)
        const threshold = alert > 0 ? alert : 5
        return q <= threshold
      })
      .sort((a: any, b: any) => Number(a.quantity) - Number(b.quantity))
  }, [productsList?.records])

  const lowStockCount = lowStockProducts.length

  const barData = useMemo(
    () => buildBarData(chartStats?.salesData, chartPeriod),
    [chartStats?.salesData, chartPeriod]
  )

  const salesChange = useMemo(() => {
    const curr = stats?.totalSales ?? 0
    const prev = prevStats?.totalSales ?? 0
    if (prev === 0 && curr === 0) return null
    if (prev === 0) return {pct: 100, trend: 'up' as const}
    const pct = Math.round(((curr - prev) / prev) * 100)
    return {
      pct: Math.abs(pct),
      trend: pct >= 0 ? ('up' as const) : ('down' as const)
    }
  }, [stats?.totalSales, prevStats?.totalSales])

  const ordersCountChange = useMemo(() => {
    const curr = stats?.totalOrders ?? 0
    const prev = prevStats?.totalOrders ?? 0
    if (prev === 0 && curr === 0) return null
    if (prev === 0) return {pct: 100, trend: 'up' as const}
    const pct = Math.round(((curr - prev) / prev) * 100)
    return {
      pct: Math.abs(pct),
      trend: pct >= 0 ? ('up' as const) : ('down' as const)
    }
  }, [stats?.totalOrders, prevStats?.totalOrders])

  const profitChange = useMemo(() => {
    const curr = totalProfit ?? 0
    const prev = prevProfit ?? 0
    if (prev === 0 && curr === 0) return null
    if (prev === 0) return {pct: 100, trend: 'up' as const}
    const pct = Math.round(((curr - prev) / prev) * 100)
    return {
      pct: Math.abs(pct),
      trend: pct >= 0 ? ('up' as const) : ('down' as const)
    }
  }, [totalProfit, prevProfit])

  const topChannels = useMemo(
    () => buildTopChannels(channelSalesRecords),
    [channelSalesRecords]
  )

  const chartPeriodStr = chartPeriod as unknown as string

  if (isError) {
    return (
      <ScreenView
        navTitle="Business Intelligence"
        alignNav="center"
        hasTopBanner={false}>
        <PageError reload={() => refetch().then(() => {})} />
      </ScreenView>
    )
  }

  return (
    <ScreenView
      navTitle="Business Intelligence"
      alignNav="center"
      hasTopBanner={false}>
      <StatusBar style="dark" animated />
      <KeyboardAwareScrollView>
        <Container>
          <PeriodTabsRow
            tabs={PERIOD_TABS}
            selectedKey={mainPeriod}
            onSelect={setMainPeriod}
          />
        </Container>

        <Container>
          <Box pb={24}>
            {statsLoading || profitLoading ? (
              <Box height={200} alignItems="center" justifyContent="center">
                <PushaActivityIndicator />
              </Box>
            ) : (
              <>
                <Box flexDirection="row" gap={10} mb={10}>
                  <Box flex={1}>
                    <StatsCard
                      title="Total Sales"
                      value={
                        formatCurrency(stats?.totalSales ?? 0, 'comma') ?? '₦0'
                      }
                      icon={
                        <AppIcon name="LineChart" size={18} color="#2554CF" />
                      }
                      trend={salesChange?.trend}
                      changePercent={salesChange?.pct}
                      changeSuffix={getChangeSuffix(mainPeriod)}
                    />
                  </Box>
                  <Box flex={1}>
                    <StatsCard
                      title="Total Orders"
                      value={stats?.totalOrders ?? 0}
                      icon={
                        <AppIcon name="ShoppingBag" size={18} color="#2554CF" />
                      }
                      trend={ordersCountChange?.trend}
                      changePercent={ordersCountChange?.pct}
                      changeSuffix={getChangeSuffix(mainPeriod)}
                    />
                  </Box>
                </Box>
                <Box flexDirection="row" gap={10} mb={10}>
                  <Box flex={1}>
                    <StatsCard
                      title="Active Customers"
                      value={customerCount ?? '—'}
                      icon={<AppIcon name="Users" size={18} color="#9810FA" />}
                    />
                  </Box>
                  <Box flex={1}>
                    <StatsCard
                      title="Low Stock Items"
                      value={lowStockCount}
                      icon={
                        <AppIcon name="Package" size={18} color="#94A3B8" />
                      }
                      attentionLabel={
                        lowStockCount > 0 ? 'Need attention' : undefined
                      }
                    />
                  </Box>
                </Box>
                <Box flexDirection="row" gap={10}>
                  <Box flex={1}>
                    <StatsCard
                      title="Pending Orders"
                      value={stats?.pendingOrders ?? 0}
                      icon={<AppIcon name="Store" size={18} color="#94A3B8" />}
                      attentionLabel={
                        (stats?.pendingOrders ?? 0) > 0
                          ? 'Need attention'
                          : undefined
                      }
                    />
                  </Box>
                  <Box flex={1}>
                    <StatsCard
                      title="Total Profit Made"
                      value={formatCurrency(totalProfit ?? 0, 'comma') ?? '₦0'}
                      icon={
                        <AppIcon name="FileText" size={18} color="#00A63E" />
                      }
                      trend={profitChange?.trend}
                      changePercent={profitChange?.pct}
                      changeSuffix={getChangeSuffix(mainPeriod)}
                    />
                  </Box>
                </Box>
              </>
            )}

            <Box
              backgroundColor="white"
              borderRadius={12}
              padding={16}
              borderWidth={1}
              mt={8}
              style={{borderColor: '#E9EAEB'}}>
              <Box
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                mb={16}>
                <Typography variant="body-semibold" color="secondary-500">
                  Sales Overview
                </Typography>
                <PeriodFilter
                  variant="tertiary"
                  onChange={p => setChartPeriod(p)}
                />
              </Box>
              <PlatformSalesChart data={barData} period={chartPeriodStr} />
            </Box>

            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              mt={16}
              mb={4}>
              <Typography variant="c1" color="neutral-600">
                Product & channel insights
              </Typography>
              <PeriodFilter variant="tertiary" onChange={setListsPeriod} />
            </Box>

            <ProductPerformanceSection
              title="Best Selling Products"
              products={topProducts as any[]}
            />

            <ProductPerformanceSection
              title="Least Selling Products"
              products={leastProducts as any[]}
            />

            <Box
              backgroundColor="white"
              borderRadius={12}
              padding={16}
              borderWidth={1}
              mt={16}
              style={{borderColor: '#E9EAEB'}}>
              <Box
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                mb={16}>
                <Typography variant="body-semibold" color="secondary-500">
                  Sales Channel Overview
                </Typography>
              </Box>
              {channelSalesLoading ? (
                <Box height={60} alignItems="center" justifyContent="center">
                  <PushaActivityIndicator />
                </Box>
              ) : topChannels.length === 0 ? (
                <Box py={16} alignItems="center">
                  <Typography variant="c1" color="neutral-600">
                    No channel data for this period
                  </Typography>
                </Box>
              ) : (
                topChannels.map((item, i) => (
                  <Box
                    key={item.channelKey}
                    flexDirection="row"
                    alignItems="center"
                    paddingVertical={10}
                    borderBottomWidth={i < topChannels.length - 1 ? 1 : 0}
                    style={{borderBottomColor: '#F5F5F5'}}>
                    <Box
                      width={36}
                      height={36}
                      borderRadius={18}
                      alignItems="center"
                      justifyContent="center"
                      mr={10}
                      style={{
                        backgroundColor: getChannelColor(item.channelKey)
                      }}>
                      <AppIcon
                        name={getChannelIcon(item.channelKey) as any}
                        size={16}
                        color="#fff"
                      />
                    </Box>
                    <Box flex={1}>
                      <Typography variant="c1-bold" color="secondary-500">
                        {item.channel}
                      </Typography>
                      <Typography variant="c2" color="neutral-600" mt={1}>
                        {item.orders} order{item.orders !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                    <Typography variant="c1-bold" color="secondary-500">
                      {formatCurrency(item.revenue, 'short')}
                    </Typography>
                  </Box>
                ))
              )}
            </Box>

            <Box
              backgroundColor="white"
              borderRadius={12}
              padding={16}
              borderWidth={1}
              mt={16}
              style={{borderColor: '#E9EAEB'}}>
              <Box
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                mb={12}>
                <Typography variant="body-semibold" color="secondary-500">
                  Low Stock Items
                </Typography>
                {lowStockCount > 0 ? (
                  <Box
                    paddingHorizontal={10}
                    paddingVertical={4}
                    borderRadius={12}
                    style={{backgroundColor: '#FFF5F6'}}>
                    <Typography variant="c2-bold" color="error-100">
                      {lowStockCount}
                    </Typography>
                  </Box>
                ) : null}
              </Box>
              {productsLoading ? (
                <Box height={60} alignItems="center" justifyContent="center">
                  <PushaActivityIndicator />
                </Box>
              ) : lowStockProducts.length === 0 ? (
                <Box py={16} alignItems="center">
                  <Typography variant="c1" color="neutral-600">
                    All products are sufficiently stocked
                  </Typography>
                </Box>
              ) : (
                lowStockProducts.slice(0, 5).map((product: any, i: number) => (
                  <Box
                    key={product.id ?? i}
                    flexDirection="row"
                    alignItems="center"
                    paddingVertical={10}
                    borderBottomWidth={
                      i < Math.min(lowStockProducts.length, 5) - 1 ? 1 : 0
                    }
                    style={{borderBottomColor: '#F5F5F5'}}>
                    <Box
                      width={48}
                      height={48}
                      borderRadius={8}
                      backgroundColor="neutral-100"
                      mr={12}
                      overflow="hidden">
                      {product.images?.[0] ? (
                        <Image
                          source={{uri: product.images[0]}}
                          style={{width: 48, height: 48}}
                          contentFit="cover"
                        />
                      ) : null}
                    </Box>
                    <Box flex={1}>
                      <Typography
                        variant="c1-bold"
                        color="secondary-500"
                        numberOfLines={1}>
                        {product.name}
                      </Typography>
                      <Typography variant="c2" color="neutral-600" mt={2}>
                        {Number(product.quantity ?? 0)} left
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push('/(auth)/(more)/products' as any)}>
                <Box
                  mt={12}
                  paddingVertical={14}
                  borderRadius={12}
                  alignItems="center"
                  style={{backgroundColor: '#EDF2FF'}}>
                  <Typography variant="c1-bold" color="primary-100">
                    See all &gt;
                  </Typography>
                </Box>
              </TouchableOpacity>
            </Box>

            <Box height={32} />
          </Box>
        </Container>
      </KeyboardAwareScrollView>
    </ScreenView>
  )
}

function ProductPerformanceSection({
  title,
  products
}: {
  title: string
  products: any[]
}) {
  return (
    <Box
      backgroundColor="white"
      borderRadius={12}
      padding={16}
      borderWidth={1}
      mt={16}
      style={{borderColor: '#E9EAEB'}}>
      <Box mb={16}>
        <Typography variant="body-semibold" color="secondary-500">
          {title}
        </Typography>
      </Box>
      {!products || products.length === 0 ? (
        <Box alignItems="center" py={20}>
          <Typography variant="c1" color="neutral-600">
            No data for this period
          </Typography>
        </Box>
      ) : (
        products.map((product: any, i: number) => (
          <Box
            key={product.product_id ?? i}
            flexDirection="row"
            alignItems="center"
            paddingVertical={10}
            borderBottomWidth={i < products.length - 1 ? 1 : 0}
            style={{borderBottomColor: '#F5F5F5'}}>
            <Box
              width={48}
              height={48}
              borderRadius={8}
              backgroundColor="neutral-100"
              mr={12}
              overflow="hidden">
              {product.image ? (
                <Image
                  source={{uri: product.image}}
                  style={{width: 48, height: 48}}
                  contentFit="cover"
                />
              ) : null}
            </Box>
            <Box flex={1}>
              <Typography
                variant="c1-bold"
                color="secondary-500"
                numberOfLines={1}>
                {product.product_name ?? 'Product'}
              </Typography>
              <Typography variant="c2" color="neutral-600" mt={2}>
                {product.total_quantity ?? 0} units sold
              </Typography>
            </Box>
            <Typography variant="c1-bold" color="secondary-500">
              {formatCurrency(
                product.total_revenue ?? product.price ?? 0,
                'comma'
              )}
            </Typography>
          </Box>
        ))
      )}
    </Box>
  )
}

export default Page
