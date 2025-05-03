// File: src/screens/Settings/NotificationSettingsScreen.tsx
import React from 'react'
import { View, Text, Switch, ActivityIndicator, StyleSheet } from 'react-native'
import { useSettings } from '../../hooks/useSettings'

export default function NotificationSettingsScreen() {
  const { settings, loading, error, save } = useSettings()

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enable Notifications</Text>
      <Switch
        value={settings!.notificationsEnabled}
        onValueChange={(value) => save({ notificationsEnabled: value })}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  label: { fontSize: 16, marginBottom: 8 },
  error: { color: 'red' },
})
