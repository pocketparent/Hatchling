import React from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Activity, ActivityType, mockActivities } from '../../models/types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const iconMap: Record<ActivityType, keyof typeof Ionicons.glyphMap> = {
  sleep: 'moon',
  feeding: 'restaurant',
  diaper: 'water',
  milestone: 'trophy',
  health: 'medkit',
};

function getAccentColor(type: ActivityType): string {
  switch (type) {
    case 'sleep':
      return colors.sleep;
    case 'feeding':
      return colors.feeding;
    case 'diaper':
      return colors.diaper;
    case 'milestone':
      return colors.accentPrimary;
    case 'health':
      return colors.accentSecondary;
  }
}

interface Props {
  activities?: Activity[];
  refreshing: boolean;
  onRefresh: () => void;
  onItemPress: (type: ActivityType, activity?: Activity) => void;
}

export default function CardView({
  activities = mockActivities,
  refreshing,
  onRefresh,
  onItemPress,
}: Props) {
  const allTypes: ActivityType[] = [
    'sleep',
    'feeding',
    'diaper',
    'milestone',
    'health',
  ];

  const groups = allTypes
    .map((type) => ({
      type,
      items: activities.filter((a) => a.type === type),
    }))
    .filter((g) => g.items.length > 0);

  const renderGroup = ({ item: { type, items } }: { item: { type: ActivityType; items: Activity[] } }) => {
    const accent = getAccentColor(type);
    return (
      <View style={[styles.card, { borderLeftColor: accent }]}>
        <View style={styles.cardHeader}>
          <Ionicons name={iconMap[type]} size={20} color={colors.textPrimary} />
          <Text style={styles.cardTitle}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>
        </View>
        {items.map((act) => (
          <TouchableOpacity
            key={act.id}
            onPress={() => onItemPress(type, act)}
          >
            <View style={styles.row}>
              <Text style={styles.entryTitle}>{act.title}</Text>
              <Text style={styles.entryTime}>{act.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScreenContainer>
      <FlatList
        data={groups}
        keyExtractor={(g) => g.type}
        contentContainerStyle={styles.list}
        renderItem={renderGroup}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              🐣 What is your little hatchling up to today?
            </Text>
          </View>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  placeholder: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    flex: 1,
    marginLeft: spacing.sm,
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.lg,
    color: colors.textPrimary,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  entryTitle: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  entryTime: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
});
