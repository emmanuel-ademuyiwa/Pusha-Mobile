import {Box, Button, Typography} from '@/components/ui'
import React from 'react'

interface WalletProps {
  balance?: number
  onWithdraw?: () => void
  onTopUp?: () => void
}

const Wallet = ({balance = 0, onWithdraw, onTopUp}: WalletProps) => {
  return (
    <Box>
      <Box
        borderRadius={16}
        p={20}
        style={{backgroundColor: '#142952'}}>
        <Typography variant="c1" color="neutral-400">
          Available Balance
        </Typography>
        <Typography variant="h1-bold" color="white" mt={4} fontSize={32}>
          ₦{balance.toLocaleString()}
        </Typography>
      </Box>
      <Box flexDirection="row" gap={12} mt={16}>
        <Box flex={1}>
          <Button label="Withdraw" onPress={onWithdraw} />
        </Box>
        <Box flex={1}>
          <Button label="Top Up" variant="secondary" onPress={onTopUp} />
        </Box>
      </Box>
    </Box>
  )
}

export default Wallet
