import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act } from 'react';

// const API_BASE_URL = 'http://192.168.100.170:3000';
const API_BASE_URL = 'https://www.ajisalit.com';
// const API_BASE_URL = 'http://192.168.100.170:3000';

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log("Using token for orders fetch:", token);

      if (!token) {
        return rejectWithValue('No authentication token available');
      }
      
      const response = await axios.get(`${API_BASE_URL}/order`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('these are the command of this user ', response);
      
      return response.data;
    } catch (error) {
      console.log('Fetch orders error:', error.message);
      return rejectWithValue(error.response?.data || 'Failed to fetch user orders');
    }
  }
);

export const fetchOrderByQrCodeOrId = createAsyncThunk(
  'orders/fetchOrderByQrCodeOrId',
  async (qrCode, { rejectWithValue, dispatch }) => {
    try {
      console.log("Fetching order with QR code:", qrCode);
      
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('No authentication token available');
      }
      
      if (!qrCode || typeof qrCode !== 'string') {
        return rejectWithValue('Invalid QR code format');
      }
      
      const sanitizedQrCode = qrCode.trim();

      const response = await axios.get(`${API_BASE_URL}/order/scan/${sanitizedQrCode}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });


      const userDataStr = await AsyncStorage.getItem('user');
        const userData = JSON.parse(userDataStr);
        console.log('the role of scanner is', userData.role);
        if(userData.role === 'client')
        {
          try
          {
            const response = await axios.patch(
              `${API_BASE_URL}/order/${sanitizedQrCode}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );
            console.log('this is log after adding user to Command Table when scan', response?.data);
          }
          catch(error)
          {
            console.log(error);
            return rejectWithValue(error);
          }
        }
      
      console.log("Order the response:", response.data);
      
      //nstori l order f local storage bach ila dkhel fl offline ibarno lih fine
      try {
        await AsyncStorage.setItem('lastScannedOrder', JSON.stringify(response.data));
      } catch (storageError) {
        console.log("Failed to store order in AsyncStorage:", storageError);
      }
      
      return response.data;
    } catch (error) {
      console.log("QR code fetch error:", error);
      if (error.response) {
        console.log("Error response data:", error.response.data);
        console.log("Error response status:", error.response.status);
      }
      return rejectWithValue(error.response?.data || 'Failed to fetch order by QR code');
    }
  }
);


export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('No authentication token available');
      }
      
      const response = await axios.post(`${API_BASE_URL}/order`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.log('Order creation error:', error.message);
      return rejectWithValue(error.response?.data || 'Failed to create order');
    }
  }
);

export const initializeCurrentOrder = createAsyncThunk(
  'orders/initializeCurrentOrder',
  async (_, { dispatch }) => {
    try {
      const orderData = await AsyncStorage.getItem('lastScannedOrder');
      if (orderData) {
        const parsedOrder = JSON.parse(orderData);
        dispatch(setCurrentOrder(parsedOrder));
        return parsedOrder;
      }
      return null;
    } catch (error) {
      console.log('Failed to initialize order from storage:', error);
      return null;
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    allOrders: [],
    userOrders: [],
    currentOrder: null,
    loading: false,
    qrCodeSearchTerm: '',
    error: null,
    success: false,
  },
  reducers: {
    resetOrderState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
      state.success = true;
      console.log("heeeeeeeeey", state.currentOrder);
      
      if (action.payload) {
        const existingOrderIndex = state.allOrders.findIndex(
          order => order._id === action.payload._id || order.id === action.payload.id
        );
        
        if (existingOrderIndex >= 0) {
          state.allOrders[existingOrderIndex] = action.payload;
        } else {
          state.allOrders.push(action.payload);
        }
      }
    },
    setQrCodeSearchTerm: (state, action) => {
      state.qrCodeSearchTerm = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchOrderByQrCodeOrId.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchOrderByQrCodeOrId.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.loading = false;
        state.success = true;
        
        // Make sure to update the allOrders array properly
        const existingOrderIndex = state.allOrders.findIndex(
          order => (order._id === action.payload._id) || 
                   (order.id === action.payload.id)
        );
        
        if (existingOrderIndex >= 0) {
          state.allOrders[existingOrderIndex] = action.payload;
        } else {
          state.allOrders.push(action.payload);
        }
      })
      .addCase(fetchOrderByQrCodeOrId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrders.push(action.payload);
        state.userOrders.push(action.payload);
        state.currentOrder = action.payload;
      console.log("heeeeeeeeey", state.currentOrder);

        state.success = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      .addCase(initializeCurrentOrder.fulfilled, (state, action) => {
        if (action.payload && !state.currentOrder) {
          state.currentOrder = action.payload;
        console.log("heeeeeeeeey", state.currentOrder);
        }
      });
  },
});

export const { resetOrderState, setCurrentOrder, setQrCodeSearchTerm, clearCurrentOrder } = ordersSlice.actions;

export const selectAllOrders = (state) => state.orders.allOrders;
export const selectUserOrders = (state) => state.orders.userOrders;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrderLoading = (state) => state.orders.loading;
export const selectOrderError = (state) => state.orders.error;
export const selectOrderSuccess = (state) => state.orders.success;
export const selectQrCodeSearchTerm = (state) => state.orders.qrCodeSearchTerm;

export default ordersSlice.reducer;