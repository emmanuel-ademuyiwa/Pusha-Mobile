import {AppIcon, Avatar, Box, Container, Typography} from '@/components/ui'
import {AppView} from '@/components/ui/app-view'
import UserManagementSection from '@/components/screens/more/user-management-section'
import {useAuthActions} from '@/store/authStore'
import {getFromVault} from '@/utils/storage'
import {router} from 'expo-router'
import {StatusBar} from 'expo-status-bar'
import React from 'react'
import {ScrollView} from 'react-native'

const More = () => {
  const user: any = getFromVault('user')
  const authActions = useAuthActions()

  const goTo = (route: string) => () => router.push(`/(auth)/(more)${route}` as any)

  return (
    <AppView hasTopBanner={false}>
      <StatusBar style="dark" animated />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Container>
          <Box pt={16} pb={8}>
            <Typography variant="h2-bold" color="secondary-500">
              More
            </Typography>
          </Box>
        </Container>

        <Container>
          <Box
            flexDirection="row"
            alignItems="center"
            backgroundColor="white"
            borderRadius={12}
            p={16}
            gap={12}
            mb={20}
            borderWidth={1}
            style={{borderColor: '#E9EAEB'}}>
            <Avatar
              name={`${user?.first_name || ''} ${user?.last_name || ''}`}
              size={48}
            />
            <Box flex={1}>
              <Typography variant="body-bold" color="secondary-500">
                {user?.first_name} {user?.last_name}
              </Typography>
              <Typography variant="c1" color="neutral-600" mt={2}>
                {user?.email}
              </Typography>
            </Box>
            <AppIcon name="ChevronRight" size={18} color="#94A3B8" />
          </Box>

          <UserManagementSection
            title="Account"
            items={[
              {id: 'account-info', title: 'Account Information', icon: 'User', onPress: goTo('/account-information')},
              {id: 'business-info', title: 'Business Information', icon: 'Building2', onPress: goTo('/business-information')},
              {id: 'bank-details', title: 'Bank Details', icon: 'CreditCard', onPress: goTo('/bank-details')},
              {id: 'change-passcode', title: 'Change Passcode', icon: 'Lock', onPress: goTo('/change-passcode')},
            ]}
          />

          <UserManagementSection
            title="Business"
            items={[
              {id: 'products', title: 'Products', icon: 'Package', onPress: goTo('/products')},
              {id: 'transactions', title: 'Transactions', icon: 'ArrowLeftRight', onPress: goTo('/transactions')},
              {id: 'expenses', title: 'Expenses', icon: 'Receipt', onPress: goTo('/expenses')},
              {id: 'wallet', title: 'Wallet', icon: 'Wallet', onPress: goTo('/wallet')},
              {id: 'subscriptions', title: 'Subscriptions', icon: 'Zap', onPress: goTo('/subscriptions')},
            ]}
          />

          <UserManagementSection
            title="Growth"
            items={[
              {id: 'referrals', title: 'Referral Earnings', icon: 'Gift', onPress: goTo('/referral-earnings')},
              {id: 'connect-socials', title: 'Connect Socials', icon: 'Share2', onPress: goTo('/connect-socials')},
              {id: 'business-intelligence', title: 'Business Intelligence', icon: 'BarChart2', onPress: goTo('/business-intelligence')},
            ]}
          />

          <UserManagementSection
            title="Support"
            items={[
              {id: 'support', title: 'Support', icon: 'HelpCircle', onPress: goTo('/support')},
            ]}
          />

          <UserManagementSection
            items={[
              {id: 'logout', title: 'Sign Out', icon: 'LogOut', destructive: true, onPress: () => authActions.logout()},
            ]}
          />

          <Box height={32} />
        </Container>
      </ScrollView>
    </AppView>
  )
}

export default More
