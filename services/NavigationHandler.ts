import React, { useEffect } from 'react';
import { useRouter } from "expo-router";
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/store/slices/userSlice';

const NavigationHandler = ({ firstLaunch }) => {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    const handleNavigation = async () => {
      try {
        if (isAuthenticated) {
          router.replace('/(home)');
        } else {
          if (firstLaunch) {
            router.replace('/onboarding');
          } else {
            router.replace('/(auth)/register');
          }
        }
      } catch (error) {
        console.log('Navigation error:', error);
        router.replace('/(auth)');
      }
    };

    const timer = setTimeout(() => {
      handleNavigation();
    }, 300);

    return () => clearTimeout(timer);
  }, [isAuthenticated, firstLaunch, router]);

  return null;
};

export default NavigationHandler;