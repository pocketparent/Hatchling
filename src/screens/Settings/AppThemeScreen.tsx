// File: src/screens/Settings/AppThemeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useSettings } from '../../hooks/useSettings';
import { UserSettings } from '../../models/types';
import { colors } from '../../theme/colors'; // Import theme colors
import { spacing } from '../../theme/spacing'; // Import spacing
import { typography } from '../../theme/typography'; // Import typography

// Define themes based on UserSettings type, including 'system'
const themes: { label: string; value: UserSettings['display']['theme'] }[] = [
  { label: 'System Default', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'Beige', value: 'beige' },
];

export default function AppThemeScreen() {
  const { settings, loading, error, save } = useSettings();

  if (loading || !settings) { // Handle loading and null settings
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error loading theme settings: {error}</Text>
      </View>
    );
  }

  const currentTheme = settings.display?.theme || 'system'; // Safely access theme, default to system

  const handleSelectTheme = (themeValue: UserSettings['display']['theme']) => {
    // Save only the display part, merging with existing display settings if necessary
    save({ display: { ...settings.display, theme: themeValue } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Theme</Text>
      {themes.map((theme) => (
        <TouchableOpacity
          key={theme.value}
          style={[
            styles.option,
            currentTheme === theme.value && styles.optionSelected,
          ]}
          onPress={() => handleSelectTheme(theme.value)}
          disabled={loading} // Disable while saving
        >
          <Text
            style={[
              styles.optionText,
              currentTheme === theme.value && styles.optionTextSelected,
            ]}
          >
            {theme.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background, // Use theme color
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background, // Use theme color
  },
  title: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    marginBottom: spacing.lg,
    color: colors.textPrimary, // Use theme color
    textAlign: 'center',
  },
  option: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border, // Use theme color
    borderRadius: 8,
    backgroundColor: colors.card, // Use theme color
  },
  optionSelected: {
    borderColor: colors.accentPrimary, // Use theme color
    backgroundColor: colors.primaryLight, // Use theme color
  },
  optionText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.textPrimary, // Use theme color
    textAlign: 'center',
  },
  optionTextSelected: {
    fontFamily: typography.fonts.medium,
    color: colors.primaryDark, // Use theme color
  },
  error: {
    color: colors.error, // Use theme color
    textAlign: 'center',
    marginTop: spacing.md,
  },
});

