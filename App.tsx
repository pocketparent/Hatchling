// File: App.tsx
import React, { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as SplashScreen from 'expo-splash-screen'
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
} from '@expo-google-fonts/poppins'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { auth, db } from './src/config/firebase'
import { doc, getDoc } from 'firebase/firestore'

import AppTabs from './src/navigation/AppTabs'
import { LoginScreen } from './src/screens/Auth/LoginScreen'
import { SignUpScreen } from './src/screens/Auth/SignUpScreen'
import OnboardingNavigator from './src/navigation/OnboardingNavigator'

export type RootStackParamList = {
  Login: undefined
  SignUp: undefined
  Onboarding: undefined
  Main: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false)
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>()

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
  })

  useEffect(() => {
    SplashScreen.preventAutoHideAsync()
  }, [])

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().then(() => setAppIsReady(true))
    }
  }, [fontsLoaded])

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setInitialRoute('Login')
      } else {
        const snap = await getDoc(doc(db, 'users', user.uid))
        const data = snap.data()
        setInitialRoute(data?.onboarded ? 'Main' : 'Onboarding')
      }
      unsub()
    })
  }, [])

  if (!appIsReady || !initialRoute) return null

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
          <Stack.Screen name="Main" component={AppTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
