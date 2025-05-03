// File: src/hooks/useSettings.ts
import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { db } from '../config/firebase'
import { updateSettings } from '../services/settingsService'
import { UserSettings } from '../models/types'

/**
 * React hook to load and persist comprehensive user settings from Firestore in real time.
 */
export function useSettings() {
  const auth = getAuth()
  const [userId, setUserId] = useState<string | null>(null)
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Default settings for new users
  const defaultSettings: UserSettings = {
    name: '',
    phoneNumber: '',
    email: undefined,
    childFirstName: '',
    childDOB: '',
    childSex: 'other',
    trackedActivities: { sleep: true, feeding: true, diaper: true, milestone: true },
    invitedUsers: [],
    communication: { nudgesEnabled: true },
    display: { theme: 'system', feedingUnit: 'oz', growthUnit: 'lb/in' },
    exportRange: '7days',
  }

  // Listen for auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUserId(user ? user.uid : null)
    })
    return () => unsubscribe()
  }, [auth])

  // Subscribe to Firestore settings doc at correct path
  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }
    setLoading(true)
    const prefsRef = doc(db, 'users', userId, 'settings', 'prefs')
    const unsubscribe = onSnapshot(
      prefsRef,
      snap => {
        if (snap.exists()) {
          const data = snap.data() as Partial<UserSettings>
          setSettings({ ...defaultSettings, ...data })
        } else {
          // initialize doc with defaults
          setSettings(defaultSettings)
          updateSettings(userId, defaultSettings)
        }
        setLoading(false)
      },
      err => {
        console.error('Error listening to settings:', err)
        setError(err.message)
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [userId])

  /**
   * Saves partial updates to user settings, merging nested objects.
   */
  const save = async (updates: Partial<UserSettings>) => {
    if (!userId || !settings) return
    setLoading(true)
    try {
      await updateSettings(userId, updates)
    } catch (e: any) {
      console.error('Error updating settings:', e)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return { settings, loading, error, save }
}
