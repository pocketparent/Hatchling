// File: src/components/modals/MilestoneModal.tsx

import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { MilestoneActivity, activityColorMap } from '../../models/types'
import { EntryModal } from './EntryModal'
import { colors } from '../../theme/colors'

interface MilestoneModalProps {
  initialEntry?: MilestoneActivity
  onClose: () => void
  onSave: (entry: MilestoneActivity) => void
}

export const MilestoneModal: React.FC<MilestoneModalProps> = ({
  initialEntry,
  onClose,
  onSave,
}) => {
  const accent = activityColorMap.milestone

  // Seed from initialEntry
  const [milestone, setMilestone] = useState(initialEntry?.title ?? '')
  const [date, setDate] = useState<Date>(
    initialEntry ? new Date(initialEntry.createdAt) : new Date()
  )
  const [showPicker, setShowPicker] = useState(false)
  const [notes, setNotes] = useState(initialEntry?.notes ?? '')

  useEffect(() => {
    if (!initialEntry) return
    setMilestone(initialEntry.title)
    setDate(new Date(initialEntry.createdAt))
    setNotes(initialEntry.notes ?? '')
  }, [initialEntry])

  const formattedDate = date.toLocaleDateString()

  const handleSave = () => {
    const entry: MilestoneActivity = {
      id: initialEntry?.id ?? '',
      type: 'milestone',
      title: milestone || 'Milestone',
      createdAt: date.toISOString(),
      notes: notes || undefined,
    }
    onSave(entry)
  }

  return (
    <EntryModal title="Log Milestone" accent={accent} onClose={onClose} onSave={handleSave}>
      <Text style={styles.fieldHeader}>Milestone</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. First smile"
        value={milestone}
        onChangeText={setMilestone}
      />

      <Text style={styles.fieldHeader}>Date</Text>
      <TouchableOpacity style={styles.pickerBox} onPress={() => setShowPicker(true)}>
        <Text style={styles.pickerText}>{formattedDate}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(_, d) => {
            setShowPicker(false)
            if (d) setDate(d)
          }}
        />
      )}

      <Text style={styles.fieldHeader}>Notes</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        placeholder="Optional notes…"
        value={notes}
        onChangeText={setNotes}
      />
    </EntryModal>
  )
}

const styles = StyleSheet.create({
  fieldHeader: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 12,
    color: colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
    color: colors.textPrimary,
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  pickerText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
})
