// src/navigation/OnboardingNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen        from '../screens/Onboarding/WelcomeScreen';
import ProfileSetupScreen   from '../screens/Onboarding/ProfileSetupScreen';
import ChildInfoScreen      from '../screens/Onboarding/ChildInfoScreen';
import PrefsScreen          from '../screens/Onboarding/PrefsScreen';
import TourScreen           from '../screens/Onboarding/TourScreen';

export type OnboardingParamList = {
  Welcome: undefined;
  ProfileSetup: undefined;
  ChildInfo: undefined;
  Prefs: undefined;
  Tour: undefined;
};

const Stack = createNativeStackNavigator<OnboardingParamList>();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome"       component={WelcomeScreen} />
      <Stack.Screen name="ProfileSetup"  component={ProfileSetupScreen} />
      <Stack.Screen name="ChildInfo"     component={ChildInfoScreen} />
      <Stack.Screen name="Prefs"         component={PrefsScreen} />
      <Stack.Screen name="Tour"          component={TourScreen} />
    </Stack.Navigator>
  );
}
