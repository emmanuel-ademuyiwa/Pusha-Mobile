import {Box, Typography} from '@/components/ui'
import React from 'react'

interface EarningsProps {
  data?: any[]
}

const Earnings = ({data = []}: EarningsProps) => {
  if (data.length === 0) {
    return (
      <Box alignItems="center" justifyContent="center" flex={1} p={24}>
        <Typography variant="body" color="neutral-600" textAlign="center">
          No earnings yet. Start referring merchants to earn rewards!
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      {data.map((item: any, i: number) => (
        <Box
          key={i}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          py={12}
          px={16}
          borderBottomWidth={1}
          style={{borderBottomColor: '#F5F5F5'}}>
          <Box>
            <Typography variant="body-semibold" color="secondary-500">
              {item.description || 'Referral Bonus'}
            </Typography>
            <Typography variant="c2" color="neutral-600" mt={2}>
              {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
            </Typography>
          </Box>
          <Typography variant="body-bold" color="success-100">
            +₦{item.amount ? Number(item.amount).toLocaleString() : '0'}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

export default Earnings
