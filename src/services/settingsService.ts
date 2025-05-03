// File: src/services/settingsService.ts

import { db } from '../config/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { UserSettings } from '../models/types'

// Helper to reference the preferences document for a given user
const prefsDoc = (uid: string) => doc(db, 'users', uid, 'settings', 'prefs')

/**
 * Fetches the user's settings from Firestore.
 * @param uid - Firebase Auth user ID
 * @returns UserSettings or null if not found
 */
export async function getSettings(uid: string): Promise<UserSettings | null> {
  const snap = await getDoc(prefsDoc(uid))
  return snap.exists() ? (snap.data() as UserSettings) : null
}

/**
 * Updates the user's settings in Firestore (merge).
 * @param uid - Firebase Auth user ID
 * @param data - Partial settings to merge
 */
export async function updateSettings(uid: string, data: Partial<UserSettings>): Promise<void> {
  await setDoc(prefsDoc(uid), data, { merge: true })
}
