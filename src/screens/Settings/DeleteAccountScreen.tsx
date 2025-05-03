// File: src/screens/Settings/DeleteAccountScreen.tsx
import React, { useState } from 'react'
import { View, Text, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native'
import { getAuth, deleteUser, signOut } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../../../App'

/**
 * Screen for deleting the current user account.
 */
export default function DeleteAccountScreen() {
  const auth = getAuth()
  // Typed navigation prop including 'Login'
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = () => {
    Alert.alert(
      'Confirm Delete',
      'This will permanently delete your account and all data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true)
            setError(null)
            try {
              const user = auth.currentUser
              if (!user) throw new Error('No authenticated user.')

              // Delete user from Firebase Auth
              await deleteUser(user)
              // TODO: clean up Firestore user data if needed

              // Sign out and reset navigation to Login screen
              await signOut(auth)
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
            } catch (e: any) {
              setError(e.message)
            } finally {
              setLoading(false)
            }
          },
        },
      ],
    )
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.warning}>
        Deleting your account is irreversible. Your settings, entries, and media will be permanently removed.
      </Text>
      {error && <Text style={styles.error}>Error: {error}</Text>}
      <Button
        title="Delete My Account"
        color="#d9534f"
        onPress={handleDelete}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  warning: { fontSize: 16, marginBottom: 20, color: '#c00' },
  error: { color: 'red', marginBottom: 12 },
})
