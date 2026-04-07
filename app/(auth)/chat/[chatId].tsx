import {Box, Container, PageError, PushaActivityIndicator, Typography} from '@/components/ui'
import {ScreenView} from '@/components/util/screen-view'
import {useGetChatMessages} from '@/queries/chatsQuery'
import {useLocalSearchParams} from 'expo-router'
import React, {useState} from 'react'
import {FlatList, TextInput, TouchableOpacity, StyleSheet} from 'react-native'
import {ChatBubble} from '@/components/ui/chat-bubble'

const Page = () => {
  const {chatId} = useLocalSearchParams<{chatId: string}>()
  const {data, isLoading, isError, refetch} = useGetChatMessages(chatId ?? '')
  const [message, setMessage] = useState('')

  const messages = (data as any)?.data ?? data ?? []

  if (isError) return <PageError reload={refetch} />

  return (
    <ScreenView navTitle="Chat" alignNav="center" hasTopBanner={false}>
      {isLoading ? (
        <Box flex={1} alignItems="center" justifyContent="center"><PushaActivityIndicator /></Box>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item: any, i) => item?.id ?? String(i)}
          renderItem={({item}: {item: any}) => (
            <Box px={16} py={4}>
              <ChatBubble
                message={item.content || item.message || ''}
                isOwn={item.sender_type === 'merchant'}
                timestamp={item.created_at ? new Date(item.created_at).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : undefined}
              />
            </Box>
          )}
          inverted
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}
        />
      )}
      <Box style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity style={styles.sendBtn} onPress={() => setMessage('')}>
          <Typography variant="body-bold" color="white">Send</Typography>
        </TouchableOpacity>
      </Box>
    </ScreenView>
  )
}

const styles = StyleSheet.create({
  inputContainer: {flexDirection: 'row', alignItems: 'flex-end', padding: 12, gap: 8, borderTopWidth: 1, borderTopColor: '#E9EAEB', backgroundColor: '#fff'},
  input: {flex: 1, borderWidth: 1, borderColor: '#E9EAEB', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, maxHeight: 100},
  sendBtn: {backgroundColor: '#2554C7', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10},
})

export default Page
