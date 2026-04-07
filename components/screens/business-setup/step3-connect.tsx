import {AppIcon, Box, Button, Container, Typography} from '@/components/ui'
import {KeyboardAwareScrollView} from '@/components/util/keyboard-aware-scroll-view'
import React from 'react'
import {StyleSheet, Text, TouchableOpacity} from 'react-native'

interface Step3ConnectProps {
  handleNext: () => void
  handleBack: () => void
}

const Step3Connect = ({handleNext, handleBack}: Step3ConnectProps) => {
  return (
    <KeyboardAwareScrollView>
      <Container>
        <Box mt={16} gap={20} pb={32}>
          <Box gap={4}>
            <Typography variant="c1-medium" color="primary-300">
              Step 3 of 4
            </Typography>
            <Typography variant="h2-bold" color="secondary-500">
              Connect your channels
            </Typography>
            <Typography variant="body" color="neutral-500">
              Reach customers on WhatsApp, Facebook & Instagram — all in one
              place
            </Typography>
          </Box>

          {/* Meta card */}
          <Box style={styles.metaCard} gap={16}>
            <Box flexDirection="row" gap={14} alignItems="flex-start">
              <Box
                width={48}
                height={48}
                borderRadius={12}
                alignItems="center"
                justifyContent="center"
                style={{backgroundColor: '#1877F2'}}>
                <Text style={styles.metaIcon}>f</Text>
              </Box>
              <Box flex={1} gap={6}>
                <Typography variant="body-bold" color="secondary-500">
                  Meta — Facebook & Instagram
                </Typography>
                <Typography variant="c1" color="neutral-500">
                  One connection unlocks WhatsApp, Facebook, and Instagram
                  messaging for your AI
                </Typography>
                <Box flexDirection="row" flexWrap="wrap" gap={6} mt={4}>
                  <Box style={[styles.badge, {backgroundColor: '#DCF8C6'}]}>
                    <Box
                      width={6}
                      height={6}
                      borderRadius={3}
                      style={{backgroundColor: '#25D366'}}
                    />
                    <Typography variant="c1-medium" style={{color: '#075E54'}}>
                      WhatsApp
                    </Typography>
                  </Box>
                  <Box style={[styles.badge, {backgroundColor: '#F3E8FF'}]}>
                    <Box
                      width={6}
                      height={6}
                      borderRadius={3}
                      style={{backgroundColor: '#833AB4'}}
                    />
                    <Typography variant="c1-medium" style={{color: '#833AB4'}}>
                      Instagram
                    </Typography>
                  </Box>
                  <Box style={[styles.badge, {backgroundColor: '#E7F0FD'}]}>
                    <Box
                      width={6}
                      height={6}
                      borderRadius={3}
                      style={{backgroundColor: '#1877F2'}}
                    />
                    <Typography variant="c1-medium" style={{color: '#1877F2'}}>
                      Facebook
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Button
              hasLinearGradient
              label="Connect with Meta"
              onPress={() => {
                // Meta OAuth flow — available from Settings after setup
                handleNext()
              }}
            />
          </Box>

          {/* Info banner */}
          <Box style={styles.infoBanner} flexDirection="row" gap={10}>
            <AppIcon name="Info" size={15} color="#E6AE00" />
            <Typography variant="c1" color="neutral-600" flex={1}>
              You can also connect channels anytime from{' '}
              <Typography variant="c1-medium" color="neutral-700">
                Settings → Integrations
              </Typography>
              .
            </Typography>
          </Box>

          {/* CTAs */}
          <Box gap={8} mt={8}>
            <Box flexDirection="row" gap={8}>
              <Box flex={1}>
                <Button variant="outline" label="Back" onPress={handleBack} />
              </Box>
              <Box flex={2}>
                <Button
                  hasLinearGradient
                  label="Continue"
                  onPress={handleNext}
                />
              </Box>
            </Box>
            <TouchableOpacity activeOpacity={0.7} onPress={handleNext}>
              <Typography
                variant="c1"
                color="neutral-400"
                textAlign="center">
                Skip for now — connect from Settings later
              </Typography>
            </TouchableOpacity>
          </Box>
        </Box>
      </Container>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  metaCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EDF2F8',
    backgroundColor: '#FFFFFF'
  },
  metaIcon: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700'
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20
  },
  infoBanner: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#FFF9E6',
    borderWidth: 1,
    borderColor: '#FFCB3B66',
    alignItems: 'flex-start'
  }
})

export default Step3Connect
