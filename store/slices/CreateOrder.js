import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';







export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.user.token;
      console.log('Create order with token:', token);
      
      if (!token) {
        return rejectWithValue('No authentication token available');
      }

      
      const formData = new FormData();
      
      
      formData.append('price', orderData.price);
      formData.append('situation', orderData.situation || "خالص");
      formData.append('status', orderData.status || "في طور الانجاز");
      
      if (orderData.advancedAmount) {
        formData.append('advancedAmount', orderData.advancedAmount);
      }
      
      formData.append('deliveryDate', orderData.deliveryDate);
      formData.append('pickupDate', orderData.pickupDate);
      formData.append('qrCode', orderData.qrCode);
      
      
      formData.append('isFinished', 'false');
      formData.append('isPickUp', 'false');
      
      
      if (orderData.images && orderData.images.length > 0) {
        console.log(`Processing ${orderData.images.length} images for upload`);
        
        
        console.log('Image array structure:', JSON.stringify(orderData.images));
        
        
        
        const imageFieldName = 'images';
        
        
        
        
        for (let i = 0; i < orderData.images.length; i++) {
          const image = orderData.images[i];
          
          if (!image.uri) {
            console.error(`Image ${i} has no URI, skipping`);
            continue;
          }
          
          try {
            
            const compressedUri = await compressImage(image.uri, 0.5);
            
            
            
            const originalName = image.name || `image_${i}.jpg`;
            const fileName = originalName.replace(/\s+/g, '_');
            
            
            let fileType = image.type || 'image/jpeg';
            if (!fileType.includes('/')) {
              fileType = fileName.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
            }
            
            
            const fileObj = {
              uri: compressedUri,
              type: fileType,
              name: fileName
            };
            
            console.log(`Adding image ${i}: ${fileName} (${fileType})`);
            
            
            
            formData.append(imageFieldName, fileObj);
            
            
            formData.append('imageOrder', i.toString());
          } catch (error) {
            console.error(`Error processing image ${i}:`, error);
          }
        }
        
        
        formData.append('imageCount', orderData.images.length.toString());
      } else {
        console.log('No images to upload');
      }
      
      console.log('FormData contains the following keys:');
      if (formData._parts) {
        formData._parts.forEach(part => {
          console.log(`- ${part[0]}: ${typeof part[1] === 'object' ? 'File object' : part[1]}`);
        });
      }
      
      console.log('Sending request to API');
      
      console.log('Request details:', {
        url: 'https://api.ajisalit.com/order',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.substring(0, 10)}...`,
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        timeout: 60000,
      });
      
      const response = await axios.post('https://api.ajisalit.com/order', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        timeout: 60000, 
        transformRequest: (data) => data, 
        
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });
      
      
      console.log('Server response:', response.status, response.statusText);
      if (response.data) {
        console.log('Response data:', JSON.stringify(response.data));
      }
      
      console.log('Order created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      
      if (error.response) {
        console.error('Server response:', error.response.status, error.response.data);
        
        if (error.response.data?.message) {
          return rejectWithValue(error.response.data.message);
        }
        
        return rejectWithValue('Failed to create order: ' + error.response.status);
      }
      
      return rejectWithValue(error.message || 'Network error');
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
    success: false
  },
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
        state.success = false;
      });
  },
});

export const { resetOrderState, setCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;