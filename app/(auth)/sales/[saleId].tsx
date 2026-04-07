import {
  AppIcon,
  AppModal,
  AppPressable,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  PageError,
  PushaActivityIndicator,
  TextField,
  Typography
} from '@/components/ui'
import {KeyboardAwareScrollView} from '@/components/util/keyboard-aware-scroll-view'
import {ScreenView} from '@/components/util/screen-view'
import {
  type ISaleOrder,
  type ISalePayment,
  useGetSale,
  useUpdateSale
} from '@/queries/salesQuery'
import {
  usePaymentsActions,
  usePaymentsLoadingState
} from '@/store/paymentsStore'
import {Modal} from '@/types/modal'
import {QUERY_KEYS} from '@/constants/queryKeys'
import {queryClient} from '@/utils/queryClient'
import {Image} from 'expo-image'
import {useLocalSearchParams} from 'expo-router'
import {StatusBar} from 'expo-status-bar'
import React, {useRef, useState} from 'react'
import {ActionSheetIOS, Alert, Platform, StyleSheet} from 'react-native'

// ─── helpers ────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return (
    '₦' + Number(value ?? 0).toLocaleString('en-NG', {minimumFractionDigits: 2})
  )
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function capitalize(str: string): string {
  if (!str) return '—'
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

type BadgeColor = 'neutral' | 'success' | 'blue' | 'error' | 'caution'

function paymentBadgeColor(status: string): BadgeColor {
  switch (status?.toUpperCase()) {
    case 'PAID':
    case 'CONFIRMED':
      return 'success'
    case 'PENDING':
      return 'caution'
    case 'FAILED':
    case 'DECLINED':
      return 'error'
    default:
      return 'neutral'
  }
}

function stageBadgeColor(status: string): BadgeColor {
  switch (status?.toUpperCase()) {
    case 'COMPLETED':
      return 'success'
    case 'CONFIRMED':
      return 'blue'
    case 'PENDING':
      return 'caution'
    default:
      return 'neutral'
  }
}

function deliveryBadgeColor(status: string): BadgeColor {
  switch (status?.toUpperCase()) {
    case 'DELIVERED':
      return 'success'
    case 'SHIPPED':
      return 'blue'
    default:
      return 'neutral'
  }
}

function getCustomerName(sale: ISaleOrder): string {
  if (!sale.customer) return '—'
  const parts = [sale.customer.first_name, sale.customer.last_name].filter(
    Boolean
  )
  return parts.join(' ') || '—'
}

// ─── sub-components ─────────────────────────────────────────────────────────

const SectionCard = ({
  title,
  children
}: {
  title: string
  children: React.ReactNode
}) => (
  <Box
    backgroundColor="white"
    borderRadius={8}
    borderWidth={1}
    style={styles.cardBorder}
    overflow="hidden"
    mb={12}>
    <Box
      paddingHorizontal={16}
      paddingVertical={12}
      style={styles.cardHeaderBg}
      borderBottomWidth={1}
      borderBottomColor="stroke">
      <Typography variant="c2-bold" style={styles.cardTitle}>
        {title.toUpperCase()}
      </Typography>
    </Box>
    {children}
  </Box>
)

const DetailRow = ({
  icon,
  label,
  value,
  badgeColor,
  badgeLabel
}: {
  icon: string
  label: string
  value?: string
  badgeColor?: BadgeColor
  badgeLabel?: string
}) => (
  <Box
    flexDirection="row"
    alignItems="center"
    justifyContent="space-between"
    paddingHorizontal={16}
    paddingVertical={13}
    gap={12}>
    <Box flexDirection="row" alignItems="center" gap={10} flex={1}>
      <Box
        width={30}
        height={30}
        borderRadius={8}
        style={styles.iconBg}
        alignItems="center"
        justifyContent="center">
        <AppIcon name={icon as any} size={14} color="#64748B" />
      </Box>
      <Typography variant="body" color="neutral-500">
        {label}
      </Typography>
    </Box>
    {badgeColor && badgeLabel ? (
      <Badge variant="light" color={badgeColor} label={badgeLabel} />
    ) : (
      <Typography
        variant="c1-medium"
        color="secondary-500"
        style={styles.rowValue}
        numberOfLines={2}>
        {value ?? '—'}
      </Typography>
    )}
  </Box>
)

const RowDivider = () => <Divider marginHorizontal={16} color="#F1F5F9" />

// ─── main screen ────────────────────────────────────────────────────────────

const DELIVERY_OPTIONS = ['PENDING', 'SHIPPED', 'DELIVERED']

export default function SaleDetailScreen() {
  const {saleId} = useLocalSearchParams<{saleId: string}>()
  const {data: sale, isLoading, isError, refetch} = useGetSale(saleId)
  const updateSale = useUpdateSale()
  const [updatingDelivery, setUpdatingDelivery] = useState(false)

  // Record payment
  const recordPaymentRef = useRef<Modal>(null)
  const paymentsActions = usePaymentsActions()
  const paymentsLoading = usePaymentsLoadingState()
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentReference, setPaymentReference] = useState('')

  const handleUpdateDelivery = () => {
    if (!sale) return
    const current = sale.delivery_status ?? 'PENDING'
    const options = DELIVERY_OPTIONS.filter(o => o !== current.toUpperCase())

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [...options, 'Cancel'],
          cancelButtonIndex: options.length,
          title: 'Update Delivery Status'
        },
        async idx => {
          if (idx < options.length) await doUpdate(options[idx])
        }
      )
    } else {
      Alert.alert('Update Delivery Status', undefined, [
        ...options.map(o => ({
          text: capitalize(o),
          onPress: () => doUpdate(o)
        })),
        {text: 'Cancel', style: 'cancel'}
      ])
    }
  }

  const doUpdate = async (status: string) => {
    setUpdatingDelivery(true)
    try {
      await updateSale.mutateAsync({saleId, payload: {delivery_status: status}})
    } finally {
      setUpdatingDelivery(false)
    }
  }

  const openRecordPayment = (remainingAmount: number) => {
    setPaymentAmount(String(remainingAmount > 0 ? remainingAmount : ''))
    setPaymentReference('')
    recordPaymentRef.current?.present()
  }

  const handleRecordPayment = () => {
    if (!sale) return

    const amount = Number(paymentAmount)
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid payment amount.')
      return
    }
    if (!paymentReference.trim()) {
      Alert.alert('Reference required', 'Please enter a payment reference.')
      return
    }

    const customerName = getCustomerName(sale)
    paymentsActions.createPayment(
      {
        sale_id: sale.id,
        customer_id: sale.customer_id ?? undefined,
        customer_name: customerName,
        amount,
        method: 'MANUAL',
        status: 'CONFIRMED',
        sale_channel: sale.sale_channel ?? 'MANUAL',
        reference: paymentReference.trim(),
        sale_items: sale.sale_items.map(i => ({
          product_id: i.product_id,
          quantity: i.quantity,
          price: i.unit_price
        }))
      },
      () => {
        recordPaymentRef.current?.dismiss()
        queryClient.invalidateQueries({queryKey: [QUERY_KEYS.SALE, saleId]})
        queryClient.invalidateQueries({queryKey: [QUERY_KEYS.SALES]})
      }
    )
  }

  if (isLoading) {
    return (
      <ScreenView navTitle="Order Details" hasTopBanner={false}>
        <Box flex={1} alignItems="center" justifyContent="center">
          <PushaActivityIndicator />
        </Box>
      </ScreenView>
    )
  }

  if (isError || !sale) {
    return (
      <ScreenView navTitle="Order Details" hasTopBanner={false}>
        <PageError reload={() => refetch().then(() => {})} />
      </ScreenView>
    )
  }

  const customerName = getCustomerName(sale)
  const payments: ISalePayment[] = Array.isArray(sale.payments)
    ? sale.payments
    : []
  const amountPaid = payments.reduce((sum, p) => sum + (p.amount ?? 0), 0)
  const amountOwed = Math.max(sale.total_amount - amountPaid, 0)

  return (
    <ScreenView navTitle={sale.order_id} hasTopBanner={false}>
      <StatusBar style="dark" animated />
      <KeyboardAwareScrollView>
        <Container>
          {/* ── Order summary card ── */}
          <Box
            backgroundColor="white"
            borderRadius={8}
            borderWidth={1}
            style={styles.cardBorder}
            overflow="hidden"
            my={12}>
            <Box
              paddingHorizontal={16}
              paddingVertical={14}
              style={styles.cardHeaderBg}
              borderBottomWidth={1}
              borderBottomColor="stroke">
              <Typography variant="body-semibold" color="neutral-500">
                {sale.order_id}
              </Typography>
              <Typography variant="c1" color="neutral-400" mt={2}>
                {formatDate(sale.sale_date)}
              </Typography>
            </Box>

            {sale.sale_items.map((item, idx) => (
              <Box
                key={item.id ?? idx}
                flexDirection="row"
                alignItems="center"
                paddingHorizontal={16}
                paddingVertical={14}
                gap={12}
                borderBottomWidth={idx < sale.sale_items.length - 1 ? 1 : 0}
                borderBottomColor="stroke">
                <Box
                  width={52}
                  height={52}
                  borderRadius={10}
                  overflow="hidden"
                  style={styles.itemImageBg}
                  alignItems="center"
                  justifyContent="center">
                  {item.product_image ? (
                    <Image
                      source={{uri: item.product_image}}
                      style={styles.fillImage}
                      contentFit="cover"
                    />
                  ) : (
                    <AppIcon name="Package" size={20} color="#94A3B8" />
                  )}
                </Box>

                <Box flex={1} gap={3}>
                  <Typography
                    variant="c1-semibold"
                    color="secondary-500"
                    numberOfLines={2}>
                    {item.product_name}
                  </Typography>
                  <Typography variant="c2" color="neutral-500">
                    {item.quantity} × {formatCurrency(item.unit_price)}
                  </Typography>
                </Box>

                <Typography variant="c1-bold" color="secondary-500">
                  {formatCurrency(item.total_price)}
                </Typography>
              </Box>
            ))}

            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              paddingHorizontal={16}
              paddingVertical={14}
              style={styles.totalBg}
              borderTopWidth={1}
              borderTopColor="stroke">
              <Typography variant="body-medium" color="neutral-500">
                Total
              </Typography>
              <Typography variant="h3-bold" color="secondary-500">
                {formatCurrency(sale.total_amount)}
              </Typography>
            </Box>

            {amountOwed > 0 && (
              <Box
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                paddingHorizontal={16}
                paddingBottom={14}
                style={styles.totalBg}>
                <Typography variant="c1-medium" style={{color: '#D70015'}}>
                  Amount owed
                </Typography>
                <Typography variant="c1-bold" style={{color: '#D70015'}}>
                  {formatCurrency(amountOwed)}
                </Typography>
              </Box>
            )}
          </Box>

          {/* ── Status card ── */}
          <SectionCard title="Status">
            <DetailRow
              icon="CircleDot"
              label="Order stage"
              badgeColor={stageBadgeColor(sale.status)}
              badgeLabel={capitalize(sale.status)}
            />
            <RowDivider />
            <DetailRow
              icon="CreditCard"
              label="Payment"
              badgeColor={paymentBadgeColor(sale.payment_status)}
              badgeLabel={capitalize(sale.payment_status)}
            />
            <RowDivider />
            <DetailRow
              icon="Truck"
              label="Delivery"
              badgeColor={deliveryBadgeColor(sale.delivery_status ?? 'PENDING')}
              badgeLabel={capitalize(sale.delivery_status ?? 'PENDING')}
            />
          </SectionCard>

          {/* ── Payment records ── */}
          {payments.length > 0 && (
            <SectionCard title={`Payment${payments.length > 1 ? 's' : ''}`}>
              {payments.map((payment, idx) => (
                <Box key={payment.id ?? idx}>
                  {payments.length > 1 && (
                    <Typography
                      variant="c2"
                      color="neutral-400"
                      mt={12}
                      ml={16}>
                      Payment #{idx + 1}
                    </Typography>
                  )}
                  <DetailRow
                    icon="CircleCheckBig"
                    label="Status"
                    badgeColor={paymentBadgeColor(payment.status)}
                    badgeLabel={capitalize(payment.status)}
                  />
                  <RowDivider />
                  <DetailRow
                    icon="Wallet"
                    label="Method"
                    value={capitalize(payment.method ?? '')}
                  />
                  <RowDivider />
                  <DetailRow
                    icon="DollarSign"
                    label="Amount"
                    value={formatCurrency(payment.amount)}
                  />
                  <RowDivider />
                  <DetailRow
                    icon="ArrowDownToLine"
                    label="Settled"
                    value={formatCurrency(payment.amount_settled)}
                  />
                  {payment.reference ? (
                    <>
                      <RowDivider />
                      <DetailRow
                        icon="Hash"
                        label="Reference"
                        value={payment.reference}
                      />
                    </>
                  ) : null}
                  {payment.paid_at ? (
                    <>
                      <RowDivider />
                      <DetailRow
                        icon="Clock"
                        label="Paid at"
                        value={formatDate(payment.paid_at)}
                      />
                    </>
                  ) : null}
                  {idx < payments.length - 1 && (
                    <Box height={8} style={styles.sectionSeparator} />
                  )}
                </Box>
              ))}
            </SectionCard>
          )}

          {/* ── Details card ── */}
          <SectionCard title="Details">
            <DetailRow icon="User" label="Customer" value={customerName} />
            <RowDivider />
            <DetailRow
              icon="ShoppingBag"
              label="Channel"
              value={capitalize(sale.sale_channel ?? '')}
            />
            <RowDivider />
            <DetailRow icon="Hash" label="Order ID" value={sale.order_id} />
            {sale.note ? (
              <>
                <RowDivider />
                <DetailRow icon="FileText" label="Note" value={sale.note} />
              </>
            ) : null}
          </SectionCard>

          {/* ── Record payment (only when amount is still owed) ── */}
          {amountOwed > 0 && (
            <AppPressable
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              backgroundColor="#142952"
              borderRadius={12}
              paddingHorizontal={16}
              paddingVertical={14}
              style={styles.recordPaymentBtn}
              onPress={() => openRecordPayment(amountOwed)}>
              <AppIcon name="CreditCard" size={16} color="#fff" />
              <Typography
                variant="body-semibold"
                color="white"
                style={styles.recordPaymentBtnText}>
                Record Payment · {formatCurrency(amountOwed)} owed
              </Typography>
              <AppIcon name="ChevronRight" size={16} color="#fff" />
            </AppPressable>
          )}

          {/* ── Update delivery status ── */}
          <AppPressable
            marginTop={12}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            backgroundColor="#EEF2FF"
            borderRadius={12}
            paddingHorizontal={16}
            paddingVertical={14}
            style={styles.deliveryBtn}
            onPress={handleUpdateDelivery}
            disabled={updatingDelivery}>
            <AppIcon name="Truck" size={16} color="#2554C7" />
            <Typography variant="body-semibold" style={styles.deliveryBtnText}>
              {updatingDelivery ? 'Updating…' : 'Update Delivery Status'}
            </Typography>
            <AppIcon name="ChevronRight" size={16} color="#2554C7" />
          </AppPressable>
        </Container>
      </KeyboardAwareScrollView>

      {/* ── Record Payment bottom sheet ── */}
      <AppModal
        ref={recordPaymentRef}
        title="Record Payment"
        snapPoints={['50%']}
        footer={() => (
          <Button
            label="Record Payment"
            onPress={handleRecordPayment}
            loading={paymentsLoading.createPayment}
          />
        )}>
        <Box gap={16}>
          {sale && (
            <Box
              backgroundColor="neutral-100"
              borderRadius={10}
              padding={12}
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center">
              <Typography variant="c1" color="neutral-500">
                {sale.order_id}
              </Typography>
              <Typography variant="c1-semibold" style={{color: '#D70015'}}>
                {formatCurrency(amountOwed)} remaining
              </Typography>
            </Box>
          )}

          <TextField
            name="paymentAmount"
            label="Amount (₦)"
            placeholder="Enter amount"
            keyboardType="decimal-pad"
            value={paymentAmount}
            onChangeText={setPaymentAmount}
          />

          <TextField
            name="paymentReference"
            label="Reference"
            placeholder="Enter payment reference"
            value={paymentReference}
            onChangeText={setPaymentReference}
          />
        </Box>
      </AppModal>
    </ScreenView>
  )
}

// ─── styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 12
  },
  cardBorder: {
    borderColor: '#E2E8F0'
  },
  cardHeaderBg: {
    backgroundColor: '#FAFBFC'
  },
  cardTitle: {
    color: '#64748B',
    letterSpacing: 0.6
  },
  iconBg: {
    backgroundColor: '#F1F5F9'
  },
  rowValue: {
    textAlign: 'right',
    maxWidth: '55%'
  },
  itemImageBg: {
    backgroundColor: '#F8FAFC'
  },
  fillImage: {
    width: '100%',
    height: '100%'
  },
  totalBg: {
    backgroundColor: '#F8FAFC'
  },
  sectionSeparator: {
    backgroundColor: '#F8FAFC'
  },
  recordPaymentBtn: {
    marginBottom: 12
  },
  recordPaymentBtnText: {
    flex: 1,
    marginLeft: 10,
    color: '#fff'
  },
  deliveryBtn: {
    marginBottom: 12
  },
  deliveryBtnText: {
    flex: 1,
    marginLeft: 10,
    color: '#2554C7'
  }
})
