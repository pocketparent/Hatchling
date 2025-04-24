// src/components/common/Button.tsx
import React, { ReactNode } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface ButtonProps {
  title: string;
  onPress: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) => (
  <TouchableOpacity
    style={[styles.button, disabled && styles.buttonDisabled, style]}
    onPress={onPress}
    activeOpacity={0.7}
    disabled={disabled || loading}
  >
    {loading 
      ? <ActivityIndicator color={colors.card} /> 
      : <Text style={[styles.text, textStyle]}>{title}</Text>
    }
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.accentPrimary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.accentSecondary,
  },
  text: {
    color: colors.card,
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.md,
  },
});
