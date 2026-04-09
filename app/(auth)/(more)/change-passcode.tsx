import {Box, Button, Container, Typography} from '@/components/ui'
import {ScreenView} from '@/components/util/screen-view'
import NumericKeypad from '@/components/ui/numeric-keypad'
import React, {useState} from 'react'
import {useAuthActions} from '@/store/authStore'
import {KeyboardAwareScrollView} from '@/components/util/keyboard-aware-scroll-view'

const Page = () => {
  const [step, setStep] = useState<'current' | 'new' | 'confirm'>('current')
  const [current, setCurrent] = useState('')
  const [newCode, setNewCode] = useState('')
  const [confirm, setConfirm] = useState('')
  const authActions = useAuthActions()

  const activeCode =
    step === 'current' ? current : step === 'new' ? newCode : confirm
  const setActiveCode =
    step === 'current' ? setCurrent : step === 'new' ? setNewCode : setConfirm

  const titles = {
    current: 'Enter current passcode',
    new: 'Enter new passcode',
    confirm: 'Confirm new passcode'
  }

  return (
    <ScreenView
      navTitle="Change Passcode"
      alignNav="center"
      hasTopBanner={false}>
      <KeyboardAwareScrollView>
        <Container>
          <Box mt={64} flex={1} justifyContent="center" alignItems="center">
            <Typography variant="h3-semibold" color="secondary-500">
              {titles[step]}
            </Typography>
            <Box flexDirection="row" gap={12} mt={24} mb={32}>
              {[0, 1, 2, 3].map(i => (
                <Box
                  key={i}
                  width={16}
                  height={16}
                  borderRadius={8}
                  borderWidth={2}
                  borderColor="stroke"
                  backgroundColor={
                    activeCode.length > i ? 'primary-100' : 'gray-bg'
                  }
                />
              ))}
            </Box>
          </Box>
        </Container>
      </KeyboardAwareScrollView>
      <Box pb={40}>
        <NumericKeypad
        onKeyPress={v => activeCode.length < 4 && setActiveCode(activeCode + v)}
        onDelete={() => setActiveCode(activeCode.slice(0, -1))}
      />
      </Box>
    </ScreenView>
  )
}

export default Page
