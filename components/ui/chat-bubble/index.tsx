import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

interface ChatBubbleProps {
  message: string
  isOwn?: boolean
  timestamp?: string
}

export const ChatBubble = ({message, isOwn = false, timestamp}: ChatBubbleProps) => {
  return (
    <View style={[styles.container, isOwn ? styles.own : styles.other]}>
      <Text style={[styles.message, isOwn ? styles.ownText : styles.otherText]}>{message}</Text>
      {timestamp ? <Text style={styles.timestamp}>{timestamp}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {maxWidth: '75%', borderRadius: 12, padding: 12, marginVertical: 4},
  own: {backgroundColor: '#2554C7', alignSelf: 'flex-end'},
  other: {backgroundColor: '#F5F5F5', alignSelf: 'flex-start'},
  message: {fontSize: 14},
  ownText: {color: '#fff'},
  otherText: {color: '#142952'},
  timestamp: {fontSize: 10, color: '#94A3B8', marginTop: 4, alignSelf: 'flex-end'},
})

export default ChatBubble
