// App.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaProvider }                       from 'react-native-safe-area-context';
import * as SplashScreen                         from 'expo-splash-screen';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
} from '@expo-google-fonts/poppins';

import RootNavigator from './src/navigation';

export default function App() {
  const [ready, setReady] = useState(false);

  // Keep the splash visible until we hide it
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().then(() => setReady(true));
    }
  }, [fontsLoaded]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}
