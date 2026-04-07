import {Box, Typography, Avatar} from '@/components/ui'
import React from 'react'

interface ReferralsProps {
  data?: any[]
}

const Referrals = ({data = []}: ReferralsProps) => {
  if (data.length === 0) {
    return (
      <Box alignItems="center" justifyContent="center" flex={1} p={24}>
        <Typography variant="body" color="neutral-600" textAlign="center">
          No referrals yet. Share your code to invite merchants.
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
          py={12}
          px={16}
          gap={12}
          borderBottomWidth={1}
          style={{borderBottomColor: '#F5F5F5'}}>
          <Avatar
            name={`${item.first_name || ''} ${item.last_name || ''}`}
            size={40}
          />
          <Box flex={1}>
            <Typography variant="body-semibold" color="secondary-500">
              {item.first_name} {item.last_name}
            </Typography>
            <Typography variant="c2" color="neutral-600" mt={2}>
              Joined {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
            </Typography>
          </Box>
          <Box
            px={8}
            py={4}
            borderRadius={20}
            backgroundColor={item.is_active ? 'success-200' : 'neutral-100'}>
            <Typography
              variant="c2-bold"
              color={item.is_active ? 'success-100' : 'neutral-600'}>
              {item.is_active ? 'Active' : 'Pending'}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default Referrals
