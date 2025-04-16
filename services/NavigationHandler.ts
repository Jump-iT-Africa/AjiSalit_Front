import { useEffect } from 'react';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NavigationHandlerProps {
  firstLaunch: boolean;
}

const NavigationHandler = ({ firstLaunch }: NavigationHandlerProps) => {
  const router = useRouter();
  // const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    const handleNavigation = async () => {
      try {
        const isAuthenticated = await AsyncStorage.getItem('isAuthenticated');
        console.log('NavigationHandler - Auth status check:', isAuthenticated);
        
        if (isAuthenticated === 'true') {
          console.log('NavigationHandler - Navigating to home');
          router.replace('/(home)');
        } else {
          console.log('NavigationHandler - Navigating to auth flow');
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
    
    // Add a slightly longer delay to ensure AsyncStorage has time to initialize
    const timer = setTimeout(() => {
      handleNavigation();
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [firstLaunch, router]);

  return null;
};

export default NavigationHandler;