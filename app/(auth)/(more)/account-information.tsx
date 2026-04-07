import {Box, Button, Container, PageError, PushaActivityIndicator, Typography} from '@/components/ui'
import {ScreenView} from '@/components/util/screen-view'
import {useGetUserProfile} from '@/queries/userQuery'
import React from 'react'

const Page = () => {
  const {data: user, isLoading, isError, refetch} = useGetUserProfile()

  if (isError) return <PageError reload={refetch} />

  return (
    <ScreenView navTitle="Account Information" alignNav="center" hasTopBanner={false}>
      {isLoading ? (
        <Box flex={1} alignItems="center" justifyContent="center">
          <PushaActivityIndicator />
        </Box>
      ) : (
        <Container>
          <Box mt={16} gap={16}>
            <Box
              backgroundColor="white"
              borderRadius={12}
              p={16}
              borderWidth={1}
              style={{borderColor: '#E9EAEB'}}
              gap={12}>
              <Box>
                <Typography variant="c1" color="neutral-600">First Name</Typography>
                <Typography variant="body-semibold" color="secondary-500" mt={4}>{(user as any)?.first_name || '—'}</Typography>
              </Box>
              <Box>
                <Typography variant="c1" color="neutral-600">Last Name</Typography>
                <Typography variant="body-semibold" color="secondary-500" mt={4}>{(user as any)?.last_name || '—'}</Typography>
              </Box>
              <Box>
                <Typography variant="c1" color="neutral-600">Email</Typography>
                <Typography variant="body-semibold" color="secondary-500" mt={4}>{(user as any)?.email || '—'}</Typography>
              </Box>
              <Box>
                <Typography variant="c1" color="neutral-600">Phone</Typography>
                <Typography variant="body-semibold" color="secondary-500" mt={4}>{(user as any)?.phone_number || '—'}</Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      )}
    </ScreenView>
  )
}

export default Page
