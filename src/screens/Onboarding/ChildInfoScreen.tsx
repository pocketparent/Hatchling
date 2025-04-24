// src/screens/Onboarding/ChildInfoScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Button }          from '../../components/common/Button';
import { spacing }         from '../../theme/spacing';
import { typography }      from '../../theme/typography';
import { colors }          from '../../theme/colors';
import { OnboardingParamList } from '../../navigation/OnboardingNavigator';

type Props = NativeStackScreenProps<OnboardingParamList, 'ChildInfo'>;

export default function ChildInfoScreen({ navigation }: Props) {
  const [babyName, setBabyName] = useState('');
  const [sex, setSex] = useState<'boy' | 'girl' | 'none'>('none');
  const [dob, setDob] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (!babyName.trim()) {
      Alert.alert('Please enter your baby’s name.');
      return;
    }
    if (sex === 'none') {
      Alert.alert('Please select your baby’s sex.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.push('Prefs');
    }, 500);
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.inner}
      >
        <Text style={styles.title}>Your Baby’s Info</Text>

        {/* Name */}
        <Text style={styles.label}>Name</Text>
        <TextInput
          value={babyName}
          onChangeText={setBabyName}
          placeholder="e.g. Mari"
          style={styles.input}
        />

        {/* Sex */}
        <Text style={styles.label}>Sex</Text>
        <View style={styles.sexContainer}>
          {['boy', 'girl', 'none'].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.sexOption,
                sex === option && styles.sexOptionSelected,
              ]}
              onPress={() => setSex(option as any)}
            >
              <Text
                style={[
                  styles.sexText,
                  sex === option && styles.sexTextSelected,
                ]}
              >
                {option === 'none'
                  ? 'Prefer not to say'
                  : option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date of Birth */}
        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          style={styles.input}
        >
          <Text style={styles.dobText}>
            {dob.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </TouchableOpacity>

        {/* Modal Picker */}
        <DateTimePickerModal
          isVisible={showPicker}
          mode="date"
          display="spinner"
          date={dob}
          maximumDate={new Date()}
          onConfirm={(date) => {
            setDob(date);
            setShowPicker(false);
          }}
          onCancel={() => setShowPicker(false)}
          // give the wheel a light grey background (not pure white)
          pickerContainerStyleIOS={{ 
            backgroundColor: colors.background, 
            borderTopLeftRadius: 16, 
            borderTopRightRadius: 16, 
          }}
  // force the wheel text into your dark primary color
  textColor={colors.textPrimary}
  />
          

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Next"
            onPress={handleNext}
            loading={loading}
            disabled={loading}
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  title: {
    fontFamily: typography.fonts.serifBold,
    fontSize: typography.sizes.xxl,
    marginBottom: spacing.xl,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  label: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    marginBottom: spacing.xs,
    color: colors.textSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    marginBottom: spacing.md,
  },
  dobText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  sexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sexOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
  },
  sexOptionSelected: {
    backgroundColor: colors.accentSecondary,
    borderColor: colors.accentPrimary,
  },
  sexText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  sexTextSelected: {
    color: colors.card,
    fontFamily: typography.fonts.medium,
  },
  buttonContainer: {
    marginTop: spacing.lg,
  },
});
