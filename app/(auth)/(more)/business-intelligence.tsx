import {Box, Container, Typography} from '@/components/ui'
import {ScreenView} from '@/components/util/screen-view'
import React from 'react'

const Page = () => (
  <ScreenView navTitle="Business Intelligence" alignNav="center" hasTopBanner={false}>
    <Container>
      <Box mt={16}>
        <Typography variant="body" color="neutral-600">
          View insights and analytics for your business.
        </Typography>
      </Box>
    </Container>
  </ScreenView>
)

export default Page
