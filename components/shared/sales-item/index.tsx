import {type ISaleOrder} from '@/queries/salesQuery'
import {Image} from 'expo-image'
import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'

interface SalesItemProps {
  item: ISaleOrder
  onPress?: () => void
}

function getPaymentStatusConfig(paymentStatus: string) {
  switch (paymentStatus.toUpperCase()) {
    case 'PAID':
      return {bg: '#ECFDF5', color: '#1FC16B', label: 'Paid'}
    case 'PENDING':
      return {bg: '#FFFBEB', color: '#F0960F', label: 'Pending'}
    default:
      return {bg: '#F5F5F5', color: '#94A3B8', label: paymentStatus}
  }
}

function getCustomerName(item: ISaleOrder): string {
  if (!item.customer) return 'Unknown Customer'
  const parts = [item.customer.first_name, item.customer.last_name].filter(Boolean)
  return parts.join(' ') || 'Unknown Customer'
}

function getItemsSummary(item: ISaleOrder): string {
  const count = item.sale_items.length
  if (count === 0) return ''
  if (count === 1) return item.sale_items[0].product_name
  return `${item.sale_items[0].product_name} +${count - 1} more`
}

export const SalesItem = ({item, onPress}: SalesItemProps) => {
  const paymentConfig = getPaymentStatusConfig(item.payment_status)
  const firstImage = item.sale_items[0]?.product_image ?? null
  const customerName = getCustomerName(item)
  const itemsSummary = getItemsSummary(item)
  const totalQty = item.sale_items.reduce((sum, s) => sum + s.quantity, 0)

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Product thumbnail */}
      <View style={styles.imageWrapper}>
        {firstImage ? (
          <Image source={{uri: firstImage}} style={styles.image} contentFit="cover" />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
      </View>

      {/* Main info */}
      <View style={styles.info}>
        <Text style={styles.orderRef}>{item.order_id}</Text>
        <Text style={styles.customerName} numberOfLines={1}>
          {customerName}
        </Text>
        {itemsSummary ? (
          <Text style={styles.itemsSummary} numberOfLines={1}>
            {itemsSummary}
          </Text>
        ) : null}
      </View>

      {/* Right: amount + status */}
      <View style={styles.right}>
        <Text style={styles.amount}>
          ₦{Number(item.total_amount).toLocaleString('en-NG', {minimumFractionDigits: 0})}
        </Text>
        <View style={[styles.statusBadge, {backgroundColor: paymentConfig.bg}]}>
          <Text style={[styles.statusText, {color: paymentConfig.color}]}>
            {paymentConfig.label}
          </Text>
        </View>
        {totalQty > 0 ? (
          <Text style={styles.units}>{totalQty} unit{totalQty !== 1 ? 's' : ''}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    gap: 12,
  },
  imageWrapper: {
    width: 52,
    height: 52,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E9EAEB',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  orderRef: {
    fontSize: 11,
    color: '#94A3B8',
    fontFamily: 'InstrumentSans_400Regular',
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#142952',
    fontFamily: 'InstrumentSans_600SemiBold',
  },
  itemsSummary: {
    fontSize: 12,
    color: '#757575',
    fontFamily: 'InstrumentSans_400Regular',
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  amount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#142952',
    fontFamily: 'InstrumentSans_700Bold',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'InstrumentSans_600SemiBold',
  },
  units: {
    fontSize: 11,
    color: '#94A3B8',
    fontFamily: 'InstrumentSans_400Regular',
  },
})

export default SalesItem
