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
  ScrollView,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Timestamp } from 'firebase/firestore'; // Import Timestamp
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Button } from '../../components/common/Button';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { colors } from '../../theme/colors';
import { OnboardingParamList } from '../../navigation/OnboardingNavigator';
import { useAuth } from '../../hooks/useAuth'; // Import useAuth
import { updateSettings } from '../../services/settingsService'; // Import updateSettings

type Props = NativeStackScreenProps<OnboardingParamList, 'ChildInfo'>;

// Standardized sex options based on user confirmation
const sexOptions: Array<'boy' | 'girl' | 'none'> = ['boy', 'girl', 'none'];

export default function ChildInfoScreen({ navigation }: Props) {
  const { user } = useAuth(); // Get user from auth context
  const [babyName, setBabyName] = useState('');
  const [sex, setSex] = useState<'boy' | 'girl' | 'none'>('none');
  const [dob, setDob] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!user) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }
    if (!babyName.trim()) {
      Alert.alert('Please enter your baby’s name.');
      return;
    }
    // No need to check sex === 'none' as it's a valid option per spec

    setLoading(true);
    try {
      await updateSettings(user.uid, {
        childFirstName: babyName.trim(),
        childSex: sex,
        childDOB: Timestamp.fromDate(dob), // Convert Date to Firestore Timestamp
        onboarded: false, // Keep onboarded false until final step
      });
      setLoading(false);
      navigation.push('Prefs'); // Navigate on successful save
    } catch (error: any) {
      setLoading(false);
      console.error('Error saving child info:', error);
      Alert.alert('Error', 'Could not save child information. Please try again.');
    }
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.inner}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Your Baby’s Info</Text>

          {/* Name */}
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={babyName}
            onChangeText={setBabyName}
            placeholder="e.g. Mari"
            style={styles.input}
            placeholderTextColor={colors.textSecondary} // Added placeholder color
          />

          {/* Sex */}
          <Text style={styles.label}>Sex</Text>
          <View style={styles.sexContainer}>
            {sexOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.sexOption,
                  sex === option && styles.sexOptionSelected,
                ]}
                onPress={() => setSex(option)}
              >
                <Text
                  style={[
                    styles.sexText,
                    sex === option && styles.sexTextSelected,
                  ]}
                >
                  {/* Display 'None' instead of 'N/A' */}
                  {option === 'none'
                    ? 'None'
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
            pickerContainerStyleIOS={{
              backgroundColor: colors.background,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
            // Use theme colors for picker text if possible, otherwise default
            // textColor={colors.textPrimary} // May not be supported by all pickers/platforms
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
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  inner: {
    flexGrow: 1,
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
    color: colors.textPrimary, // Ensure input text color uses theme
    backgroundColor: colors.card, // Ensure input background uses theme
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
    backgroundColor: colors.card, // Ensure options use theme background
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
    color: colors.card, // Text color for selected option
    fontFamily: typography.fonts.medium,
  },
  buttonContainer: {
    marginTop: spacing.lg,
  },
});

