// File: src/services/activityService.ts
import { Activity } from '../models/types'
import { db } from '../config/firebase'
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'

/**
 * Returns only today's Activity docs, using a YYYY-MM-DD "date" field.
 */
export async function fetchTodaysActivities(): Promise<Activity[]> {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  const isoDay = `${yyyy}-${mm}-${dd}`

  const q = query(
    collection(db, 'activities'),
    where('date', '==', isoDay)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => {
    const data = d.data() as Omit<Activity, 'id'>
    return { ...data, id: d.id } as Activity
  })
}

/**
 * Create a new Activity in Firestore.
 * Uses a.createdAt or now to derive YYYY-MM-DD "date".
 */
export async function createActivity(a: Activity): Promise<string> {
  const createdAt = a.createdAt || new Date().toISOString()
  const date = createdAt.slice(0, 10)
  const ref = await addDoc(collection(db, 'activities'), {
    ...a,
    createdAt,
    date,
  })
  return ref.id
}

/**
 * Update an existing Activity document.
 */
export async function updateActivity(a: Activity): Promise<void> {
  const createdAt = a.createdAt
  const date = createdAt.slice(0, 10)
  await updateDoc(doc(db, 'activities', a.id), {
    ...a,
    createdAt,
    date,
  })
}

/**
 * Delete an Activity by its ID.
 */
export async function deleteActivity(id: string): Promise<void> {
  await deleteDoc(doc(db, 'activities', id))
}
