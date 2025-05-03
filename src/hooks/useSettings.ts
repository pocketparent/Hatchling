// File: src/hooks/useSettings.ts
import { useState, useEffect } from 'react';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore'; // Import Timestamp
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../config/firebase';
import { updateSettings } from '../services/settingsService';
import { UserSettings } from '../models/types';

/**
 * React hook to load and persist comprehensive user settings from Firestore in real time.
 */
export function useSettings() {
  const auth = getAuth();
  const [userId, setUserId] = useState<string | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Default settings for new users - Updated based on audit-fix-2 plan
  const defaultSettings: UserSettings = {
    name: '',
    phoneNumber: '',
    email: undefined,
    onboarded: false, // Assuming default is false
    childFirstName: '',
    childDOB: Timestamp.fromDate(new Date()), // Use current date as default Timestamp
    childSex: 'none', // Standardized default
    trackedActivities: {
      sleep: true,
      feeding: true,
      diaper: true,
      milestone: true,
      // Add defaults for other potential activities if needed
      growth: false,
      health: false,
    },
    communication: {
      nudgesEnabled: true,
      // Add defaults for other communication settings if needed
      insightsEnabled: false,
      emailPreferences: { summary: false, insights: false },
      pushCategories: {
        timerReminders: true,
        routineSuggestions: true,
        ageBasedInsights: true,
      },
    },
    display: {
      theme: 'system',
      feedingUnit: 'oz',
      growthUnit: 'lb/in',
      defaultView: 'Timeline',
    },
    // invitedUsers is handled by subcollection, removed from here
    // exportRange is likely a function parameter, removed from here
  };

  // Listen for auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, [auth]);

  // Subscribe to Firestore settings doc at correct path
  useEffect(() => {
    if (!userId) {
      setSettings(null); // Clear settings if no user
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null); // Clear previous errors
    const prefsRef = doc(db, 'users', userId, 'settings', 'prefs');
    const unsubscribe = onSnapshot(
      prefsRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as Partial<UserSettings>; // Data might be partial
          // Deep merge with defaults to handle potentially missing nested objects
          const mergedSettings = {
            ...defaultSettings,
            ...data,
            trackedActivities: {
              ...defaultSettings.trackedActivities,
              ...(data.trackedActivities || {}),
            },
            communication: {
              ...defaultSettings.communication,
              ...(data.communication || {}),
              emailPreferences: {
                ...defaultSettings.communication.emailPreferences,
                ...(data.communication?.emailPreferences || {}),
              },
              pushCategories: {
                ...defaultSettings.communication.pushCategories,
                ...(data.communication?.pushCategories || {}),
              },
            },
            display: {
              ...defaultSettings.display,
              ...(data.display || {}),
            },
          };
          setSettings(mergedSettings);
        } else {
          // Initialize doc with defaults if it doesn't exist
          setSettings(defaultSettings);
          updateSettings(userId, defaultSettings).catch((err) => {
            console.error('Failed to initialize settings:', err);
            setError('Failed to initialize settings.');
          });
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error listening to settings:', err);
        setError(err.message || 'Failed to load settings.');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [userId]); // Rerun when userId changes

  /**
   * Saves partial updates to user settings, merging nested objects.
   */
  const save = async (updates: Partial<UserSettings>) => {
    if (!userId) {
      setError('User not authenticated.');
      return;
    }
    // setLoading(true); // Consider only showing loading state on the specific save button
    try {
      // Use the updateSettings service function which handles merge: true
      await updateSettings(userId, updates);
    } catch (e: any) {
      console.error('Error updating settings:', e);
      setError(e.message || 'Failed to save settings.');
      // Re-throw or handle error appropriately in UI
      throw e;
    } finally {
      // setLoading(false);
    }
  };

  return { settings, loading, error, save };
}

