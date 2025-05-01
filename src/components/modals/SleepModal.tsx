// File: src/components/modals/SleepModal.tsx
import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Ionicons } from '@expo/vector-icons'
import { EntryModal } from './EntryModal'
import { SleepActivity, SleepInterruption } from '../../models/types'
import { activityColorMap } from '../../constants/activityConfig'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'

type Period = 'Day' | 'Night'
type Mood = 'Happy' | 'Fussy' | ''
interface Interruption { start: Date; duration: string }

type PickerContext =
  | { type: 'start' }
  | { type: 'end' }
  | { type: 'interruption'; index: number }

interface SleepModalProps {
  initialEntry?: SleepActivity;
  onClose: () => void;
  onSave: (entry: SleepActivity | SleepActivity[]) => void;
}

export const SleepModal: React.FC<SleepModalProps> = ({
  initialEntry,
  onClose,
  onSave,
}) => {
  const accent = activityColorMap.sleep

  // Seed form state
  const [period, setPeriod] = useState<Period>(
    initialEntry?.period === 'night' ? 'Night' : 'Day'
  )
  const [startTime, setStartTime] = useState<Date>(
    initialEntry ? new Date(initialEntry.start) : new Date()
  )
  const [endTime, setEndTime] = useState<Date | null>(
    initialEntry ? new Date(initialEntry.end) : null
  )
  const [interruptions, setInterruptions] = useState<Interruption[]>(
    initialEntry?.interruptions
      ? initialEntry.interruptions.map((i: SleepInterruption) => ({
          start: new Date(i.time),
          duration: String(i.duration),
        }))
      : []
  )
  const [mood, setMood] = useState<Mood>(initialEntry?.mood || '')
  const [notes, setNotes] = useState<string>(initialEntry?.notes || '')
  const [picker, setPicker] = useState<PickerContext | null>(null)

  const now = new Date()
  const fmtTime = (d: Date) =>
    d.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })

  const canSave = !!(endTime && endTime >= startTime)

  const addInterruption = () => {
    setInterruptions(prev => [...prev, { start: new Date(), duration: '5' }])
  }

  const onChange = (_: any, dt?: Date) => {
    if (!dt) {
      setPicker(null)
      return
    }
    const valid = dt > now ? now : dt
    if (picker) {
      if (picker.type === 'start') setStartTime(valid)
      if (picker.type === 'end') setEndTime(valid)
      if (picker.type === 'interruption') {
        setInterruptions(prev => {
          const u = [...prev]
          u[picker.index] = { ...u[picker.index], start: valid }
          return u
        })
      }
    }
    setPicker(null)
  }

  const handleSave = () => {
    if (!canSave) return

    const main: SleepActivity = {
      id: initialEntry?.id || '',
      type: 'sleep',
      start: startTime.toISOString(),
      end: (endTime || startTime).toISOString(),
      createdAt: initialEntry?.createdAt || startTime.toISOString(),
      duration: `${Math.round(
        ((endTime || startTime).getTime() - startTime.getTime()) / 60000
      )} min`,
      period: period.toLowerCase() as 'day' | 'night',
      title: `Sleep (${period}): ${fmtTime(startTime)}–${fmtTime(
        endTime || startTime
      )}`,
      ...(notes.trim() && { notes: notes.trim() }),
      ...(mood && { mood }),
      ...(interruptions.length && initialEntry
        ? { interruptions: interruptions.map(i => ({ time: i.start.toISOString(), duration: parseInt(i.duration, 10) })) }
        : {}),
    }

    if (interruptions.length > 0) {
      const wakes = interruptions.map((i, idx) => {
        const dur = parseInt(i.duration, 10) || 0
        const endW = new Date(i.start.getTime() + dur * 60000)
        return {
          id: `${Date.now()}_${idx}`,
          type: 'sleep',
          start: i.start.toISOString(),
          end: endW.toISOString(),
          createdAt: i.start.toISOString(),
          duration: `${dur} min`,
          period: 'night',
          title: `Wake: ${fmtTime(i.start)} for ${dur} min`,
          ...(notes.trim() && { notes: notes.trim() }),
        } as SleepActivity
      })
      onSave([main, ...wakes])
    } else {
      onSave(main)
    }
    onClose()
  }

  return (
    <EntryModal title="Log Sleep" accent={accent} onClose={onClose} onSave={handleSave}>
      <ScrollView>
        <View style={styles.toggleRow}>
          {(['Day', 'Night'] as Period[]).map(p => (
            <TouchableOpacity
              key={p}
              style={[
                styles.toggleBtn,
                period === p && { backgroundColor: accent, borderColor: accent },
              ]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.toggleTxt, period === p && styles.toggleTxtActive]}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.timeRow}>
          {(['Start', 'End'] as const).map(label => (
            <View key={label} style={styles.timeContainer}>
              <Text style={styles.label}>{label}</Text>
              <TouchableOpacity
                style={styles.timeBox}
                onPress={() => setPicker({ type: label.toLowerCase() as any })}
              >
                <Text style={styles.timeText}>
                  {label === 'Start' ? fmtTime(startTime) : fmtTime(endTime || startTime)}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {picker && (
          <DateTimePicker
            value={picker.type === 'start' ? startTime : endTime || new Date()}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChange}
          />
        )}

        <Text style={styles.sectionHeader}>Sleep Interruptions</Text>
        {interruptions.map((i, idx) => (
          <View key={idx} style={styles.interruptionRow}>
            <TouchableOpacity
              style={styles.timeBox}
              onPress={() => setPicker({ type: 'interruption', index: idx })}
            >
              <Text style={styles.timeText}>{fmtTime(i.start)}</Text>
            </TouchableOpacity>
            <TextInput
              style={[styles.input, styles.durationInput]}
              keyboardType="numeric"
              value={i.duration}
              onChangeText={v =>
                setInterruptions(prev => prev.map((x, j) => (j === idx ? { ...x, duration: v } : x)))
              }
              placeholder="min"
            />
          </View>
        ))}
        <TouchableOpacity onPress={addInterruption}>
          <Text style={[styles.addLink, { color: accent }]}>+ Add Interruption</Text>
        </TouchableOpacity>

        <Text style={styles.sectionHeader}>Mood on Wake</Text>
        <View style={styles.toggleRow}>
          {(['Happy', 'Fussy'] as Mood[]).map(mv => (
            <TouchableOpacity
              key={mv}
              style={[
                styles.toggleBtn,
                mood === mv && { backgroundColor: accent, borderColor: accent },
              ]}
              onPress={() => setMood(mood === mv ? '' : mv)}
            >
              <Ionicons
                name={mv === 'Happy' ? 'happy-outline' : 'sad-outline'}
                size={24}
                color={mood === mv ? '#fff' : colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionHeader}>Notes</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          multiline
          placeholder="(e.g., baby stirred once)"
          placeholderTextColor={colors.textSecondary}
          value={notes}
          onChangeText={setNotes}
        />
      </ScrollView>
    </EntryModal>
  )
}

const styles = StyleSheet.create({
  toggleRow: { flexDirection: 'row', marginVertical: spacing.md },
  toggleBtn: {
    flex: 1,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  toggleTxt: { fontSize: 14, color: colors.textSecondary },
  toggleTxtActive: { color: '#fff', fontWeight: '600' },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  timeContainer: { flex: 1, alignItems: 'center' },
  label: { fontSize: 14, fontWeight: '500', color: colors.textPrimary },
  timeBox: {
    marginTop: 4,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  timeText: { fontSize: 16, color: colors.textPrimary },
  sectionHeader: { fontSize: 14, fontWeight: '500', marginTop: spacing.md, color: colors.textPrimary },
  interruptionRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  durationInput: { width: 60 },
  addLink: { marginTop: spacing.sm, fontWeight: '500' },
  notesInput: { height: 80, textAlignVertical: 'top' },
})
