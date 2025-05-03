// File: src/screens/Settings/NotificationSettingsScreen.tsx
import React from 'react';
import {
  View,
  Text,
  Switch,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useSettings } from '../../hooks/useSettings';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function NotificationSettingsScreen() {
  const { settings, loading, error, save } = useSettings();

  // Handle loading and null settings state
  if (loading || !settings) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  // Handle error state
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error loading notification settings: {error}</Text>
      </View>
    );
  }

  // Safely access the nested property, providing a default value
  const nudgesEnabled = settings.communication?.nudgesEnabled ?? false;

  const handleValueChange = (value: boolean) => {
    // Save the update correctly nested within the communication object
    save({ communication: { ...settings.communication, nudgesEnabled: value } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Enable Routine Nudges</Text>
        <Switch
          value={nudgesEnabled}
          onValueChange={handleValueChange}
          trackColor={{ false: colors.border, true: colors.accentPrimary }}
          thumbColor={colors.card}
          ios_backgroundColor={colors.border}
          disabled={loading} // Disable switch while settings are loading/saving
        />
      </View>
      {/* Add more notification settings switches here as needed */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.regular,
    color: colors.textPrimary,
    flex: 1, // Allow label to take available space
    marginRight: spacing.sm,
  },
  error: {
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});

