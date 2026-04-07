import React from 'react'
import {Modal, View, StyleSheet, TouchableOpacity} from 'react-native'

interface CenterdModalProps {
  show: boolean
  onClose?: () => void
  children?: React.ReactNode
}

export const CenterdModal = ({show, onClose, children}: CenterdModalProps) => {
  return (
    <Modal visible={show} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.container}>
          <TouchableOpacity activeOpacity={1}>{children}</TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center'},
  container: {backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '90%'},
})

export default CenterdModal
