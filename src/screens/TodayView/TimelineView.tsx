// File: src/screens/TodayView/TimelineView.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db, auth } from '../../config/firebase';

import {
  Activity,
  ActivityType,
  SleepActivity,
  FeedingActivity,
  DiaperActivity,
  MilestoneActivity,
} from '../../models/types';
import { activityColorMap, activityIconMap } from '../../constants/activityConfig';
import { NLInputBar } from '../../components/common/NLInputBar';
import { Fab } from '../../components/common/Fab';
import { SleepModal } from '../../components/modals/SleepModal';
import { FeedingModal } from '../../components/modals/FeedingModal';
import { DiaperModal } from '../../components/modals/DiaperModal';
import { MilestoneModal } from '../../components/modals/MilestoneModal';
import { ActivityItem } from '../../components/ActivityItem';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const ACTIONS: {
  type: ActivityType;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}[] = [
  { type: 'sleep', icon: 'moon', color: colors.sleep },
  { type: 'feeding', icon: 'restaurant', color: colors.feeding },
  { type: 'diaper', icon: 'water', color: colors.diaper },
  { type: 'milestone', icon: 'camera', color: colors.accentPrimary },
];

function formatHM(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function computeStats(activities: Activity[]) {
  const now = new Date();
  let totalDayMin = 0;

  activities.forEach(a => {
    if (a.type === 'sleep' && a.period === 'day') {
      const dur = parseInt((a as SleepActivity).duration || '') || 0;
      totalDayMin += dur;
    }
  });

  const lastSleepDates = activities
    .filter(a => a.type === 'sleep')
    .map(a => new Date(a.createdAt));

  const lastSleep = lastSleepDates.length
    ? new Date(Math.max(...lastSleepDates.map(d => d.getTime())))
    : null;

  const timeSinceLastSleep = lastSleep
    ? formatHM(Math.round((now.getTime() - lastSleep.getTime()) / 60000))
    : '–';

  let totalBottle = 0;
  let totalBreastMin = 0;
  activities.forEach(a => {
    if (a.type === 'feeding') {
      const fa = a as any;
      if (fa.mode === 'bottle') totalBottle += fa.amount || 0;
      else if (fa.mode === 'breast')
        totalBreastMin += parseInt(fa.duration || '') || 0;
    }
  });

  const wet = activities.filter(
    a => a.type === 'diaper' && (a as DiaperActivity).status === 'Wet'
  ).length;
  const dirty = activities.filter(
    a => a.type === 'diaper' && (a as DiaperActivity).status === 'Dirty'
  ).length;

  return {
    totalDaySleep: formatHM(totalDayMin),
    timeSinceLastSleep,
    totalBottle,
    totalBreastMin,
    wet,
    dirty,
  };
}

function SummaryView({ activities }: { activities: Activity[] }) {
  const stats = computeStats(activities);
  const cards = [
    {
      key: 'sleep' as const,
      icon: 'moon' as const,
      value: stats.totalDaySleep,
      label: 'Day Sleep',
      secondary: `Since ${stats.timeSinceLastSleep}`,
      color: colors.sleep,
    },
    {
      key: 'feeding' as const,
      icon: 'restaurant' as const,
      value: `${stats.totalBottle}oz, ${stats.totalBreastMin}m`,
      label: 'Feeding',
      color: colors.feeding,
    },
    {
      key: 'diaper' as const,
      icon: 'water' as const,
      value: `${stats.wet}/${stats.dirty}`,
      label: 'Diapers (W/D)',
      color: colors.diaper,
    },
  ];

  return (
    <View style={styles.summaryContainer}>
      {cards.map((c, i) => (
        <View
          key={c.key}
          style={[
            styles.summaryCard,
            i < cards.length - 1 && { marginRight: 16 },
          ]}
        >
          <Ionicons name={c.icon} size={20} color={c.color} />
          <Text style={styles.summaryValue}>{c.value}</Text>
          <Text style={styles.summaryLabel}>{c.label}</Text>
          {c.secondary && (
            <Text style={styles.summarySecondary}>{c.secondary}</Text>
          )}
        </View>
      ))}
    </View>
  );
}

export default function TimelineView() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [actionMenuVisible, setActionMenuVisible] = useState(false);
  const [showModal, setShowModal] = useState<ActivityType | null>(null);
  const [editItem, setEditItem] = useState<Activity | undefined>(undefined);
  const user = auth.currentUser;

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      const q = query(
        collection(db, 'entries'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const unsub = onSnapshot(q, snap => {
        const docs = snap.docs.map(d => ({
          ...(d.data() as Activity),
          id: d.id,
        }));
        setActivities(docs);
      });
      return () => unsub();
    }, [user])
  );

  // ─── Create or update an entry ─────────────────────────────────────
  const handleSave = async (
    type: ActivityType,
    entry?: Activity
  ) => {
    if (!entry || !auth.currentUser) return;
    const userId = auth.currentUser.uid;
    const createdAt = entry.createdAt || new Date().toISOString();
    const dateKey = createdAt.slice(0, 10);

    // build payload and drop undefineds
    const payload: Record<string, any> = {
      ...entry,
      userId,
      createdAt,
      dateKey,
    };
    delete payload.id;
    Object.keys(payload).forEach(k => {
      if (payload[k] === undefined) delete payload[k];
    });

    try {
      if (entry.id) {
        await updateDoc(doc(db, 'entries', entry.id), payload);
      } else {
        await addDoc(collection(db, 'entries'), payload);
      }
      setShowModal(null);
      setEditItem(undefined);
    } catch (err) {
      console.error('Failed to save entry:', err);
    }
  };

  const handleItemPress = (item: Activity) => {
    setEditItem(item);
    setActionMenuVisible(false);
    setShowModal(item.type);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={styles.container}>
      <SummaryView activities={activities} />

      <FlatList
        data={activities}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ActivityItem activity={item} onPress={handleItemPress} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <NLInputBar
        placeholder="Ask about your baby..."
        onSubmit={q =>
          handleSave('health', {
            id: '',
            type: 'health',
            title: q,
            createdAt: new Date().toISOString(),
          } as Activity)
        }
      />

      <View style={styles.fabContainer} pointerEvents="box-none">
        {actionMenuVisible &&
          ACTIONS.map((act, i) => {
            const R = 110;
            const angle = Math.PI * ((i + 1) / (ACTIONS.length + 1));
            const x = Math.cos(angle) * R;
            const y = Math.sin(angle) * R;
            return (
              <TouchableOpacity
                key={act.type}
                style={[
                  styles.actionIcon,
                  { backgroundColor: act.color },
                  { transform: [{ translateX: x }, { translateY: -y }] },
                ]}
                onPress={() => {
                  setEditItem(undefined);
                  setActionMenuVisible(false);
                  setShowModal(act.type);
                }}
              >
                <Ionicons name={act.icon} size={24} color="#fff" />
              </TouchableOpacity>
            );
          })}
        <Fab
          iconName={actionMenuVisible ? 'close' : 'add'}
          onPress={() => setActionMenuVisible(v => !v)}
        />
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: '#F7F3EE',
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  summaryValue: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  summaryLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '400',
    color: '#333',
  },
  summarySecondary: {
    marginTop: 2,
    fontSize: 10,
    fontStyle: 'italic',
    color: '#C6B4A3',
  },
  list: { padding: spacing.md, paddingBottom: spacing.md + 120 },
  fabContainer: {
    position: 'absolute',
    bottom: spacing.md + 70,
    alignSelf: 'center',
    zIndex: 10,
  },
  actionIcon: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});
