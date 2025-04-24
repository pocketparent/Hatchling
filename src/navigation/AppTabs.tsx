// src/navigation/AppTabs.tsx
import React from 'react';
import type { ComponentProps }             from 'react';
import { createBottomTabNavigator }        from '@react-navigation/bottom-tabs';
import { Ionicons }                        from '@expo/vector-icons';

import TodayView     from '../screens/TodayView';
import TrendsView    from '../screens/TrendsView';
import Settings      from '../screens/Settings';
import { colors }    from '../theme/colors';
import SettingsNavigator from './SettingsNavigator';

export type TabParamList = {
  Today:    undefined;
  Insights:   undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function AppTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Today"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor:   colors.accentPrimary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIcon: ({ color, size }) => {
          const icons: Record<
            keyof TabParamList,
            ComponentProps<typeof Ionicons>['name']
          > = {
            Today:    'calendar',
            Insights:   'bulb',
            Settings: 'settings',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Today"    component={TodayView}  />
      <Tab.Screen name="Insights"   component={TrendsView} />
      <Tab.Screen name="Settings" component={SettingsNavigator}   />
    </Tab.Navigator>
  );
}
