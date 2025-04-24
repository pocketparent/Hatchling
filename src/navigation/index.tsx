// src/navigation/index.tsx
import React from 'react';
import { NavigationContainer }        from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OnboardingNavigator from './OnboardingNavigator';
import AppTabs             from './AppTabs';

export type RootParamList = {
  Onboarding: undefined;
  Main:       undefined;
};

const RootStack = createNativeStackNavigator<RootParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {/* Onboarding flow */}
        <RootStack.Screen name="Onboarding" component={OnboardingNavigator} />
        {/* Main dashboard tabs */}
        <RootStack.Screen name="Main"        component={AppTabs}             />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
