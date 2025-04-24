import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { colors }          from '../../theme/colors';
import { typography }      from '../../theme/typography';
import { spacing }         from '../../theme/spacing';

export default function TrendsView() {
  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.container}>
        {/* —————————————————————————————————————— */}
        {/* Sleep Analysis */}
        <View style={styles.card}>
          <Text style={styles.title}>Sleep Analysis</Text>
          <Text style={styles.subtitle}>Premium feature</Text>

          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>14.2h</Text>
              <Text style={styles.metricLabel}>Daily average</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>2.5h</Text>
              <Text style={styles.metricLabel}>Nap average</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>11.7h</Text>
              <Text style={styles.metricLabel}>Night average</Text>
            </View>
          </View>

          {/* placeholder for your bar chart */}
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartText}>(Sleep bar chart here)</Text>
          </View>
        </View>

        {/* —————————————————————————————————————— */}
        {/* AI Insights */}
        <View style={styles.card}>
          <Text style={styles.title}>AI Insights</Text>
          <Text style={styles.subtitle}>Premium feature</Text>

          {[
            {
              key: 'regression',
              headline: 'Sleep Regression Detected',
              body:
                'Mari may be experiencing a 3-month sleep regression. This is normal development and typically lasts 2-4 weeks.',
            },
            {
              key: 'feedingPattern',
              headline: 'Feeding Pattern Established',
              body:
                'Mari has a consistent feeding pattern of 5 feedings per day, approximately every 3-4 hours.',
            },
            {
              key: 'diaperIncrease',
              headline: 'Diaper Change Increase',
              body:
                'Diaper changes have gone up this week, which can be normal during growth spurts.',
            },
          ].map((insight) => (
            <View key={insight.key} style={styles.insightCard}>
              <Text style={styles.insightHeadline}>{insight.headline}</Text>
              <Text style={styles.insightBody}>{insight.body}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  title: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.lg,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },

  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xl,
    color: colors.textPrimary,
  },
  metricLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },

  chartPlaceholder: {
    height: 150,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },

  insightCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  insightHeadline: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  insightBody: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
});
