// File: src/components/modals/DiaperModal.tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
  StyleSheet,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { DiaperActivity, activityColorMap } from '../../screens/TodayView/types'
import { EntryModal } from './EntryModal'
import { colors } from '../../theme/colors'

interface DiaperModalProps {
  onClose: () => void
  onSave: (entry: DiaperActivity) => void
}

export const DiaperModal: React.FC<DiaperModalProps> = ({ onClose, onSave }) => {
  const accent = activityColorMap.diaper
  const [selectedType, setSelectedType] = useState<'wet' | 'dry' | 'dirty'>('wet')
  const [diarrhea, setDiarrhea] = useState(false)
  const [rash, setRash] = useState(false)
  const [time, setTime] = useState(new Date())
  const [showPicker, setShowPicker] = useState(false)
  const [notes, setNotes] = useState('')

  const formattedTime = time.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: 'numeric',
  })

  const handleSave = () => {
    const entry: DiaperActivity = {
      id: Date.now().toString(),
      type: 'diaper',
      title: `Diaper: ${selectedType}${
        selectedType === 'dirty' && diarrhea ? ' (diarrhea)' : ''
      }`,
      createdAt: time.toISOString(),
      rash: rash || undefined,
      notes: notes || undefined,
    }
    onSave(entry)
  }

  return (
    <EntryModal title="Log Diaper" accent={accent} onClose={onClose} onSave={handleSave}>
      <View style={styles.typeSelector}>
        {(['wet', 'dry', 'dirty'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[
              styles.toggleOpt,
              selectedType === t && { backgroundColor: accent, borderColor: accent },
            ]}
            onPress={() => setSelectedType(t)}
          >
            <Text style={selectedType === t ? styles.toggleTxtActive : styles.toggleTxt}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
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
          display="default"
          onChange={(_, d) => {
            setShowPicker(false)
            if (d) setTime(d)
          }}
          textColor={accent}
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
    marginBottom: 12,
  },
  toggleOpt: {
    flex: 1,
    marginHorizontal: 4,
    padding: 10,
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
    marginVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  fieldHeader: {
    marginTop: 12,
    marginBottom: 4,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
  },
  pickerText: {
    color: colors.textPrimary,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    height: 80,
    textAlignVertical: 'top',
    color: colors.textPrimary,
  },
})
