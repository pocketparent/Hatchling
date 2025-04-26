// File: src/components/modals/FeedingModal.tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Ionicons } from '@expo/vector-icons'
import {
  BreastFeedingActivity,
  BottleFeedingActivity,
  SolidsFeedingActivity,
  activityColorMap,
} from '../../screens/TodayView/types'
import { EntryModal } from './EntryModal'
import { colors } from '../../theme/colors'

type Mode = 'breast' | 'bottle' | 'solids'

export const FeedingModal: React.FC<{
  onClose(): void
  onSave(
    entry: BreastFeedingActivity | BottleFeedingActivity | SolidsFeedingActivity
  ): void
}> = ({ onClose, onSave }) => {
  const accent = activityColorMap.feeding
  const [mode, setMode] = useState<Mode>('breast')
  const [showPicker, setShowPicker] = useState(false)
  const [startTime, setStartTime] = useState(new Date())
  const [leftMins, setLeftMins] = useState('0')
  const [rightMins, setRightMins] = useState('0')
  const [bottleType, setBottleType] = useState<'breastmilk' | 'formula'>(
    'breastmilk'
  )
  const [bottleAmount, setBottleAmount] = useState('')
  const [foods, setFoods] = useState<{ name: string; liked?: boolean | null }[]>([])
  const [notes, setNotes] = useState('')

  const fmt = (d: Date) =>
    d.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })

  const entered = {
    breast: Number(leftMins) > 0 || Number(rightMins) > 0,
    bottle: !!bottleAmount,
    solids: foods.length > 0 && foods.every(f => f.name),
  }
  const canSave = () => {
    if (mode === 'breast') return entered.breast
    if (mode === 'bottle') return entered.bottle
    if (mode === 'solids') return entered.solids
    return false
  }

  const handleSave = () => {
    const base = {
      id: Date.now().toString(),
      type: 'feeding' as const,
      createdAt: startTime.toISOString(),
    }
    if (mode === 'breast') {
      const entry: BreastFeedingActivity = {
        ...base,
        mode: 'breast',
        start: startTime.toISOString(),
        end: startTime.toISOString(),
        side: Number(rightMins) > Number(leftMins) ? 'Right' : 'Left',
        notes: notes || undefined,
        title: `Breast L:${leftMins}m R:${rightMins}m`,
      }
      return onSave(entry)
    }
    if (mode === 'bottle') {
      const entry: BottleFeedingActivity = {
        ...base,
        mode: 'bottle',
        amount: Number(bottleAmount),
        unit: 'oz',
        notes: notes || undefined,
        title: `Bottle: ${bottleAmount} oz`,
      }
      return onSave(entry)
    }
    // solids
    const names = foods.map(f => f.name).join(', ')
    const allLiked = foods.every(f => f.liked)
    const reaction: 'Liked' | 'Disliked' = allLiked ? 'Liked' : 'Disliked'
    const entry: SolidsFeedingActivity = {
      ...base,
      mode: 'solids',
      start: startTime.toISOString(),
      amountDesc: names,
      reaction,
      notes: notes || undefined,
      title: `Solids: ${names}`,
    }
    return onSave(entry)
  }

  const addFood = () => setFoods(f => [...f, { name: '', liked: null }])
  const updateFood = (i: number, name: string) => {
    const copy = [...foods]
    copy[i].name = name
    setFoods(copy)
  }
  const setFoodLike = (i: number, liked: boolean) => {
    const copy = [...foods]
    copy[i].liked = liked
    setFoods(copy)
  }

  return (
    <EntryModal title="Log Feeding" accent={accent} onClose={onClose} onSave={handleSave}>
      <View style={styles.toggleRow}>
        {(['breast', 'bottle', 'solids'] as Mode[]).map(m => (
          <TouchableOpacity
            key={m}
            style={[
              styles.toggleOpt,
              mode === m && { backgroundColor: accent, borderColor: accent },
              entered[m] && styles.toggleOptDone,
            ]}
            onPress={() => setMode(m)}
          >
            <Text style={mode === m ? styles.toggleTxtActive : styles.toggleTxt}>
              {m === 'breast' ? '🍼 Breast' : m === 'bottle' ? '🍼 Bottle' : '🍽 Solids'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Start Time</Text>
      <TouchableOpacity style={styles.picker} onPress={() => setShowPicker(true)}>
        <Text style={styles.pickerTxt}>{fmt(startTime)}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display="default"
          onChange={(_, d) => {
            setShowPicker(false)
            if (d) setStartTime(d)
          }}
        />
      )}

      {mode === 'breast' && (
        <View style={styles.timeRow}>
          {['Left', 'Right'].map((sideName, idx) => {
            const val = idx === 0 ? leftMins : rightMins
            const setter = idx === 0 ? setLeftMins : setRightMins
            return (
              <View key={sideName} style={styles.sideContainer}>
                <View style={styles.timeBox}>
                  <TextInput
                    style={styles.timeInput}
                    keyboardType="numeric"
                    value={val}
                    onChangeText={setter}
                    onFocus={() => val === '0' && setter('')}
                  />
                  <Text style={styles.unit}>mins</Text>
                </View>
                <Text style={[styles.sideLabel, { color: accent }]}>
                  {sideName} Side
                </Text>
              </View>
            )
          })}
        </View>
      )}

      {mode === 'bottle' && (
        <>
          <Text style={styles.label}>Milk Type</Text>
          <View style={styles.toggleRow}>
            {(['breastmilk', 'formula'] as const).map(t => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.toggleOpt,
                  bottleType === t && { backgroundColor: accent, borderColor: accent },
                ]}
                onPress={() => setBottleType(t)}
              >
                <Text style={bottleType === t ? styles.toggleTxtActive : styles.toggleTxt}>
                  {t === 'breastmilk' ? 'Breastmilk' : 'Formula'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Amount (oz)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="e.g. 4"
            value={bottleAmount}
            onChangeText={setBottleAmount}
          />
        </>
      )}

      {mode === 'solids' && (
        <>
          <Text style={styles.label}>Foods</Text>
          {foods.map((f, i) => (
            <View key={i} style={styles.foodRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Food name"
                value={f.name}
                onChangeText={t => updateFood(i, t)}
              />
              <View style={styles.likeRow}>
                <TouchableOpacity onPress={() => setFoodLike(i, false)}>
                  <Ionicons
                    name={f.liked === false ? 'heart-dislike' : 'heart-dislike-outline'}
                    size={24}
                    color={f.liked === false ? accent : colors.textSecondary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setFoodLike(i, true)}
                  style={{ marginLeft: 12 }}
                >
                  <Ionicons
                    name={f.liked === true ? 'heart' : 'heart-outline'}
                    size={24}
                    color={f.liked === true ? accent : colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.addBtn} onPress={addFood}>
            <Text style={[styles.addTxt, { color: accent }]}>+ Add Another Food</Text>
          </TouchableOpacity>
        </>
      )}

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        placeholder="Any extra details..."
        value={notes}
        onChangeText={setNotes}
      />
    </EntryModal>
  )
}

const styles = StyleSheet.create({
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  toggleOpt: {
    flex: 1,
    marginHorizontal: 4,
    padding: 8,
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
  toggleOptDone: {
    borderWidth: 2,
    borderColor: colors.accentSecondary,
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  picker: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
  },
  pickerTxt: {
    color: colors.textPrimary,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  sideContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  timeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    width: '100%',
  },
  timeInput: {
    flex: 1,
    fontSize: 20,
    textAlign: 'center',
    color: colors.textPrimary,
    padding: 0,
    margin: 0,
  },
  unit: {
    marginLeft: 4,
    fontSize: 16,
    color: colors.textSecondary,
  },
  sideLabel: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 8,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  likeRow: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  addBtn: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  addTxt: {
    fontWeight: '500',
  },
})
