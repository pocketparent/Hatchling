// File: src/components/common/Button.tsx
import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { colors } from '../../theme/colors'
import { typography } from '../../theme/typography'
import { spacing } from '../../theme/spacing'

export interface ButtonProps {
  title: string
  onPress: (e?: GestureResponderEvent) => void
  disabled?: boolean
  loading?: boolean
  color?: string       // override background color
  style?: ViewStyle    // additional container styles
  textStyle?: TextStyle // additional text styles
}

export function Button({
  title,
  onPress,
  disabled = false,
  loading = false,
  color,
  style,
  textStyle,
}: ButtonProps) {
  const bgColor = disabled
    ? colors.accentSecondary
    : color || colors.accentPrimary

  const textColor = color || disabled
    ? '#000'
    : '#fff'

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        defaultStyles.button,
        { backgroundColor: bgColor },
        style,
      ]}
    >
      {loading
        ? <ActivityIndicator color={textColor} />
        : <Text style={[defaultStyles.text, { color: textColor }, textStyle]}>
            {title}
          </Text>
      }
    </TouchableOpacity>
  )
}

const defaultStyles = StyleSheet.create({
  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.md,
  },
})
