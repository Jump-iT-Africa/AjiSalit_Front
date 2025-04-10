import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveUserToDB, loginUser, getAuthToken, getUserData } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const registerUser = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await saveUserToDB(userData);
      
      // Store user data and token in AsyncStorage for persistence
      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user || response));
      
      return {
        token: response.token,
        user: response.user || response
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const login = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials);
      
      // Store user data and token in AsyncStorage for persistence
      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user || response));
      
      return {
        token: response.token,
        user: response.user || response 
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const restoreAuthState = createAsyncThunk(
  'user/restore',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userDataStr = await AsyncStorage.getItem('user');
      
      if (!token || !userDataStr) {
        return rejectWithValue('No stored auth data');
      }
      
      const userData = JSON.parse(userDataStr);
      return {
        token,
        user: userData
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { dispatch }) => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    
    dispatch(logout());
    dispatch(resetOrdersState());
    
    return true;
  }
);

const initialState = {
  id: '',
  name: '',
  role: '', 
  phoneNumber: '',
  city: '',
  field: null,
  ice: null,
  ownRef: '',
  refBy: '',
  listRefs: [],
  
  token: null,
  isAuthenticated: false,  

  password: '',
  
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
      AsyncStorage.setItem('role', state.role);
    },
    setPersonalInfo: (state, action) => {
      const { name, city } = action.payload;
      state.name = name;
      state.city = city;
    },
    setCompanyInfo: (state, action) => {
      const { name, city, field, ice } = action.payload;
      state.name = name;
      state.city = city;
      state.field = field;
      state.ice = ice;
    },
    setReferralInfo: (state, action) => {
      const { ownRef, refBy } = action.payload;
      state.ownRef = ownRef;
      state.refBy = refBy;
    },
    
    // Manual auth actions
    logout: (state) => {
      Object.assign(state, initialState);
      
      // Clear AsyncStorage
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('user');
    },
    
    resetUserState: () => initialState
  },
  extraReducers: (builder) => {
    // Registration
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      const { token, user } = action.payload;
      
      // Update auth state
      state.token = token;
      state.isAuthenticated = true;
      state.loading = false;
      
      // Update user data
      state.id = user.id;
      state.name = user.name;
      state.phoneNumber = user.phoneNumber;
      state.role = user.role;
      state.city = user.city;
      state.field = user.field || null;
      state.ice = user.ice || null;
      state.ownRef = user.ownRef || '';
      state.listRefs = user.listRefs || [];
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    });
    
    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      const { token, user } = action.payload;
      
      state.token = token;
      state.isAuthenticated = true;
      state.loading = false;
      
      state.id = user.id;
      state.name = user.name;
      state.phoneNumber = user.phoneNumber;
      state.role = user.role;
      state.city = user.city;
      state.field = user.field || null;
      state.ice = user.ice || null;
      state.ownRef = user.ownRef || '';
      state.listRefs = user.listRefs || [];
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    });
    
    builder.addCase(restoreAuthState.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(restoreAuthState.fulfilled, (state, action) => {
      const { token, user } = action.payload;
      
      state.token = token;
      state.isAuthenticated = true;
      state.loading = false;
      
      state.id = user.id;
      state.name = user.name;
      state.phoneNumber = user.phoneNumber;
      state.role = user.role;
      state.city = user.city;
      state.field = user.field || null;
      state.ice = user.ice || null;
      state.ownRef = user.ownRef || '';
      state.listRefs = user.listRefs || [];
    });
    builder.addCase(restoreAuthState.rejected, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
    });
  }
});

export const { 
  setPhoneNumber, 
  setPassword, 
  setRole, 
  setPersonalInfo, 
  setCompanyInfo,
  setReferralInfo,
  logout,
  resetUserState
} = userSlice.actions;

export default userSlice.reducer;

export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectToken = (state) => state.user.token;
export const selectUserData = (state) => {
  const { id, name, phoneNumber, role, city, field, ice, ownRef, listRefs } = state.user;
  return { id, name, phoneNumber, role, city, field, ice, ownRef, listRefs };
};
export const selectUserRole = (state) => state.user.role;
export const selectLoading = (state) => state.user.loading;
export const selectError = (state) => state.user.error;