// src/screens/TodayView/types.ts
export type ActivityType = 'sleep' | 'feeding' | 'diaper' | 'milestone' | 'health';

export interface BaseActivity {
  id: string;
  type: ActivityType;
  title: string;
  time: string;
}

export interface SleepActivity extends BaseActivity {
  type: 'sleep';
  start: string;
  end: string;
  duration: string;
  notes?: string;
  mood?: 'Happy' | 'Fussy';
  wakeups?: number;
  photos?: string[];
}

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
  foodType: 'Puree' | 'Solid';
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

export interface DiaperActivity extends BaseActivity {
  type: 'diaper';
  rash?: boolean;
  notes?: string;
}

export interface MilestoneActivity extends BaseActivity {
  type: 'milestone';
  notes?: string;
  photos?: string[];
}

export interface HealthActivity extends BaseActivity {
  type: 'health';
  details?: string;
}

export type Activity =
  | SleepActivity
  | FeedingActivity
  | DiaperActivity
  | MilestoneActivity
  | HealthActivity;

// mock activities for screens
export const mockActivities: Activity[] = [
  { id: '1', type: 'sleep',     title: 'Nap session', time: '12:00 PM', start: '12:00 PM', end: '12:30 PM', duration: '30 mins' },
  { id: '2', type: 'diaper',    title: 'Wet diaper',  time: '11:30 AM', rash: false },
  { id: '3', type: 'feeding',   title: 'Bottle feed', time: '10:15 AM', mode: 'bottle', amount: 3, unit: 'oz' },
  { id: '4', type: 'milestone', title: 'First smile', time: '9:00 AM', notes: 'So cute!' },
  { id: '5', type: 'health',    title: 'Vaccination', time: '8:00 AM', details: 'DTaP' },
];

// schedule definitions
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
  { title: 'Wake Up', data: [ { id: 'f1', label: 'Bottle feeding', time: '7:30 AM' }, { id: 'd1', label: 'Diaper change', time: '8:00 AM' } ] },
  { title: 'Morning Nap', data: [ { id: 'f2', label: 'Breast feeding', time: '9:45 AM' }, { id: 'd2', label: 'Diaper change', time: '10:00 AM' } ] },
  { title: 'Afternoon Nap', data: [ { id: 'f3', label: 'Bottle feeding', time: '2:15 PM' }, { id: 'd3', label: 'Diaper change', time: '3:00 PM' } ] },
  { title: 'Bedtime', data: [ { id: 'd4', label: 'Diaper change', time: '7:20 PM' } ] },
];