import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Button } from '../../components/common/Button';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { colors } from '../../theme/colors';
import { OnboardingParamList } from '../../navigation/OnboardingNavigator';

type Props = NativeStackScreenProps<OnboardingParamList, 'Prefs'>;

export default function PrefsScreen({ navigation }: Props) {
  // Activity toggles
  const [trackSleep, setTrackSleep] = useState(true);
  const [trackFeeding, setTrackFeeding] = useState(true);
  const [trackDiaper, setTrackDiaper] = useState(true);
  const [trackGrowth, setTrackGrowth] = useState(false);
  const [trackMilestones, setTrackMilestones] = useState(false);
  const [trackHealth, setTrackHealth] = useState(false);

  // Default view
  const [defaultView, setDefaultView] = useState<'timeline' | 'schedule' | 'cards'>('timeline');

  // Notifications
  const [timerNudges, setTimerNudges] = useState(true);
  const [monthlyInsights, setMonthlyInsights] = useState(false);
  const [qaChat, setQaChat] = useState(false);

  const handleNext = () => {
    // basic validation if needed…
    navigation.push('Tour');
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionTitle}>Track Activities</Text>
          {[
            { label: 'Sleep', val: trackSleep, set: setTrackSleep },
            { label: 'Feeding', val: trackFeeding, set: setTrackFeeding },
            { label: 'Diaper', val: trackDiaper, set: setTrackDiaper },
            { label: 'Growth', val: trackGrowth, set: setTrackGrowth },
            { label: 'Milestones', val: trackMilestones, set: setTrackMilestones },
            { label: 'Health', val: trackHealth, set: setTrackHealth },
          ].map(({ label, val, set }) => (
            <View key={label} style={styles.row}>
              <Text style={styles.label}>{label}</Text>
              <Switch
                value={val}
                onValueChange={set}
                trackColor={{ true: colors.accentPrimary }}
                thumbColor={val ? colors.accentSecondary : colors.border}
              />
            </View>
          ))}

          <Text style={styles.sectionTitle}>Default View</Text>
          <View style={styles.buttonGroup}>
            {(['timeline', 'schedule', 'cards'] as const).map((view) => (
              <TouchableOpacity
                key={view}
                style={[
                  styles.viewOption,
                  defaultView === view && styles.viewOptionSelected,
                ]}
                onPress={() => setDefaultView(view)}
              >
                <Text
                  style={[
                    styles.viewText,
                    defaultView === view && styles.viewTextSelected,
                  ]}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Notifications</Text>
          {[
            { label: 'Timer nudges', val: timerNudges, set: setTimerNudges },
            { label: 'Monthly insights', val: monthlyInsights, set: setMonthlyInsights },
            { label: 'Q & A Chat', val: qaChat, set: setQaChat },
          ].map(({ label, val, set }) => (
            <View key={label} style={styles.row}>
              <Text style={styles.label}>{label}</Text>
              <Switch
                value={val}
                onValueChange={set}
                trackColor={{ true: colors.accentPrimary }}
                thumbColor={val ? colors.accentSecondary : colors.border}
              />
            </View>
          ))}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button title="Finish Setup" onPress={handleNext} />
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: typography.fonts.serifBold,
    fontSize: typography.sizes.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    color: colors.textPrimary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  viewOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
  },
  viewOptionSelected: {
    backgroundColor: colors.accentSecondary,
    borderColor: colors.accentPrimary,
  },
  viewText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  viewTextSelected: {
    color: colors.card,
    fontFamily: typography.fonts.medium,
  },
  buttonContainer: {
    padding: spacing.lg,
  },
});
