import {Box, Container, PushaActivityIndicator, Typography} from '@/components/ui'
import {ScreenView} from '@/components/util/screen-view'
import {Refer} from '@/components/shared'
import Earnings from '@/components/screens/more/referrlas-earning/earnings'
import Referrals from '@/components/screens/more/referrlas-earning/referrals'
import {useGetReferralStats} from '@/queries/referralsQuery'
import React, {useState} from 'react'
import {TouchableOpacity} from 'react-native'

const Page = () => {
  const [tab, setTab] = useState<'earnings' | 'referrals'>('earnings')
  const {data, isLoading} = useGetReferralStats()

  return (
    <ScreenView navTitle="Referral Earnings" alignNav="center" hasTopBanner={false}>
      <Container>
        <Box mt={16} mb={16}>
          <Refer referralCode={(data as any)?.referral_code} />
        </Box>

        <Box flexDirection="row" gap={4} mb={16} backgroundColor="neutral-100" borderRadius={8} p={4}>
          {(['earnings', 'referrals'] as const).map(t => (
            <TouchableOpacity key={t} style={{flex: 1}} onPress={() => setTab(t)}>
              <Box borderRadius={6} py={8} alignItems="center"
                backgroundColor={tab === t ? 'white' : 'neutral-100'}>
                <Typography variant="c1-bold" color={tab === t ? 'secondary-500' : 'neutral-600'}
                  textTransform="capitalize">{t}</Typography>
              </Box>
            </TouchableOpacity>
          ))}
        </Box>
      </Container>

      {isLoading ? (
        <Box flex={1} alignItems="center" justifyContent="center"><PushaActivityIndicator /></Box>
      ) : tab === 'earnings' ? (
        <Earnings data={(data as any)?.earnings ?? []} />
      ) : (
        <Referrals data={(data as any)?.referrals ?? []} />
      )}
    </ScreenView>
  )
}

export default Page
