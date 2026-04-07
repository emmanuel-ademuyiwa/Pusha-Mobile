import Activity from '@/components/screens/dashboard/activity'
import {StatsCard} from '@/components/shared/stats-card'
import {FloatingButton} from '@/components/shared/floating-button'
import {
  AppIcon,
  Avatar,
  Box,
  Container,
  PageError,
  PeriodFilter,
  PushaActivityIndicator,
  Typography
} from '@/components/ui'
import {PlatformSalesChart, BarItem} from '@/components/ui/platform-sales-chart'
import {SectionHeader} from '@/components/ui/section-header'
import {DashboardFilter} from '@/libs'
import {
  useDashboardStats,
  useRecentActivities,
  useTopProducts
} from '@/queries/analyticsQuery'
import {useGetNotifications} from '@/queries/notificationsQuery'
import {useGetWalletBalance} from '@/queries/walletQuery'
import {useListSales, type ISaleOrder} from '@/queries/salesQuery'
import {
  useGetChats,
  useTakeOverChat,
  useHandOverChat,
  type IChatSession
} from '@/queries/chatsQuery'
import {useListCustomers} from '@/queries/customersQuery'
import {formatCurrency} from '@/utils/currency'
import {getRelativeTimeText} from '@/utils/datetime'
import {getFromVault} from '@/utils/storage'
import {router} from 'expo-router'
import {StatusBar} from 'expo-status-bar'
import React, {useMemo, useState} from 'react'
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native'
import {Image} from 'expo-image'
import {ScreenView} from '@/components/util/screen-view'
import { KeyboardAwareScrollView } from '@/components/util/keyboard-aware-scroll-view';

// ─── Types ───────────────────────────────────────────────────────────────────

type MainPeriod = 'today' | 'this-week' | 'this-month' | 'all'

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
  {key: 'saturday', label: 'SA'}
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getPeriodRange = (period: MainPeriod | DashboardFilter) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  switch (period) {
    case 'today':
      return {
        start: today.toISOString(),
        end: new Date(today.getTime() + 86_400_000 - 1).toISOString()
      }
    case 'this-week': {
      const startOfWeek = new Date(
        today.getTime() - today.getDay() * 86_400_000
      )
      return {
        start: startOfWeek.toISOString(),
        end: new Date(startOfWeek.getTime() + 7 * 86_400_000 - 1).toISOString()
      }
    }
    case 'this-month': {
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
    }
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
    case 'this-month': {
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

// ─── New section helpers ──────────────────────────────────────────────────────

const PAYMENT_STATUS_CONFIG: Record<
  string,
  {bg: string; text: string; label: string}
> = {
  PAID: {bg: '#F6FDF8', text: '#20B038', label: 'Paid'},
  PENDING: {bg: '#FFF9EC', text: '#F0960F', label: 'Pending'},
  FAILED: {bg: '#FFF5F6', text: '#D70015', label: 'Failed'}
}

const getPaymentBadge = (status: string) =>
  PAYMENT_STATUS_CONFIG[status?.toUpperCase()] ?? PAYMENT_STATUS_CONFIG.PENDING

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

const getChatCustomerName = (chat: IChatSession): string => {
  if (chat.customer) {
    const full =
      `${chat.customer.first_name ?? ''} ${chat.customer.last_name ?? ''}`.trim()
    if (full) return full
    if (chat.customer.email) return chat.customer.email
    if (chat.customer.phone_number) return chat.customer.phone_number
  }
  return `Customer ${(chat.customer_id ?? chat.id).slice(0, 6)}`
}

const getChatInitial = (chat: IChatSession): string => {
  if (chat.customer?.first_name)
    return chat.customer.first_name[0].toUpperCase()
  if (chat.customer?.email) return chat.customer.email[0].toUpperCase()
  return 'C'
}

const getOrderCustomerName = (order: ISaleOrder): string => {
  if (order.customer) {
    const full =
      `${order.customer.first_name} ${order.customer.last_name ?? ''}`.trim()
    if (full) return full
  }
  return `Order ${order.order_id}`
}

const getOrderSummary = (order: ISaleOrder): string => {
  const items = order.sale_items ?? []
  if (items.length === 0) return '—'
  const first = items[0].product_name
  return items.length > 1 ? `${first} +${items.length - 1} more` : first
}

// ─── Component ───────────────────────────────────────────────────────────────

const Dashboard = () => {
  const user: any = getFromVault('user')

  const [mainPeriod, setMainPeriod] = useState<MainPeriod>('today')
  const [chartPeriod, setChartPeriod] = useState<DashboardFilter>(
    DashboardFilter.thisWeek
  )
  const [productsPeriod, setProductsPeriod] = useState<DashboardFilter>(
    DashboardFilter.today
  )

  const currentRange = useMemo(() => getPeriodRange(mainPeriod), [mainPeriod])
  const prevRange = useMemo(() => getPrevRange(mainPeriod), [mainPeriod])
  const chartRange = useMemo(
    () => getPeriodRange(chartPeriod as MainPeriod),
    [chartPeriod]
  )
  const productsRange = useMemo(
    () => getPeriodRange(productsPeriod as MainPeriod),
    [productsPeriod]
  )

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

  const {data: topProducts} = useTopProducts({
    period: productsPeriod,
    limit: 5,
    date_from: productsRange.start,
    date_to: productsRange.end
  })

  const {data: activities} = useRecentActivities({
    limit: 6,
    date_from: currentRange.start,
    date_to: currentRange.end
  })

  const {data: notifications} = useGetNotifications(1, 50)
  const unreadCount =
    notifications?.records?.filter((n: any) => !n.read_at).length ?? 0

  // ── New data sources ──────────────────────────────────────────────────────
  const {data: wallet, isLoading: walletLoading} = useGetWalletBalance()
  const {data: recentSalesData, isLoading: recentSalesLoading} = useListSales({
    page: 1,
    limit: 20
  })
  const {data: chatsData} = useGetChats({page: 1, limit: 10})
  const {data: customersData} = useListCustomers({page: 1, limit: 1})
  const takeOverMutation = useTakeOverChat()
  const handOverMutation = useHandOverChat()

  // ── Derived ───────────────────────────────────────────────────────────────
  const recentOrders: ISaleOrder[] = useMemo(
    () => recentSalesData?.records?.slice(0, 6) ?? [],
    [recentSalesData]
  )

  const recentChats: IChatSession[] = useMemo(
    () =>
      [...(chatsData?.records ?? [])]
        .sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )
        .slice(0, 2),
    [chatsData]
  )

  const customerCount: number | null = useMemo(
    () => (customersData as any)?.pagination?.total ?? null,
    [customersData]
  )

  const productsSold = useMemo(
    () =>
      (recentSalesData?.records ?? []).reduce(
        (sum, sale) =>
          sum +
          (sale.sale_items?.reduce((s, item) => s + (item.quantity ?? 0), 0) ??
            0),
        0
      ),
    [recentSalesData]
  )

  const topChannels = useMemo(
    () => buildTopChannels(recentSalesData?.records ?? []),
    [recentSalesData]
  )

  // ── Period-based stats ────────────────────────────────────────────────────
  const salesChange = useMemo(() => {
    const curr = stats?.totalSales ?? 0
    const prev = prevStats?.totalSales ?? 0
    if (prev === 0) return null
    const pct = Math.round(((curr - prev) / prev) * 100)
    return {
      pct: Math.abs(pct),
      trend: pct >= 0 ? ('up' as const) : ('down' as const)
    }
  }, [stats?.totalSales, prevStats?.totalSales])

  const ordersChange = useMemo(() => {
    const curr = stats?.pendingOrders ?? 0
    const prev = prevStats?.pendingOrders ?? 0
    if (prev === 0) return null
    const pct = Math.round(((curr - prev) / prev) * 100)
    return {
      pct: Math.abs(pct),
      trend: pct >= 0 ? ('up' as const) : ('down' as const)
    }
  }, [stats?.pendingOrders, prevStats?.pendingOrders])

  const barData = useMemo(
    () => buildBarData(chartStats?.salesData, chartPeriod),
    [chartStats?.salesData, chartPeriod]
  )

  if (isError) return <PageError reload={() => refetch().then(() => {})} />

  return (
    <ScreenView
      headerAction={
        <Box
          pt={16}
          pb={4}
          flex={1}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Box flexDirection="row" alignItems="center" gap={10}>
            <Avatar
              src={user?.avatar ?? user?.profile_photo}
              name={
                user?.first_name
                  ? `${user.first_name} ${user.last_name ?? ''}`
                  : 'User'
              }
              size={44}
            />
            <Box>
              <Typography variant="c1-medium" color="secondary-500">
                Hello, {user?.first_name ?? 'there'}
              </Typography>
              <Typography variant="c2" color="neutral-600">
                Here&apos;s what your business has been up to
              </Typography>
            </Box>
          </Box>

          {/* Notification bell */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/(auth)/notifications' as any)}>
            <Box style={styles.bellWrapper}>
              <AppIcon name="Bell" size={20} color="#142952" />
              {unreadCount > 0 && (
                <Box style={styles.bellBadge}>
                  <Typography
                    variant="c2-bold"
                    color="white"
                    style={{fontSize: 9, lineHeight: 14}}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Typography>
                </Box>
              )}
            </Box>
          </TouchableOpacity>
        </Box>
      }
      backButton={false}
      hasTopBanner={false}
      footerPadding={false}>
      <StatusBar style="dark" animated />

      <KeyboardAwareScrollView >
        <Container>
          {/* ── Header ── */}

          {/* ── Title ── */}
          <Typography variant="h2-bold" color="secondary-500" mt={12} mb={16}>
            Dashboard
          </Typography>

          {/* ── Period tabs ── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsScroll}>
            <Box flexDirection="row" alignItems="center" gap={8} pb={4}>
              {PERIOD_TABS.map(({key, label}) => (
                <TouchableOpacity
                  key={key}
                  activeOpacity={0.8}
                  onPress={() => setMainPeriod(key)}>
                  <Box
                    paddingHorizontal={16}
                    paddingVertical={8}
                    borderRadius={20}
                    style={[
                      styles.periodTab,
                      mainPeriod === key && styles.periodTabActive
                    ]}>
                    <Typography
                      variant="c1-medium"
                      color={mainPeriod === key ? 'white' : 'neutral-600'}>
                      {label}
                    </Typography>
                  </Box>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setMainPeriod('all')}>
                <Box paddingHorizontal={8} paddingVertical={8}>
                  <Typography variant="c1-medium" color="primary-100">
                    See all
                  </Typography>
                </Box>
              </TouchableOpacity>
            </Box>
          </ScrollView>
        </Container>

        <Container>
          <Box gap={16} pb={100} mt={8}>
            {/* ── Business Overview ── */}
            {statsLoading ? (
              <Box height={72} alignItems="center" justifyContent="center">
                <PushaActivityIndicator />
              </Box>
            ) : (
              <Box flexDirection="row" gap={10}>
                <StatsCard
                  title="Total Orders"
                  value={stats?.totalOrders ?? 0}
                  icon={<AppIcon name="ShoppingCart" size={18} color="#2554CF" />}
                />
                <StatsCard
                  title="Customers"
                  value={customerCount ?? '—'}
                  icon={<AppIcon name="Users" size={18} color="#9810FA" />}
                />
                <StatsCard
                  title="Units Sold"
                  value={productsSold}
                  icon={<AppIcon name="Package" size={18} color="#00A63E" />}
                />
              </Box>
            )}

            {/* ── Stats cards (period-filtered) ── */}
            {statsLoading ? (
              <Box height={96} alignItems="center" justifyContent="center">
                <PushaActivityIndicator />
              </Box>
            ) : (
              <Box flexDirection="row" gap={12}>
                <StatsCard
                  title="Total Sales"
                  value={`₦${Number(stats?.totalSales ?? 0).toLocaleString()}`}
                  icon={<AppIcon name="Receipt" size={18} color="#94A3B8" />}
                  trend={salesChange?.trend}
                  changePercent={salesChange?.pct}
                  changeSuffix={getChangeSuffix(mainPeriod)}
                />
                <StatsCard
                  title="Pending Orders"
                  value={stats?.pendingOrders ?? 0}
                  icon={
                    <AppIcon name="ClipboardList" size={18} color="#94A3B8" />
                  }
                  trend={ordersChange?.trend}
                  changePercent={ordersChange?.pct}
                  changeSuffix={getChangeSuffix(mainPeriod)}
                />
              </Box>
            )}

            {/* ── Financial Overview ── */}
            <Box gap={10}>
              <Typography variant="body-semibold" color="secondary-500">
                Financial Overview
              </Typography>
              {walletLoading ? (
                <Box height={96} alignItems="center" justifyContent="center">
                  <PushaActivityIndicator />
                </Box>
              ) : (
                <>
                  <Box flexDirection="row" gap={10}>
                    <StatsCard
                      title="Wallet Balance"
                      value={formatCurrency(wallet?.balance ?? 0, 'short') ?? '₦0'}
                      icon={<AppIcon name="Wallet" size={18} color="#FFA500" />}
                    />
                    <StatsCard
                      title="Total Earned"
                      value={formatCurrency(wallet?.total_earned ?? 0, 'short') ?? '₦0'}
                      icon={<AppIcon name="DollarSign" size={18} color="#00A63E" />}
                    />
                  </Box>
                  <Box flexDirection="row" gap={10}>
                    <StatsCard
                      title="Total Settled"
                      value={formatCurrency(wallet?.total_withdrawn ?? 0, 'short') ?? '₦0'}
                      icon={<AppIcon name="CheckCircle" size={18} color="#2554CF" />}
                    />
                    <StatsCard
                      title="Total Owe"
                      value={formatCurrency(wallet?.pending_withdrawals ?? 0, 'short') ?? '₦0'}
                      icon={<AppIcon name="AlertCircle" size={18} color="#D70015" />}
                    />
                  </Box>
                </>
              )}
            </Box>

            {/* ── Sales Overview ── */}
            <Box
              backgroundColor="white"
              borderRadius={12}
              padding={16}
              borderWidth={1}
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
              <PlatformSalesChart data={barData} period={chartPeriod} />
            </Box>

            {/* ── Top Sales Channels ── */}
            <Box
              backgroundColor="white"
              borderRadius={12}
              padding={16}
              borderWidth={1}
              style={{borderColor: '#E9EAEB'}}>
              <Typography variant="body-semibold" color="secondary-500" mb={12}>
                Top Sales Channels
              </Typography>
              {recentSalesLoading ? (
                <Box height={60} alignItems="center" justifyContent="center">
                  <PushaActivityIndicator />
                </Box>
              ) : topChannels.length === 0 ? (
                <Box py={16} alignItems="center">
                  <Typography variant="c1" color="neutral-600">
                    No channel data yet
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

            {/* ── Recent Orders ── */}
            <Box
              backgroundColor="white"
              borderRadius={12}
              padding={16}
              borderWidth={1}
              style={{borderColor: '#E9EAEB'}}>
              <Box
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                mb={12}>
                <Typography variant="body-semibold" color="secondary-500">
                  Recent Orders
                </Typography>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.push('/(auth)/(tabs)/sales' as any)}>
                  <Typography variant="c1-medium" color="primary-100">
                    View all
                  </Typography>
                </TouchableOpacity>
              </Box>
              {recentSalesLoading ? (
                <Box height={60} alignItems="center" justifyContent="center">
                  <PushaActivityIndicator />
                </Box>
              ) : recentOrders.length === 0 ? (
                <Box py={16} alignItems="center">
                  <Typography variant="c1" color="neutral-600">
                    No recent orders
                  </Typography>
                </Box>
              ) : (
                recentOrders.map((order, i) => {
                  const badge = getPaymentBadge(order.payment_status)
                  return (
                    <Box
                      key={order.id}
                      flexDirection="row"
                      alignItems="center"
                      paddingVertical={10}
                      borderBottomWidth={i < recentOrders.length - 1 ? 1 : 0}
                      style={{borderBottomColor: '#F5F5F5'}}>
                      <Box flex={1}>
                        <Typography
                          variant="c1-bold"
                          color="secondary-500"
                          numberOfLines={1}>
                          {getOrderCustomerName(order)}
                        </Typography>
                        <Typography
                          variant="c2"
                          color="neutral-600"
                          mt={1}
                          numberOfLines={1}>
                          {getOrderSummary(order)}
                        </Typography>
                      </Box>
                      <Box alignItems="flex-end" gap={4}>
                        <Box
                          paddingHorizontal={8}
                          paddingVertical={3}
                          borderRadius={12}
                          style={{backgroundColor: badge.bg}}>
                          <Typography
                            variant="c2-bold"
                            style={{color: badge.text}}>
                            {badge.label}
                          </Typography>
                        </Box>
                        <Typography variant="c1-bold" color="secondary-500">
                          ₦{Number(order.total_amount).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  )
                })
              )}
            </Box>

            {/* ── Top Products ── */}
            <Box
              backgroundColor="white"
              borderRadius={12}
              padding={16}
              borderWidth={1}
              style={{borderColor: '#E9EAEB'}}>
              <Box
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                mb={16}>
                <Typography variant="body-semibold" color="secondary-500">
                  Top Products
                </Typography>
                <PeriodFilter
                  variant="tertiary"
                  onChange={p => setProductsPeriod(p)}
                />
              </Box>

              {!topProducts || topProducts.length === 0 ? (
                <Box alignItems="center" py={20}>
                  <Typography variant="c1" color="neutral-600">
                    No products found
                  </Typography>
                </Box>
              ) : (
                topProducts.slice(0, 5).map((product: any, i: number) => (
                  <Box
                    key={product.product_id ?? i}
                    flexDirection="row"
                    alignItems="center"
                    paddingVertical={10}
                    borderBottomWidth={i < topProducts.length - 1 ? 1 : 0}
                    style={{borderBottomColor: '#F5F5F5'}}>
                    {/* Thumbnail */}
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
                      ₦
                      {Number(
                        product.total_revenue ?? product.price ?? 0
                      ).toLocaleString()}
                    </Typography>
                  </Box>
                ))
              )}
            </Box>

            {/* ── Recent Chats ── */}
            <Box backgroundColor="white">
              <Box
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                mb={12}>
                <Typography variant="body-semibold" color="secondary-500">
                  Recent Chats
                </Typography>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.push('/(auth)/(tabs)/chats' as any)}>
                  <Typography variant="c1-medium" color="primary-100">
                    View all
                  </Typography>
                </TouchableOpacity>
              </Box>

              {recentChats.length === 0 ? (
                <Box py={16} alignItems="center">
                  <Typography variant="c1" color="neutral-600">
                    No recent chats
                  </Typography>
                </Box>
              ) : (
                recentChats.map(chat => {
                  const name = getChatCustomerName(chat)
                  const initial = getChatInitial(chat)
                  const channel = chat.channel?.toLowerCase() ?? 'chat'
                  const isAIControlled = chat.ai_controlled !== false
                  const displayChannel = chat.channel
                    ? chat.channel.charAt(0).toUpperCase() +
                      chat.channel.slice(1).toLowerCase()
                    : 'Chat'

                  return (
                    <Box
                      key={chat.id}
                      borderRadius={12}
                      borderWidth={1}
                      padding={12}
                      mb={8}
                      style={{borderColor: '#E9EAEB'}}>
                      <Box flexDirection="row" gap={10} alignItems="flex-start">
                        {/* Avatar */}
                        <Box
                          width={40}
                          height={40}
                          borderRadius={20}
                          alignItems="center"
                          justifyContent="center"
                          backgroundColor="primary-100">
                          <Typography variant="c1-bold" color="white">
                            {initial}
                          </Typography>
                        </Box>

                        <Box flex={1}>
                          <Box
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center">
                            <Typography variant="c1-bold" color="secondary-500">
                              {name}
                            </Typography>
                            {!isAIControlled && (
                              <Box
                                width={8}
                                height={8}
                                borderRadius={4}
                                style={{backgroundColor: '#2554CF'}}
                              />
                            )}
                          </Box>

                          <Box
                            flexDirection="row"
                            alignItems="center"
                            gap={4}
                            mt={4}>
                            <Box
                              width={16}
                              height={16}
                              borderRadius={8}
                              alignItems="center"
                              justifyContent="center"
                              style={{
                                backgroundColor: getChannelColor(channel)
                              }}>
                              <AppIcon
                                name={getChannelIcon(channel) as any}
                                size={9}
                                color="#fff"
                              />
                            </Box>
                            <Typography variant="c2" color="neutral-600">
                              {displayChannel}
                            </Typography>
                            <Typography variant="c2" color="neutral-600">
                              ·
                            </Typography>
                            <Typography variant="c2" color="neutral-600">
                              {getRelativeTimeText(chat.updated_at)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Action buttons */}
                      <Box flexDirection="row" gap={8} mt={10}>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          style={[styles.chatBtn, styles.chatBtnOutline]}
                          onPress={() =>
                            router.push('/(auth)/(tabs)/chats' as any)
                          }>
                          <Typography variant="c1-medium" color="secondary-500">
                            View Chat
                          </Typography>
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          style={[
                            styles.chatBtn,
                            isAIControlled
                              ? styles.chatBtnPrimary
                              : styles.chatBtnOutline
                          ]}
                          onPress={() => {
                            if (isAIControlled) {
                              takeOverMutation.mutate(chat.id)
                            } else {
                              handOverMutation.mutate(chat.id)
                            }
                          }}>
                          <Typography
                            variant="c1-medium"
                            color={isAIControlled ? 'white' : 'secondary-500'}>
                            {isAIControlled ? 'Take Over' : 'Hand Over'}
                          </Typography>
                        </TouchableOpacity>
                      </Box>
                    </Box>
                  )
                })
              )}
            </Box>

            {/* ── Recent Activities ── */}
            <Box>
              <SectionHeader title="Recent Activities" />
              <Box mt={12}>
                <Activity data={activities ?? []} />
              </Box>
            </Box>
          </Box>
        </Container>
      </KeyboardAwareScrollView>

      {/* ── FAB ── */}
      <FloatingButton
        onPress={() => router.push('/(auth)/(tabs)/sales' as any)}>
        <AppIcon name="Plus" size={24} color="#fff" />
      </FloatingButton>
    </ScreenView>
  )
}

const styles = StyleSheet.create({
  tabsScroll: {marginBottom: 4},
  periodTab: {
    backgroundColor: '#F5F5F5'
  },
  periodTabActive: {
    backgroundColor: '#142952'
  },
  bellWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bellBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#D70015',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3
  },
  chatBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  chatBtnOutline: {
    borderWidth: 1,
    borderColor: '#E9EAEB'
  },
  chatBtnPrimary: {
    backgroundColor: '#142952'
  }
})

export default Dashboard
