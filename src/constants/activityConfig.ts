// File: src/constants/activityConfig.ts

import { Ionicons } from '@expo/vector-icons'
import { colors } from '../theme/colors'
import { ActivityType } from '../models/types'

// Map each activity type to its Ionicons icon name
export const activityIconMap: Record<ActivityType, keyof typeof Ionicons.glyphMap> = {
  sleep: 'moon',
  feeding: 'restaurant',
  diaper: 'water',
  milestone: 'camera',
  health: 'medkit',
}

// Map each activity type to its accent color
export const activityColorMap: Record<ActivityType, string> = {
  sleep: colors.sleep,
  feeding: colors.feeding,
  diaper: colors.diaper,
  milestone: colors.milestone,
  health: colors.accentSecondary,
}
