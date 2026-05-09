import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {AppIcon} from '../app-icon'

const KEY_BG = '#EFEFF4'
const KEY_TEXT = '#142952'
const ICON_SIZE = 26

type KeyDef =
  | {kind: 'digit'; value: string; letters?: string}
  | {kind: 'delete'}
  | {kind: 'biometric'}

const ROWS: KeyDef[][] = [
  [
    {kind: 'digit', value: '1'},
    {kind: 'digit', value: '2', letters: 'ABC'},
    {kind: 'digit', value: '3', letters: 'DEF'},
  ],
  [
    {kind: 'digit', value: '4', letters: 'GHI'},
    {kind: 'digit', value: '5', letters: 'JKL'},
    {kind: 'digit', value: '6', letters: 'MNO'},
  ],
  [
    {kind: 'digit', value: '7', letters: 'PQRS'},
    {kind: 'digit', value: '8', letters: 'TUV'},
    {kind: 'digit', value: '9', letters: 'WXYZ'},
  ],
  [{kind: 'biometric'}, {kind: 'digit', value: '0'}, {kind: 'delete'}],
]

export interface NumericKeypadProps {
  onKeyPress: (val: string) => void
  onDelete: () => void
  /** Shows and enables the biometric key when biometric login is active. */
  onBiometricPress?: () => void
}

const NumericKeypad = ({
  onKeyPress,
  onDelete,
  onBiometricPress,
}: NumericKeypadProps) => {
  return (
    <View style={styles.container}>
      {ROWS.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((def, ki) => (
            <KeyCell
              key={`${ri}-${ki}`}
              def={def}
              onKeyPress={onKeyPress}
              onDelete={onDelete}
              onBiometricPress={onBiometricPress}
            />
          ))}
        </View>
      ))}
    </View>
  )
}

function KeyCell({
  def,
  onKeyPress,
  onDelete,
  onBiometricPress,
}: {
  def: KeyDef
  onKeyPress: (val: string) => void
  onDelete: () => void
  onBiometricPress?: () => void
}) {
  if (def.kind === 'digit') {
    return (
      <View style={styles.cell}>
        <TouchableOpacity
          style={styles.keyCircle}
          onPress={() => onKeyPress(def.value)}
          activeOpacity={0.65}>
          <View style={styles.keyInner}>
            <Text style={styles.digit}>{def.value}</Text>
            {def.letters ? (
              <Text style={styles.letters}>{def.letters}</Text>
            ) : (
              <View style={styles.lettersSpacer} />
            )}
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  if (def.kind === 'delete') {
    return (
      <View style={styles.cell}>
        <TouchableOpacity
          style={styles.keyCircle}
          onPress={onDelete}
          activeOpacity={0.65}
          accessibilityRole="button"
          accessibilityLabel="Delete">
          <MaterialIcons name="backspace" size={ICON_SIZE} color={KEY_TEXT} />
        </TouchableOpacity>
      </View>
    )
  }

  if (!onBiometricPress) {
    return <View style={styles.cell} />
  }

  return (
    <View style={styles.cell}>
      <TouchableOpacity
        style={styles.keyCircle}
        onPress={onBiometricPress}
        activeOpacity={0.65}
        accessibilityRole="button"
        accessibilityLabel="Biometric unlock">
        <AppIcon
          name="FingerScan"
          size={ICON_SIZE + 2}
          color={KEY_TEXT}
          variant="Bulk"
        />
      </TouchableOpacity>
    </View>
  )
}

const KEY_SIZE = 72

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cell: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyCircle: {
    width: KEY_SIZE,
    height: KEY_SIZE,
    borderRadius: KEY_SIZE / 2,
    backgroundColor: KEY_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lettersSpacer: {
    height: 11,
    marginTop: -2,
  },
  digit: {
    fontSize: 28,
    color: KEY_TEXT,
    fontWeight: '600',
    lineHeight: 32,
  },
  letters: {
    marginTop: -2,
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 0.5,
    color: KEY_TEXT,
    opacity: 0.85,
  },
})

export default NumericKeypad
