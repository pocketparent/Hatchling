// File: src/components/modals/SleepModal.tsx

import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Ionicons } from '@expo/vector-icons'
import {
  SleepActivity,
  activityColorMap,
} from '../../screens/TodayView/types'
import { EntryModal } from './EntryModal'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'

type Mode = 'sleep' | 'wake'

interface SleepModalProps {
  initialEntry?: SleepActivity
  onClose(): void
  onSave(entry: SleepActivity): void
}

export const SleepModal: React.FC<SleepModalProps> = ({
  initialEntry,
  onClose,
  onSave,
}) => {
  const accent = activityColorMap.sleep

  // ─── State (with initialEntry) ───────────────────────────────
  const [mode, setMode] = useState<Mode>('sleep')
  const [dayPeriod, setDayPeriod] = useState<'Day' | 'Night'>('Day')
  const [startTime, setStartTime] = useState<Date>(new Date())
  const [endTime, setEndTime] = useState<Date | null>(null)
  const [showPickerFor, setShowPickerFor] = useState<'start' | 'end' | null>(null)
  const [wakes, setWakes] = useState<{ start: Date; duration: string }[]>([])
  const [editingWake, setEditingWake] = useState<number | null>(null)
  const [pickerForWake, setPickerForWake] = useState(false)
  const [mood, setMood] = useState<'Happy' | 'Fussy' | ''>('')
  const [notes, setNotes] = useState<string>('')

  useEffect(() => {
    if (!initialEntry) return
    // Only single‐entry (sleep) editing supported
    setMode('sleep')
    setStartTime(new Date(initialEntry.start))
    setEndTime(new Date(initialEntry.end))
    setDayPeriod(
      (initialEntry.period.charAt(0).toUpperCase() +
        initialEntry.period.slice(1)) as 'Day' | 'Night'
    )
    setMood(initialEntry.mood ?? '')
    setNotes(initialEntry.notes ?? '')
  }, [initialEntry])

  const fmt = (d: Date) =>
    d.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })

  const addWake = () =>
    setWakes(ws => [...ws, { start: new Date(), duration: '5' }])
  const updateWakeTime = (i: number, dt: Date) => {
    setWakes(ws => {
      const c = [...ws]
      c[i].start = dt
      return c
    })
  }
  const updateWakeDur = (i: number, v: string) => {
    setWakes(ws => {
      const c = [...ws]
      c[i].duration = v
      return c
    })
  }

  const handleSave = () => {
    if (mode === 'sleep') {
      const end = endTime ?? startTime
      const mins = Math.round((end.getTime() - startTime.getTime()) / 60000)
      const entry: SleepActivity = {
        id: initialEntry?.id ?? '',
        type: 'sleep',
        title: `Sleep (${dayPeriod}): ${fmt(startTime)}–${fmt(end)}`,
        createdAt: startTime.toISOString(),
        start: startTime.toISOString(),
        end: end.toISOString(),
        duration: `${mins} min`,
        period: dayPeriod.toLowerCase() as 'day' | 'night',
        mood: mood || undefined,
        notes: notes || undefined,
      }
      onSave(entry)
    } else {
      // If you do want to batch wakes, you can loop here:
      // onSave(entriesArray)
      // But TimelineView only expects a single SleepActivity, so we skip that.
      onClose()
    }
  }

  return (
    <EntryModal title="Log Sleep" accent={accent} onClose={onClose} onSave={handleSave}>
      {/* Period */}
      <View style={styles.toggleRow}>
        {(['Day', 'Night'] as const).map(p => (
          <TouchableOpacity
            key={p}
            style={[
              styles.toggleOpt,
              dayPeriod === p && { backgroundColor: accent, borderColor: accent },
            ]}
            onPress={() => setDayPeriod(p)}
          >
            <Text style={dayPeriod === p ? styles.toggleTxtActive : styles.toggleTxt}>
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Start & End */}
      <View style={styles.timeRow}>
        <View style={styles.sideContainer}>
          <Text style={styles.fieldHeader}>Start</Text>
          <TouchableOpacity style={styles.timeBox} onPress={() => setShowPickerFor('start')}>
            <Text style={styles.timeInput}>{fmt(startTime)}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sideContainer}>
          <Text style={styles.fieldHeader}>End</Text>
          <TouchableOpacity style={styles.timeBox} onPress={() => setShowPickerFor('end')}>
            <Text style={styles.timeInput}>
              {endTime ? fmt(endTime) : fmt(startTime)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {showPickerFor && (
        <DateTimePicker
          value={showPickerFor === 'start' ? startTime : endTime || new Date()}
          mode="time"
          display="default"
          onChange={(_, dt) => {
            setShowPickerFor(null)
            if (!dt) return
            showPickerFor === 'start' ? setStartTime(dt) : setEndTime(dt)
          }}
        />
      )}

      {/* Mood */}
      <Text style={styles.fieldHeader}>Mood on Wake</Text>
      <View style={styles.toggleRow}>
        {(['Happy', 'Fussy'] as const).map(mv => (
          <TouchableOpacity
            key={mv}
            style={[
              styles.toggleOpt,
              mood === mv && { backgroundColor: accent, borderColor: accent },
            ]}
            onPress={() => setMood(mv)}
          >
            <Ionicons
              name={mv === 'Happy' ? 'happy-outline' : 'sad-outline'}
              size={22}
              color={mood === mv ? '#fff' : colors.textSecondary}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Notes */}
      <Text style={styles.fieldHeader}>Notes</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        placeholder="(e.g., mood)"
        placeholderTextColor={colors.textSecondary}
        value={notes}
        onChangeText={setNotes}
      />
    </EntryModal>
  )
}

const styles = StyleSheet.create({
  toggleRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  toggleOpt: {
    flex: 1,
    marginHorizontal: 4,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleTxt: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  toggleTxtActive: {
    color: '#fff',
    fontWeight: '600',
  },
  fieldHeader: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 12,
    color: colors.textPrimary,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sideContainer: {
    flex: 1,
    alignItems: 'center',
  },
  timeBox: {
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginTop: 4,
    alignItems: 'center',
  },
  timeInput: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 8,
    color: colors.textPrimary,
  },
})
