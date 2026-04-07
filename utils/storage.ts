import {router} from 'expo-router'
import {MMKV} from 'react-native-mmkv'
import {StateStorage} from 'zustand/middleware'

import {queryClient} from './queryClient'
import toast from './toast'

const vault = new MMKV()

type VaultKeys =
  | 'accessToken'
  | 'authority'
  | 'refreshToken'
  | 'resetToken'
  | 'pushToken'
  | 'biometricsEnabled'
  | 'deviceRegistered'
  | 'hasAppLaunchedBefore'
  | 'user'
  | 'showTrialModal'
  | 'otaLastChecked'

export function saveToVault(key: VaultKeys, value: unknown) {
  vault.set(key, JSON.stringify(value))
}

export function getFromVault(key: VaultKeys) {
  const result = vault.getString(key)
  return result ? JSON.parse(result) : undefined
}

export function deleteFromVault(key: VaultKeys) {
  vault.contains(key) && vault.delete(key)
}

export function valueExistsInVault(key: VaultKeys) {
  return vault.contains(key)
}

export const resetAppStorage = () => {
  //TODO: Clear any timers running
  deleteFromVault('authority')
  deleteFromVault('biometricsEnabled')
  deleteFromVault('deviceRegistered')
  deleteFromVault('pushToken')
  deleteFromVault('user')
  deleteFromVault('showTrialModal')
  deleteFromVault('accessToken')
  deleteFromVault('refreshToken')
  deleteFromVault('resetToken')
  queryClient.clear()
}

export const clearSession = (
  route?: 'fresh-login' | 'login' | 'no-route' | 'expired'
) => {
  deleteFromVault('accessToken')
  deleteFromVault('refreshToken')
  deleteFromVault('resetToken')

  if (route === 'expired') {
    router.replace('/login')
    toast.info('Your session has expired!')
    return
  }

  if (route === 'no-route') {
    return
  }
  if (route === 'fresh-login') {
    router.replace('/fresh-login')
  } else {
    router.replace('/login')
  }
}
const storage = new MMKV()

export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value)
  },
  getItem: name => {
    const value = storage.getString(name)
    return value ?? null
  },
  removeItem: name => {
    return storage.delete(name)
  }
}
