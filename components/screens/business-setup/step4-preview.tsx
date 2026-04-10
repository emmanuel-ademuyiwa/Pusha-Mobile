import {api} from '@/api'
import {
  AppIcon,
  Box,
  Button,
  Container,
  TextField,
  Typography
} from '@/components/ui'
import {KeyboardAwareScrollView} from '@/components/util/keyboard-aware-scroll-view'
import {useGetBusiness, useUpdateAssistant} from '@/queries/merchantQuery'
import {errorHandler} from '@/utils/errorHandler'
import {getFromVault} from '@/utils/storage'
import {formatTime} from '@/utils/datetime'
import {connectWebchatClientSocket} from '@/utils/webchatClientSocket'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import type {Socket} from 'socket.io-client'

interface Step4PreviewProps {
  handleNext: () => void
  handleBack: () => void
}

type ChatBubble = {
  id: string
  sender: 'user' | 'bot'
  message: string
  time: string
}

const Step4Preview = ({handleNext, handleBack}: Step4PreviewProps) => {
  const [aiName, setAiName] = useState('')
  const {mutateAsync: patchAssistant, isPending} = useUpdateAssistant()
  const {data: business, refetch: refetchBusiness} = useGetBusiness()

  const [chatMessages, setChatMessages] = useState<ChatBubble[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatSocketStatus, setChatSocketStatus] = useState<
    'idle' | 'connecting' | 'connected'
  >('idle')

  const chatSocketRef = useRef<Socket | null>(null)
  const sessionIdRef = useRef<string | null>(null)
  const chatStartedRef = useRef(false)
  const messagesScrollRef = useRef<ScrollView>(null)

  const displayName = aiName.trim() || 'Your AI assistant'
  const businessId =
    business && typeof business === 'object'
      ? (business as {id?: string}).id
      : undefined

  const scrollToBottom = useCallback(() => {
    messagesScrollRef.current?.scrollToEnd({animated: true})
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages, scrollToBottom])

  useEffect(() => {
    if (!businessId) {
      refetchBusiness()
      return
    }
    if (chatStartedRef.current) return
    chatStartedRef.current = true

    let ignored = false

    const user = getFromVault('user') as Record<string, unknown> | undefined
    const userName =
      [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Visitor'
    const userEmail =
      typeof user?.email === 'string' ? user.email : `visitor@pusha.ai`
    const userPhone =
      typeof user?.phone_number === 'string' ? user.phone_number : '00000000000'

    // Generate client-side session id FIRST (mirrors the webchat widget pattern)
    const clientSessionId = `${Date.now()}-${Math.random().toString(16).slice(2)}`

    setChatSocketStatus('connecting')
    console.log('[Step4] connecting socket with client session_id:', clientSessionId, ' business_id:', businessId)

    // Connect socket immediately with the client-generated session_id — don't wait for startChat
    const socket = connectWebchatClientSocket({
      business_id: businessId,
      session_id: clientSessionId
    })
    chatSocketRef.current = socket
    sessionIdRef.current = clientSessionId

    socket.on('connect', () => {
      if (ignored) return
      console.log('[Step4] socket CONNECTED ✓  socket.id:', socket.id, ' session_id:', clientSessionId)
      setChatSocketStatus('connected')

      // Call startChat AFTER socket is connected (registers user info with server)
      console.log('[Step4] calling startChat to register session…')
      api.webchat
        .startChat({
          business_id: businessId,
          name: userName,
          email: userEmail,
          phone_number: userPhone
        })
        .then((axiosRes: unknown) => {
          if (ignored) return
          console.log('[Step4] startChat response (raw):', JSON.stringify(axiosRes))
          // Use server's session_id if returned, otherwise keep client-generated one
          const body = (axiosRes as any)?.data
          const inner = body?.data ?? body
          const serverSid: string | undefined =
            inner?.session_id ?? inner?.sessionId ?? undefined
          const sid = serverSid ?? clientSessionId
          if (serverSid && serverSid !== clientSessionId) {
            console.log('[Step4] server returned different session_id:', serverSid, '— using it for emit')
            sessionIdRef.current = serverSid
          }

          const opening = 'Hi! What do you sell?'
          const now = new Date().toISOString()
          setChatMessages([
            {
              id: `user-${now}`,
              sender: 'user',
              message: opening,
              time: formatTime(now)
            }
          ])
          const emitPayload = {session_id: sid, business_id: businessId, message: opening}
          console.log('[Step4] emitting clientwebchat-message →', JSON.stringify(emitPayload))
          socket.emit('clientwebchat-message', emitPayload)
        })
        .catch((err: unknown) => {
          if (ignored) return
          console.error('[Step4] startChat failed:', err)
          // Still try sending with client session_id even if startChat fails
          const opening = 'Hi! What do you sell?'
          const now = new Date().toISOString()
          setChatMessages([
            {id: `user-${now}`, sender: 'user', message: opening, time: formatTime(now)}
          ])
          socket.emit('clientwebchat-message', {
            session_id: clientSessionId,
            business_id: businessId,
            message: opening
          })
        })
    })

    // Catch-all — fires for EVERY event the socket receives (dev aid)
    socket.onAny((event: string, ...args: unknown[]) => {
      console.log('[Step4] ← socket event received:', event, JSON.stringify(args))
    })

    socket.on('chat-response', (data: Record<string, unknown>) => {
      if (ignored) return
      const content = (
        data?.text ??
        data?.message ??
        data?.content ??
        ''
      ).toString()
      if (!content) return
      const ts = (data?.created_at as string) || new Date().toISOString()
      setChatMessages(prev => [
        ...prev,
        {
          id: `bot-${ts}-${Math.random().toString(16).slice(2)}`,
          sender: 'bot',
          message: content,
          time: formatTime(ts)
        }
      ])
    })

    socket.on('connect_error', (err: Error) => {
      console.error('[Step4] socket connect_error:', err.message, (err as any).data)
      if (!ignored) setChatSocketStatus('idle')
    })

    socket.on('disconnect', (reason: string) => {
      console.warn('[Step4] socket DISCONNECTED, reason:', reason)
      if (!ignored) setChatSocketStatus('idle')
    })

    return () => {
      ignored = true
      chatSocketRef.current?.disconnect()
      chatSocketRef.current = null
      chatStartedRef.current = false
      sessionIdRef.current = null
    }
  }, [businessId, refetchBusiness])

  const handleChatSend = () => {
    if (!chatSocketRef.current || chatSocketStatus !== 'connected') return
    const message = chatInput.trim()
    if (!message || !businessId) return

    const now = new Date().toISOString()
    setChatMessages(prev => [
      ...prev,
      {
        id: `user-${now}`,
        sender: 'user',
        message,
        time: formatTime(now)
      }
    ])
    setChatInput('')
    // Read session_id from socket query opts (matches web app approach)
    const sid = (chatSocketRef.current as any)?.io?.opts?.query?.session_id ?? sessionIdRef.current
    chatSocketRef.current.emit('clientwebchat-message', {
      session_id: sid,
      business_id: businessId,
      message
    })
  }

  const onLaunch = async () => {
    try {
      const name = aiName.trim()
      if (name) {
        await patchAssistant({name})
      }
      handleNext()
    } catch (err) {
      errorHandler(err)
    }
  }

  return (
    <KeyboardAwareScrollView>
      <Container>
        <Box mt={16} gap={20} pb={32}>
          <Box gap={4}>
            <Typography variant="c1-medium" color="primary-300">
              Step 4 of 4
            </Typography>
            <Typography variant="h2-bold" color="secondary-500">
              Meet {aiName.trim() || 'your AI assistant'}
            </Typography>
            <Typography variant="body" color="neutral-800">
              Chat with your AI as a customer would — powered by your business
            </Typography>
          </Box>

          {/* AI name */}
          <Box gap={6}>
            <Typography variant="c1-medium" color="neutral-800">
              Give your AI a name{' '}
              <Typography variant="c1" color="neutral-600">
                (optional)
              </Typography>
            </Typography>
            <TextField
              name="aiName"
              placeholder="e.g. Zara, Aria, Max"
              value={aiName}
              onChangeText={setAiName}
            />
            <Typography variant="c1" color="neutral-600">
              This is the name your customers will see when chatting
            </Typography>
          </Box>

          {/* Live chat */}
          <Box gap={8}>
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between">
              <Typography variant="body-bold" color="secondary-500">
                Try your AI
              </Typography>
              <Box flexDirection="row" alignItems="center" gap={6}>
                <Box
                  width={8}
                  height={8}
                  borderRadius={4}
                  style={{
                    backgroundColor:
                      chatSocketStatus === 'connected'
                        ? '#2ccb91'
                        : chatSocketStatus === 'connecting'
                          ? '#F5A623'
                          : '#94A3B8'
                  }}
                />
                <Typography variant="c1" color="neutral-700">
                  {chatSocketStatus === 'connected'
                    ? 'Online'
                    : chatSocketStatus === 'connecting'
                      ? 'Connecting…'
                      : 'Offline'}
                </Typography>
              </Box>
            </Box>

            {!businessId ? (
              <Box
                padding={24}
                alignItems="center"
                justifyContent="center"
                style={styles.chatShell}>
                <ActivityIndicator color="#2554C7" />
                <Typography variant="c1" color="neutral-700" marginTop={12}>
                  Loading your business…
                </Typography>
              </Box>
            ) : (
              <Box style={styles.chatShell} gap={0}>
                <Box
                  flexDirection="row"
                  alignItems="center"
                  gap={10}
                  padding={12}
                  style={styles.chatHeader}>
                  <Box
                    width={36}
                    height={36}
                    borderRadius={18}
                    alignItems="center"
                    justifyContent="center"
                    style={{backgroundColor: '#2554C7'}}>
                    <Typography style={{color: '#fff', fontSize: 11}}>
                      AI
                    </Typography>
                  </Box>
                  <Box flex={1}>
                    <Typography variant="body-bold" color="neutral-900">
                      {displayName}
                    </Typography>
                    <Typography variant="c1" color="neutral-600">
                      Preview conversation
                    </Typography>
                  </Box>
                </Box>

                <ScrollView
                  ref={messagesScrollRef}
                  style={styles.messagesScroll}
                  contentContainerStyle={styles.messagesContent}
                  keyboardShouldPersistTaps="handled">
                  {chatSocketStatus === 'connecting' &&
                    chatMessages.length === 0 && (
                      <Typography variant="c1" color="neutral-600">
                        Starting chat…
                      </Typography>
                    )}
                  {chatMessages.map(msg => (
                    <View
                      key={msg.id}
                      style={[
                        styles.bubbleWrap,
                        msg.sender === 'user' ? styles.bubbleWrapUser : null
                      ]}>
                      <View
                        style={[
                          styles.bubble,
                          msg.sender === 'user'
                            ? styles.bubbleUser
                            : styles.bubbleBot
                        ]}>
                        <Typography
                          color={
                            msg.sender === 'user' ? 'white' : 'neutral-900'
                          }
                          variant="body"
                          style={
                            msg.sender === 'user'
                              ? styles.bubbleTextUser
                              : styles.bubbleTextBot
                          }>
                          {msg.message}
                        </Typography>
                      </View>
                      <Typography
                        variant="c1"
                        color="neutral-600"
                        marginTop={4}>
                        {msg.time}
                      </Typography>
                    </View>
                  ))}
                </ScrollView>

                <Box
                  flexDirection="row"
                  alignItems="center"
                  gap={8}
                  padding={12}
                  style={styles.chatInputRow}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Type a message…"
                    placeholderTextColor="#94A3B8"
                    value={chatInput}
                    onChangeText={setChatInput}
                    editable={chatSocketStatus === 'connected'}
                    onSubmitEditing={handleChatSend}
                    returnKeyType="send"
                  />
                  <TouchableOpacity
                    style={[
                      styles.sendBtn,
                      (chatSocketStatus !== 'connected' || !chatInput.trim()) &&
                        styles.sendBtnDisabled
                    ]}
                    onPress={handleChatSend}
                    disabled={
                      chatSocketStatus !== 'connected' || !chatInput.trim()
                    }>
                    <AppIcon name="Send" size={16} color="#fff" />
                  </TouchableOpacity>
                </Box>
              </Box>
            )}
          </Box>

          {/* Banner */}
          <Box style={styles.successBanner} gap={4}>
            <Box flexDirection="row" alignItems="center" gap={6}>
              <AppIcon name="Rocket" size={16} color="#2554C7" />
              <Typography variant="body-bold" color="secondary-500">
                {aiName.trim()
                  ? `${aiName.trim()} works while you sleep 🌙`
                  : 'Your AI works while you sleep 🌙'}
              </Typography>
            </Box>
            <Typography variant="c1" color="neutral-700">
              {displayName} answers questions, confirms orders, and closes sales
              automatically. You take over any conversation at any time.
            </Typography>
          </Box>

          <Box flexDirection="row" gap={8} mt={8}>
            <Box flex={1}>
              <Button variant="outline" label="Back" onPress={handleBack} />
            </Box>
            <Box flex={2}>
              <Button
                hasLinearGradient
                label="Launch my store 🚀"
                loading={isPending}
                onPress={onLaunch}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  chatShell: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    minHeight: 280
  },
  chatHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F8',
    backgroundColor: '#FAFBFC'
  },
  messagesScroll: {
    maxHeight: 280,
    backgroundColor: '#F8F9FC'
  },
  messagesContent: {
    padding: 12,
    paddingBottom: 16
  },
  bubbleWrap: {
    marginBottom: 12,
    maxWidth: '92%'
  },
  bubbleWrapUser: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end'
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '100%'
  },
  bubbleUser: {
    backgroundColor: '#2554C7',
    borderBottomRightRadius: 4
  },
  bubbleBot: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomLeftRadius: 4,
    alignSelf: 'flex-start'
  },
  bubbleTextUser: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22
  },
  bubbleTextBot: {
    color: '#1A202C',
    fontSize: 15,
    lineHeight: 22
  },
  chatInputRow: {
    borderTopWidth: 1,
    borderTopColor: '#EDF2F8',
    backgroundColor: '#FFFFFF'
  },
  textInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    borderRadius: 22,
    paddingHorizontal: 16,
    backgroundColor: '#F1F5F9',
    color: '#0F172A',
    fontSize: 15
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2554C7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendBtnDisabled: {
    opacity: 0.45
  },
  successBanner: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#EEF3FF',
    borderWidth: 1,
    borderColor: 'rgba(37, 84, 199, 0.25)'
  }
})

export default Step4Preview
