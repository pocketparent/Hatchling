// src/screens/Onboarding/TourScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingParamList }    from '../../navigation/OnboardingNavigator';
import { ScreenContainer }        from '../../components/layout/ScreenContainer';
import { colors }                 from '../../theme/colors';
import { spacing }                from '../../theme/spacing';
import { typography }             from '../../theme/typography';

type Props = NativeStackScreenProps<OnboardingParamList, 'Tour'>;

export default function TourScreen({ navigation }: Props) {
  const slides = [
    { key: '1', title: 'Track with Ease',     description: 'Log sleep, feeding, and diapers in just a tap.' },
    { key: '2', title: 'Get Smart Insights',  description: 'AI-powered tips to help your baby thrive.' },
    { key: '3', title: 'Stay in Sync',        description: 'Share updates with caregivers instantly.' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const { width } = Dimensions.get('window');

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(idx);
  };

  const handleGetStarted = () => {
    // Exit onboarding and load the Main tabs
    navigation.getParent()?.navigate('Main');
  };

  return (
    <ScreenContainer>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {slides.map((slide, idx) => (
          <View key={slide.key} style={[styles.slide, { width }]}>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
            {idx === slides.length - 1 && (
              <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
                <Text style={styles.buttonText}>Start Tracking</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.dotsContainer}>
        {slides.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              currentIndex === idx ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  title: {
    fontFamily: typography.fonts.serifBold,
    fontSize: typography.sizes.xxl,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.accentPrimary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 25,
  },
  buttonText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.md,
    color: colors.card,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: spacing.xs,
  },
  dotActive: {
    backgroundColor: colors.accentPrimary,
  },
  dotInactive: {
    backgroundColor: colors.border,
  },
});
