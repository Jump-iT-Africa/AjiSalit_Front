import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_URL = 'https://www.ajisalit.com';
const API_URL = 'http://192.168.1.66:3000';

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('No authentication token available');
      }
      
      const userData = await AsyncStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      
      if (!user) {
        return rejectWithValue('User data not available');
      }
      
      const role = getState().role.role;
    
      let queryParam = '';
      if (role === 'client') {
        queryParam = `?clientId=${user.id}`;
      } else if (role === 'company') {
        queryParam = `?companyId=${user.id}`;
      }

      const response = await axios.get(`${API_URL}/order${queryParam}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("reponse of the client or  company", response.data);
      return response.data;
      
    } catch (error) {
      console.log("Orders API error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const transformOrderData = (apiOrders) => {
  return apiOrders.map(order => ({
    orderCode: order.qrCode,
    status: order.status,
    amount: {
      type: getAmountType(order.situation),
      value: order.advancedAmount,
      label: order.situation,
      currency: order.advancedAmount ? "درهم" : null
    },
    customerDisplayName: order.customerDisplayName || 'عميل غير معروف',
    date: formatDate(order.deliveryDate),
    id: order._id,
    price: order.price,
    city: order.city,
    pickupDate: formatDate(order.pickupDate),
    deliveryDate: formatDate(order.deliveryDate)
  }));
};

const getAmountType = (situation) => {
  switch (situation) {
    case 'خالص':
      return 'paid';
    case 'غير خالص':
      return 'unpaid';
    case 'تسبيق':
      return 'installment';
    default:
      return 'unknown';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "غير محدد";
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    loading: false,
    error: null,
    searchTerm: '',
    statusFilter: null,
    dateFilter: null
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    setDateFilter: (state, action) => {
      state.dateFilter = action.payload;
    },
    markOrderFinished: (state, action) => {
      const orderIndex = state.items.findIndex(order => order.id === action.payload);
      if (orderIndex !== -1) {
        state.items[orderIndex].isFinished = true;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = transformOrderData(action.payload);
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch orders';
      });
  }
});

export const { setSearchTerm, setStatusFilter, setDateFilter, markOrderFinished } = ordersSlice.actions;

// Selectors
export const selectAllOrders = state => state?.orders?.items || [];
export const selectOrdersLoading = state => state?.orders?.loading || false;
export const selectOrdersError = state => state?.orders?.error || null;
export const selectSearchTerm = state => state?.orders?.searchTerm || '';
export const selectStatusFilter = state => state?.orders?.statusFilter || null;
export const selectDateFilter = state => state?.orders?.dateFilter || null;

export const selectFilteredOrders = state => {
  if (!state || !state.orders) {
    return [];
  }
  
  const { items, searchTerm, statusFilter, dateFilter } = state.orders;
  
  if (!items || !Array.isArray(items)) {
    return [];
  }
  
  let result = items;
  
  if (searchTerm) {
    result = result.filter(order => 
      order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  if (statusFilter) {
    let typeToFilter;
    
    switch(statusFilter) {
      case 'خالص':
        typeToFilter = 'paid';
        break;
      case 'غير خالص':
        typeToFilter = 'unpaid';
        break;
      case 'تسبيق':
        typeToFilter = 'installment';
        break;
      default:
        typeToFilter = null;
    }
    
    if (typeToFilter) {
      result = result.filter(order => order.amount.type === typeToFilter);
    }
  }
  
  if (dateFilter) {
    const filterDate = new Date(dateFilter);
    
    result = result.filter(order => {
      if (!order.date || order.date === "غير محدد") return false;
      
      const [day, month, year] = order.date.split('/').map(Number);
      const orderDate = new Date(year, month - 1, day);
      
      return orderDate.toDateString() === filterDate.toDateString();
    });
  }
  
  return result;
};

export default ordersSlice.reducer;