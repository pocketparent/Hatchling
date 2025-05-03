// File: src/screens/Settings/AppThemeScreen.tsx
import React from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import { useSettings } from '../../hooks/useSettings'
import { UserSettings } from '../../models/types'

const themes: { label: string; value: UserSettings['theme'] }[] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'Beige', value: 'beige' },
]

export default function AppThemeScreen() {
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
      <Text style={styles.label}>Select App Theme</Text>
      {themes.map((t) => (
        <TouchableOpacity
          key={t.value}
          style={
            settings!.theme === t.value
              ? [styles.option, styles.selected]
              : styles.option
          }
          onPress={() => save({ theme: t.value })}
        >
          <Text
            style={
              settings!.theme === t.value
                ? [styles.optionText, styles.selectedText]
                : styles.optionText
            }
          >
            {t.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontSize: 18, marginBottom: 12 },
  option: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selected: {
    borderColor: '#888',
    backgroundColor: '#f0f0f0',
  },
  optionText: { fontSize: 16 },
  selectedText: { fontWeight: 'bold' },
  error: { color: 'red', padding: 16 },
})
