import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

type Status = 'success' | 'error' | 'warning' | 'info' | 'pending'

interface StatusCardProps {
  status: Status
  title: string
  message?: string
  children?: React.ReactNode
}

const STATUS_COLORS: Record<Status, {bg: string; text: string}> = {
  success: {bg: '#F6FDF8', text: '#20B038'},
  error: {bg: '#FFF5F6', text: '#D70015'},
  warning: {bg: '#FFFBEB', text: '#F0960F'},
  info: {bg: '#EFF4FF', text: '#2554C7'},
  pending: {bg: '#F5F5F5', text: '#94A3B8'},
}

export const StatusCard = ({status, title, message, children}: StatusCardProps) => {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.info

  return (
    <View style={[styles.card, {backgroundColor: colors.bg}]}>
      <Text style={[styles.title, {color: colors.text}]}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {borderRadius: 12, padding: 16},
  title: {fontSize: 14, fontWeight: '600'},
  message: {fontSize: 13, color: '#454A53', marginTop: 4},
})

export default StatusCard
