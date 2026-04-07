import {Box, Container, PageError, PushaActivityIndicator, Typography} from '@/components/ui'
import {ScreenView} from '@/components/util/screen-view'
import {useGetExpense} from '@/queries/expensesQuery'
import {useLocalSearchParams} from 'expo-router'
import React from 'react'

const Page = () => {
  const {expensesId} = useLocalSearchParams<{expensesId: string}>()
  const {data: expense, isLoading, isError, refetch} = useGetExpense(expensesId ?? '')

  if (isError) return <PageError reload={refetch} />

  return (
    <ScreenView navTitle="Expense Details" alignNav="center" hasTopBanner={false}>
      {isLoading ? (
        <Box flex={1} alignItems="center" justifyContent="center"><PushaActivityIndicator /></Box>
      ) : (
        <Container>
          <Box mt={16} backgroundColor="white" borderRadius={12} p={16} borderWidth={1}
            style={{borderColor: '#E9EAEB'}} gap={12}>
            <Box>
              <Typography variant="c1" color="neutral-600">Title</Typography>
              <Typography variant="body-semibold" color="secondary-500" mt={4}>{(expense as any)?.title || '—'}</Typography>
            </Box>
            <Box>
              <Typography variant="c1" color="neutral-600">Amount</Typography>
              <Typography variant="h2-bold" color="error-100" mt={4}>
                ₦{(expense as any)?.amount ? Number((expense as any).amount).toLocaleString() : '0'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="c1" color="neutral-600">Category</Typography>
              <Typography variant="body-semibold" color="secondary-500" mt={4}>{(expense as any)?.category || '—'}</Typography>
            </Box>
            <Box>
              <Typography variant="c1" color="neutral-600">Date</Typography>
              <Typography variant="body-semibold" color="secondary-500" mt={4}>
                {(expense as any)?.created_at ? new Date((expense as any).created_at).toLocaleDateString() : '—'}
              </Typography>
            </Box>
          </Box>
        </Container>
      )}
    </ScreenView>
  )
}

export default Page
