import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';

// Initialize with a default role
const roleSlice = createSlice({
  name: 'role',
  initialState: { role: 'client', isInitialized: false }, // Default value until we load from storage
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
      state.isInitialized = true;
    },
    initializeRoleComplete: (state) => {
      state.isInitialized = true;
    }
  },
});

// Create an async action to initialize the role from AsyncStorage
export const initializeRole = () => async (dispatch) => {
  try {
    const savedRole = await AsyncStorage.getItem('role');
    if (savedRole) {
      dispatch(setRole(savedRole));
    } else {
      dispatch(initializeRoleComplete());
    }
  } catch (error) {
    console.log('Failed to load role from storage:', error);
    dispatch(initializeRoleComplete());
  }
};

export const { setRole, initializeRoleComplete } = roleSlice.actions;
export default roleSlice.reducer;