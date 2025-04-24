// src/screens/TodayView/TimelineView.tsx
import React, { useState, useMemo } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Button,
  StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import TimelineView from './TimelineView'
import { NLInputBar } from '../../components/common/NLInputBar'
import { ScreenContainer } from '../../components/layout/ScreenContainer'
import { Activity, ActivityType } from './types'
import { colors } from '../../theme/colors'
import { typography } from '../../theme/typography'
import { spacing } from '../../theme/spacing'

interface Props {
  activities: Activity[]
  refreshing: boolean
  onRefresh: () => void
  onAddActivity: (type: Exclude<ActivityType, 'health'>, item?: Activity) => void
}

const quickActions: {
  type: Exclude<ActivityType, 'health'>
  icon: keyof typeof Ionicons.glyphMap
  color: string
  label: string
}[] = [
  { type: 'sleep',     icon: 'moon',       color: colors.sleep,         label: 'Sleep'     },
  { type: 'feeding',   icon: 'restaurant', color: colors.feeding,       label: 'Feed'      },
  { type: 'diaper',    icon: 'water',      color: colors.diaper,        label: 'Diaper'    },
  { type: 'milestone', icon: 'trophy',     color: colors.accentPrimary, label: 'Milestone' },
]

export default function TimelineViewScreen({
  activities,
  refreshing,
  onRefresh,
  onAddActivity,
}: Props) {
  const [fabOpen, setFabOpen] = useState(false)
  const [modalType, setModalType] = useState<
    Exclude<ActivityType, 'health'> | null
  >(null)

  // ---- summary calculations ----
  const summary = useMemo(() => {
    const sleepActivities = activities.filter(a => a.type === 'sleep')
    const totalSleepCount = sleepActivities.length

    const diaperActivities = activities.filter(a => a.type === 'diaper')
    const wetCount = diaperActivities.filter(d =>
      d.title.toLowerCase().includes('wet')
    ).length
    const dirtyCount = diaperActivities.filter(d =>
      d.title.toLowerCase().includes('dirty')
    ).length

    const feedingCount = activities.filter(a => a.type === 'feeding').length

    const lastSleep = sleepActivities.slice(-1)[0]
    const lastDiaper = diaperActivities.slice(-1)[0]
    const lastFeeding = activities.filter(a => a.type === 'feeding').slice(-1)[0]

    return {
      totalSleepCount,
      wetCount,
      dirtyCount,
      feedingCount,
      lastSleep,
      lastDiaper,
      lastFeeding,
    }
  }, [activities])

  const openModal = (
    type: Exclude<ActivityType, 'health'>,
    item?: Activity
  ) => {
    setModalType(type)
    setFabOpen(false)
    onAddActivity(type, item)
  }
  const closeModal = () => setModalType(null)

  return (
    <ScreenContainer>
      {/* 1) Summary row */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{summary.totalSleepCount}</Text>
          <Text style={styles.summaryLabel}>Sleep</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>
            {summary.wetCount}/{summary.dirtyCount}
          </Text>
          <Text style={styles.summaryLabel}>Wet/Dirty</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{summary.feedingCount}</Text>
          <Text style={styles.summaryLabel}>Feedings</Text>
        </View>
      </View>

      {/* 2) Last-activity row */}
      <View style={styles.lastRow}>
        {summary.lastSleep && (
          <TouchableOpacity
            style={[styles.lastCard, { borderLeftColor: colors.sleep }]}
            onPress={() => openModal('sleep', summary.lastSleep)}
          >
            <Text style={styles.lastTitle}>Last Sleep</Text>
            <Text style={styles.lastText}>
              {summary.lastSleep.title} at {summary.lastSleep.time}
            </Text>
          </TouchableOpacity>
        )}
        {summary.lastDiaper && (
          <TouchableOpacity
            style={[styles.lastCard, { borderLeftColor: colors.diaper }]}
            onPress={() => openModal('diaper', summary.lastDiaper)}
          >
            <Text style={styles.lastTitle}>Last Diaper</Text>
            <Text style={styles.lastText}>
              {summary.lastDiaper.title} at {summary.lastDiaper.time}
            </Text>
          </TouchableOpacity>
        )}
        {summary.lastFeeding && (
          <TouchableOpacity
            style={[styles.lastCard, { borderLeftColor: colors.feeding }]}
            onPress={() => openModal('feeding', summary.lastFeeding)}
          >
            <Text style={styles.lastTitle}>Last Feed</Text>
            <Text style={styles.lastText}>
              {summary.lastFeeding.title} at {summary.lastFeeding.time}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 3) Chronological timeline */}
      <TimelineView
        activities={activities}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onAddActivity={openModal}
      />

      {/* FAB speed-dial */}
      <View style={styles.fabWrapper}>
        {fabOpen &&
          quickActions.map((a, i) => {
            const angle = -Math.PI + (Math.PI / (quickActions.length - 1)) * i
            const r = 80,
              x = r * Math.cos(angle),
              y = r * Math.sin(angle)
            return (
              <TouchableOpacity
                key={a.type}
                onPress={() => openModal(a.type)}
                style={[
                  styles.fabOption,
                  {
                    backgroundColor: a.color,
                    transform: [{ translateX: x }, { translateY: y }],
                  },
                ]}
              >
                <Ionicons name={a.icon} size={20} color="white" />
              </TouchableOpacity>
            )
          })}
        <TouchableOpacity
          style={styles.fabMain}
          onPress={() => setFabOpen(o => !o)}
        >
          <Ionicons name={fabOpen ? 'close' : 'add'} size={32} color="white" />
        </TouchableOpacity>
      </View>

      {/* NL input bar */}
      <View style={styles.nlBottom}>
        <NLInputBar placeholder="How can I help you?" onSubmit={() => {}} />
      </View>

      {/* placeholder modal */}
      <Modal transparent animationType="slide" visible={!!modalType}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>{modalType} Entry</Text>
            <Button title="Close" onPress={closeModal} />
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.md,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.sm,
    alignItems: 'center',
    width: 100,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryValue: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.lg,
    color: colors.textPrimary,
  },
  summaryLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 4,
  },

  lastRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  lastCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: spacing.sm,
    marginHorizontal: 4,
  },
  lastTitle: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  lastText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    marginTop: 2,
  },

  fabWrapper: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  fabMain: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accentPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  fabOption: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  nlBottom: {
    position: 'absolute',
    bottom: 5,
    left: spacing.md,
    right: spacing.md,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: spacing.lg,
  },
  modalHeader: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.lg,
    marginBottom: spacing.md,
  },
})