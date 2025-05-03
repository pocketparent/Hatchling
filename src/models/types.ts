// File: src/models/types.ts
import { Timestamp } from 'firebase/firestore'; // Import Timestamp

// ─── Activity Types ───────────────────────────────────────────────────
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
  createdAt: string; // ISO timestamp string
}

// ─── Sleep ───────────────────────────────────────────────────────────
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

// ─── Feeding ─────────────────────────────────────────────────────────
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

// ─── Diaper ──────────────────────────────────────────────────────────
export interface DiaperActivity extends BaseActivity {
  type: 'diaper';
  status?: 'Wet' | 'Dry' | 'Dirty';
  rash?: boolean;
  diarrhea?: boolean;
  notes?: string;
}

// ─── Milestone ───────────────────────────────────────────────────────
export interface MilestoneActivity extends BaseActivity {
  type: 'milestone';
  notes?: string;
  photos?: string[];
}

// ─── Health ──────────────────────────────────────────────────────────
export interface HealthActivity extends BaseActivity {
  type: 'health';
  details?: string;
}

// ─── Union ───────────────────────────────────────────────────────────
export type Activity =
  | SleepActivity
  | FeedingActivity
  | DiaperActivity
  | MilestoneActivity
  | HealthActivity;

// ─── User Management & Settings ──────────────────────────────────────

/**
 * Represents another user invited to this journal (MVP: no roles).
 */
export interface InvitedUser {
  uid: string;
  name: string;
  phoneNumber: string;
}

/**
 * Client-side representation of all configurable user settings (MVP).
 */
export interface UserSettings {
  // ─── Profile & Account Info ───────────────────────────────────────
  name: string;
  phoneNumber: string;
  email?: string;
  onboarded?: boolean; // Added based on SignUpScreen logic

  // ─── Child Information ───────────────────────────────────────────
  childFirstName: string;
  childDOB: Timestamp; // Changed from string to Firestore Timestamp
  childSex: 'boy' | 'girl' | 'none'; // Standardized options

  // ─── Tracked Activities ──────────────────────────────────────────
  trackedActivities: {
    sleep: boolean;
    feeding: boolean;
    diaper: boolean;
    milestone: boolean;
    growth?: boolean;
    health?: boolean;
  };

  // ─── Communication Preferences ─────────────────────────────────
  communication: {
    nudgesEnabled: boolean;
    insightsEnabled?: boolean;
    emailPreferences?: {
      summary?: boolean;
      insights?: boolean;
    };
    pushCategories?: {
      timerReminders?: boolean;
      routineSuggestions?: boolean;
      ageBasedInsights?: boolean;
    };
  };

  // ─── Display Preferences ────────────────────────────────────────
  display: {
    theme: 'light' | 'dark' | 'beige' | 'system'; // Added beige, system (default)
    feedingUnit: 'oz' | 'ml';
    growthUnit: 'lb/in' | 'kg/cm';
    defaultView?: 'Timeline' | 'Schedule' | 'Card'; // Missing from audit report but in spec
  };
}

// ─── Schedule View Types ─────────────────────────────────────────────

export interface ScheduleItem {
  id: string;
  label: string;
  time: string; // e.g., "9:00 AM"
}

export interface ScheduleSection {
  title: string; // e.g., "Morning Routine", "Nap #1"
  data: ScheduleItem[];
}

// Removed mockSchedule definition from here

