import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigation } from 'expo-router';
import { resetOrderButtons,resetButtons } from '@/store/slices/OrderDetailsSlice';


export default function OrderResetManager() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', (e) => {
      dispatch(resetButtons());
    });

    return unsubscribe;
  }, [navigation, dispatch]);

  // This is a utility component with no UI
  return null;
}