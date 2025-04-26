// src/hooks/useActivities.ts
import { useState, useEffect } from 'react'
import { auth } from '../config/firebase'
import { listenToEntries } from '../services/firestore'
import { Activity } from '../screens/TodayView/types'

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = auth.currentUser
    if (!user) return

    const unsubscribe = listenToEntries(user.uid, (entries) => {
      setActivities(entries)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { activities, loading }
}
