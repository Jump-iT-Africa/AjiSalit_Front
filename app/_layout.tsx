import { Stack, router } from "expo-router";
import React, { useState, useEffect } from "react";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import store from '@/store/actions/Store';
import AuthCheck from "@/services/CheckIfUserAuth";
import * as Notifications from "expo-notifications";
import { NotificationProvider } from '../context/NotificationContext'
import HandleNotification from "./(home)/HandleNotification";
import NavigationHandler from "@/services/NavigationHandler";
import { GestureHandlerRootView } from "react-native-gesture-handler";


SplashScreen.preventAutoHideAsync()
  .catch(console.warn);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {

  const [isAppFirstLaunched, setIsAppFirstLaunched] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    'Tajawal': require('../assets/fonts/Tajawal.ttf'),
    'TajawalRegular': require('../assets/fonts/TajawalRegular.ttf'),
  });


  useEffect(() => {
    const initializeApp = async () => {
      try {
        const appData = await AsyncStorage.getItem('isAppFirstLaunched');
        const isAuthenticated = await AsyncStorage.getItem('isAuthenticated');

        console.log("App initialization - Auth status:", isAuthenticated);


        if (appData === null) {
          setIsAppFirstLaunched(true);
          await AsyncStorage.setItem('isAppFirstLaunched', 'false');
        } else {
          setIsAppFirstLaunched(false);
        }

      } catch (error) {
        // console.log('Error checking first launch:', error);
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
          // console.log("Splash screen countdown starting...");
          for (let i = 1; i <= 2; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            // console.log(`Splash screen: ${i}s`);
          }
          // console.log("Hiding splash screen now");
          await SplashScreen.hideAsync();
        } catch (error) {
          // console.warn('Error hiding splash screen:', error);
        }
      }
    };

    prepare();
  }, [isReady, isAppFirstLaunched, fontsLoaded]);



  if (!fontsLoaded || isAppFirstLaunched === null || !isReady) {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <NotificationProvider>
      <Provider store={store}>
        <AuthCheck />
        <HandleNotification />
        <NavigationHandler firstLaunch={isAppFirstLaunched} />
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(home)" options={{ headerShown: false }} />
        </Stack>
      </Provider>
    </NotificationProvider>
  );
}
