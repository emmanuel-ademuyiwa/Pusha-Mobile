import React from 'react'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

import AppIcon from '../app-icon'
import Box from '../box'
import Typography from '../typography'

export const ServiceBanner = () => {
  const insets = useSafeAreaInsets()

  return (
    <>
      <>
        <Box height={insets.top} backgroundColor="caution-300" />
        <Box
          bg="caution-300"
          height={30}
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          pb={8}
          gap={8}>
          <AppIcon name="construction" size={20} color="black" />
          <Typography variant="c1-bold">
            Your website is in service mode
          </Typography>
        </Box>
      </>
    </>
  )
}

export default ServiceBanner
