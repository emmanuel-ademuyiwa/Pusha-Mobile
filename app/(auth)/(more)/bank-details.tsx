import {Box, Container, Typography} from '@/components/ui'
import {ScreenView} from '@/components/util/screen-view'
import React from 'react'

const Page = () => (
  <ScreenView navTitle="Bank Details" alignNav="center" hasTopBanner={false}>
    <Container>
      <Box mt={16}>
        <Typography variant="body" color="neutral-600">
          View and manage your bank accounts.
        </Typography>
      </Box>
    </Container>
  </ScreenView>
)

export default Page
