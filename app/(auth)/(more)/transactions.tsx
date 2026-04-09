import {Box, Container, EmptyState, PageError, PushaActivityIndicator, Typography} from '@/components/ui'
import {ScreenView} from '@/components/util/screen-view'
import {GroupedByDate} from '@/components/shared'
import {useGetWalletTransactions} from '@/queries/walletQuery'
import React from 'react'

const Page = () => {
  const {data, isLoading, isError, refetch} = useGetWalletTransactions()
  const items = Array.isArray(data) ? data : []

  if (isError) return <PageError reload={refetch} />

  return (
    <ScreenView navTitle="Transactions" alignNav="center" hasTopBanner={false}>
      {isLoading ? (
        <Box flex={1} alignItems="center" justifyContent="center"><PushaActivityIndicator /></Box>
      ) : items.length === 0 ? (
        <EmptyState title="No transactions" description="Your transaction history will appear here." />
      ) : (
        <GroupedByDate
          data={items}
          dateKey="created_at"
          renderItem={(item: any) => (
            <Box flexDirection="row" alignItems="center" justifyContent="space-between"
              px={16} py={12} borderBottomWidth={1} style={{borderBottomColor: '#F5F5F5'}}>
              <Box flex={1}>
                <Typography variant="body-semibold" color="secondary-500">
                  {item.description || item.type || 'Transaction'}
                </Typography>
                <Typography variant="c2" color="neutral-600" mt={2}>
                  {item.reference || ''}
                </Typography>
              </Box>
              <Typography variant="body-bold"
                color={item.type === 'credit' ? 'success-100' : 'error-100'}>
                {item.type === 'credit' ? '+' : '-'}₦{item.amount ? Number(item.amount).toLocaleString() : '0'}
              </Typography>
            </Box>
          )}
        />
      )}
    </ScreenView>
  )
}

export default Page
