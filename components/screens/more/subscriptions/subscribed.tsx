import {Box} from '@/components/ui'
import React from 'react'
import SubscribedTab from './subscribed-tab'

interface SubscribedProps {
  subscription?: any
}

const Subscribed = ({subscription}: SubscribedProps) => {
  return (
    <Box flex={1}>
      <SubscribedTab subscription={subscription} />
    </Box>
  )
}

export default Subscribed
