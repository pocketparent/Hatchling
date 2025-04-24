import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Activity, ActivityType, mockActivities } from './types';

const iconMap: Record<ActivityType, keyof typeof Ionicons.glyphMap> = {
  sleep: 'moon',
  feeding: 'restaurant',
  diaper: 'water',
  milestone: 'trophy',
  health: 'medkit',
};

export interface Props {
  activities?: Activity[];
  refreshing: boolean;
  onRefresh: () => void;
  onItemPress: (type: ActivityType, activity?: Activity) => void;
}

export default function TimelineView({
  activities = mockActivities,
  refreshing,
  onRefresh,
  onItemPress,
}: Props) {
  const renderItem = ({ item }: { item: Activity }) => {
    const borderStyle = styles[
      `item_${item.type}` as keyof typeof styles
    ] as ViewStyle;

    return (
      <TouchableOpacity onPress={() => onItemPress(item.type, item)}>
        <View style={[styles.itemContainer, borderStyle]}>
          <Ionicons
            name={iconMap[item.type]}
            size={24}
            color={colors.textSecondary}
            style={styles.icon}
          />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={activities}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md, paddingBottom: 100 },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: { marginRight: spacing.md },
  textContainer: { flex: 1 },
  title: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  time: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },

  item_sleep: { borderLeftWidth: 4, borderLeftColor: colors.sleep },
  item_feeding: { borderLeftWidth: 4, borderLeftColor: colors.feeding },
  item_diaper: { borderLeftWidth: 4, borderLeftColor: colors.diaper },
  item_milestone: {
    borderLeftWidth: 4,
    borderLeftColor: colors.accentPrimary,
  },
  item_health: {
    borderLeftWidth: 4,
    borderLeftColor: colors.accentSecondary,
  },
});
