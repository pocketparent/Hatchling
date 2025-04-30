import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Activity,
  SleepActivity,
  FeedingActivity,
  DiaperActivity,
  activityIconMap,
  activityColorMap,
} from '../models/types';
import { colors } from '../theme/colors';
import { formatTime } from '../utils/timeUtils';

interface Props {
  activity: Activity;
  onPress: (activity: Activity) => void;
}

export const ActivityItem: React.FC<Props> = ({ activity, onPress }) => {
  let detail = '';
  let timeLabel = formatTime(activity.createdAt);
  let displayTitle = activity.title;

  switch (activity.type) {
    case 'sleep': {
      const sa = activity as SleepActivity;
      displayTitle = sa.period === 'night' ? 'Nighttime Sleep' : 'Nap';
      timeLabel = `${formatTime(sa.start)} - ${formatTime(sa.end)}`;
      const startMs = sa.start ? new Date(sa.start).getTime() : NaN;
      const endMs = sa.end ? new Date(sa.end).getTime() : NaN;
      const durationMin = !isNaN(startMs) && !isNaN(endMs)
        ? Math.round((endMs - startMs) / 60000)
        : 0;
      const interrupts = sa.interruptions?.length || 0;
      const moodText = sa.mood ? ` | Woke ${sa.mood}` : '';
      detail = `${durationMin}m | Awoke ${interrupts}x${moodText}`;
      break;
    }
    case 'feeding': {
      const fa = activity as FeedingActivity;
      displayTitle = 'Feeding';
      timeLabel = formatTime(fa.createdAt);
      const parts: string[] = [];
      if (fa.mode === 'bottle') parts.push(`Bottle (${fa.amount}${fa.unit || 'oz'})`);
      else if (fa.mode === 'breast') {
        const s = fa.start ? new Date(fa.start).getTime() : NaN;
        const e = fa.end ? new Date(fa.end).getTime() : NaN;
        const d = !isNaN(s) && !isNaN(e) ? Math.round((e - s) / 60000) : 0;
        parts.push(`Breast (${d}m)`);
      } else if (fa.mode === 'solids') {
        parts.push('Solids');
      }
      detail = parts.join(' | ');
      break;
    }
    case 'diaper': {
      const da = activity as DiaperActivity;
      displayTitle = 'Diaper';
      timeLabel = formatTime(da.createdAt);
      const parts: string[] = [];
      if (da.status) parts.push(da.status);
      if (da.rash) parts.push('Rash');
      if (da.diarrhea) parts.push('Diarrhea');
      detail = parts.join(' | ');
      break;
    }
    case 'milestone':
      displayTitle = activity.title;
      detail = (activity as any).notes || '';
      break;
    case 'health':
      displayTitle = activity.title;
      detail = (activity as any).details || '';
      break;
  }

  return (
    <TouchableOpacity onPress={() => onPress(activity)} style={styles.container}>
      <View style={styles.left}>
        <Ionicons
          name={activityIconMap[activity.type]}
          size={20}
          color={activityColorMap[activity.type]}
        />
        <View style={styles.leftText}>
          <Text style={styles.title}>{displayTitle}</Text>
          {!!detail && <Text style={styles.detail}>{detail}</Text>}
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.time}>{timeLabel}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 8,
    backgroundColor: colors.card,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  left: { flexDirection: 'row', alignItems: 'center', maxWidth: '70%' },
  leftText: { marginLeft: 8 },
  title: { fontSize: 16, color: colors.textPrimary, flexShrink: 1 },
  detail: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  right: { alignItems: 'flex-end', maxWidth: '40%' },
  time: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
});