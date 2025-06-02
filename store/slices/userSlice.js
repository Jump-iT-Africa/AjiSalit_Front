import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { saveUserToDB, loginUser, getAuthToken, getUserData, verifyNumber, updateUser, updatePasswordService,fetchUserData,updateUserWithImage } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {clearCurrentOrder} from "@/store/slices/OrdersManagment"


export const fetchCurrentUserData = createAsyncThunk(
  'user/fetchCurrentUserData',
  async (_, { rejectWithValue }) => {
    try {
     
      const response = await fetchUserData();

      console.log('here is the response of get users', response);

      if (response) {
        await AsyncStorage.setItem('user',JSON.stringify(response))
        return response;
      }
      
      return rejectWithValue('Failed to fetch user data');
    } catch (error) {
      console.log('Error fetching current user data:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const registerUser = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('data to save', userData);
      const response = await saveUserToDB(userData);
  
      console.log('this is response from register', response);
      
      return {
        token: response.token,
        user: response.user
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
      
      console.log('Login response form login method:', response);

      return {
        token: response.token,
        user: response.user || response.data || response.data.user
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
      // console.log('this is user from ache if userisauth', userData);

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
      
      if (response.statusCode === 409 && response.isExist === true) {
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
    await AsyncStorage.setItem('isAuthenticated', 'false');

    dispatch(logout());
    dispatch(resetOrdersState());
    dispatch(clearCurrentOrder())
    
    return true;
  }
);




export const UpdateUser = createAsyncThunk(
  'user/UpdateUser',
  async (credentials, { rejectWithValue, getState }) => {
    try {
      console.log('Info to update:', credentials);
      
      const UserId = (await AsyncStorage.getItem('userId'))?.replace(/^"|"$/g, '');
      console.log('User ID (cleaned):', UserId);
      
      if (!UserId) {
        return rejectWithValue('User ID not found');
      }
      
      let updatedUserData;
      
      // Check if there's a profile image and what type it is
      if (credentials.image && !credentials.image.startsWith('http')) {
        if (credentials.image.startsWith('data:')) {
          // Base64 image - use JSON approach
          console.log('Updating user with base64 image via JSON...');
          updatedUserData = await updateUser(UserId, credentials);
        } else {
          // Local file URI - use FormData approach
          console.log('Updating user with local file via FormData...');
          updatedUserData = await updateUserWithImage(UserId, credentials);
        }
      } else {
        // No new image or image is a URL - use JSON approach
        console.log('Updating user without new image...');
        updatedUserData = await updateUser(UserId, credentials);
      }
      
      if (updatedUserData) {
        const updatedUser = { ...updatedUserData, id: UserId };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      console.log('Response of updated user:', updatedUserData);
      return updatedUserData;
    } catch (error) {
      console.log('Update user error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  id: '',
  Fname: '',
  Lname: '',
  companyName: '',
  role: '', 
  phoneNumber: '',
  city: '',
  field: null,
  ice: null,
  ownRef: '',
  refBy: '',
  listRefs: [],
  image: null, 
  token: null,
  isAuthenticated: false,  
  password: '',
  pocket:0,
  loading: false,
  verificationLoading: false,
  verificationSuccess: false,
  verificationData: null,
  error: null,

  passwordUpdateLoading: false,
  passwordUpdateSuccess: false,
  passwordUpdateError: null
};



export const updatePassword = createAsyncThunk(
  'user/updatePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      if (passwordData.password.length < 6) {
        return rejectWithValue({
          message: 'يجب أن يتكون الكود الجديد من 6 أرقام على الأقل',
          field: 'password'
        });
      }
      
      const response = await updatePasswordService({
        oldPassword: passwordData.oldPassword,
        password: passwordData.password
      });
      
      return response;
    } catch (error) {
      console.log('Error in updatePassword thunk:', error);
      
      if (error.response?.status === 401 || (error.response?.data?.message && error.response.data.message.includes('incorrect'))) {
        return rejectWithValue({
          message: 'الكود الحالي غير صحيح. الرجاء التحقق وإعادة المحاولة.',
          field: 'oldPassword',
          statusCode: error.response?.status
        });
      }
      
      if (error.response?.status === 404) {
        return rejectWithValue({
          message: 'لم يتم العثور على المستخدم. الرجاء تسجيل الخروج وتسجيل الدخول مرة أخرى.',
          field: 'general'
        });
      }
      
      if (error.response?.data?.message) {
        return rejectWithValue({
          message: error.response.data.message,
          field: 'general',
          statusCode: error.response?.status
        });
      }
      
      return rejectWithValue({
        message: 'حدث خطأ أثناء تحديث الكود. الرجاء المحاولة مرة أخرى.',
        field: 'general'
      });
    }
  }
);



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
      const { Fname, city } = action.payload;
      state.Fname = Fname;
      state.city = city;
    },
    setCompanyInfo: (state, action) => {
      const { companyName, city, field, ice } = action.payload;
      state.companyName = companyName;
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
    resetVerificationState: (state) => {
      state.verificationLoading = false;
      state.verificationSuccess = false;
      state.verificationData = null;
      state.error = null;
    },
    setUserInfo: (state, action) => {
      const { Fname, role } = action.payload;
      state.Fname = Fname || state.Fname;
      state.role = role || state.role;
    },
    resetPasswordUpdateState: (state) => {
      state.passwordUpdateLoading = false;
      state.passwordUpdateSuccess = false;
      state.passwordUpdateError = null;
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

      state.id = user.id ||user._id;
      state.Fname = user.Fname;
      state.Lname = user.Lname;
      state.companyName = user.companyName;
      state.phoneNumber = user.phoneNumber;
      state.role = user.role;
      state.city = user.city;
      state.field = user.field || null;
      state.ice = user.ice || null;
      state.ownRef = user.ownRef || '';
      state.listRefs = user.listRefs || [];
      state.image = user.image || null;
      state.pocket = user?.pocket || null;

    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    });

    
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
      state.Fname = user?.Fname || user?.username;
      state.Lname = user.Lname;
      state.companyName = user.companyName;
      state.phoneNumber = user?.phoneNumber;
      state.role = user?.role;
      state.city = user?.city;
      state.field = user?.field || null;
      state.ice = user?.ice || null;
      state.ownRef = user?.ownRef || '';
      state.listRefs = user?.listRefs || [];
      state.image = user.image || null;
      state.pocket = user?.pocket || null;

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
      
      state.id = user.id||user._id;
      state.Fname = user.Fname;
      state.phoneNumber = user.phoneNumber;
      state.Lname = user.Lname;
      state.companyName = user.companyName;
      state.role = user.role;
      state.city = user.city;
      state.field = user.field || null;
      state.ice = user.ice || null;
      state.ownRef = user.ownRef || '';
      state.listRefs = user.listRefs || [];
      state.image = user.image || null;
      state.pocket = user.pocket || null;
    });
    builder.addCase(restoreAuthState.rejected, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
    });
    
    
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
    
    builder.addCase(UpdateUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(UpdateUser.fulfilled, (state, action) => {
      state.loading = false;
      
      if (action.payload) {
        Object.keys(action.payload).forEach(key => {
          if (key in state) {
            state[key] = action.payload[key];
          }
        });
        
        if (action.payload.Fname) state.Fname = action.payload.Fname;
        if (action.payload.companyName) state.companyName = action.payload.companyName;
        if (action.payload.Lname) state.Lname = action.payload.Lname;
        if (action.payload.image) state.image = action.payload.image;
      }
    });
    builder.addCase(UpdateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(updatePassword.pending, (state) => {
      state.passwordUpdateLoading = true;
      state.passwordUpdateError = null;
      state.passwordUpdateSuccess = false;
    });
    builder.addCase(updatePassword.fulfilled, (state, action) => {
      state.passwordUpdateLoading = false;
      state.passwordUpdateSuccess = true;
      state.passwordUpdateError = null;
      console.log("Password update successful!", action.payload);
    });
    builder.addCase(updatePassword.rejected, (state, action) => {
      state.passwordUpdateLoading = false;
      state.passwordUpdateSuccess = false;
      state.passwordUpdateError = action.payload;
      console.log("Password update rejected with payload:", action.payload);
    });

    builder.addCase(fetchCurrentUserData.pending, (state) => {
    });
    builder.addCase(fetchCurrentUserData.fulfilled, (state, action) => {
      const userData = action.payload;
      
      if (userData) {
        if (userData.id || userData._id) state.id = userData.id || userData._id;
        if (userData.Fname) state.Fname = userData.Fname;
        if (userData.Lname) state.Lname = userData.Lname;
        if (userData.companyName) state.companyName = userData.companyName;
        if (userData.phoneNumber) state.phoneNumber = userData.phoneNumber;
        if (userData.role) state.role = userData.role;
        if (userData.city) state.city = userData.city;
        if (userData.field) state.field = userData.field;
        if (userData.ice) state.ice = userData.ice;
        if (userData.ownRef) state.ownRef = userData.ownRef;
        if (userData.listRefs) state.listRefs = userData.listRefs;
        if (userData.image) state.image = userData.image;
        
        state.pocket = userData.pocket !== undefined ? userData.pocket : null;
      }
    });
    builder.addCase(fetchCurrentUserData.rejected, (state, action) => {
      console.log("Failed to fetch current user data:", action.payload);
    });
  }
});




const passwordUpdateInitialState = {
  passwordUpdateLoading: false,
  passwordUpdateSuccess: false,
  passwordUpdateError: null
};






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
  resetPasswordUpdateState,
  setUserInfo
} = userSlice.actions;



export default userSlice.reducer;


const selectUser = state => state.user;
export const selectIsAuthenticated = state => state.user.isAuthenticated;
export const selectToken = state => state.user.token;
export const selectUserRole = state => state.user.role;
export const selectLoading = state => state.user.loading;
export const selectError = state => state.user.error;
export const selectVerificationLoading = state => state.user.verificationLoading;
export const selectVerificationSuccess = state => state.user.verificationSuccess;
export const selectVerificationData = state => state.user.verificationData;
export const selectPasswordUpdateLoading = state => state.user.passwordUpdateLoading;
export const selectPasswordUpdateSuccess = state => state.user.passwordUpdateSuccess;
export const selectPasswordUpdateError = state => state.user.passwordUpdateError;

 
export const selectUserData = createSelector(
  [selectUser],
  (user) => ({
    id: user.id,
    Fname: user.Fname,
    Lname: user.Lname,
    companyName: user.companyName,
    phoneNumber: user.phoneNumber,
    role: user.role,
    city: user.city, 
    field: user.field,
    ice: user.ice,
    ownRef: user.ownRef,
    listRefs: user.listRefs,
    image: user.image,
    pocket: user.pocket,

  })
);