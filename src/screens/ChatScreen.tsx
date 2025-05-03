import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native'
import { NLInputBar } from '../components/common/NLInputBar'
import { useChildChatContext } from '../hooks/useChildChatContext'
import { sendChatToOpenAI } from '../services/openaiService'
import { saveChatToFirestore } from '../services/chatService'
import { ChatMessage } from '../models/chatTypes'
import { spacing } from '../theme/spacing'
import { colors } from '../theme/colors'
import { RouteProp, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../../App'
import { auth } from '../config/firebase'
import { Ionicons } from '@expo/vector-icons'

interface ChatScreenProps {
  childId?: string // optional to allow useChildChatContext to handle it
  onClose?: () => void // for modal usage
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ childId, onClose }) => {
  const userId = auth.currentUser?.uid
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [contextLoaded, setContextLoaded] = useState(false)

  useEffect(() => {
    const loadContext = async () => {
      if (!userId || !childId) return
      const context = await useChildChatContext(userId, childId)
      setMessages([context.systemMessage])
      setContextLoaded(true)
    }
    loadContext()
  }, [userId, childId])

  const handleSubmit = async (userText: string) => {
    if (!contextLoaded || !userId || !childId) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: userText,
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setLoading(true)

    const response = await sendChatToOpenAI(newMessages)
    setLoading(false)

    if (response.success) {
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.reply,
      }

      setMessages([...newMessages, assistantMessage])

      await saveChatToFirestore({
        childId,
        question: userText,
        reply: response.reply,
      })
    } else {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Sorry, I couldn’t process that right now. Try again soon.',
        },
      ])
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {onClose && (
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="chevron-down" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
      )}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {messages
          .filter(m => m.role !== 'system')
          .map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                msg.role === 'user' ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              <Text style={styles.messageText}>{msg.content}</Text>
            </View>
          ))}
        {loading && <ActivityIndicator size="small" color={colors.accentPrimary} />}
      </ScrollView>
      <NLInputBar onSubmit={handleSubmit} />
    </View>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  messageBubble: {
    marginBottom: spacing.sm,
    borderRadius: 16,
    padding: spacing.sm,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: colors.accentSecondary,
    alignSelf: 'flex-end',
  },
  assistantBubble: {
    backgroundColor: colors.card,
    alignSelf: 'flex-start',
  },
  messageText: {
    color: colors.textPrimary,
  },
  backButton: {
    padding: spacing.md,
    alignSelf: 'flex-start',
  },
})