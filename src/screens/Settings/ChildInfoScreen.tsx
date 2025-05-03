// File: src/screens/Settings/ChildInfoScreen.tsx
import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useNavigation } from '@react-navigation/native'
import { useSettings } from '../../hooks/useSettings'
import { colors } from '../../theme/colors'

const sexOptions: Array<'boy' | 'girl' | 'other'> = ['boy', 'girl', 'other']

export default function ChildInfoScreen() {
  const navigation = useNavigation()
  const { settings, loading, error, save } = useSettings()
  const [firstName, setFirstName] = useState('')
  const [dob, setDob] = useState(new Date())
  const [showPicker, setShowPicker] = useState(false)
  const [sex, setSex] = useState<'boy' | 'girl' | 'other'>('other')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (settings) {
      setFirstName(settings.childFirstName)
      if (settings.childDOB) {
        setDob(new Date(settings.childDOB))
      }
      setSex(settings.childSex)
    }
  }, [settings])

  // Show loading state
  if (loading || !settings) {
    return (
      <View style={styles.center}>
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

  const onChangeDate = (_: any, selected?: Date) => {
    setShowPicker(Platform.OS === 'ios')
    if (selected) {
      setDob(selected)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    await save({
      childFirstName: firstName,
      childDOB: dob.toISOString().slice(0, 10),
      childSex: sex,
    })
    setSaving(false)
    // Navigate back to Settings list to signal save complete
    navigation.goBack()
  }

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
      <Text style={styles.dateText} onPress={() => setShowPicker(true)}>
        {dob.toDateString()}
      </Text>
      {showPicker && (
        <DateTimePicker
          value={dob}
          mode="date"
          display="default"
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
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          title={saving ? 'Saving...' : 'Save'}
          onPress={handleSave}
          color={colors.accentPrimary}
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
  label: {
    fontSize: 16,
    color: colors.textPrimary,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    padding: 8,
    marginTop: 4,
    backgroundColor: colors.card,
    color: colors.textPrimary,
  },
  dateText: {
    fontSize: 16,
    color: colors.textPrimary,
    padding: 8,
    backgroundColor: colors.card,
    borderRadius: 4,
    marginTop: 4,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  radioOption: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    backgroundColor: colors.card,
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
  },
})
