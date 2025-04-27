// File: src/components/modals/SleepModal.tsx
import React, { useState } from 'react'
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
import { activityColorMap } from '../../screens/TodayView/types'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { SleepActivity } from '../../screens/TodayView/types'

type Period = 'Day' | 'Night'
type Mood = 'Happy' | 'Fussy' | ''
interface Interruption { start: Date; duration: string }

type PickerContext =
  | { type: 'start' }
  | { type: 'end' }
  | { type: 'interruption'; index: number }

export const SleepModal: React.FC<{ onClose: () => void; onSave: (entry: SleepActivity | SleepActivity[]) => void }> = ({ onClose, onSave }) => {
  const accent = activityColorMap.sleep
  const [period, setPeriod] = useState<Period>('Day')
  const [startTime, setStartTime] = useState<Date>(new Date())
  const [endTime, setEndTime] = useState<Date | null>(null)
  const [interruptions, setInterruptions] = useState<Interruption[]>([])
  const [mood, setMood] = useState<Mood>('')
  const [notes, setNotes] = useState<string>('')
  const [picker, setPicker] = useState<PickerContext | null>(null)

  const fmtTime = (d: Date) => d.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })
  const now = new Date()

  const canSave = !!(endTime && endTime >= startTime)

  const addInterruption = () => {
    setInterruptions(prev => [...prev, { start: new Date(), duration: '5' }])
  }

  const onChange = (_: any, dt?: Date) => {
    if (!dt) {
      setPicker(null)
      return
    }
    // prevent future times
    const validDate = dt > now ? now : dt
    if (picker) {
      if (picker.type === 'start') setStartTime(validDate)
      if (picker.type === 'end') setEndTime(validDate)
      if (picker.type === 'interruption') {
        setInterruptions(prev => {
          const updated = [...prev]
          updated[picker.index] = { ...updated[picker.index], start: validDate }
          return updated
        })
      }
    }
    setPicker(null)
  }

  const handleSave = () => {
    if (!canSave) return
    // primary sleep entry
    const sleepEntry: SleepActivity = {
      id: Date.now().toString(),
      type: 'sleep',
      start: startTime.toISOString(),
      end: (endTime || startTime).toISOString(),
      createdAt: startTime.toISOString(),
      duration: `${Math.round(((endTime || startTime).getTime() - startTime.getTime())/60000)} min`,
      period: period.toLowerCase() as 'day' | 'night',
      title: `Sleep (${period}): ${fmtTime(startTime)}–${fmtTime(endTime || startTime)}`,
      ...(notes.trim() && { notes: notes.trim() }),
      ...(mood && { mood }),
    }

    // interruptions as separate entries when tagging 'wake'
    if (interruptions.length > 0) {
      const wakeEntries = interruptions.map((intr, i) => {
        const dur = parseInt(intr.duration, 10) || 0
        const endIntr = new Date(intr.start.getTime() + dur*60000)
        return {
          id: `${Date.now()}_${i}`,
          type: 'sleep',
          start: intr.start.toISOString(),
          end: endIntr.toISOString(),
          createdAt: intr.start.toISOString(),
          duration: `${dur} min`,
          period: 'night',
          title: `Wake: ${fmtTime(intr.start)} for ${dur} min`,
          ...(notes.trim() && { notes: notes.trim() }),
        } as SleepActivity
      })
      onSave([sleepEntry, ...wakeEntries])
    } else {
      onSave(sleepEntry)
    }
    onClose()
  }

  return (
    <EntryModal title="Log Sleep" accent={accent} onClose={onClose} onSave={handleSave}>
      <ScrollView>
        {/* Period Toggle */}
        <View style={styles.toggleRow}>
          {(['Day', 'Night'] as Period[]).map(p => (
            <TouchableOpacity
              key={p}
              style={[styles.toggleBtn, period === p && { backgroundColor: accent, borderColor: accent }]}
              onPress={() => setPeriod(p)}>
              <Text style={[styles.toggleTxt, period === p && styles.toggleTxtActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Time Pickers */}
        <View style={styles.timeRow}>
          {(['Start', 'End'] as const).map(label => (
            <View key={label} style={styles.timeContainer}>
              <Text style={styles.label}>{label}</Text>
              <TouchableOpacity
                style={styles.timeBox}
                onPress={() => setPicker({ type: label.toLowerCase() as 'start' | 'end' })}>
                <Text style={styles.timeText}>
                  {label === 'Start' ? fmtTime(startTime) : fmtTime(endTime || startTime)}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        {/* Picker */}
        {picker && (
          <DateTimePicker
            value={picker.type === 'start' ? startTime : endTime || new Date()}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChange}
          />
        )}
        {/* Interruptions */}
        <Text style={styles.sectionHeader}>Sleep Interruptions</Text>
        {interruptions.map((intr, idx) => (
          <View key={idx} style={styles.interruptionRow}>
            <TouchableOpacity
              style={styles.timeBox}
              onPress={() => setPicker({ type: 'interruption', index: idx })}>
              <Text style={styles.timeText}>{fmtTime(intr.start)}</Text>
            </TouchableOpacity>
            <TextInput
              style={[styles.input, styles.durationInput]}
              keyboardType="numeric"
              value={intr.duration}
              onChangeText={v => setInterruptions(prev => prev.map((x,i)=>i===idx?{...x,duration:v}:x))}
              placeholder="min"
            />
          </View>
        ))}
        <TouchableOpacity onPress={addInterruption}>
          <Text style={[styles.addLink, { color: accent }]}>+ Add Interruption</Text>
        </TouchableOpacity>
        {/* Mood */}
        <Text style={styles.sectionHeader}>Mood on Wake</Text>
        <View style={styles.toggleRow}>
          {(['Happy', 'Fussy'] as Mood[]).map(mv => (
            <TouchableOpacity
              key={mv}
              style={[styles.toggleBtn, mood === mv && { backgroundColor: accent, borderColor: accent }]}
              onPress={() => setMood(mood === mv ? '' : mv)}>
              <Ionicons
                name={mv === 'Happy' ? 'happy-outline' : 'sad-outline'}
                size={24}
                color={mood === mv ? '#fff' : colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>
        {/* Notes */}
        <Text style={styles.sectionHeader}>Notes</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          multiline
          placeholder="(e.g., baby stirred once)"
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
