import {
  AppIcon,
  AppPressable,
  Box,
  Button,
  PageError,
  PushaActivityIndicator,
  Typography
} from '@/components/ui'
import {ScreenView} from '@/components/util/screen-view'
import {QUERY_KEYS} from '@/constants/queryKeys'
import {
  type IChatSession,
  useGetChatMessages,
  useGetChats,
  useHandOverChat,
  useTakeOverChat
} from '@/queries/chatsQuery'
import {
  getCustomerInitial,
  getCustomerName,
  getCustomerSubtitle
} from '@/utils/chatSessionDisplay'
import {connectDashboardChatSocket} from '@/utils/dashboardChatSocket'
import {getFromVault} from '@/utils/storage'
import {router, useLocalSearchParams} from 'expo-router'
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {ActivityIndicator, Pressable, StyleSheet} from 'react-native'
import {
  Bubble,
  BubbleProps,
  GiftedChat,
  IMessage,
  InputToolbar,
  SendProps
} from 'react-native-gifted-chat'
import {useQueryClient} from '@tanstack/react-query'
import type {Socket} from 'socket.io-client'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

/** Stable ids for GiftedChat alignment (left = customer, right = merchant). */
const MERCHANT_ID = 'merchant' as const
const CUSTOMER_ID = 'customer' as const

/** Align with web chat-inbox message fetch depth */
const CHAT_LIST_QUERY = {page: 1, limit: 1000000} as const
const CHAT_MESSAGES_QUERY = {page: 1, limit: 1000000} as const

interface ChatApiMessage {
  id?: string
  content?: string
  message?: string
  sender_type?: string
  direction?: 'INBOUND' | 'OUTBOUND'
  created_at?: string
}

function extractMessages(raw: unknown): ChatApiMessage[] {
  if (Array.isArray(raw)) return raw
  if (raw && typeof raw === 'object') {
    const d = raw as {data?: unknown; records?: unknown}
    if (Array.isArray(d.data)) return d.data
    if (Array.isArray(d.records)) return d.records
  }
  return []
}

function isOutbound(item: ChatApiMessage): boolean {
  if (item.direction === 'OUTBOUND') return true
  if (item.direction === 'INBOUND') return false
  return item.sender_type === 'merchant'
}

function toGiftedMessages(
  rows: ChatApiMessage[],
  names: {merchant: string; customer: string}
): IMessage[] {
  const merchantUser = {_id: MERCHANT_ID, name: names.merchant}
  const customerUser = {_id: CUSTOMER_ID, name: names.customer}
  const mapped: IMessage[] = rows.map((item, index) => {
    const id = item.id ?? `row-${index}`
    const isMerchant = isOutbound(item)
    const text = item.content ?? item.message ?? ''
    const created = item.created_at ? new Date(item.created_at) : new Date()
    return {
      _id: id,
      text,
      createdAt: created,
      user: isMerchant ? merchantUser : customerUser
    }
  })
  return mapped.sort((a, b) => {
    const ta =
      a.createdAt instanceof Date ? a.createdAt.getTime() : Number(a.createdAt)
    const tb =
      b.createdAt instanceof Date ? b.createdAt.getTime() : Number(b.createdAt)
    return tb - ta
  })
}

function ChatNavTitle({
  session,
  listLoading
}: {
  session: IChatSession | undefined
  listLoading: boolean
}) {
  if (listLoading && !session) {
    return (
      <Box
        flex={1}
        alignItems="center"
        justifyContent="center"
        minHeight={40}
        minWidth={0}>
        <ActivityIndicator size="small" color="#2554C7" />
      </Box>
    )
  }

  if (!session) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center" minWidth={0}>
        <Typography variant="h3-bold" color="secondary-500" numberOfLines={1}>
          Conversation
        </Typography>
      </Box>
    )
  }

  const name = getCustomerName(session)
  const initial = getCustomerInitial(session)
  const subtitle = getCustomerSubtitle(session)

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      gap={10}
      minWidth={0}
      flex={1}
      paddingRight={4}>
      <Box
        width={40}
        height={40}
        borderRadius={22}
        backgroundColor="primary-100"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}>
        <Typography variant="body-bold" color="white">
          {initial}
        </Typography>
      </Box>
      <Box flex={1} minWidth={0}>
        <Box flexDirection="row" alignItems="center" gap={6}>
          <Typography
            variant="body-semibold"
            color="secondary-500"
            numberOfLines={1}
            style={{flexShrink: 1}}>
            {name}
          </Typography>
          <Box
            paddingHorizontal={6}
            paddingVertical={2}
            borderRadius={4}
            backgroundColor={
              session.ai_controlled ? 'light-primary' : 'success-200'
            }
            flexShrink={0}>
            <Typography
              variant="c2"
              color={session.ai_controlled ? 'primary-100' : 'success-100'}>
              {session.ai_controlled ? 'AI' : 'Human'}
            </Typography>
          </Box>
        </Box>
        <Typography variant="c2" color="neutral-600" mt={2} numberOfLines={1}>
          {subtitle}
        </Typography>
      </Box>
    </Box>
  )
}

const Page = () => {
  const {chatId} = useLocalSearchParams<{chatId: string}>()
  const queryClient = useQueryClient()
  const socketRef = useRef<Socket | null>(null)
  const [chatSocketStatus, setChatSocketStatus] = useState<
    'connected' | 'disconnected'
  >('disconnected')

  const {
    data,
    isLoading,
    isError,
    refetch: refetchMessages
  } = useGetChatMessages(chatId ?? '', CHAT_MESSAGES_QUERY)
  const {
    data: chatsData,
    isLoading: chatsListLoading,
    refetch: refetchChats
  } = useGetChats(CHAT_LIST_QUERY)

  const takeOverMutation = useTakeOverChat()
  const handOverMutation = useHandOverChat()
  const insets = useSafeAreaInsets()

  const chatSession = useMemo(
    () => chatsData?.records?.find(s => s.id === chatId),
    [chatsData?.records, chatId]
  )

  /** Human merchant has control (not AI) — only then can we send. */
  const humanHasControl = chatSession?.ai_controlled === false
  const isTogglingControl =
    takeOverMutation.isPending || handOverMutation.isPending

  const navTitle = useMemo(
    () => (
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        my={12}>
          <AppPressable onPress={() => router.back()} marginRight={10}>
            <AppIcon name="ChevronLeft" size={24} color="black" />
          </AppPressable>
        <ChatNavTitle session={chatSession} listLoading={chatsListLoading} />

        <Button
          size="sm"
          variant={humanHasControl ? 'primary' : 'outline'}
          label={humanHasControl ? 'Hand over' : 'Take over'}
          loading={isTogglingControl}
          disabled={isTogglingControl}
          onPress={() => {
            if (!chatId || isTogglingControl) return
            if (humanHasControl) {
              handOverMutation.mutate(chatId)
            } else {
              takeOverMutation.mutate(chatId)
            }
          }}
        />
      </Box>
    ),
    [chatSession, chatsListLoading]
  )

  const headerAction = useMemo(() => {
    if (!chatId || !chatSession) return null
    return (
      <Box maxWidth={118} flexShrink={0}>
        <Button
          size="sm"
          variant={humanHasControl ? 'primary' : 'outline'}
          label={humanHasControl ? 'Hand over' : 'Take over'}
          loading={isTogglingControl}
          disabled={isTogglingControl}
          onPress={() => {
            if (!chatId || isTogglingControl) return
            if (humanHasControl) {
              handOverMutation.mutate(chatId)
            } else {
              takeOverMutation.mutate(chatId)
            }
          }}
        />
      </Box>
    )
  }, [
    chatId,
    chatSession,
    humanHasControl,
    isTogglingControl,
    takeOverMutation,
    handOverMutation
  ])

  const chatDisplayNames = useMemo(() => {
    const vaultUser = getFromVault('user') as {name?: string} | undefined
    const merchant =
      typeof vaultUser?.name === 'string' && vaultUser.name.trim()
        ? vaultUser.name.trim()
        : 'You'
    const customer = chatSession ? getCustomerName(chatSession) : 'Visitor'
    return {merchant, customer}
  }, [chatSession])

  const merchantUser = useMemo(
    () => ({_id: MERCHANT_ID, name: chatDisplayNames.merchant}),
    [chatDisplayNames.merchant]
  )

  const serverMessages = useMemo(() => {
    const rows = extractMessages(data)
    return toGiftedMessages(rows, {
      merchant: chatDisplayNames.merchant,
      customer: chatDisplayNames.customer
    })
  }, [data, chatDisplayNames])

  const messages = useMemo(() => serverMessages, [serverMessages])

  const messageQueryKey = useMemo(
    () => [QUERY_KEYS.CHAT_MESSAGES, chatId, CHAT_MESSAGES_QUERY] as const,
    [chatId]
  )

  useEffect(() => {
    if (!chatId) return
    const token = getFromVault('accessToken') as string | undefined
    if (!token) return

    const socket = connectDashboardChatSocket({
      session_id: chatId,
      token
    })
    socketRef.current = socket

    const syncSocketStatus = () => {
      setChatSocketStatus(socket.connected ? 'connected' : 'disconnected')
    }
    syncSocketStatus()
    socket.on('connect', syncSocketStatus)
    socket.on('disconnect', syncSocketStatus)

    const handleChatResponse = (payload: unknown) => {
      const d = payload as Record<string, unknown>
      const content = String(d?.text ?? d?.message ?? d?.content ?? '').trim()
      if (!content) return

      const createdAt =
        typeof d.created_at === 'string'
          ? d.created_at
          : new Date().toISOString()
      const dirRaw = d.direction
      const direction: 'INBOUND' | 'OUTBOUND' =
        dirRaw === 'INBOUND' || dirRaw === 'OUTBOUND' ? dirRaw : 'INBOUND'

      const incoming: ChatApiMessage = {
        id: `ws-${createdAt}-${Math.random().toString(16).slice(2)}`,
        content,
        created_at: createdAt,
        direction,
        sender_type: direction === 'OUTBOUND' ? 'merchant' : undefined
      }

      queryClient.setQueryData(messageQueryKey, (old: unknown) => {
        const existing = extractMessages(old)
        const last = existing[existing.length - 1]
        if (
          last &&
          last.content === incoming.content &&
          last.created_at === incoming.created_at
        ) {
          return old
        }
        return [...existing, incoming]
      })
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.CHATS]})
    }

    socket.on('chat-response', handleChatResponse)

    return () => {
      socket.off('connect', syncSocketStatus)
      socket.off('disconnect', syncSocketStatus)
      socket.off('chat-response', handleChatResponse)
      socket.disconnect()
      if (socketRef.current === socket) socketRef.current = null
    }
  }, [chatId, messageQueryKey, queryClient])

  const onSend = useCallback(
    (newMessages: IMessage[] = []) => {
      const text = newMessages[0]?.text?.trim()
      if (!text || !chatId) return
      if (!humanHasControl) return

      const createdAt = new Date().toISOString()
      const outgoing: ChatApiMessage = {
        id: `local-${createdAt}-${Math.random().toString(16).slice(2)}`,
        content: text,
        created_at: createdAt,
        direction: 'OUTBOUND',
        sender_type: 'merchant'
      }

      queryClient.setQueryData(messageQueryKey, (old: unknown) => {
        const existing = extractMessages(old)
        return [...existing, outgoing]
      })
      queryClient.invalidateQueries({queryKey: [QUERY_KEYS.CHATS]})

      socketRef.current?.emit('chat-message', {
        session_id: chatId,
        message: text
      })
    },
    [chatId, humanHasControl, messageQueryKey, queryClient]
  )

  const renderBubble = useCallback((props: BubbleProps<IMessage>) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: styles.bubbleRight,
          left: styles.bubbleLeft
        }}
        textStyle={{
          right: styles.bubbleTextRight,
          left: styles.bubbleTextLeft
        }}
      />
    )
  }, [])

  const renderSend = useCallback(
    (props: SendProps<IMessage>) => {
      const text = props.text?.trim() ?? ''
      const canSend =
        chatSocketStatus === 'connected' &&
        text.length > 0 &&
        !props.disabled &&
        typeof props.onSend === 'function'

      return (
        <Pressable
          style={({pressed}) => [
            styles.sendButton,
            !canSend && styles.sendButtonMuted,
            pressed && canSend && styles.sendButtonPressed
          ]}
          onPress={() => {
            if (!canSend || !props.onSend) return
            props.onSend({text} as Partial<IMessage>, true)
          }}
          disabled={!canSend}
          hitSlop={{top: 4, bottom: 4, left: 4, right: 4}}>
          <AppIcon name="Send" size={16} color="#fff" />
        </Pressable>
      )
    },
    [chatSocketStatus]
  )

  const renderInputToolbar = useCallback(
    (props: React.ComponentProps<typeof InputToolbar>) => {
      if (!humanHasControl) {
        return (
          <Box
            paddingHorizontal={16}
            paddingVertical={14}
            style={{
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: 'white'
            }}
            backgroundColor="neutral-100">
            <Typography
              variant="c1"
              color="neutral-600"
              style={{textAlign: 'center'}}>
              Take over this chat to reply. Use the button above.
            </Typography>
          </Box>
        )
      }
      return <InputToolbar {...props} />
    },
    [humanHasControl]
  )

  if (!chatId) {
    return (
      <ScreenView navTitle="Chat" alignNav="center" hasTopBanner={false}>
        <Box flex={1} alignItems="center" justifyContent="center" padding={24}>
          <Typography variant="body" color="neutral-600" textAlign="center">
            Missing conversation id.
          </Typography>
        </Box>
      </ScreenView>
    )
  }

  if (isError) {
    return (
      <PageError
        reload={async () => {
          await refetchMessages()
          await refetchChats()
        }}
      />
    )
  }

  if (isLoading && data == null) {
    return (
      <ScreenView
        hasTopBanner={false}
        footerPadding={false}
        backButton={false}
        headerAction={navTitle}>
        <Box flex={1} alignItems="center" justifyContent="center">
          <PushaActivityIndicator />
        </Box>
      </ScreenView>
    )
  }

  return (
    <ScreenView
      hasTopBanner={false}
      footerPadding={true}
      backButton={false}
      headerAction={navTitle}>
      <Box flex={1}>
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={merchantUser}
          // renderUsernameOnMessage
          renderBubble={renderBubble}
          bottomOffset={insets.bottom}
          messagesContainerStyle={styles.messagesContainer}
          placeholder={
            humanHasControl ? 'Type a message…' : 'Take over to reply…'
          }
          textInputProps={{
            editable: humanHasControl
          }}
          alwaysShowSend={true}
          renderSend={renderSend}
          renderInputToolbar={renderInputToolbar}
          renderChatEmpty={() => (
            <Box
              flex={1}
              alignItems="center"
              justifyContent="center"
              paddingHorizontal={24}>
              <Typography
                variant="body"
                color="secondary-400"
                style={{textAlign: 'center'}}>
                No messages yet. Say hello to start the conversation.
              </Typography>
            </Box>
          )}
          {...({
            containerStyle: {
              left: styles.messageRowLeft,
              right: styles.messageRowRight
            }
          } as Record<string, unknown>)}
        />
      </Box>
    </ScreenView>
  )
}

const styles = StyleSheet.create({
  messagesContainer: {flex: 1},
  messageRowLeft: {marginBottom: 10},
  messageRowRight: {marginBottom: 10},
  bubbleRight: {backgroundColor: '#2554C7', paddingVertical: 4},
  bubbleLeft: {backgroundColor: '#F5F5F5'},
  bubbleTextRight: {color: '#fff', fontSize: 14},
  bubbleTextLeft: {color: '#142952', fontSize: 14},
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2554C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 4,
    flexShrink: 0,
    alignSelf: 'flex-end'
  },
  sendButtonMuted: {opacity: 0.35},
  sendButtonPressed: {opacity: 0.85},
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 4,
    backgroundColor: '#2554C7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  sendText: {color: '#fff', fontWeight: '600', fontSize: 15}
})

export default Page
