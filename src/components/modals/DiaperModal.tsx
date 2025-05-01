// File: src/components/modals/DiaperModal.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { EntryModal } from './EntryModal/index';
import { DiaperActivity } from '../../models/types';
import { activityColorMap } from '../../constants/activityConfig';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

type DiaperType = 'wet' | 'dirty' | 'dry';

interface DiaperModalProps {
  initialEntry?: DiaperActivity;
  onClose: () => void;
  onSave: (entry: DiaperActivity) => void;
}

// Map lowercase UI types to Firestore enum
const STATUS_MAP: Record<DiaperType, 'Wet' | 'Dirty' | 'Dry'> = {
  wet: 'Wet',
  dirty: 'Dirty',
  dry: 'Dry',
};

export const DiaperModal: React.FC<DiaperModalProps> = ({
  initialEntry,
  onClose,
  onSave,
}) => {
  const accent = activityColorMap.diaper;

  // State seeded from initialEntry or defaults
  const [selectedType, setSelectedType] = useState<DiaperType | ''>(
    initialEntry?.status ? (initialEntry.status.toLowerCase() as DiaperType) : ''
  );
  const [diarrhea, setDiarrhea] = useState(initialEntry?.diarrhea || false);
  const [rash, setRash] = useState(initialEntry?.rash || false);
  const [time, setTime] = useState<Date>(
    initialEntry ? new Date(initialEntry.createdAt) : new Date()
  );
  const [showPicker, setShowPicker] = useState(false);
  const [notes, setNotes] = useState(initialEntry?.notes || '');

  const canSave = selectedType !== '';

  // Clear diarrhea when switching away from 'dirty'
  useEffect(() => {
    if (selectedType !== 'dirty') {
      setDiarrhea(false);
    }
  }, [selectedType]);

  const formattedTime = time.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: 'numeric',
  });

  const handleSave = () => {
    if (!canSave) return;
    const entry: DiaperActivity = {
      id: initialEntry?.id || '',
      type: 'diaper',
      title: `Diaper: ${
        selectedType.charAt(0).toUpperCase() + selectedType.slice(1)
      }${selectedType === 'dirty' && diarrhea ? ' (diarrhea)' : ''}`,
      createdAt: initialEntry?.createdAt || time.toISOString(),
      status: STATUS_MAP[selectedType as DiaperType],
      rash: rash || undefined,
      diarrhea: selectedType === 'dirty' ? diarrhea || undefined : undefined,
      notes: notes.trim() || undefined,
    };
    onSave(entry);
  };

  const onChange = (_: any, dt?: Date) => {
    setShowPicker(false);
    if (!dt) return;
    setTime(dt > new Date() ? new Date() : dt);
  };

  return (
    <EntryModal
      title="Log Diaper"
      accent={accent}
      onClose={onClose}
      onSave={handleSave}
    >
      <View style={styles.typeSelector}>
        {(['wet', 'dirty', 'dry'] as DiaperType[]).map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.toggleOpt,
              selectedType === type && {
                backgroundColor: accent,
                borderColor: accent,
              },
            ]}
            onPress={() =>
              setSelectedType(prev => (prev === type ? '' : type))
            }
          >
            <Text
              style={
                selectedType === type
                  ? styles.toggleTxtActive
                  : styles.toggleTxt
              }
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedType === 'dirty' && (
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Diarrhea</Text>
          <Switch
            value={diarrhea}
            onValueChange={setDiarrhea}
            trackColor={{ true: accent }}
            thumbColor={diarrhea ? accent : undefined}
          />
        </View>
      )}

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Diaper Rash</Text>
        <Switch
          value={rash}
          onValueChange={setRash}
          trackColor={{ true: accent }}
          thumbColor={rash ? accent : undefined}
        />
      </View>

      <Text style={styles.fieldHeader}>Time</Text>
      <TouchableOpacity
        style={styles.pickerBox}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.pickerText}>{formattedTime}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange}
        />
      )}

      <Text style={styles.fieldHeader}>Notes</Text>
      <TextInput
        style={styles.textArea}
        multiline
        placeholder="(e.g., color, texture)"
        placeholderTextColor={colors.textSecondary}
        value={notes}
        onChangeText={setNotes}
      />
    </EntryModal>
  );
};

const styles = StyleSheet.create({
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  toggleOpt: {
    flex: 1,
    marginHorizontal: spacing.xs,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleTxt: {
    color: colors.textSecondary,
  },
  toggleTxtActive: {
    color: '#fff',
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  switchLabel: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  fieldHeader: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  pickerText: {
    color: colors.textPrimary,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    height: 80,
    textAlignVertical: 'top',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
});
