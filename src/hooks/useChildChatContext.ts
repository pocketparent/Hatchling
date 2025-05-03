import { Timestamp, collection, getDoc, getDocs, doc, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '../config/firebase'
import { Activity } from '../models/types'
import { ChatContext, ChatMessage } from '../models/chatTypes'
import { differenceInDays, format } from 'date-fns'

const ACTIVITY_TYPES = ['sleep', 'feeding', 'diaper', 'milestone', 'health']
const THREE_WEEKS_AGO = new Date(Date.now() - 1000 * 60 * 60 * 24 * 21)
export async function useChildChatContext(userId: string, childId: string): Promise<ChatContext> {
  // --- Step 1: Fetch child profile ---
  const childDocRef = doc(db, 'users', userId, 'children', childId)
  const childSnap = await getDoc(childDocRef)

  if (!childSnap.exists()) throw new Error('Child not found')
  const child = childSnap.data()
  const childName = child.name || 'your baby'

  const dob = child.dob?.toDate?.()
  const ageInMonths = dob ? Math.max(0, Math.floor(differenceInDays(new Date(), dob) / 30.5)) : 'unknown'

  // --- Step 2: Fetch entries for past 3 weeks by type ---
  const entries: Activity[] = []

  for (const type of ACTIVITY_TYPES) {
    const entriesRef = collection(db, 'entries')
    const typeQuery = query(
      entriesRef,
      where('userId', '==', userId),
      where('childId', '==', childId),
      where('type', '==', type),
      where('createdAt', '>=', Timestamp.fromDate(THREE_WEEKS_AGO)),
      orderBy('createdAt', 'desc'),
      limit(200)
    )
    const snap = await getDocs(typeQuery)
    snap.docs.forEach(doc => entries.push(doc.data() as Activity))
  }

  // --- Step 3: Summarize key data ---
  const sleepEntries = entries.filter(e => e.type === 'sleep')
  const diaperEntries = entries.filter(e => e.type === 'diaper')
  const feedingEntries = entries.filter(e => e.type === 'feeding')

  const lastNapEntry = sleepEntries[0]
  const toDate = (input: any): Date | null => {
    if (!input) return null
    if (typeof input === 'string') return new Date(input)
    if (input.toDate) return input.toDate()
    return null
  }
  
  const lastNapTime = toDate(lastNapEntry?.createdAt)
    ? format(toDate(lastNapEntry?.createdAt)!, 'MMM d, h:mm a')
    : 'N/A'

  // --- Step 4: Build system prompt ---
  const systemContent = `
You are a kind and practical assistant helping parents of young children.

This baby is named ${childName} and is ${ageInMonths} months old.
In the last 3 weeks:
- ${sleepEntries.length} sleep sessions were logged.
- ${feedingEntries.length} feedings were recorded.
- ${diaperEntries.length} diaper changes occurred.
The most recent nap began around ${lastNapTime}.

Respond with helpful insights based only on the above context. Do not assume information you don’t have.
`.trim()

  const systemMessage: ChatMessage = {
    role: 'system',
    content: systemContent,
  }

  // --- Step 5: Return context ---
  return {
    systemMessage,
    historyMessages: [], // Can fetch from /users/{userId}/chats later
  }
}
