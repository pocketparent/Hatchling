// src/screens/Onboarding/WelcomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Button }          from '../../components/common/Button';
import { spacing }         from '../../theme/spacing';
import { typography }      from '../../theme/typography';

export default function WelcomeScreen({ navigation }) {
  return (
    <ScreenContainer>
      <View style={styles.inner}>
        {/* Optional logo */}
        <Image
          source={require('../../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Welcome to Hatchling</Text>
        <Text style={styles.subtitle}>
          Let’s get you set up to start tracking your baby’s routine.
        </Text>

        <Button
          title="Get Started"
          onPress={() => navigation.push('ProfileSetup')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: spacing.xl,
  },
  title: {
    fontFamily: typography.fonts.serifBold,
    fontSize: typography.sizes.xxl,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    marginBottom: spacing.lg,
    textAlign: 'center',
    color: '#666666',
  },
});
