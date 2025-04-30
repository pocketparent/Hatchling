// src/services/firestore.ts
import { db } from '../config/firebase'
import { collection, addDoc, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore'
import { Activity } from '../models/types'

const entriesCollection = collection(db, 'entries')

export async function addEntry(entry: Activity, userId: string) {
  const date = new Date(entry.createdAt || entry.createdAt)
  const dateKey = date.toISOString().split('T')[0]

  await addDoc(entriesCollection, {
    ...entry,
    createdAt: entry.createdAt || new Date().toISOString(),
    dateKey,
    userId,
  })
}

export function listenToEntries(userId: string, callback: (entries: Activity[]) => void) {
  const q = query(
    entriesCollection,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )

  return onSnapshot(q, (snapshot) => {
    const entries = snapshot.docs.map(doc => ({
      ...(doc.data() as Activity),
      id: doc.id,
    }))
    callback(entries)
  })
}
