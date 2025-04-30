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
  activityColorMap,
} from '../../models/types'

// Supported feeding modes
type Mode = 'breast' | 'bottle' | 'solids'
// Picker context
type PickerContext = { type: 'time' }

interface Props {
  onClose: () => void
  onSave: (
    entry:
      | BreastFeedingActivity
      | BottleFeedingActivity
      | SolidsFeedingActivity
      | Array<BreastFeedingActivity | BottleFeedingActivity | SolidsFeedingActivity>
  ) => void
}

export const FeedingModal: React.FC<Props> = ({ onClose, onSave }) => {
  const accent = activityColorMap.feeding

  // Shared state
  const [startTime, setStartTime] = useState<Date>(new Date())
  const [picker, setPicker] = useState<PickerContext | null>(null)
  const [selectedModes, setSelectedModes] = useState<Mode[]>(['breast'])
  const [notes, setNotes] = useState<string>('')

  // Breast mode state
  const [leftMins, setLeftMins] = useState<string>('')
  const [rightMins, setRightMins] = useState<string>('')

  // Bottle mode state (breastmilk vs formula oz)
  const [breastMilkOz, setBreastMilkOz] = useState<string>('')
  const [formulaOz, setFormulaOz] = useState<string>('')

  // Solids mode state
  const [foods, setFoods] = useState<{ name: string; liked: boolean | null }[]>([])

  const now = new Date()
  const fmt = (d: Date) => d.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })

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

  // Validation
  const validBreast = (Number(leftMins) || 0) + (Number(rightMins) || 0) > 0
  const validBottle = (Number(breastMilkOz) || 0) + (Number(formulaOz) || 0) > 0
  const validSolids = foods.length > 0 && foods.every(f => f.name.trim().length > 0)
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
    const entries: Array<BreastFeedingActivity | BottleFeedingActivity | SolidsFeedingActivity> = []

    // Breast
    if (selectedModes.includes('breast')) {
      const total = (Number(leftMins) || 0) + (Number(rightMins) || 0)
      entries.push({
        id: Date.now().toString(),
        type: 'feeding',
        mode: 'breast',
        start: timestamp,
        end: timestamp,
        createdAt: timestamp,
        side: Number(rightMins) > Number(leftMins) ? 'Right' : 'Left',
        title: `Breast: ${total} min`,
        notes: notes.trim() || undefined,
      })
    }

    // Bottle entries (separate)
    if (selectedModes.includes('bottle')) {
      const bm = Number(breastMilkOz) || 0
      const fm = Number(formulaOz) || 0
      if (bm > 0) entries.push({
        id: `${Date.now()}-bm`,
        type: 'feeding',
        mode: 'bottle',
        createdAt: timestamp,
        amount: bm,
        unit: 'oz',
        title: `Bottle (breastmilk): ${bm} oz`,
        notes: notes.trim() || undefined,
      })
      if (fm > 0) entries.push({
        id: `${Date.now()}-fm`,
        type: 'feeding',
        mode: 'bottle',
        createdAt: timestamp,
        amount: fm,
        unit: 'oz',
        title: `Bottle (formula): ${fm} oz`,
        notes: notes.trim() || undefined,
      })
    }

    // Solids
    if (selectedModes.includes('solids')) {
      const names = foods.map(f => f.name.trim()).join(', ')
      const reaction = foods.every(f => f.liked) ? 'Liked' : 'Disliked'
      entries.push({
        id: `${Date.now()}-sol`,
        type: 'feeding',
        mode: 'solids',
        createdAt: timestamp,
        amountDesc: names,
        reaction,
        title: `Solids: ${names}`,
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
  const addFood = () => setFoods(prev => [...prev, { name: '', liked: null }])
  const deleteFood = (i: number) => setFoods(prev => prev.filter((_, idx) => idx !== i))
  const updateFood = (i: number, name: string) => setFoods(prev => prev.map((f, idx) => idx === i ? { ...f, name } : f))
  const setFoodLike = (i: number, liked: boolean) => setFoods(prev => prev.map((f, idx) => idx === i ? { ...f, liked } : f))

  return (
    <EntryModal title="Log Feeding" accent={accent} onClose={onClose} onSave={handleSave}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Time Picker */}
        <Text style={styles.label}>Time</Text>
        <TouchableOpacity style={styles.picker} onPress={() => setPicker({ type: 'time' })}>
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
          {(['breast','bottle','solids'] as Mode[]).map(m => (
            <TouchableOpacity
              key={m}
              style={[styles.chip, selectedModes.includes(m) && { backgroundColor: accent, borderColor: accent }]} 
              onPress={() => toggleMode(m)}>
              <Text style={selectedModes.includes(m) ? styles.chipTxtActive : styles.chipTxt}>
                {m==='breast'?'🥛 Breast':m==='bottle'?'🍼 Bottle':'🍽 Solids'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Breast Section */}
        {selectedModes.includes('breast') && (
          <>
            <Text style={styles.sectionHeader}>Breastfeeding</Text>
            <View style={styles.timeRow}>
              {['Left','Right'].map((side,i)=>(
                <View key={side} style={styles.sideContainer}>
                  <Text style={styles.subLabel}>{`${side} Side (min)`}</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={i===0?leftMins:rightMins}
                    onChangeText={v=>i===0?setLeftMins(v):setRightMins(v)}
                  />
                </View>
              ))}
            </View>
          </>
        )}

        {/* Bottle Section */}
        {selectedModes.includes('bottle') && (
          <>
            <Text style={styles.sectionHeader}>Bottle Feeding</Text>
            <View style={styles.timeRow}>
              <View style={styles.sideContainer}>
                <Text style={styles.subLabel}>Breastmilk (oz)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={breastMilkOz}
                  placeholder="e.g. 4"
                  onChangeText={setBreastMilkOz}
                />
              </View>
              <View style={styles.sideContainer}>
                <Text style={styles.subLabel}>Formula (oz)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={formulaOz}
                  placeholder="e.g. 4"
                  onChangeText={setFormulaOz}
                />
              </View>
            </View>
          </>
        )}

        {/* Solids Section */}
        {selectedModes.includes('solids') && (
          <>
            <Text style={styles.sectionHeader}>Solids</Text>
            {foods.map((f,i)=>(
              <View key={`food-${i}`} style={styles.foodRow}>
                <TextInput
                  style={[styles.input,{flex:1}]}
                  placeholder="Food name"
                  value={f.name}
                  onChangeText={t=>updateFood(i,t)}
                />
                <TouchableOpacity onPress={()=>deleteFood(i)} style={{marginRight:spacing.sm}}>
                  <Ionicons name="trash-outline" size={20} color={colors.textSecondary}/>
                </TouchableOpacity>
                <View style={styles.likeRow}>
                  <TouchableOpacity onPress={()=>setFoodLike(i,false)}>
                    <Ionicons name={f.liked===false?'heart-dislike':'heart-dislike-outline'} size={20} color={f.liked===false?accent:colors.textSecondary}/>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>setFoodLike(i,true)} style={{marginLeft:spacing.sm}}>
                    <Ionicons name={f.liked===true?'heart':'heart-outline'} size={20} color={f.liked===true?accent:colors.textSecondary}/>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <TouchableOpacity onPress={addFood}>
              <Text style={[styles.addLink,{color:accent}]}>+ Add Food</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Notes */}
        <Text style={styles.sectionHeader}>Notes</Text>
        <TextInput
          style={[styles.input,styles.notesInput]}
          multiline
          placeholder="Optional notes..."
          value={notes}
          onChangeText={setNotes}
        />
      </ScrollView>
    </EntryModal>
  )
}

const styles = StyleSheet.create({
  container:{padding:spacing.md},
  label:{fontSize:14,fontWeight:'500',color:colors.textPrimary},
  picker:{
    marginTop:4,marginBottom:spacing.md,padding:spacing.md,
    borderWidth:1,borderColor:colors.border,borderRadius:8,
  },
  pickerTxt:{fontSize:16,color:colors.textPrimary},
  toggleRow:{flexDirection:'row',marginBottom:spacing.md},
  chip:{
    flex:1,padding:spacing.sm,borderWidth:1,borderColor:colors.border,
    borderRadius:8,alignItems:'center',marginHorizontal:spacing.xs,
  },
  chipTxt:{fontSize:14,color:colors.textSecondary},
  chipTxtActive:{fontSize:14,color:'#fff',fontWeight:'600'},
  sectionHeader:{
    marginTop:spacing.md,fontSize:14,fontWeight:'600',color:colors.textPrimary
  },
  timeRow:{flexDirection:'row',justifyContent:'space-between'},
  sideContainer:{flex:1,paddingRight:spacing.sm},
  subLabel:{fontSize:13,color:colors.textSecondary,marginBottom:4},
  input:{
    borderWidth:1,borderColor:colors.border,borderRadius:8,
    padding:spacing.sm,color:colors.textPrimary,marginBottom:spacing.md
  },
  bottleRow:{flexDirection:'row',alignItems:'center'},
  unitBtn:{
    marginLeft:spacing.sm,padding:spacing.sm,
    borderWidth:1,borderColor:colors.border,borderRadius:8
  },
  unitTxt:{fontSize:14,color:colors.textPrimary},
  foodRow:{flexDirection:'row',alignItems:'center',marginVertical:spacing.xs},
  likeRow:{flexDirection:'row',marginLeft:spacing.sm},
  addLink:{marginTop:spacing.sm,fontWeight:'500'},
  notesInput:{height:80,textAlignVertical:'top'},
})
