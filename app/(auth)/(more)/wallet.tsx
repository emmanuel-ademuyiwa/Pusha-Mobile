import {Box, Container, PageError, PushaActivityIndicator} from '@/components/ui'
import {ScreenView} from '@/components/util/screen-view'
import WalletComponent from '@/components/screens/more/wallet'
import {useGetWalletBalance} from '@/queries/walletQuery'
import React from 'react'

const Page = () => {
  const {data: wallet, isLoading, isError, refetch} = useGetWalletBalance()

  if (isError) return <PageError reload={refetch} />

  return (
    <ScreenView navTitle="Wallet" alignNav="center" hasTopBanner={false}>
      {isLoading ? (
        <Box flex={1} alignItems="center" justifyContent="center"><PushaActivityIndicator /></Box>
      ) : (
        <Container>
          <Box mt={16}>
            <WalletComponent balance={(wallet as any)?.balance ?? 0} />
          </Box>
        </Container>
      )}
    </ScreenView>
  )
}

export default Page
