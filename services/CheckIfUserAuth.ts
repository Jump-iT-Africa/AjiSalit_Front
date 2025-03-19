// services/CheckIfUserAuth.js
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { restoreAuthState } from '@/store/slices/userSlice';

const AuthCheck = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await dispatch(restoreAuthState());
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuth();
  }, [dispatch]);

  return null;
};

export default AuthCheck;