// src/components/layout/ScreenContainer.tsx
import React, { ReactNode } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

type Props = { children: ReactNode };

export const ScreenContainer = ({ children }: Props) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.content}>{children}</View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
