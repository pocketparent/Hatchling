// File: src/theme/colors.ts
import { ActivityType } from '../models/types'

export const colors = {
  // Base colors
  background:      '#F7F5F2',
  card:            '#FFFFFF',
  textPrimary:     '#333333',
  textSecondary:   '#666666',
  text:            '#333333',       // alias for textPrimary
  border:          '#E5E5E5',
  shadow:          'rgba(0,0,0,0.05)',

  // Thematic accents
  sleep:           '#D8D3E8',
  feeding:         '#E8DFD1',
  diaper:          '#C4D1CE',
  milestone:       '#E8D8D3',

  // Accent palette
  accentPrimary:   '#A8A5B1',  // softer accent
  accentSecondary: '#D8D3E8',  // complementary accent
  premium:         '#7D7A89',

  // App theme colors
  primary:         '#A8A5B1',  // main brand color (alias of accentPrimary)
  primaryLight:    '#D8D3E8',  // lighter variant
  primaryDark:     '#7D7A89',  // darker variant
  error:           '#d9534f',  // error notifications

  // Activity background tints
  sleepBg:         '#F0ECF8',  // lighter tint for sleep
  feedingBg:       '#F5F1E9',
  diaperBg:        '#EDF1EF',
  milestoneBg:     '#F7F2EF',
  healthBg:        '#F0ECF8',
}

// Central mapping for icon or pill colors by ActivityType
export const activityColors: Record<ActivityType, string> = {
  sleep:     colors.sleep,
  feeding:   colors.feeding,
  diaper:    colors.diaper,
  milestone: colors.premium,
  health:    colors.accentSecondary,
}
