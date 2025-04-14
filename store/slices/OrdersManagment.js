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

      const result = await axios.get(`${API_BASE_URL}/order/scan/${sanitizedQrCode}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('data retured from scan',result.data);

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
      
      //nstori l order f local storage bach ila dkhel fl offline ibarno lih fine
      try {
        await AsyncStorage.setItem('lastScannedOrder', JSON.stringify(result.data));
        console.log('this is saved data', saved);
        
      } catch (storageError) {
        console.log("Failed to store order in AsyncStorage:", storageError);
      }
      
      dispatch(setCurrentOrder(result.data));
      return result.data;
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


export const fetchORderById = createAsyncThunk(
    'orders/fetchOrderById',
    async (OrderMainId, {rejectWithValue, dispatch}) =>{

    try{
        console.log('This is the id of the  command', OrderMainId);

        const token = await AsyncStorage.getItem('token')

        if(!token){
            return rejectWithValue('No authenticated Token Available')    
        }

        if(!OrderMainId || typeof OrderMainId !== 'string'){
            return rejectWithValue('Invalid Id format');
        }

        const sanitizedId = OrderMainId.trim();
        console.log('this is sanitizedId', sanitizedId);
        const response = await axios.get(`${API_BASE_URL}/order/${sanitizedId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        

        console.log('order id response:', response.data);

        // //nstori l order f local storage bach ila dkhel fl offline ibarno lih fine
        // try{
        //     await AsyncStorage.setItem('lastScannedOrder', JSON.stringify(response.data))
        // }catch(error){
        //     console.log('failed to store the order on the storage');
        // }

        return response.data;

    }catch(error)
    {
        console.log('error finding the Order');
        if(error.response)
        {
            console.log('error in the responose:', error.response.data);
            console.log('error in the status:', error.response.status);
        }
    }
})


export const updateOrderDate = createAsyncThunk(
  'orders/updateOrderDate',
  async ({ orderId, dateData }, { rejectWithValue, dispatch }) => {
    try {
      if (!orderId) {
        return rejectWithValue('Order ID is required');
      }

      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('No authentication token available');
      }
      
      const response = await axios.put(
        `${API_BASE_URL}/order/${orderId}`,
        dateData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log('Order date update response:', response.data);
      return response.data;
    } catch (error) {
      console.log('Order date update error:', error.message);
      if (error.response) {
        console.log('Error response data:', error.response.data);
        console.log('Error response status:', error.response.status);
      }
      return rejectWithValue(error.response?.data || 'Failed to update order date');
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
      console.log("setCurrentOrder payload:", action.payload);
      
      // Keep the original nested structure for objects like companyId
      const normalizedOrder = {
        _id: action.payload._id || action.payload.id,
        id: action.payload.id || action.payload._id,
        
        orderCode: action.payload.orderCode || action.payload.qrCode,
        qrCode: action.payload.qrCode || action.payload.orderCode,
        
        // Keep the original nested structure for companyId
        companyId: action.payload.companyId,
        
        situation: action.payload.situation || 
          (action.payload.amount?.type === 'paid' ? 'خالص' : 'غير خالص'),
        
        deliveryDate: action.payload.deliveryDate,
        pickupDate: action.payload.pickupDate,
        
        price: action.payload.price,
        
        status: action.payload.status,
        
        advancedAmount: action.payload.advancedAmount || 
          (action.payload.amount?.value || 0),
        
        ...action.payload
      };
      
      console.log("Normalized order in Redux:", normalizedOrder);
      
      state.currentOrder = normalizedOrder;
      state.success = true;
      
      if (normalizedOrder) {
        const existingOrderIndex = state.allOrders.findIndex(
          order => (order._id === normalizedOrder._id) || 
                   (order.id === normalizedOrder.id) ||
                   (order.orderCode === normalizedOrder.orderCode) ||
                   (order.qrCode === normalizedOrder.qrCode)
        );
        
        if (existingOrderIndex >= 0) {
          state.allOrders[existingOrderIndex] = normalizedOrder;
        } else {
          state.allOrders.push(normalizedOrder);
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
      .addCase(updateOrderDate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateOrderDate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        
        const existingOrderIndex = state.allOrders.findIndex(
          order => (order._id === action.payload._id) || 
                   (order.id === action.payload.id)
        );
        
        if (existingOrderIndex >= 0) {
          state.allOrders[existingOrderIndex] = action.payload;
        }
        
        const userOrderIndex = state.userOrders.findIndex(
          order => (order._id === action.payload._id) || 
                   (order.id === action.payload.id)
        );
        
        if (userOrderIndex >= 0) {
          state.userOrders[userOrderIndex] = action.payload;
        }
        
        if (state.currentOrder && 
           (state.currentOrder._id === action.payload._id || 
            state.currentOrder.id === action.payload.id)) {
          state.currentOrder = action.payload;
        }
        if (state.currentOrder && action.payload) {
          state.currentOrder.isFinished = action.payload.isFinished || action.meta.arg.dateData.isFinished;
        }
      })
      .addCase(updateOrderDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
    },
});

export const { resetOrderState, setCurrentOrder, setQrCodeSearchTerm, clearCurrentOrder } = ordersSlice.actions;

export const selectAllOrders = (state) => state.orders.allOrders;
export const selectUserOrders = (state) => state.orders.userOrders;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrderLoading = (state) => state.orders.loading;
export const selectOrderError = (state) => state.orders.error;
export const selectOrderSuccess = (state) => state.orders.success;
export const selectQrCodeSearchTerm = (fstate) => state.orders.qrCodeSearchTerm;

export default ordersSlice.reducer;