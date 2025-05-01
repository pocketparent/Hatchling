// File: src/components/modals/FeedingModal.tsx
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
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import {
  BreastFeedingActivity,
  BottleFeedingActivity,
  SolidsFeedingActivity,
  FeedingActivity,
} from '../../models/types'
import { activityColorMap } from '../../constants/activityConfig'

// Supported feeding modes
type Mode = 'breast' | 'bottle' | 'solids'
// Picker context
type PickerContext = { type: 'time' }

interface FeedingModalProps {
  /** Prefill form when editing */
  initialEntry?:
    | BreastFeedingActivity
    | BottleFeedingActivity
    | SolidsFeedingActivity
    | FeedingActivity[]
  onClose: () => void
  onSave: (
    entry:
      | BreastFeedingActivity
      | BottleFeedingActivity
      | SolidsFeedingActivity
      | FeedingActivity[]
  ) => void
}

export const FeedingModal: React.FC<FeedingModalProps> = ({
  initialEntry,
  onClose,
  onSave,
}) => {
  const accent = activityColorMap.feeding

  // For editing arrays, take first entry
  const editEntry = Array.isArray(initialEntry)
    ? initialEntry[0]
    : initialEntry

  // Shared state seeded from editEntry or defaults
  const [startTime, setStartTime] = useState<Date>(
    editEntry ? new Date(editEntry.createdAt) : new Date()
  )
  const [picker, setPicker] = useState<PickerContext | null>(null)
  const [selectedModes, setSelectedModes] = useState<Mode[]>(
    editEntry ? [editEntry.mode] : ['breast']
  )
  const [notes, setNotes] = useState<string>(
    editEntry?.notes || ''
  )

  // Breast mode state
  const [leftMins, setLeftMins] = useState<string>(
    editEntry && editEntry.mode === 'breast'
      ? editEntry.title.match(/(\d+) min/)?.[1] || ''
      : ''
  )
  const [rightMins, setRightMins] = useState<string>(
    editEntry && editEntry.mode === 'breast'
      ? editEntry.title.match(/(\d+) min/)?.[1] || ''
      : ''
  )

  // Bottle mode state
  const [breastMilkOz, setBreastMilkOz] = useState<string>(
    editEntry && editEntry.mode === 'bottle'
      ? String((editEntry as BottleFeedingActivity).amount)
      : ''
  )
  const [formulaOz, setFormulaOz] = useState<string>(
    editEntry && editEntry.mode === 'bottle'
      ? String((editEntry as BottleFeedingActivity).amount)
      : ''
  )

  // Solids mode state
  const [foods, setFoods] = useState<{ name: string; liked: boolean | null }[]>(
    editEntry && editEntry.mode === 'solids'
      ? [
          {
            name: (editEntry as SolidsFeedingActivity).amountDesc || '',
            liked: (editEntry as SolidsFeedingActivity).reaction === 'Liked',
          },
        ]
      : []
  )

  const now = new Date()
  const fmt = (d: Date) =>
    d.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })

  // Toggle mode selection and clear inputs
  const toggleMode = (mode: Mode) => {
    setSelectedModes(prev => {
      if (prev.includes(mode)) {
        if (mode === 'breast') {
          setLeftMins('')
          setRightMins('')
        }
        if (mode === 'bottle') {
          setBreastMilkOz('')
          setFormulaOz('')
        }
        if (mode === 'solids') setFoods([])
        return prev.filter(m => m !== mode)
      }
      return [...prev, mode]
    })
  }

  // Validation flags
  const validBreast =
    (Number(leftMins) || 0) + (Number(rightMins) || 0) > 0
  const validBottle = (Number(breastMilkOz) || 0) > 0
  const validSolids =
    foods.length > 0 && foods.every(f => f.name.trim().length > 0)
  const canSave =
    selectedModes.length > 0 &&
    selectedModes.every(m =>
      m === 'breast'
        ? validBreast
        : m === 'bottle'
        ? validBottle
        : m === 'solids'
        ? validSolids
        : false
    )

  // Save handler
  const handleSave = () => {
    if (!canSave) return
    const timestamp = startTime.toISOString()
    const entries: Array<
      BreastFeedingActivity | BottleFeedingActivity | SolidsFeedingActivity
    > = []

    // Breast
    if (selectedModes.includes('breast')) {
      const total = (Number(leftMins) || 0) + (Number(rightMins) || 0)
      entries.push({
        id:
          editEntry && editEntry.mode === 'breast'
            ? editEntry.id
            : Date.now().toString(),
        type: 'feeding',
        mode: 'breast',
        start: timestamp,
        end: timestamp,
        createdAt: timestamp,
        side:
          Number(rightMins) > Number(leftMins) ? 'Right' : 'Left',
        title: `Breast: ${total} min`,
        notes: notes.trim() || undefined,
      })
    }

    // Bottle
    if (selectedModes.includes('bottle')) {
      const bm = Number(breastMilkOz) || 0
      if (bm > 0)
        entries.push({
          id:
            editEntry && editEntry.mode === 'bottle'
              ? editEntry.id
              : Date.now().toString(),
          type: 'feeding',
          mode: 'bottle',
          createdAt: timestamp,
          amount: bm,
          unit: 'oz',
          title: `Bottle: ${bm} oz`,
          notes: notes.trim() || undefined,
        })
    }

    // Solids
    if (selectedModes.includes('solids')) {
      const list = foods.map(f => f.name.trim()).join(', ')
      const reaction = foods.every(f => f.liked) ? 'Liked' : 'Disliked'
      entries.push({
        id:
          editEntry && editEntry.mode === 'solids'
            ? editEntry.id
            : Date.now().toString(),
        type: 'feeding',
        mode: 'solids',
        createdAt: timestamp,
        amountDesc: list,
        reaction,
        title: `Solids: ${list}`,
        notes: notes.trim() || undefined,
      })
    }

    onSave(entries.length > 1 ? entries : entries[0])
    onClose()
  }

  // Picker
  const onPickerChange = (_: any, dt?: Date) => {
    setPicker(null)
    if (!dt) return
    setStartTime(dt > now ? now : dt)
  }

  // Solids handlers
  const addFood = () =>
    setFoods(prev => [...prev, { name: '', liked: null }])
  const deleteFood = (i: number) =>
    setFoods(prev => prev.filter((_, idx) => idx !== i))
  const updateFood = (i: number, name: string) =>
    setFoods(prev => prev.map((f, idx) => (idx === i ? { ...f, name } : f)))
  const setFoodLike = (i: number, liked: boolean) =>
    setFoods(prev => prev.map((f, idx) => (idx === i ? { ...f, liked } : f)))

  return (
    <EntryModal title="Log Feeding" accent={accent} onClose={onClose} onSave={handleSave}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Time Picker */}
        <Text style={styles.label}>Time</Text>
        <TouchableOpacity
          style={styles.picker}
          onPress={() => setPicker({ type: 'time' })}
        >
          <Text style={styles.pickerTxt}>{fmt(startTime)}</Text>
        </TouchableOpacity>
        {picker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onPickerChange}
          />
        )}

        {/* Modes */}
        <Text style={styles.sectionHeader}>Modes</Text>
        <View style={styles.toggleRow}>
          {(['breast', 'bottle', 'solids'] as Mode[]).map(m => (
            <TouchableOpacity
              key={m}
              style={[
                styles.chip,
                selectedModes.includes(m) && { backgroundColor: accent, borderColor: accent },
              ]}
              onPress={() => toggleMode(m)}
            >
              <Text
                style={
                  selectedModes.includes(m) ? styles.chipTxtActive : styles.chipTxt
                }
              >
                {m === 'breast'
                  ? '🥛 Breast'
                  : m === 'bottle'
                  ? '🍼 Bottle'
                  : '🍽 Solids'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* ...rest of UI unchanged... */}
      </ScrollView>
    </EntryModal>
  )
}

const styles = StyleSheet.create({
  container: { padding: spacing.md },
  label: { fontSize: 14, fontWeight: '500', color: colors.textPrimary },
  picker: {
    marginTop: 4,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  pickerTxt: { fontSize: 16, color: colors.textPrimary },
  toggleRow: { flexDirection: 'row', marginBottom: spacing.md },
  chip: {
    flex: 1,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  chipTxt: { fontSize: 14, color: colors.textSecondary },
  chipTxtActive: { fontSize: 14, color: '#fff', fontWeight: '600' },
  sectionHeader: {
    marginTop: spacing.md,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  sideContainer: { flex: 1, paddingRight: spacing.sm },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  notesInput: { height: 80, textAlignVertical: 'top' },
  // include any other style definitions from original file
})
