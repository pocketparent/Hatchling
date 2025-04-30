// File: src/components/modals/DiaperModal.tsx
import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { EntryModal } from './EntryModal'
import { DiaperActivity, activityColorMap } from '../../models/types'
import { colors } from '../../theme/colors'
import { Button } from '../common/Button'
import { spacing } from '../../theme/spacing'

type DiaperType = 'wet' | 'dirty' | 'dry'

export const DiaperModal: React.FC<{ onClose: () => void; onSave: (entry: DiaperActivity) => void }> = ({ onClose, onSave }) => {
  const accent = activityColorMap.diaper

  // State
  const [selectedType, setSelectedType] = useState<DiaperType | ''>('')
  const [diarrhea, setDiarrhea] = useState(false)
  const [rash, setRash] = useState(false)
  const [time, setTime] = useState<Date>(new Date())
  const [showPicker, setShowPicker] = useState(false)
  const [notes, setNotes] = useState('')

  // Validation: status must be selected
  const canSave = selectedType !== ''

  // Reset diarrhea if type changes away from 'dirty'
  useEffect(() => {
    if (selectedType !== 'dirty') {
      setDiarrhea(false)
    }
  }, [selectedType])

  const formattedTime = time.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })

  const handleSave = () => {
    if (!canSave) return
    const entry: DiaperActivity = {
      id: Date.now().toString(),
      type: 'diaper',
      title: `Diaper: ${selectedType}${selectedType === 'dirty' && diarrhea ? ' (diarrhea)' : ''}`,
      createdAt: time.toISOString(),
      rash: rash || undefined,
      notes: notes.trim() || undefined,
    }
    onSave(entry)
  }

  const onChange = (_: any, dt?: Date) => {
    setShowPicker(false)
    if (!dt) return
    setTime(dt > new Date() ? new Date() : dt)
  }

  return (
    <EntryModal
      title="Log Diaper"
      accent={accent}
      onClose={onClose}
      onSave={handleSave}
    >
      <View style={styles.typeSelector}>
        {(['wet', 'dirty', 'dry'] as DiaperType[]).map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.toggleOpt,
              selectedType === type && { backgroundColor: accent, borderColor: accent },
            ]}
            onPress={() => setSelectedType(prev => (prev === type ? '' : type))}
          >
            <Text style={selectedType === type ? styles.toggleTxtActive : styles.toggleTxt}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedType === 'dirty' && (
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Diarrhea</Text>
          <Switch
            value={diarrhea}
            onValueChange={setDiarrhea}
            trackColor={{ true: accent }}
            thumbColor={diarrhea ? accent : undefined}
          />
        </View>
      )}

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Diaper Rash</Text>
        <Switch
          value={rash}
          onValueChange={setRash}
          trackColor={{ true: accent }}
          thumbColor={rash ? accent : undefined}
        />
      </View>

      <Text style={styles.fieldHeader}>Time</Text>
      <TouchableOpacity style={styles.pickerBox} onPress={() => setShowPicker(true)}>
        <Text style={styles.pickerText}>{formattedTime}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange}
        />
      )}

      <Text style={styles.fieldHeader}>Notes</Text>
      <TextInput
        style={styles.textArea}
        multiline
        placeholder="(e.g., color, texture)"
        placeholderTextColor={colors.textSecondary}
        value={notes}
        onChangeText={setNotes}
      />
    </EntryModal>
  )
}

const styles = StyleSheet.create({
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  toggleOpt: {
    flex: 1,
    marginHorizontal: spacing.xs,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleTxt: {
    color: colors.textSecondary,
  },
  toggleTxtActive: {
    color: '#fff',
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  switchLabel: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  fieldHeader: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  pickerText: {
    color: colors.textPrimary,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    height: 80,
    textAlignVertical: 'top',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
})
