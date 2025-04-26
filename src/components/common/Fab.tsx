import React from 'react';
import { TouchableOpacity, ViewStyle, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing } from '../../theme/spacing';
import { colors } from '../../theme/colors';

interface FabProps {
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  style?: ViewStyle;
}

export const Fab: React.FC<FabProps> = ({ iconName, onPress, style }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Ionicons name={iconName} size={28} color="#fff" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accentPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});