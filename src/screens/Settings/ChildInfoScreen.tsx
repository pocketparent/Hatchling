// File: src/screens/Settings/ChildInfoScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { Timestamp } from 'firebase/firestore'; // Import Timestamp
import { useSettings } from '../../hooks/useSettings';
import { colors } from '../../theme/colors';
import { UserSettings } from '../../models/types'; // Import UserSettings type

// Standardized sex options based on user confirmation and types.ts
const sexOptions: Array<'boy' | 'girl' | 'none'> = ['boy', 'girl', 'none'];

export default function ChildInfoScreen() {
  const navigation = useNavigation();
  const { settings, loading, error, save } = useSettings();
  const [firstName, setFirstName] = useState('');
  const [dob, setDob] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [sex, setSex] = useState<'boy' | 'girl' | 'none'>('none'); // Updated type
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFirstName(settings.childFirstName || ''); // Handle potentially undefined
      // Convert Firestore Timestamp to JS Date
      if (settings.childDOB && settings.childDOB instanceof Timestamp) {
        setDob(settings.childDOB.toDate());
      } else if (typeof settings.childDOB === 'string') {
        // Fallback for potentially old string format (should be removed later)
        const parsedDate = new Date(settings.childDOB);
        if (!isNaN(parsedDate.getTime())) {
          setDob(parsedDate);
        }
      }
      // Ensure sex is one of the valid options
      setSex(sexOptions.includes(settings.childSex as any) ? settings.childSex : 'none');
    }
  }, [settings]);

  // Show loading state
  if (loading) { // Simplified loading check
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error loading settings: {error}</Text>
      </View>
    );
  }

  const onChangeDate = (_: any, selected?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selected) {
      setDob(selected);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const settingsToSave: Partial<UserSettings> = {
        childFirstName: firstName,
        childDOB: Timestamp.fromDate(dob), // Save as Firestore Timestamp
        childSex: sex,
      };
      await save(settingsToSave);
      setSaving(false);
      // Navigate back to Settings list to signal save complete
      navigation.goBack();
    } catch (saveError: any) {
      setSaving(false);
      console.error('Error saving settings:', saveError);
      // Display error to user (consider using a more user-friendly message)
      // Alert.alert('Save Failed', saveError.message || 'Could not save settings.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Child's first name"
        value={firstName}
        onChangeText={setFirstName}
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={styles.label}>Date of Birth</Text>
      <TouchableOpacity style={styles.dateTouchable} onPress={() => setShowPicker(true)}>
        <Text style={styles.dateText}>
          {dob.toDateString()}
        </Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={dob}
          mode="date"
          display="default" // Consider 'spinner' for consistency with onboarding if desired
          onChange={onChangeDate}
          maximumDate={new Date()}
        />
      )}

      <Text style={styles.label}>Sex</Text>
      <View style={styles.radioGroup}>
        {sexOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.radioOption,
              sex === option && styles.radioSelected,
            ]}
            onPress={() => setSex(option)}
          >
            <Text
              style={
                sex === option
                  ? [styles.radioText, styles.radioTextSelected]
                  : styles.radioText
              }
            >
              {/* Display 'None' instead of 'Other' */}
              {option === 'none'
                ? 'None'
                : option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          title={saving ? 'Saving...' : 'Save'}
          onPress={handleSave}
          color={colors.accentPrimary}
          disabled={saving || loading} // Disable if loading initial settings too
        />
      </View>
    </View>
  );
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
  label: {
    fontSize: 16,
    color: colors.textPrimary,
    marginTop: 12,
    // Consider using theme typography
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    padding: 10, // Increased padding slightly
    marginTop: 4,
    backgroundColor: colors.card,
    color: colors.textPrimary,
    fontSize: 16, // Ensure consistent font size
  },
  dateTouchable: { // Wrap date text in touchable for better hit area
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    padding: 10,
    marginTop: 4,
    backgroundColor: colors.card,
  },
  dateText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Adjusted spacing
    marginTop: 8,
  },
  radioOption: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    backgroundColor: colors.card,
    alignItems: 'center', // Center text
  },
  radioSelected: {
    borderColor: colors.accentPrimary,
    backgroundColor: colors.primaryLight,
  },
  radioText: {
    textAlign: 'center',
    color: colors.textPrimary,
    fontSize: 16,
  },
  radioTextSelected: {
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
  buttonWrapper: {
    marginTop: 24,
  },
  error: {
    color: colors.error,
    marginTop: 20,
    textAlign: 'center',
  },
});

