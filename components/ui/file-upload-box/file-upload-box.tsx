import {Image} from 'expo-image'
import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import AppIcon from '../app-icon'

interface FileUploadBoxProps {
  /** URI of selected image */
  value?: string | null
  /** 'full' = wide/tall banner, default = small square slot */
  variant?: 'full' | 'default'
  label?: string
  onChange?: () => void
  onRemove?: () => void
  showRemove?: boolean
  readOnly?: boolean
}

export const FileUploadBox = ({
  value,
  variant = 'default',
  label = 'Browse and select image cover',
  onChange,
  onRemove,
  showRemove,
  readOnly,
}: FileUploadBoxProps) => {
  const isFull = variant === 'full'

  if (value) {
    return (
      <View style={[styles.base, isFull ? styles.fullContainer : styles.slotContainer]}>
        <Image
          source={{uri: value}}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
        {showRemove && !readOnly && (
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={onRemove}
            hitSlop={{top: 6, right: 6, bottom: 6, left: 6}}>
            <AppIcon name="X" size={12} color="#fff" />
          </TouchableOpacity>
        )}
        {!readOnly && (
          <TouchableOpacity
            style={[StyleSheet.absoluteFill, styles.replaceOverlay]}
            onPress={onChange}
            activeOpacity={0.7}
          />
        )}
      </View>
    )
  }

  return (
    <TouchableOpacity
      activeOpacity={readOnly ? 1 : 0.7}
      onPress={readOnly ? undefined : onChange}
      style={[styles.base, styles.emptyBase, isFull ? styles.fullContainer : styles.slotContainer]}>
      {isFull ? (
        <>
          <AppIcon name="Upload" size={24} color="#94A3B8" />
          <Text style={styles.label}>{label}</Text>
        </>
      ) : (
        <AppIcon name="Upload" size={18} color="#94A3B8" />
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  emptyBase: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  fullContainer: {
    width: '100%',
    height: 110,
  },
  slotContainer: {
    flex: 1,
    aspectRatio: 1,
    minHeight: 64,
  },
  label: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    fontFamily: 'InstrumentSans_400Regular',
  },
  removeBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 20,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  replaceOverlay: {
    backgroundColor: 'transparent',
  },
})

export default FileUploadBox
