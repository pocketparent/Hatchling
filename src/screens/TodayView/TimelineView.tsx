// File: src/screens/TodayView/TimelineView.tsx
import React, { useState, useCallback, useMemo } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Text,
  Modal,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
} from 'firebase/firestore'
import { useSettings } from '../../hooks/useSettings'
import { db, auth } from '../../config/firebase'
import {
  Activity,
  ActivityType,
  SleepActivity,
  FeedingActivity,
  DiaperActivity,
  MilestoneActivity,
  UserSettings,
} from '../../models/types'
import { NLInputBar } from '../../components/common/NLInputBar'
import { Fab } from '../../components/common/Fab'
import { SleepModal } from '../../components/modals/SleepModal'
import { FeedingModal } from '../../components/modals/FeedingModal'
import { DiaperModal } from '../../components/modals/DiaperModal'
import { MilestoneModal } from '../../components/modals/MilestoneModal'
import { ActivityItem } from '../../components/ActivityItem'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { ChatScreen } from '../ChatScreen'
type IconName = React.ComponentProps<typeof Ionicons>['name']

const ACTIONS = [
  { type: 'sleep', icon: 'moon', color: colors.sleep },
  { type: 'feeding', icon: 'restaurant', color: colors.feeding },
  { type: 'diaper', icon: 'water', color: colors.diaper },
  { type: 'milestone', icon: 'camera', color: colors.accentPrimary },
] as const

function formatHM(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function computeStats(activities: Activity[]) {
  const now = new Date()
  let totalDayMin = 0
  activities.forEach(a => {
    if (a.type === 'sleep' && (a as SleepActivity).period === 'day') {
      totalDayMin += parseInt((a as SleepActivity).duration || '0', 10)
    }
  })
  const sleepDates = activities.filter(a => a.type === 'sleep').map(a => new Date(a.createdAt))
  const last = sleepDates.length ? new Date(Math.max(...sleepDates.map(d => d.getTime()))) : null
  const timeSinceLast = last ? formatHM(Math.round((now.getTime() - last.getTime()) / 60000)) : '–'

  let totalBottle = 0
  let totalBreastMin = 0
  activities.forEach(a => {
    if (a.type === 'feeding') {
      const fa = a as FeedingActivity
      if (fa.mode === 'bottle') totalBottle += fa.amount
      else {
        const start = new Date((fa as any).start).getTime()
        const end = new Date((fa as any).end).getTime()
        totalBreastMin += Math.round((end - start) / 60000)
      }
    }
  })

  const wet = activities.filter(a => a.type === 'diaper' && (a as DiaperActivity).status === 'Wet').length
  const dirty = activities.filter(a => a.type === 'diaper' && (a as DiaperActivity).status === 'Dirty').length

  return {
    totalDaySleep: formatHM(totalDayMin),
    timeSinceLast,
    totalBottle,
    totalBreastMin,
    wet,
    dirty,
  }
}

function SummaryView({ activities, enabled }: { activities: Activity[]; enabled: Record<string, boolean> }) {
  const stats = computeStats(activities)
  const cards = [
    {
      key: 'sleep', icon: 'moon', label: 'Day Sleep', value: stats.totalDaySleep, secondary: `Since ${stats.timeSinceLast}`, color: colors.sleep,
    },
    {
      key: 'feeding', icon: 'restaurant', label: 'Feeding', value: `${stats.totalBottle}oz, ${stats.totalBreastMin}m`, color: colors.feeding,
    },
    {
      key: 'diaper', icon: 'water', label: 'Diapers (W/D)', value: `${stats.wet}/${stats.dirty}`, color: colors.diaper,
    },
    {
      key: 'milestone', icon: 'camera', label: 'Milestones', value: '–', color: colors.accentSecondary,
    },
  ]
  const visible = cards.filter(c => enabled[c.key])
  if (visible.length === 0) {
    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.noTrackingText}>No activity tracking turned on.</Text>
      </View>
    )
  }
  return (
    <View style={styles.summaryContainer}>
      {visible.map((c, idx) => (
        <View key={c.key} style={[styles.summaryCard, idx < visible.length - 1 && { marginRight: spacing.md }]}>
          <Ionicons name={c.icon as IconName} size={20} color={c.color} />
          <Text style={styles.summaryValue}>{c.value}</Text>
          <Text style={styles.summaryLabel}>{c.label}</Text>
        </View>
      ))}
    </View>
  )
}

export default function TimelineView() {
  const user = auth.currentUser
  const { settings } = useSettings()
  const [activities, setActivities] = useState<Activity[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [actionMenuVisible, setActionMenuVisible] = useState(false)
  const [showModal, setShowModal] = useState<ActivityType | null>(null)
  const [editItem, setEditItem] = useState<Activity>()
  const [showChat, setShowChat] = useState(false) // ✅ Hook must be declared unconditionally and at top level

  useFocusEffect(
    useCallback(() => {
      if (!user) return
      const q = query(
        collection(db, 'entries'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )
      return onSnapshot(q, snap =>
        setActivities(snap.docs.map(d => ({ ...(d.data() as Activity), id: d.id })))
      )
    }, [user])
  )

  const visibleActivities = useMemo(
    () =>
      activities.filter(a => {
        switch (a.type) {
          case 'sleep': return settings?.trackedActivities.sleep ?? true
          case 'feeding': return settings?.trackedActivities.feeding ?? true
          case 'diaper': return settings?.trackedActivities.diaper ?? true
          case 'milestone': return settings?.trackedActivities.milestone ?? true
          default: return true
        }
      }),
    [activities, settings]
  )

  const availableActions = useMemo(
    () => ACTIONS.filter(a => settings?.trackedActivities[a.type] ?? true),
    [settings]
  )

  const handleSave = async (type: ActivityType, entry?: Activity) => {
    if (!entry || !user) return
    const userId = user.uid
    const createdAt = entry.createdAt || new Date().toISOString()
    const dateKey = createdAt.slice(0, 10)
    const payload: Record<string, any> = { ...entry, userId, createdAt, dateKey }
    delete payload.id
    Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k])
    try {
      if (entry.id) await updateDoc(doc(db, 'entries', entry.id), payload)
      else await addDoc(collection(db, 'entries'), payload)
      setShowModal(null)
      setEditItem(undefined)
    } catch (err) {
      console.error(err)
    }
  }

  const handleItemPress = (item: Activity) => {
    setEditItem(item)
    setActionMenuVisible(false)
    setShowModal(item.type)
  }

  return (
    <View style={styles.container}>
      <SummaryView
        activities={visibleActivities}
        enabled={
          settings?.trackedActivities ?? {
            sleep: true, feeding: true, diaper: true, milestone: true
          }
        }
      />

      <FlatList
        data={visibleActivities}
        extraData={settings?.trackedActivities}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <ActivityItem activity={item} onPress={handleItemPress} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true)
              setTimeout(() => setRefreshing(false), 1000)
            }}
          />
        }
      />

      <NLInputBar
        placeholder="Ask about your baby..."
        onSubmit={() => setShowChat(true)}
      />

      <Modal visible={showChat} animationType="slide">
        <ChatScreen onClose={() => setShowChat(false)} />
      </Modal>

      <View style={styles.fabContainer} pointerEvents="box-none">
        {actionMenuVisible &&
          availableActions.map((act, i) => {
            const angle = Math.PI * ((i + 1) / (availableActions.length + 1))
            const x = Math.cos(angle) * 110
            const y = Math.sin(angle) * 110
            return (
              <TouchableOpacity
                key={act.type}
                style={[
                  styles.actionIcon,
                  { backgroundColor: act.color, transform: [{ translateX: x }, { translateY: -y }] },
                ]}
                onPress={() => {
                  setEditItem(undefined)
                  setActionMenuVisible(false)
                  setShowModal(act.type)
                }}
              >
                <Ionicons name={act.icon} size={24} color="#fff" />
              </TouchableOpacity>
            )
          })}
        <Fab iconName={actionMenuVisible ? 'close' : 'add'} onPress={() => setActionMenuVisible(v => !v)} />
      </View>

      {showModal === 'sleep' && (
        <SleepModal
          initialEntry={editItem as SleepActivity}
          onClose={() => setShowModal(null)}
          onSave={e => handleSave('sleep', e as SleepActivity)}
        />
      )}
      {showModal === 'feeding' && (
        <FeedingModal
          initialEntry={editItem as FeedingActivity}
          onClose={() => setShowModal(null)}
          onSave={e => handleSave('feeding', e as FeedingActivity)}
        />
      )}
      {showModal === 'diaper' && (
        <DiaperModal
          initialEntry={editItem as DiaperActivity}
          onClose={() => setShowModal(null)}
          onSave={e => handleSave('diaper', e as DiaperActivity)}
        />
      )}
      {showModal === 'milestone' && (
        <MilestoneModal
          initialEntry={editItem as MilestoneActivity}
          onClose={() => setShowModal(null)}
          onSave={e => handleSave('milestone', e as MilestoneActivity)}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  summaryContainer: {
    flexDirection: 'row', backgroundColor: '#F7F3EE', paddingHorizontal: 16, marginBottom: 12,
    borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  summaryCard: {
    flex: 1, backgroundColor: '#FFF', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 8,
    alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 2, elevation: 1,
  },
  summaryValue: { marginTop: 8, fontSize: 16, fontWeight: '600', color: '#333' },
  summaryLabel: { marginTop: 4, fontSize: 12, fontWeight: '400', color: '#333' },
  noTrackingText: {
    flex: 1, textAlign: 'center', color: colors.textSecondary, fontStyle: 'italic', padding: spacing.md,
  },
  list: { padding: spacing.md, paddingBottom: spacing.md + 120 },
  fabContainer: { position: 'absolute', bottom: spacing.md + 70, alignSelf: 'center', zIndex: 10 },
  actionIcon: {
    position: 'absolute', width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5,
  },
})
