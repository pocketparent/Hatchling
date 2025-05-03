import React, { useState, useEffect } from 'react'; // Added useState, useEffect
import { SectionList, StyleSheet, View, Text, ActivityIndicator } from 'react-native'; // Added ActivityIndicator
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { ScheduleSection } from '../../models/types'; // Correctly import ScheduleSection

// Placeholder function for fetching schedule data - replace with actual implementation
async function fetchScheduleData(): Promise<ScheduleSection[]> {
  console.log('Fetching schedule data...');
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Return empty array for now, or replace with actual fetch logic
  // Example: return await getScheduleFromAPI();
  return []; // Return empty array as placeholder
}

export default function ScheduleView() {
  const [sections, setSections] = useState<ScheduleSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchScheduleData()
      .then(data => {
        // Process data if needed (e.g., adding Nap counts)
        let napCount = 0;
        const processedSections = data.map((sec) => {
          if (sec.title.toLowerCase().includes('nap')) {
            napCount += 1;
            return { ...sec, title: `Nap #${napCount}` };
          }
          return sec;
        });
        setSections(processedSections);
      })
      .catch(err => {
        console.error('Failed to fetch schedule:', err);
        setError('Could not load schedule.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // Fetch data on component mount

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (sections.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No schedule available for today.</Text>
      </View>
    );
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item, index) => item.id + index} // Use index for potentially non-unique IDs in mock/real data
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
    flexGrow: 1, // Ensure container grows if content is short
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: colors.background, // Use theme color
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
    color: colors.textPrimary, // Use theme color
  },
  itemTime: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary, // Use theme color
  },
  separator: {
    height: spacing.xs,
  },
  errorText: {
    color: colors.error,
    fontFamily: typography.fonts.regular,
  },
  emptyText: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
  },
});

