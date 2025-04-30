import { colors } from "src/theme/colors";
import { Ionicons } from '@expo/vector-icons';

export type ActivityType =
  | 'sleep'
  | 'feeding'
  | 'diaper'
  | 'milestone'
  | 'health';

export interface BaseActivity {
  id: string;
  type: ActivityType;
  title: string;
  createdAt: string;
}

// ─── icon map ─────────────────────────────────────────────────────
export const activityIconMap: Record<ActivityType, keyof typeof Ionicons.glyphMap> = {
  sleep: 'moon',
  feeding: 'restaurant',
  diaper: 'water',
  milestone: 'camera',
  health: 'medkit',
};

// ─── Sleep ────────────────────────────────────────────────────────
export interface SleepInterruption {
  time: string;
  duration: number; // in minutes
}

export interface SleepActivity extends BaseActivity {
  type: 'sleep';
  start: string;
  end: string;
  duration?: string;
  period: 'night' | 'day';
  mood?: 'Happy' | 'Fussy';
  notes?: string;
  interruptions?: SleepInterruption[];
}

// ─── Feeding ──────────────────────────────────────────────────────
export interface BreastFeedingActivity extends BaseActivity {
  type: 'feeding';
  mode: 'breast';
  start: string;
  end: string;
  side: 'Left' | 'Right';
  notes?: string;
}
export interface BottleFeedingActivity extends BaseActivity {
  type: 'feeding';
  mode: 'bottle';
  amount: number;
  unit: string;
  notes?: string;
}
export interface SolidsFeedingActivity extends BaseActivity {
  type: 'feeding';
  mode: 'solids';
  reaction: 'Liked' | 'Loved' | 'Disliked';
  amountDesc?: string;
  notes?: string;
  start?: string;
}
export interface ComboFeedingActivity extends BaseActivity {
  type: 'feeding';
  mode: 'combo';
  notes?: string;
  start?: string;
  end?: string;
}
export type FeedingActivity =
  | BreastFeedingActivity
  | BottleFeedingActivity
  | SolidsFeedingActivity
  | ComboFeedingActivity;

// ─── Diaper ───────────────────────────────────────────────────────
export interface DiaperActivity extends BaseActivity {
  type: 'diaper';
  status?: 'Wet' | 'Dry' | 'Dirty';
  rash?: boolean;
  diarrhea?: boolean;
  notes?: string;
}

// ─── Milestone ────────────────────────────────────────────────────
export interface MilestoneActivity extends BaseActivity {
  type: 'milestone';
  notes?: string;
  photos?: string[];
}

// ─── Health ───────────────────────────────────────────────────────
export interface HealthActivity extends BaseActivity {
  type: 'health';
  details?: string;
}

// ─── Union ────────────────────────────────────────────────────────
export type Activity =
  | SleepActivity
  | FeedingActivity
  | DiaperActivity
  | MilestoneActivity
  | HealthActivity;

// ─── Mock data ────────────────────────────────────────────────────
export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'sleep',
    title: 'Nap session',
    createdAt: '12:00 PM',
    start: '12:00 PM',
    end: '12:30 PM',
    duration: '30 mins',
    period: 'day',
    interruptions: [{ time: '12:15 PM', duration: 10 }], 
  },
  {
    id: '2',
   
    type: 'diaper',
    title: 'Wet diaper',
    status: "Wet",
    createdAt: '11:30 AM',
    rash: true, 
  },
  {
    id: '3',
    type: 'feeding',
    title: 'Bottle feed',
    createdAt: '10:15 AM',
    mode: 'bottle',
    amount: 3,
    unit: 'oz',
  },
  {
    id: '4',
    type: 'milestone',
    title: 'First smile',
    createdAt: '9:00 AM',
    notes: 'So cute!',
  },
];

// ─── Schedule (unchanged) ─────────────────────────────────────────
export interface ScheduleItem {
  id: string;
  label: string;
  time: string;
}
export interface ScheduleSection {
  title: string;
  data: ScheduleItem[];
}
export const mockSchedule: ScheduleSection[] = [
  {
    title: 'Wake Up',
    data: [
      { id: 'f1', label: 'Bottle feeding', time: '7:30 AM' },
      { id: 'd1', label: 'Diaper change', time: '8:00 AM' },
    ],
  },
  {
    title: 'Morning Nap',
    data: [
      { id: 'f2', label: 'Breast feeding', time: '9:45 AM' },
      { id: 'd2', label: 'Diaper change', time: '10:00 AM' },
    ],
  },
  {
    title: 'Afternoon Nap',
    data: [
      { id: 'f3', label: 'Bottle feeding', time: '2:15 PM' },
      { id: 'd3', label: 'Diaper change', time: '3:00 PM' },
    ],
  },
  {
    title: 'Bedtime',
    data: [{ id: 'd4', label: 'Diaper change', time: '7:20 PM' }],
  },
];

// ─── Colors ───────────────────────────────────────────────────────
export const activityColorMap: Record<ActivityType, string> = {
  sleep: colors.sleep,
  feeding: colors.feeding,
  diaper: colors.diaper,
  milestone: colors.milestone,
  health: colors.accentSecondary,
};
