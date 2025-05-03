// File: src/screens/Settings/TrackedActivitiesScreen.tsx
import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Switch,
  Button,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSettings } from '../../hooks/useSettings'
import { colors } from '../../theme/colors'

/**
 * Screen to toggle which activities the user wants to track.
 */
export default function TrackedActivitiesScreen() {
  const navigation = useNavigation()
  const { settings, loading, error, save } = useSettings()
  const [toggles, setToggles] = useState(settings?.trackedActivities)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (settings) {
      setToggles(settings.trackedActivities)
    }
  }, [settings])

  if (loading || !settings || !toggles) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
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

  const handleSave = async () => {
    setSaving(true)
    await save({ trackedActivities: toggles })
    setSaving(false)
    navigation.goBack()
  }

  const renderToggle = (label: string, value: boolean, onChange: (v: boolean) => void) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        trackColor={{ false: colors.border, true: colors.accentSecondary }}
        thumbColor={value ? colors.primary : colors.card}
        ios_backgroundColor={colors.border}
        value={value}
        onValueChange={onChange}
      />
    </View>
  )

  return (
    <View style={styles.container}>
      {renderToggle('Sleep', toggles.sleep, (value) => setToggles({ ...toggles, sleep: value }))}
      {renderToggle('Feeding', toggles.feeding, (value) => setToggles({ ...toggles, feeding: value }))}
      {renderToggle('Diaper', toggles.diaper, (value) => setToggles({ ...toggles, diaper: value }))}
      {renderToggle('Milestones', toggles.milestone, (value) => setToggles({ ...toggles, milestone: value }))}

      <View style={styles.buttonWrapper}>
        <Button
          title={saving ? 'Saving...' : 'Save'}
          onPress={handleSave}
          color={colors.primary}
          disabled={saving}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  buttonWrapper: {
    marginTop: 32,
    backgroundColor: colors.card,
    padding: 8,
    borderRadius: 4,
  },
  error: {
    color: colors.error,
    textAlign: 'center',
    marginTop: 20,
  },
})
