// File: src/components/ActivityItem.tsx
import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import {
  Activity,
  SleepActivity,
  FeedingActivity,
  DiaperActivity,
  MilestoneActivity,
  HealthActivity,
} from '../models/types'
import {
  activityIconMap,
  activityColorMap,
} from '../constants/activityConfig'
import { colors } from '../theme/colors'
import { formatTime } from '../utils/timeUtils'

interface Props {
  activity: Activity
  onPress: (activity: Activity) => void
}

export const ActivityItem: React.FC<Props> = ({ activity, onPress }) => {
  // Default label and detail
  let displayTitle = ''
  let detail = ''
  // Derive start and end times (for sleep) or fallback to createdAt
  let start = ''
  let end = ''

  switch (activity.type) {
    case 'sleep': {
      const sa = activity as SleepActivity
      displayTitle = 'Sleep'
      start = formatTime(sa.start)
      end = formatTime(sa.end)
      const startDate = new Date(sa.start)
      const endDate = new Date(sa.end)
      const durationMin = Math.round((endDate.getTime() - startDate.getTime()) / 60000)
      const interrupts = sa.interruptions?.length ?? 0
      const moodText = sa.mood ? ` | Mood: ${sa.mood}` : ''
      detail = `${durationMin}m | Wake Ups: ${interrupts}${moodText}`
      break
    }
    case 'feeding': {
      const fa = activity as FeedingActivity
      displayTitle = 'Feeding'
      start = formatTime(fa.createdAt)
      // no end for feeding
      if (fa.mode === 'bottle') {
        const amount = fa.amount ?? 0
        detail = `Bottle: ${amount}${fa.unit ?? 'oz'}`
      } else if (fa.mode === 'breast') {
        const s = new Date(fa.start)
        const e = new Date(fa.end)
        const dur = Math.round((e.getTime() - s.getTime()) / 60000)
        detail = `Breast: ${dur}m | Side: ${fa.side}`
      } else if (fa.mode === 'solids') {
        const desc = fa.amountDesc || ''
        const reaction = fa.reaction || ''
        detail = `Solids${desc ? `: ${desc}` : ''}${reaction ? ` | ${reaction}` : ''}`
      }
      break
    }
    case 'diaper': {
      const da = activity as DiaperActivity
      displayTitle = 'Diaper'
      start = formatTime(da.createdAt)
      const parts: string[] = []
      if (da.status) parts.push(da.status)
      if (da.rash) parts.push('Rash')
      if (da.diarrhea) parts.push('Diarrhea')
      detail = parts.join(' | ')
      break
    }
    case 'milestone': {
      const me = activity as MilestoneActivity
      displayTitle = 'Milestone'
      start = formatTime(me.createdAt)
      detail = me.notes || ''
      break
    }
    case 'health': {
      const he = activity as HealthActivity
      displayTitle = 'Health'
      start = formatTime(he.createdAt)
      detail = he.details || ''
      break
    }
    default: {
      const t = (activity as Activity).type
      displayTitle = t.charAt(0).toUpperCase() + t.slice(1)
      start = formatTime((activity as Activity).createdAt)
      break
    }
  }

  // Build timeLabel: two lines if both start and end
  const timeLabel = end
    ? `${start} -\n${end}`
    : `${start}`

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(activity)}>
      <View style={styles.left}>
        <Ionicons
          name={activityIconMap[activity.type]}
          size={20}
          color={activityColorMap[activity.type]}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{displayTitle}</Text>
          {!!detail && <Text style={styles.detail}>{detail}</Text>}
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.time}>{timeLabel}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    backgroundColor: colors.card,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '70%',
  },
  textContainer: {
    marginLeft: 8,
  },
  title: {
    fontSize: 16,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  detail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  right: {
    alignItems: 'flex-end',
    maxWidth: '40%',
  },
  time: {
    fontSize: 12,
    color: colors.textSecondary,
  },
})