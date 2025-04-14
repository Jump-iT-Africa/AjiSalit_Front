import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveUserToDB, loginUser, getAuthToken, getUserData, verifyNumber } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {clearCurrentOrder} from "@/store/slices/OrdersManagment"

export const registerUser = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await saveUserToDB(userData);
      
    
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
      console.log('password is', credentials.password);
      const response = await loginUser(credentials);
      
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


export const verifyPhoneNumber = createAsyncThunk(
  'user/verify',
  async(phoneNumber, {rejectWithValue, dispatch}) => {
    try {
      const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      
      const phoneData = { 
        phoneNumber: formattedNumber 
      };
      
      console.log('Sending verification request with phone:', phoneNumber);
      console.log('Formatted as:', phoneData);
      
      const response = await verifyNumber(phoneData);
      console.log('Verification response:', response);
      
      if (response.statusCode === 409 && response.isExist === false) {
        dispatch(setUserInfo({
          name: response.UserName,
          role: response.role
        }));
      }
      
      return response;
    } catch(error) {
      console.log('Verification error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { dispatch }) => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('lastScannedOrder');

    dispatch(logout());
    dispatch(resetOrdersState());
    dispatch(clearCurrentOrder())
    
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
  verificationLoading: false,
  verificationSuccess: false,
  verificationData: null,
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
    
    logout: (state) => {
      Object.assign(state, initialState);
      
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('user');
    },
    resetOrdersState: (state) => {
      state.allOrders = [];
      state.userOrders = [];
      state.currentOrder = null;
      state.loading = false;
      state.qrCodeSearchTerm = '';
      state.error = null;
      state.success = false;
    },
    
    resetUserState: () => initialState,
    
    // Reset verification state (useful when navigating away from the verification screen)
    resetVerificationState: (state) => {
      state.verificationLoading = false;
      state.verificationSuccess = false;
      state.verificationData = null;
      state.error = null;
    },
    setUserInfo: (state, action) => {
      const { name, role } = action.payload;
      state.name = name || state.name;
      state.role = role || state.role;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
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
      
      state.id = user?.id || user?._id;
      state.name = user?.name || user?.username;
      state.phoneNumber = user?.phoneNumber;
      state.role = user?.role;
      state.city = user?.city;
      state.field = user?.field || null;
      state.ice = user?.ice || null;
      state.ownRef = user?.ownRef || '';
      state.listRefs = user?.listRefs || [];
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
    
    // Phone verification cases
    builder.addCase(verifyPhoneNumber.pending, (state) => {
      state.verificationLoading = true;
      state.verificationSuccess = false;
      state.verificationData = null;
      state.error = null;
    });
    builder.addCase(verifyPhoneNumber.fulfilled, (state, action) => {
      state.verificationLoading = false;
      state.verificationSuccess = true;
      state.verificationData = action.payload;
      state.error = null;
    });
    builder.addCase(verifyPhoneNumber.rejected, (state, action) => {
      state.verificationLoading = false;
      state.verificationSuccess = false;
      state.verificationData = null;
      state.error = action.payload;
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
  resetOrdersState,
  resetUserState,
  resetVerificationState,
  setUserInfo
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
export const selectVerificationLoading = (state) => state.user.verificationLoading;
export const selectVerificationSuccess = (state) => state.user.verificationSuccess;
export const selectVerificationData = (state) => state.user.verificationData;