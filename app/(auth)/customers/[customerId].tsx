import {AppIcon, Box, Container, PageError, PushaActivityIndicator, Typography} from '@/components/ui'
import {ScreenView} from '@/components/util/screen-view'
import {useGetCustomer} from '@/queries/customersQuery'
import {useLocalSearchParams} from 'expo-router'
import React from 'react'

const Page = () => {
  const {customerId} = useLocalSearchParams<{customerId: string}>()
  const {data: customer, isLoading, isError, refetch} = useGetCustomer(customerId ?? '')

  if (isError) return <PageError reload={refetch} />

  return (
    <ScreenView navTitle="Customer Details" alignNav="center" hasTopBanner={false}>
      {isLoading ? (
        <Box flex={1} alignItems="center" justifyContent="center"><PushaActivityIndicator /></Box>
      ) : (
        <Container>
          <Box mt={16} gap={16}>
            <Box alignItems="center" mb={8}>
              <Box width={72} height={72} borderRadius={36} backgroundColor="primary-100"
                alignItems="center" justifyContent="center" mb={12}>
                <Typography variant="h2-bold" color="white">
                  {((customer as any)?.first_name?.[0] ?? '?').toUpperCase()}
                </Typography>
              </Box>
              <Typography variant="h3-bold" color="secondary-500">
                {(customer as any)?.first_name} {(customer as any)?.last_name}
              </Typography>
              <Typography variant="body" color="neutral-600" mt={4}>
                {(customer as any)?.email}
              </Typography>
            </Box>

            <Box backgroundColor="white" borderRadius={12} p={16} borderWidth={1}
              style={{borderColor: '#E9EAEB'}} gap={12}>
              {[
                {label: 'Phone', value: (customer as any)?.phone_number},
                {label: 'Total Orders', value: (customer as any)?.total_orders ?? '0'},
                {label: 'Total Spent', value: `₦${Number((customer as any)?.total_spent ?? 0).toLocaleString()}`},
                {label: 'Joined', value: (customer as any)?.created_at ? new Date((customer as any).created_at).toLocaleDateString() : '—'},
              ].map(({label, value}) => (
                <Box key={label} flexDirection="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body" color="neutral-600">{label}</Typography>
                  <Typography variant="body-semibold" color="secondary-500">{value || '—'}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      )}
    </ScreenView>
  )
}

export default Page
