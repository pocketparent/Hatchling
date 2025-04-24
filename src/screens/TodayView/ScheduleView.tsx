import React from 'react';
import { SectionList, StyleSheet, View, Text } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { ScheduleSection, mockSchedule } from './types';

export default function ScheduleView() {
  let napCount = 0;
  const sections: ScheduleSection[] = mockSchedule.map((sec) => {
    if (sec.title.toLowerCase().includes('nap')) {
      napCount += 1;
      return { ...sec, title: `Nap #${napCount}` };
    }
    return sec;
  });

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      renderSectionHeader={({ section }) => {
        const times =
          section.data.length === 0
            ? ''
            : section.data.length === 1
            ? section.data[0].time
            : `${section.data[0].time} - ${
                section.data[section.data.length - 1].time
              }`;

        return (
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{section.title}</Text>
            {times !== '' && <Text style={styles.headerTime}>{times}</Text>}
          </View>
        );
      }}
      renderItem={({ item }) => (
        <View style={styles.itemRow}>
          <View style={styles.bullet} />
          <Text style={styles.itemLabel}>{item.label}</Text>
          <Text style={styles.itemTime}>{item.time}</Text>
        </View>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },

  headerContainer: {
    backgroundColor: colors.accentPrimary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.md,
    color: 'white',
  },
  headerTime: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: 'white',
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentPrimary,
    marginRight: spacing.md,
  },
  itemLabel: {
    flex: 1,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  itemTime: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },

  separator: {
    height: spacing.xs,
  },
});
