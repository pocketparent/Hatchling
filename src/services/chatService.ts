// File: src/services/chatService.ts

import { db, auth } from '../config/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export async function saveChatToFirestore({
  childId,
  question,
  reply,
  model = 'gpt-3.5-turbo',
}: {
  childId: string
  question: string
  reply: string
  model?: string
}): Promise<void> {
  const currentUser = auth.currentUser

  if (!currentUser?.uid) {
    console.error('❌ Cannot save chat: No authenticated user')
    throw new Error('User is not authenticated')
  }

  const userId = currentUser.uid
  const chatsRef = collection(db, 'users', userId, 'chats')

  console.log('📤 Saving chat to Firestore path:', `users/${userId}/chats`)
  console.log('📝 Chat content:', { question, reply })

  await addDoc(chatsRef, {
    userId, // still included as a field for reference
    childId,
    question,
    reply,
    model,
    createdAt: serverTimestamp(),
  })
}
