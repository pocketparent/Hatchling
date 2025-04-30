// src/services/activityService.ts
import { Activity } from '../models/types'
import { db } from '../config/firebase'   // your Firebase export
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp
} from 'firebase/firestore'

// Returns only today's docs (you'll need a date field on each activity)
export async function fetchTodaysActivities(): Promise<Activity[]> {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth()+1).padStart(2,'0')
  const dd = String(today.getDate()).padStart(2,'0')
  const isoDay = `${yyyy}-${mm}-${dd}`

  // assumes you store a "date" field as "YYYY-MM-DD"
  const q = query(
    collection(db, 'activities'),
    where('date', '==', isoDay)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Activity[]
}

export async function createActivity(a: Activity): Promise<string> {
  const ref = await addDoc(collection(db, 'activities'), {
    ...a,
    date: a.time.slice(0,10) // store YYYY-MM-DD for quick querying
  })
  return ref.id
}

export async function updateActivity(a: Activity): Promise<void> {
  await updateDoc(doc(db, 'activities', a.id), {
    ...a,
    date: a.time.slice(0,10)
  })
}

export async function deleteActivity(id: string): Promise<void> {
  await deleteDoc(doc(db, 'activities', id))
}
