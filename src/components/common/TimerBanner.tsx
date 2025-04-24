// src/components/common/TimerBanner.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

interface TimerBannerProps {
  label: string;
  onPress?: () => void;
}

export const TimerBanner = ({ label, onPress }: TimerBannerProps) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <Ionicons name="time-outline" size={20} color={colors.card} style={styles.icon} />
    <Text style={styles.text}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.accentPrimary,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    elevation: 3,
  },
  icon: {
    marginRight: spacing.sm,
  },
  text: {
    color: colors.card,
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.md,
  },
});
