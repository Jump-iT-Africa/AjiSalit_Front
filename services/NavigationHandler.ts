import React, { useEffect } from 'react';
import { useRouter } from "expo-router";
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/store/slices/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NavigationHandlerProps {
  firstLaunch: boolean;
}

const NavigationHandler = ({ firstLaunch }: NavigationHandlerProps) => {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    const handleNavigation = async () => {
      try {
        const isRegistering = await AsyncStorage.getItem('isRegistering');
        const registered = await AsyncStorage.getItem('registered');

        if (isRegistering === 'true') {
          return;
        }

        if (registered === 'true' && !isAuthenticated) {
          return;
        }

        if (isAuthenticated) {
          router.replace('/(home)');
        } else {
          if (firstLaunch) {
            router.replace('/(auth)/onboarding');
          } else {
            router.replace('/');
          }
        }
      } catch (error) {
        console.log('Navigation error:', error);
      }
    };

    const timer = setTimeout(() => {
      handleNavigation();
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, firstLaunch, router]);

  return null;
};

export default NavigationHandler;