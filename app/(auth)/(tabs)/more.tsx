import {Box, BZSwitch, Container, Typography} from '@/components/ui'
import UserManagementSection from '@/components/screens/more/user-management-section'
import {useAuthActions, useBiometricsEnabled} from '@/store/authStore'
import {saveToVault} from '@/utils/storage'
import Constants from 'expo-constants'
import * as LocalAuthentication from 'expo-local-authentication'
import {router} from 'expo-router'
import {StatusBar} from 'expo-status-bar'
import React, {useCallback} from 'react'
import {Alert} from 'react-native'
import {ScreenView} from '@/components/util/screen-view'
import {KeyboardAwareScrollView} from '@/components/util/keyboard-aware-scroll-view'

const More = () => {
  const authActions = useAuthActions()
  const biometricsEnabled = useBiometricsEnabled()
  const appVersion = Constants.expoConfig?.version ?? '1.0.0'

  const goTo = (route: string) => () =>
    router.push(`/(auth)/(more)${route}` as any)

  const toggleBiometricSwitch = useCallback(async () => {
    if (!biometricsEnabled) {
      const savedBiometrics = await LocalAuthentication.isEnrolledAsync()
      if (!savedBiometrics) {
        authActions.setBiometricsEnabled(false)
        await saveToVault('biometricsEnabled', false)
        return Alert.alert('Biometrics Error', 'Unable to enable biometrics.')
      }
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Enable Biometrics',
        disableDeviceFallback: true,
        cancelLabel: 'Cancel'
      })
      if (biometricAuth.success) {
        authActions.setBiometricsEnabled(true)
        saveToVault('biometricsEnabled', true)
      }
    } else {
      authActions.setBiometricsEnabled(false)
      saveToVault('biometricsEnabled', false)
    }
  }, [biometricsEnabled, authActions])

  return (
    <ScreenView
      navTitle="More"
      backButton={false}
      footerPadding={false}
      hasTopBanner={false}>
      <StatusBar style="dark" animated />
      <KeyboardAwareScrollView>
        <Container>
          <Box pt={24} pb={100} gap={16}>
            <UserManagementSection
              title="Business profile"
              layout="grouped"
              items={[
                {
                  id: 'business-info',
                  title: 'Business Information',
                  icon: 'Shop',
                  onPress: goTo('/business-information')
                },
                {
                  id: 'account-info',
                  title: 'Account Information',
                  icon: 'ProfileCircle',
                  onPress: goTo('/account-information')
                },
                {
                  id: 'bank-details',
                  title: 'Bank Details',
                  icon: 'CreditCard',
                  onPress: goTo('/bank-details')
                }
              ]}
            />

            <UserManagementSection
              title="Growth & operations"
              layout="grouped"
              items={[
                {
                  id: 'wallet',
                  title: 'Wallet',
                  icon: 'Wallet',
                  onPress: goTo('/wallet')
                },
                {
                  id: 'business-intelligence',
                  title: 'Business Intelligence',
                  icon: 'FavoriteChart',
                  onPress: goTo('/business-intelligence')
                },
                {
                  id: 'integrations',
                  title: 'Integrations',
                  icon: 'Flash',
                  onPress: goTo('/integrations')
                },
                {
                  id: 'customers',
                  title: 'Customers',
                  icon: 'Users',
                  onPress: goTo('/customers')
                },
                {
                  id: 'referrals',
                  title: 'Referrals & Earning',
                  icon: 'Share',
                  onPress: goTo('/referral-earnings')
                },
                {
                  id: 'subscriptions',
                  title: 'Subscriptions',
                  icon: 'Ranking',
                  onPress: goTo('/subscriptions')
                }
              ]}
            />

            <UserManagementSection
              title="App settings"
              layout="grouped"
              items={[
                {
                  id: 'biometric',
                  title: 'Biometric Login',
                  icon: 'FingerScan',
                  rightElement: (
                    <BZSwitch
                      value={biometricsEnabled}
                      onValueChange={toggleBiometricSwitch}
                    />
                  )
                },
                {
                  id: 'change-password',
                  title: 'Change Password',
                  icon: 'KeySquare',
                  onPress: goTo('/change-passcode')
                },
                {
                  id: 'support',
                  title: 'Support & Help',
                  icon: 'HelpCircle',
                  onPress: goTo('/support')
                },
                {
                  id: 'logout',
                  title: 'Log out',
                  icon: 'Logout',
                  destructive: true,
                  onPress: () => authActions.logout()
                }
              ]}
            />

            <Box
              backgroundColor="white"
              borderRadius={12}
              borderWidth={1}
              style={{borderColor: '#E9EAEB'}}
              py={20}
              px={16}
              alignItems="center"
              mb={24}>
              <Typography variant="body-bold" color="secondary-500">
                Pusha Technologies
              </Typography>
              <Typography variant="c1" color="neutral-600" mt={6}>
                Version {appVersion}
              </Typography>
              <Typography variant="c1" color="neutral-600" mt={4}>
                All rights reserved
              </Typography>
            </Box>
          </Box>
        </Container>
      </KeyboardAwareScrollView>
    </ScreenView>
  )
}

export default More
