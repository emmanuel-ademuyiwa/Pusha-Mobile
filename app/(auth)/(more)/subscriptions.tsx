import {Box, PushaActivityIndicator} from '@/components/ui'
import {ScreenView} from '@/components/util/screen-view'
import Subscribed from '@/components/screens/more/subscriptions/subscribed'
import Unsubscribed from '@/components/screens/more/subscriptions/unsubscribed'
import {useGetCurrentSubscription} from '@/queries/subscriptionQuery'
import React from 'react'

const Page = () => {
  const {data: subscription, isLoading} = useGetCurrentSubscription()

  return (
    <ScreenView
      navTitle="Subscriptions"
      alignNav="center"
      hasTopBanner={false}
      color={isLoading || subscription ? 'white' : 'primary-100'}
      navTone={isLoading || subscription ? 'default' : 'inverse'}>
      {isLoading ? (
        <Box flex={1} alignItems="center" justifyContent="center">
          <PushaActivityIndicator />
        </Box>
      ) : subscription ? (
        <Subscribed subscription={subscription} />
      ) : (
        <Unsubscribed />
      )}
    </ScreenView>
  )
}

export default Page
