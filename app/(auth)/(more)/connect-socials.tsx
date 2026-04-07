import {Box, Container, Typography} from '@/components/ui'
import {ScreenView} from '@/components/util/screen-view'
import React from 'react'

const Page = () => (
  <ScreenView navTitle="Connect Socials" alignNav="center" hasTopBanner={false}>
    <Container>
      <Box mt={16}>
        <Typography variant="body" color="neutral-600">
          Connect your social media accounts to sync your store.
        </Typography>
      </Box>
    </Container>
  </ScreenView>
)

export default Page
