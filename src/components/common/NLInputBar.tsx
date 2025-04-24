// src/components/common/NLInputBar.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

interface NLInputBarProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
}

export const NLInputBar = ({ onSubmit, placeholder = 'How can I help you?' }: NLInputBarProps) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    onSubmit(text.trim());
    setText('');
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        style={styles.input}
        returnKeyType="send"
        onSubmitEditing={handleSend}
      />
      <TouchableOpacity onPress={handleSend} style={styles.button}>
        <Ionicons name="send" size={24} color={colors.accentPrimary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 25,
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  button: {
    padding: spacing.sm,
  },
});
