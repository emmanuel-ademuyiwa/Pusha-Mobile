import {Box, Button, Container, Typography} from '@/components/ui'
import {ScreenView} from '@/components/util/screen-view'
import NumericKeypad from '@/components/ui/numeric-keypad'
import React, {useState} from 'react'
import {useAuthActions} from '@/store/authStore'

const Page = () => {
  const [step, setStep] = useState<'current' | 'new' | 'confirm'>('current')
  const [current, setCurrent] = useState('')
  const [newCode, setNewCode] = useState('')
  const [confirm, setConfirm] = useState('')
  const authActions = useAuthActions()

  const activeCode = step === 'current' ? current : step === 'new' ? newCode : confirm
  const setActiveCode = step === 'current' ? setCurrent : step === 'new' ? setNewCode : setConfirm

  const titles = {current: 'Enter current passcode', new: 'Enter new passcode', confirm: 'Confirm new passcode'}

  return (
    <ScreenView navTitle="Change Passcode" alignNav="center" hasTopBanner={false}>
      <Container>
        <Box mt={24} alignItems="center">
          <Typography variant="h3-semibold" color="secondary-500">{titles[step]}</Typography>
          <Box flexDirection="row" gap={12} mt={24} mb={32}>
            {[0, 1, 2, 3].map(i => (
              <Box key={i} width={16} height={16} borderRadius={8} borderWidth={2} borderColor="stroke"
                backgroundColor={activeCode.length > i ? 'primary-100' : 'gray-bg'} />
            ))}
          </Box>
        </Box>
      </Container>
      <NumericKeypad
        onKeyPress={v => activeCode.length < 4 && setActiveCode(activeCode + v)}
        onDelete={() => setActiveCode(activeCode.slice(0, -1))}
      />
    </ScreenView>
  )
}

export default Page
