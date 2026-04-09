import {AppIcon, Box, Container, EmptyState, PageError, PushaActivityIndicator, Typography} from '@/components/ui'
import {AppView} from '@/components/ui/app-view'
import { ScreenView } from '@/components/util/screen-view';
import {type IChatSession, useGetChats} from '@/queries/chatsQuery'
import {
  getCustomerInitial,
  getCustomerName,
  getCustomerSubtitle,
} from '@/utils/chatSessionDisplay'
import {formatDate} from '@/utils/datetime'
import {router} from 'expo-router'
import {StatusBar} from 'expo-status-bar'
import React from 'react'
import {FlatList, TouchableOpacity} from 'react-native'

const ChatItem = ({item, onPress}: {item: IChatSession; onPress: () => void}) => {
  const name = getCustomerName(item)
  const initial = getCustomerInitial(item)
  const subtitle = getCustomerSubtitle(item)
  const timestamp = item.updated_at ? formatDate(item.updated_at, 'MMM d') : ''

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <Box
        flexDirection="row"
        alignItems="center"
        px={16}
        py={14}
        borderBottomWidth={1}
        style={{borderBottomColor: '#F5F5F5'}}
        gap={12}>
        {/* Avatar */}
        <Box
          width={44}
          height={44}
          borderRadius={22}
          backgroundColor="primary-100"
          alignItems="center"
          justifyContent="center">
          <Typography variant="body-bold" color="white">
            {initial}
          </Typography>
        </Box>

        {/* Content */}
        <Box flex={1}>
          <Box flexDirection="row" alignItems="center" gap={6}>
            <Typography variant="body-semibold" color="secondary-500">
              {name}
            </Typography>
            {/* AI badge */}
            <Box
              paddingHorizontal={6}
              paddingVertical={2}
              borderRadius={4}
              backgroundColor={item.ai_controlled ? 'light-primary' : 'success-200'}>
              <Typography
                variant="c2"
                color={item.ai_controlled ? 'primary-100' : 'success-100'}>
                {item.ai_controlled ? 'AI' : 'Human'}
              </Typography>
            </Box>
          </Box>
          <Typography variant="c2" color="neutral-600" mt={2} numberOfLines={1}>
            {subtitle}
          </Typography>
        </Box>

        {/* Timestamp */}
        <Typography variant="c2" color="neutral-500">
          {timestamp}
        </Typography>
      </Box>
    </TouchableOpacity>
  )
}

const Chats = () => {
  const {data, isLoading, isError, refetch} = useGetChats()

  const chats = data?.records ?? []

  if (isError) {
    return <PageError reload={() => refetch().then(() => {})} />
  }

  return (
    <ScreenView backButton={false} navTitle="Chats" hasTopBanner={false} footerPadding={false}>
      <StatusBar style="dark" animated />
      {/* <Container>
        <Box pt={16} pb={8} flexDirection="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h2-bold" color="secondary-500">
            Chats
          </Typography>
          {data?.pagination?.total ? (
            <Box
              paddingHorizontal={8}
              paddingVertical={3}
              borderRadius={12}
              backgroundColor="light-primary">
              <Typography variant="c2" color="primary-100">
                {data.pagination.total}
              </Typography> 
            </Box>
          ) : null}
        </Box>
      </Container> */}

      {isLoading ? (
        <Box flex={1} alignItems="center" justifyContent="center">
          <PushaActivityIndicator />
        </Box>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item, i) => item.id ?? String(i)}
          renderItem={({item}) => (
            <ChatItem
              item={item}
              onPress={() => router.push(`/(auth)/chat/${item.id}` as any)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              title="No chats yet"
              description="Customer conversations will appear here."
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}
        />
      )}
    </ScreenView>
  )
}

export default Chats
