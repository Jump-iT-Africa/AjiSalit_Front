import { Stack } from "expo-router";
import React, { useState, useCallback, useEffect } from "react";
import { ToastProvider } from "react-native-toast-notifications";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { View } from 'react-native';
import { Provider } from 'react-redux';
import store from '@/store/actions/OrderDetailsAction';

SplashScreen.preventAutoHideAsync()
  .catch(console.warn);

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

    initializeApp();
  }, []); 




  useEffect(() => {
    const prepare = async () => {
      if (isReady && isAppFirstLaunched !== null && fontsLoaded) {
        try {
          await SplashScreen.hideAsync();
         router.replace(isAppFirstLaunched ? '/onboarding' : '/(tabs)');
          // router.replace(isAppFirstLaunched ? '/(home)' : '/(tabs)');
        } catch (error) {
          console.warn('Error hiding splash screen:', error);
        }
      }
    };

    prepare();
  }, [isReady, isAppFirstLaunched, fontsLoaded, router]);

  if (!fontsLoaded || isAppFirstLaunched === null || !isReady) {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(home)" options={{ headerShown: false }} />
      </Stack>
    </Provider>

  );
}