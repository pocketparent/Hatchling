// src/screens/Settings/index.tsx
import React from 'react'
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { ScreenContainer } from '../../components/layout/ScreenContainer'
import { colors }          from '../../theme/colors'
import { typography }      from '../../theme/typography'
import { spacing }         from '../../theme/spacing'
import { SettingsStackParamList } from '../../navigation/SettingsNavigator'

type SettingsNavProp = NativeStackNavigationProp<
  SettingsStackParamList,
  'SettingsMain'
>

type SectionItem = {
  key: string
  title: string
  icon: keyof typeof Ionicons.glyphMap
  onPress: () => void
}

export default function Settings() {
  const navigation = useNavigation<SettingsNavProp>()

  const sections: { title: string; data: SectionItem[] }[] = [
    {
      title: 'Account',
      data: [
        {
          key: 'profile',
          title: 'Profile Setup',
          icon: 'person',
          onPress: () => navigation.navigate('ProfileSetup'),
        },
        {
          key: 'logout',
          title: 'Log Out',
          icon: 'log-out',
          onPress: () => {
            /* TODO: auth.signOut() */
          },
        },
      ],
    },
    {
      title: "Baby & Caregivers",
      data: [
        {
          key: 'childInfo',
          title: "Your Baby’s Info",
          icon: 'bicycle',
          onPress: () => navigation.navigate('ChildInfo'),
        },
        {
          key: 'caregivers',
          title: 'Manage Caregivers',
          icon: 'people',
          onPress: () => navigation.navigate('ManageCaregivers'),
        },
      ],
    },
    {
      title: 'Preferences',
      data: [
        {
          key: 'activityTracking',
          title: 'Activity Tracking',
          icon: 'list',
          onPress: () => navigation.navigate('ActivityTracking'),
        },
        {
          key: 'notifications',
          title: 'Notification Settings',
          icon: 'notifications',
          onPress: () => navigation.navigate('NotificationSettings'),
        },
        {
          key: 'theme',
          title: 'App Theme',
          icon: 'color-palette',
          onPress: () => navigation.navigate('AppTheme'),
        },
      ],
    },
    {
      title: 'Data & Security',
      data: [
        {
          key: 'export',
          title: 'Export Data',
          icon: 'download',
          onPress: () => navigation.navigate('ExportData'),
        },
        {
          key: 'delete',
          title: 'Delete Account',
          icon: 'trash',
          onPress: () => navigation.navigate('DeleteAccount'),
        },
      ],
    },
  ]

  return (
    <ScreenContainer>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.list}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.6}
            onPress={item.onPress}
          >
            <View style={styles.rowContent}>
              <Ionicons
                name={item.icon}
                size={24}
                color={colors.textSecondary}
                style={styles.icon}
              />
              <Text style={styles.title}>{item.title}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.md,
  },
  sectionHeader: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.md,
  },
  title: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
})
