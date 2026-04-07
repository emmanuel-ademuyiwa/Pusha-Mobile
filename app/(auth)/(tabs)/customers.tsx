import {AppIcon, Box, Container, EmptyState, PageError, PushaActivityIndicator, Typography} from '@/components/ui'
import {AppView} from '@/components/ui/app-view'
import {FloatingButton} from '@/components/shared'
import {useListCustomers} from '@/queries/customersQuery'
import {router} from 'expo-router'
import {StatusBar} from 'expo-status-bar'
import React, {useState} from 'react'
import {FlatList, TouchableOpacity} from 'react-native'
import AddOrEditCustomer from '@/components/modals/add-or-edit-customer'

const Customers = () => {
  const [showAdd, setShowAdd] = useState(false)
  const {data, isLoading, isError, refetch} = useListCustomers()

  const customers = (data as any)?.data ?? data ?? []

  if (isError) {
    return <PageError reload={refetch} />
  }

  return (
    <AppView hasTopBanner={false}>
      <StatusBar style="dark" animated />
      <Container>
        <Box pt={16} pb={8}>
          <Typography variant="h2-bold" color="secondary-500">
            Customers
          </Typography>
        </Box>
      </Container>

      {isLoading ? (
        <Box flex={1} alignItems="center" justifyContent="center">
          <PushaActivityIndicator />
        </Box>
      ) : (
        <FlatList
          data={customers}
          keyExtractor={(item: any, i) => item?.id ?? String(i)}
          renderItem={({item}: {item: any}) => (
            <TouchableOpacity
              onPress={() => router.push(`/(auth)/customers/${item.id}` as any)}>
              <Box
                flexDirection="row"
                alignItems="center"
                px={16}
                py={14}
                borderBottomWidth={1}
                style={{borderBottomColor: '#F5F5F5'}}
                gap={12}>
                <Box
                  width={40}
                  height={40}
                  borderRadius={20}
                  backgroundColor="primary-100"
                  alignItems="center"
                  justifyContent="center">
                  <Typography variant="body-bold" color="white">
                    {(item.first_name?.[0] ?? item.name?.[0] ?? '?').toUpperCase()}
                  </Typography>
                </Box>
                <Box flex={1}>
                  <Typography variant="body-semibold" color="secondary-500">
                    {item.first_name} {item.last_name}
                  </Typography>
                  <Typography variant="c2" color="neutral-600" mt={2}>
                    {item.email || item.phone_number || ''}
                  </Typography>
                </Box>
                <AppIcon name="ChevronRight" size={16} color="#94A3B8" />
              </Box>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <EmptyState
              title="No customers yet"
              description="Add your first customer to get started."
              actionText="Add Customer"
              onAction={() => setShowAdd(true)}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}
        />
      )}

      <FloatingButton onPress={() => setShowAdd(true)}>
        <AppIcon name="Plus" size={24} color="#fff" />
      </FloatingButton>

      <AddOrEditCustomer show={showAdd} onClose={() => setShowAdd(false)} />
    </AppView>
  )
}

export default Customers
