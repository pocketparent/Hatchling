// File: src/theme/colors.ts
import { MilestoneModal } from 'src/components/modals/MilestoneModal';
import { ActivityType } from '../models/types';

export const colors = {
  background:      '#F7F5F2',
  card:            '#FFFFFF',
  textPrimary:     '#333333',
  textSecondary:   '#666666',
  border:          '#E5E5E5',
  shadow:          'rgba(0,0,0,0.05)',

  sleep:           '#D8D3E8',
  feeding:         '#E8DFD1',
  diaper:          '#C4D1CE',
  milestone:       '#E8D8D3',

  // Use a softer accent:
  accentPrimary:   '#A8A5B1',  // was '#7D7A89'
  accentSecondary: '#D8D3E8',  // was '#A8A5B1'

  premium:         '#7D7A89',
};

// Add this central mapping below:
export const activityColors: Record<ActivityType, string> = {
  sleep:     colors.sleep,
  feeding:   colors.feeding,
  diaper:    colors.diaper,
  milestone: colors.premium,
  health:    colors.accentSecondary,
};
