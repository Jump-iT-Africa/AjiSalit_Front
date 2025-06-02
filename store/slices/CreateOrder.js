import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { convertToBackendFormat } from '@/components/ActionSheetToAddProduct/statusMappings';



export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue, getState, dispatch }) => {
    try {
      const state = getState();
      const token = state.user.token;
      console.log('Create order with token:', token);
      
      if (!token) {
        return rejectWithValue('No authentication token available');
      }

      const formData = new FormData();
      
      // CONVERT ARABIC VALUES TO ENGLISH BEFORE APPENDING TO FORMDATA
      const convertedSituation = convertToBackendFormat(orderData.situation, 'situation');
      const convertedStatus = convertToBackendFormat(orderData.status || "inProgress", 'status');
      
      console.log('Original situation:', orderData.situation);
      console.log('Converted situation:', convertedSituation);
      
      // Convert price to number and append
      formData.append('price', Number(orderData.price));
      formData.append('situation', convertedSituation); // Use converted value
      formData.append('status', convertedStatus); // Use converted value
      
      if (orderData.advancedAmount) {
        formData.append('advancedAmount', Number(orderData.advancedAmount));
      }
      
      formData.append('deliveryDate', orderData.deliveryDate);
      formData.append('pickupDate', orderData.pickupDate);
      formData.append('qrCode', orderData.qrCode);
      
      // Convert boolean values properly
      formData.append('isFinished', orderData.isFinished || false);
      formData.append('isPickUp', orderData.isPickUp || false);
      
      // ... rest of your image processing code stays the same ...
      
      console.log('FormData contains the following keys:');
      if (formData._parts) {
        formData._parts.forEach(part => {
          console.log(`- ${part[0]}: ${typeof part[1] === 'object' ? 'File object' : part[1]}`);
        });
      }
      
      console.log('Sending request to API');
      
      const response = await axios.post('https://api.ajisalit.com/order', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        timeout: 180000, // Increased timeout to 3 minutes
        transformRequest: (data) => data,
        
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(40 + (progressEvent.loaded * 60) / progressEvent.total); // 40% base + 60% upload
          console.log(`Upload progress: ${percentCompleted}%`);
          dispatch(setUploadProgress(percentCompleted));
        },
      });
      
      console.log('Server response:', response.status, response.data);
      if (response.data) {
        console.log('Response data:', JSON.stringify(response.data));
      }
      
      // Final progress update
      dispatch(setUploadProgress(100));
      
      console.log('Order created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      
      if (error.response) {
        console.error('Server response:', error.response.status, error.response.data);
        
        let errorMessage = 'حدث خطأ في الخادم';
        
        if (error.response.status === 400) {
          errorMessage = 'خطأ في البيانات المرسلة. يرجى التحقق من صحة المعلومات';
        } else if (error.response.status === 401) {
          errorMessage = 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى';
        } else if (error.response.status === 413) {
          errorMessage = 'حجم الصور كبير جداً. يرجى اختيار صور أصغر';
        } else if (error.response.status === 500) {
          errorMessage = 'خطأ في الخادم. يرجى المحاولة مرة أخرى';
        } else if (error.response.status === 503) {
          errorMessage = 'الخدمة غير متاحة حالياً. يرجى المحاولة لاحقاً';
        }
        
        if (error.response.data?.message) {
          // If server provides Arabic message, use it
          if (error.response.data.message.includes('arabic') || /[\u0600-\u06FF]/.test(error.response.data.message)) {
            errorMessage = error.response.data.message;
          }
        }
        
        return rejectWithValue(errorMessage);
      }
      
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue('انتهت مهلة الاتصال. يرجى التحقق من الاتصال بالإنترنت والمحاولة مرة أخرى');
      }
      
      if (error.message === 'Network Error') {
        return rejectWithValue('خطأ في الشبكة. يرجى التحقق من الاتصال بالإنترنت');
      }
      
      return rejectWithValue(error.message || 'حدث خطأ غير متوقع');
    }
  }
);

const compressImage = async (uri, quality = 0.5, maxWidth = 800) => {
  try {
    console.log(`Processing image: ${uri}`);
    
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      throw new Error("File does not exist");
    }
    
    console.log(`Original size: ${(fileInfo.size / 1024).toFixed(2)} KB`);
    
    if (fileInfo.size > 200 * 1024) {
      const manipResult = await manipulateAsync(
        uri,
        [{ resize: { width: maxWidth } }],
        { compress: quality, format: SaveFormat.JPEG }
      );
      
      const compressedInfo = await FileSystem.getInfoAsync(manipResult.uri);
      console.log(`Compressed size: ${(compressedInfo.size / 1024).toFixed(2)} KB`);
      
      return manipResult.uri;
    } else {
      console.log("Image already small enough, skipping compression");
      return uri;
    }
  } catch (error) {
    console.error("Error in compressImage:", error);
    return uri;
  }
};

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    success: false,
    uploadProgress: 0
  },
  reducers: {
    resetOrderState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.uploadProgress = 0;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.uploadProgress = 0;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        state.currentOrder = action.payload;
        state.success = true;
        state.uploadProgress = 100;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.uploadProgress = 0;
      });
  },
});

export const { resetOrderState, setCurrentOrder, setUploadProgress } = orderSlice.actions;
export default orderSlice.reducer;