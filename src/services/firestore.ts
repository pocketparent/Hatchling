// File: src/services/firestore.ts
import { db } from '../config/firebase'
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore'
import { Activity } from '../models/types'

const entriesCollection = collection(db, 'entries')

/**
 * Add a new entry to Firestore.
 * Strips undefined fields and adds userId, createdAt, and dateKey.
 */
export async function addEntry(
  entry: Activity,
  userId: string
): Promise<void> {
  const createdAt = entry.createdAt || new Date().toISOString()
  const dateKey = createdAt.slice(0, 10)

  const payload: Partial<Activity> = {
    ...entry,
    userId,
    createdAt,
    dateKey,
  }
  // Remove undefined fields
  Object.keys(payload).forEach(key => {
    if ((payload as any)[key] === undefined) delete (payload as any)[key]
  })

  await addDoc(entriesCollection, payload as Record<string, any>)
}

/**
 * Update an existing entry in Firestore.
 * Strips undefined fields and updates createdAt and dateKey.
 */
export async function updateEntry(
  id: string,
  entry: Activity
): Promise<void> {
  const createdAt = entry.createdAt
  const dateKey = createdAt.slice(0, 10)

  const payload: Partial<Activity> = {
    ...entry,
    createdAt,
    dateKey,
  }
  Object.keys(payload).forEach(key => {
    if ((payload as any)[key] === undefined) delete (payload as any)[key]
  })

  const ref = doc(db, 'entries', id)
  await updateDoc(ref, payload as Record<string, any>)
}

/**
 * Listen to real-time updates for a user's entries.
 */
export function listenToEntries(
  userId: string,
  callback: (entries: Activity[]) => void
) {
  const q = query(
    entriesCollection,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  return onSnapshot(q, snapshot => {
    const entries = snapshot.docs.map(d => ({
      ...(d.data() as Activity),
      id: d.id,
    }))
    callback(entries)
  })
}
