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
  FeedingActivity,
  BreastFeedingActivity,
  BottleFeedingActivity,
  SleepActivity,
  DiaperActivity,
  activityColorMap,
  activityIconMap,
} from '../screens/TodayView/types';
import { colors } from '../theme/colors';

interface Props {
  activity: Activity;
  onPress: (activity: Activity) => void;
}

export const ActivityItem: React.FC<Props> = ({ activity, onPress }) => {
  const fmt = (iso: string) => {
    try {
      const date = new Date(iso);
      return isNaN(date.getTime())
        ? '—'
        : date.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
          });
    } catch {
      return '—';
    }
  };

  let detail = '';
  let timeLabel = (activity.createdAt);

  switch (activity.type) {
    case 'sleep': {
      const sa = activity as SleepActivity;
      const start = sa.start;
      const end = sa.end;
    
      // Format for time label (top right)
      timeLabel = `${(start)} - ${(end)}`;
    
      // Title for line 1
      const label = sa.period === 'night' ? 'Nighttime Sleep' : 'Nap';
      activity.title = label;
    
      // Duration in minutes
      let durationText = '';
      if (start && end) {
        const startTime = new Date(start).getTime();
        const endTime = new Date(end).getTime();
        if ((startTime) && (endTime)) {
          const durationMin = Math.round((endTime - startTime) / 60000);
          durationText = `${durationMin}m`;
        }
      }
    
      // Sleep details for line 2
      const interruptionCount = sa.interruptions?.length || 0;
      const moodText = sa.mood ? `  |  Woke up ${sa.mood}` : '';
      detail = `${durationText}  |  Awake ${interruptionCount}x${moodText}`;
      break;
    }
    
  
    case 'feeding': {
      const fa = activity as FeedingActivity;
      activity.title = 'Feeding';
      timeLabel = (fa.createdAt);
  
      const parts: string[] = [];
  
      if ((fa as BottleFeedingActivity).mode === 'bottle' && 'amount' in fa) {
        parts.push(`Bottle (${fa.amount}${fa.unit || 'oz'})`);
      }
  
      if ((fa as BreastFeedingActivity).mode === 'breast' && 'start' in fa && 'end' in fa) {
        const dur =
          fa.start && fa.end
            ? Math.round(
                (new Date(fa.end).getTime() - new Date(fa.start).getTime()) / 60000
              )
            : 0;
        parts.push(`Breast (${dur}m)`);
      }
  
      if ((fa as any).mode === 'solids') {
        parts.push('Solids');
      }
  
      detail = parts.join('  |  ');
      break;
    }
  
    case 'diaper': {
      const da = activity as DiaperActivity;
      activity.title = 'Diaper';
      timeLabel = (da.createdAt);
  
      const parts: string[] = [];
if (da.status) parts.push(da.status); 
if (da.rash) parts.push('Rash');
if (da.diarrhea) parts.push('Diarrhea');

detail = parts.join('  |  ');
  
      detail = parts.join('  |  ');
      break;
    }
  
    case 'milestone':
      detail = (activity as any).notes || '';
      break;
  
    case 'health':
      detail = (activity as any).details || '';
      break;
  
    default:
      detail = '';
  }

  return (
    <TouchableOpacity onPress={() => onPress(activity)} style={styles.container}>
      <View style={styles.left}>
        <Ionicons
          name={activityIconMap[activity.type]}
          size={20}
          color={activityColorMap[activity.type]}
        />
       <View style={{ marginLeft: 8 }}>
        <Text style={styles.title}>{activity.title}</Text>
        {detail.length > 0 && (
          <Text style={styles.detail}>{detail}</Text>
        )}
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
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '70%',
  },
  title: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  right: {
    alignItems: 'flex-end',
    maxWidth: '40%',
  },
  detail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    marginLeft: 8,
  },
  time: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
