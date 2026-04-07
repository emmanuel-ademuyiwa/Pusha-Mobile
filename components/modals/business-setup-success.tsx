import {useAuthActions, useBiometricsEnabled} from '@/store/authStore'
import {saveToVault} from '@/utils/storage'
import * as LocalAuthentication from 'expo-local-authentication'
import React from 'react'
import {Alert} from 'react-native'
import SuccessCheck from '../svgs/success-check'
import {BZSwitch, Box, Button, Divider, Typography} from '../ui'
import {CenterdModal} from '../ui/centerd-modal'

const BusinessSetupCompleted = ({
  show,
  onClose
}: {
  show: boolean
  onClose: () => void
}) => {
  const biometricsEnabled = useBiometricsEnabled()
  const authActions = useAuthActions()

  const toggleBiometricSwitch = async () => {
    if (!biometricsEnabled) {
      const savedBiometrics = await LocalAuthentication.isEnrolledAsync()
      if (!savedBiometrics) {
        authActions.setBiometricsEnabled(false)
        await saveToVault('biometricsEnabled', false)
        return Alert.alert('Biometrics Error', 'Unable to enable biometrics.')
      } else {
        const biometricAuth = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Enable Biometrics',
          disableDeviceFallback: true,
          cancelLabel: 'Cancel'
        })
        if (biometricAuth.success) {
          authActions.setBiometricsEnabled(true)
          saveToVault('biometricsEnabled', true)
        }
      }
    } else {
      authActions.setBiometricsEnabled(false)
      saveToVault('biometricsEnabled', false)
    }
  }

  return (
    <CenterdModal show={show} onClose={onClose}>
      <Box alignItems="center" width={'100%'}>
        <SuccessCheck />
        <Typography
          variant="h1-bold"
          color="secondary-500"
          fontSize={22}
          lineHeight={33}>
          Set up Complete
        </Typography>
        <Typography
          mt={16}
          maxWidth={293}
          textAlign="center"
          color="neutral-800"
          variant="body">
          You have successfully completed your business setup
        </Typography>

        <Box width={'100%'}>
          <Divider thickness={1} marginVertical={16} />

          <Box mb={16} flexDirection="row" justifyContent="space-between">
            <Typography color="neutral-700" variant="body">
              Enable Biometrics Login?
            </Typography>
            <BZSwitch
              value={biometricsEnabled}
              onValueChange={toggleBiometricSwitch}
            />
          </Box>

          <Button
            label="Continue to Dashboard"
            onPress={() => authActions.routeUser()}
          />
        </Box>
      </Box>
    </CenterdModal>
  )
}

export default BusinessSetupCompleted
