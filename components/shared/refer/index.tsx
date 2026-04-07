import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import * as Clipboard from 'expo-clipboard'
import toast from '@/utils/toast'

interface ReferProps {
  referralCode?: string
  referralLink?: string
}

export const Refer = ({referralCode, referralLink}: ReferProps) => {
  const handleCopy = async () => {
    const toCopy = referralLink || referralCode || ''
    await Clipboard.setStringAsync(toCopy)
    toast.info('Copied to clipboard!')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your referral code</Text>
      <View style={styles.codeRow}>
        <Text style={styles.code}>{referralCode || '—'}</Text>
        <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
          <Text style={styles.copyText}>Copy</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {backgroundColor: '#EFF4FF', borderRadius: 12, padding: 16},
  label: {fontSize: 12, color: '#94A3B8', marginBottom: 8},
  codeRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  code: {fontSize: 18, fontWeight: '700', color: '#142952', letterSpacing: 2},
  copyBtn: {backgroundColor: '#2554C7', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8},
  copyText: {color: '#fff', fontWeight: '600', fontSize: 13},
})

export default Refer
