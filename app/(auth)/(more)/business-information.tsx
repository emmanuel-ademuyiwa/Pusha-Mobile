import {Box, Container, PageError, PushaActivityIndicator, Typography} from '@/components/ui'
import {ScreenView} from '@/components/util/screen-view'
import React from 'react'

const Page = () => {
  return (
    <ScreenView navTitle="Business Information" alignNav="center" hasTopBanner={false}>
      <Container>
        <Box mt={16}>
          <Typography variant="body" color="neutral-600">
            Manage your business profile and information.
          </Typography>
        </Box>
      </Container>
    </ScreenView>
  )
}

export default Page
