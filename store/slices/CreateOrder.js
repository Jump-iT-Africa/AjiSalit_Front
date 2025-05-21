import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';


const compressImage = async (uri, quality = 0.5, maxWidth = 1200) => {
  try {
    
    const manipulatedImage = await manipulateAsync(
      uri,
      [{ resize: { width: maxWidth } }],
      { compress: quality, format: SaveFormat.JPEG }
    );
    
    return manipulatedImage.uri;
  } catch (error) {
    console.error('Error compressing image:', error);
    return uri; 
  }
};


export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.user.token;
      console.log('create order token', token);
      
      if (!token) {
        return rejectWithValue('No authentication token available');
      }
      
      if (orderData.images && orderData.images.length > 0) {
        const formData = new FormData();
        
        Object.keys(orderData).forEach(key => {
          if (key !== 'images') {
            formData.append(key, orderData[key]);
          }
        });
        
        for (let i = 0; i < orderData.images.length; i++) {
          const image = orderData.images[i];
          
          const compressedUri = await compressImage(image.uri, 0.3);
          
          const fileInfo = await FileSystem.getInfoAsync(compressedUri);
          console.log(`Compressed image size: ${fileInfo.size / 1024} KB`);
          
          formData.append('images', {
            uri: compressedUri,
            type: image.type || 'image/jpeg',
            name: image.name || `image_${i}.jpg`
          });
          
        }
        
        console.log('Sending form data with image files');
        
        
        const response = await axios.post('https://api.ajisalit.com/order', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000,
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        });
        
        return response.data;
      } else {
        
        const response = await axios.post('https://api.ajisalit.com/order', orderData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        return response.data;
      }
    } catch (error) {
      console.log('Order error:', error.response?.status || error.message);
      
      if (error.response && error.response.status === 413) {
        return rejectWithValue('الصور كبيرة جدًا. يرجى التقاط صور بجودة أقل أو تقليل عددها.');
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create order');
    }
  }
);



const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  success: false,
  currentOrder: { isFinished: false }
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        state.currentOrder = action.payload;
        state.success = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log(state.error);
        state.success = false;
      });
  },
});

export const { resetOrderState, setCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;