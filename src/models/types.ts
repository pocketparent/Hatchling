// File: src/models/types.ts

export type ActivityType =
  | 'sleep'
  | 'feeding'
  | 'diaper'
  | 'milestone'
  | 'health';

export interface BaseActivity {
  id: string;
  userId?: string;
  dateKey?: string;
  type: ActivityType;
  title: string;
  createdAt: string;
}

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
}

export type FeedingActivity =
  | BreastFeedingActivity
  | BottleFeedingActivity
  | SolidsFeedingActivity;

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

// (Mock data and UI mappings have been moved to their own modules.)

