import { Stack } from "expo-router";
import React, { useState, useCallback, useEffect } from "react";
import { ToastProvider } from "react-native-toast-notifications";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isAppFirstLaunched, setIsAppFirstLaunched] = useState<boolean | null>(null);
  const [isReady, setIsReady] = useState(false); 
  const router = useRouter();
  
  const [fontsLoaded] = useFonts({
    'Tajawal': require('../assets/fonts/Tajawal.ttf'),
    'TajawalRegular': require('../assets/fonts/TajawalRegular.ttf'),
  });

  AsyncStorage.clear();
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const appData = await AsyncStorage.getItem('isAppFirstLaunched');

        if (appData === null) {
          setIsAppFirstLaunched(true);
          await AsyncStorage.setItem('isAppFirstLaunched', 'false');
        } else {
          setIsAppFirstLaunched(false);
        }
      } catch (error) {
        console.log('Error checking first launch:', error);
        setIsAppFirstLaunched(false);
      } finally {
        setIsReady(true); 
      }
    };

    if (fontsLoaded) {
      initializeApp();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (isReady && isAppFirstLaunched !== null) {
      router.replace(isAppFirstLaunched ? '/onboarding' : '/(tabs)');
    }
  }, [isReady, isAppFirstLaunched, router]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || isAppFirstLaunched === null || !isReady) {
    return null; 
  }

  return (
    <ToastProvider
      placement="top"
      duration={4000}
      animationType="slide-in"
      successColor="green"
      dangerColor="red"
      warningColor="orange"
      normalColor="gray"
    >
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ToastProvider>
  );
}
