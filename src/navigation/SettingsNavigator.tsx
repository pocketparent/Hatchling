// src/navigation/SettingsNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from '../screens/Settings';
import ProfileSetupScreen from '../screens/Settings/SettingsProfileSetupScreen';
import ChildInfoScreen from '../screens/Settings/ChildInfoScreen';
import ManageCaregiversScreen from '../screens/Settings/ManageCaregiversScreen';
import ActivityTrackingScreen from '../screens/Settings/ActivityTrackingScreen';
import NotificationSettingsScreen from '../screens/Settings/NotificationSettingsScreen';
import AppThemeScreen from '../screens/Settings/AppThemeScreen';
import ExportDataScreen from '../screens/Settings/ExportDataScreen';
import DeleteAccountScreen from '../screens/Settings/DeleteAccountScreen';

export type SettingsStackParamList = {
  SettingsMain: undefined;
  ProfileSetup: undefined;
  ChildInfo: undefined;
  ManageCaregivers: undefined;
  ActivityTracking: undefined;
  NotificationSettings: undefined;
  AppTheme: undefined;
  ExportData: undefined;
  DeleteAccount: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="SettingsMain"
      screenOptions={{ headerTitleAlign: 'center' }}
    >
      <Stack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen
        name="ProfileSetup"
        component={ProfileSetupScreen}
        options={{ title: 'Profile Setup' }}
      />
      <Stack.Screen
        name="ChildInfo"
        component={ChildInfoScreen}
        options={{ title: "Baby's Info" }}
      />
      <Stack.Screen
        name="ManageCaregivers"
        component={ManageCaregiversScreen}
        options={{ title: 'Manage Caregivers' }}
      />
      <Stack.Screen
        name="ActivityTracking"
        component={ActivityTrackingScreen}
        options={{ title: 'Activity Tracking' }}
      />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
        options={{ title: 'Notifications' }}
      />
      <Stack.Screen
        name="AppTheme"
        component={AppThemeScreen}
        options={{ title: 'App Theme' }}
      />
      <Stack.Screen
        name="ExportData"
        component={ExportDataScreen}
        options={{ title: 'Export Data' }}
      />
      <Stack.Screen
        name="DeleteAccount"
        component={DeleteAccountScreen}
        options={{ title: 'Delete Account' }}
      />
    </Stack.Navigator>
  );
}
