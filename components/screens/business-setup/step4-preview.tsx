import {AppIcon, Box, Button, Container, TextField, Typography} from '@/components/ui'
import {KeyboardAwareScrollView} from '@/components/util/keyboard-aware-scroll-view'
import React, {useState} from 'react'
import {StyleSheet} from 'react-native'

interface Step4PreviewProps {
  handleNext: () => void
  handleBack: () => void
}

const Step4Preview = ({handleNext, handleBack}: Step4PreviewProps) => {
  const [aiName, setAiName] = useState('')

  const displayName = aiName.trim() || 'Your AI assistant'

  return (
    <KeyboardAwareScrollView>
      <Container>
        <Box mt={16} gap={20} pb={32}>
          <Box gap={4}>
            <Typography variant="c1-medium" color="primary-300">
              Step 4 of 4
            </Typography>
            <Typography variant="h2-bold" color="secondary-500">
              Meet {aiName.trim() || 'your AI assistant'}
            </Typography>
            <Typography variant="body" color="neutral-500">
              See how it handles real customer conversations — automatically,
              24/7
            </Typography>
          </Box>

          {/* AI name input */}
          <Box gap={6}>
            <Typography variant="c1-medium" color="neutral-600">
              Give your AI a name{' '}
              <Typography variant="c1" color="neutral-400">
                (optional)
              </Typography>
            </Typography>
            <TextField
              name="aiName"
              placeholder="e.g. Zara, Aria, Max"
              value={aiName}
              onChangeText={setAiName}
            />
            <Typography variant="c1" color="neutral-400">
              This is the name your customers will see when chatting
            </Typography>
          </Box>

          {/* Stats strip */}
          <Box flexDirection="row" gap={8}>
            {[
              {icon: '⚡', value: '< 3s', label: 'Response time'},
              {icon: '✅', value: '94%', label: 'Resolved'},
              {icon: '💰', value: '38', label: 'Sales today'}
            ].map((s, i) => (
              <Box key={i} flex={1} style={styles.statCard} alignItems="center">
                <Typography style={{fontSize: 18}}>{s.icon}</Typography>
                <Typography variant="body-bold" color="secondary-500">
                  {s.value}
                </Typography>
                <Typography
                  variant="c1"
                  color="neutral-400"
                  textAlign="center">
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Aha moment callout */}
          <Box style={styles.callout} gap={6}>
            <Box flexDirection="row" alignItems="center" gap={8}>
              <Box
                width={40}
                height={40}
                borderRadius={20}
                alignItems="center"
                justifyContent="center"
                style={{
                  background: undefined,
                  backgroundColor: '#2554C7'
                }}>
                <Typography style={{fontSize: 14}}>AI</Typography>
              </Box>
              <Box flex={1}>
                <Typography variant="body-bold" color="secondary-500">
                  {displayName}
                </Typography>
                <Box flexDirection="row" alignItems="center" gap={4}>
                  <Box
                    width={6}
                    height={6}
                    borderRadius={3}
                    style={{backgroundColor: '#2ccb91'}}
                  />
                  <Typography variant="c1" style={{color: '#2ccb91'}}>
                    Online · Replies instantly
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box style={styles.chatBubble}>
              <Typography variant="c1" color="neutral-600">
                Hi! Do you have this in size M?
              </Typography>
            </Box>
            <Box style={styles.chatBubbleBot}>
              <Typography variant="c1" style={{color: '#FFFFFF'}}>
                Yes! We have S, M, L & XL in stock 🎉 Shall I place the order?
              </Typography>
            </Box>
          </Box>

          {/* Works while you sleep */}
          <Box style={styles.successBanner} gap={4}>
            <Box flexDirection="row" alignItems="center" gap={6}>
              <AppIcon name="Rocket" size={16} color="#2554C7" />
              <Typography variant="body-bold" color="secondary-500">
                {aiName.trim()
                  ? `${aiName.trim()} works while you sleep 🌙`
                  : 'Your AI works while you sleep 🌙'}
              </Typography>
            </Box>
            <Typography variant="c1" color="neutral-500">
              {displayName} answers questions, confirms orders, and closes sales
              automatically. You take over any conversation at any time.
            </Typography>
          </Box>

          {/* CTAs */}
          <Box flexDirection="row" gap={8} mt={8}>
            <Box flex={1}>
              <Button variant="outline" label="Back" onPress={handleBack} />
            </Box>
            <Box flex={2}>
              <Button
                hasLinearGradient
                label="Launch my store 🚀"
                onPress={handleNext}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  statCard: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EDF2F8',
    backgroundColor: '#FFFFFF',
    gap: 4
  },
  callout: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EDF2F8',
    backgroundColor: '#FFFFFF'
  },
  chatBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#F0F2F5',
    borderRadius: 12,
    borderBottomRightRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '80%'
  },
  chatBubbleBot: {
    alignSelf: 'flex-start',
    backgroundColor: '#2554C7',
    borderRadius: 12,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '80%'
  },
  successBanner: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#EEF3FF',
    borderWidth: 1,
    borderColor: '#2554C740'
  }
})

export default Step4Preview
