import {AppIcon, Box, Container, EmptyState, PageError, PushaActivityIndicator, Typography} from '@/components/ui'
import {ScreenView} from '@/components/util/screen-view'
import {FloatingButton} from '@/components/shared'
import {useListExpenses} from '@/queries/expensesQuery'
import React, {useState} from 'react'
import {FlatList} from 'react-native'
import AddOrEditExpenses from '@/components/modals/add-or-edit-expenses'

const Page = () => {
  const [showAdd, setShowAdd] = useState(false)
  const {data, isLoading, isError, refetch} = useListExpenses()
  const items = (data as any)?.data ?? data ?? []

  if (isError) return <PageError reload={refetch} />

  return (
    <ScreenView navTitle="Expenses" alignNav="center" hasTopBanner={false}>
      {isLoading ? (
        <Box flex={1} alignItems="center" justifyContent="center"><PushaActivityIndicator /></Box>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item: any, i) => item?.id ?? String(i)}
          renderItem={({item}: {item: any}) => (
            <Box flexDirection="row" alignItems="center" justifyContent="space-between" px={16} py={14}
              borderBottomWidth={1} style={{borderBottomColor: '#F5F5F5'}}>
              <Box flex={1}>
                <Typography variant="body-semibold" color="secondary-500">{item.title || item.description || 'Expense'}</Typography>
                <Typography variant="c2" color="neutral-600" mt={2}>{item.category || ''}</Typography>
              </Box>
              <Typography variant="body-bold" color="error-100">-₦{item.amount ? Number(item.amount).toLocaleString() : '0'}</Typography>
            </Box>
          )}
          ListEmptyComponent={<EmptyState title="No expenses" description="Track your business expenses here." actionText="Add Expense" onAction={() => setShowAdd(true)} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}
        />
      )}
      <FloatingButton onPress={() => setShowAdd(true)}>
        <AppIcon name="Plus" size={24} color="#fff" />
      </FloatingButton>
      <AddOrEditExpenses show={showAdd} onClose={() => setShowAdd(false)} />
    </ScreenView>
  )
}

export default Page
