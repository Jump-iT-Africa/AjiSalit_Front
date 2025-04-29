import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://www.ajisalit.com';
// const API_URL = 'http://192.168.1.66:3000';

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
      
      if (response.data === "ماكين حتا طلب" || !Array.isArray(response.data)) {
        return []; 
      }
      // console.log("reponse of the client or  company", response.data);
      return response.data;
      
    } catch (error) {
      console.log("Orders API error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const transformOrderData = (apiOrders) => {
  if (!apiOrders || !Array.isArray(apiOrders) || apiOrders.length === 0) {
    return [];
  }

  console.log('after',formatDate("2025-04-24T00:00:00.000Z"));

  return apiOrders.map(order => ({
    orderCode: order.qrCode,
    status: order.status,
    type: getAmountType(order.situation),
    advancedAmount: order.advancedAmount,
    label: order.situation,
    currency: order.advancedAmount ? "درهم" : null,
    customerDisplayName: order.customerDisplayName || 'عميل غير معروف',
    customerField: order.customerField,
    date: formatDate(order.deliveryDate),
    id: order._id,
    price: order.price,
    city: order.city,
    pickupDate: formatDate(order.pickupDate),
    deliveryDate: formatDate(order.deliveryDate),
    isFinished: order.isFinished,
    isPickUp: order.isPickUp,
    isToday: isToday(order.deliveryDate),
    newDate: formatDate(order.newDate),
    isDateChanged: order.isDateChanged,
    ChangeDateReason: order.ChangeDateReason,
    rawDeliveryDate:order.deliveryDate
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

const isToday = (dateString) => {
  if (!dateString) return false;
  const today = new Date();
  const date = new Date(dateString);
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
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
  },
    extraReducers: (builder) => {
      builder
        .addCase(fetchOrders.pending, (state) => {
          state.loading = true;
          state.error = null;
          console.log('Fetch orders pending');
        })
        .addCase(fetchOrders.fulfilled, (state, action) => {
          state.loading = false;
          // console.log('Fetch orders fulfilled:', action.payload);
          state.items = transformOrderData(action.payload);
        })
        .addCase(fetchOrders.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to fetch orders';
          console.log('Fetch orders rejected:', action.error);
        });
    }
    });

export const { setSearchTerm, setStatusFilter, setDateFilter, markOrderFinished, resetOrdersState } = ordersSlice.actions;

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
  


  // let result = items;
  //here i return only order with is pickup and is finised are both true
  let result = items.filter(order => !(order.isFinished === true && order.isPickUp === true));
  

  if (searchTerm) {
    result = result.filter(order => 
      order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerDisplayName.toLowerCase().includes(searchTerm.toLowerCase())
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
      result = result.filter(order => order.type === typeToFilter);
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

  if (dateFilter) {
    const filterDate = new Date(dateFilter);
    
    result = result.filter(order => {
      if (!order.date || order.date === "غير محدد") return false;
      
      const [day, month, year] = order.date.split('/').map(Number);
      const orderDate = new Date(year, month - 1, day);
      
      return orderDate.toDateString() === filterDate.toDateString();
    });
  }

  result.sort((a, b) => {
    if (a.isToday && !b.isToday) return -1;
    if (!a.isToday && b.isToday) return 1;
    
    if (a.rawDeliveryDate && b.rawDeliveryDate) {
      return new Date(a.rawDeliveryDate) - new Date(b.rawDeliveryDate);
    }
    
    if (!a.rawDeliveryDate && b.rawDeliveryDate) return 1;
    if (a.rawDeliveryDate && !b.rawDeliveryDate) return -1;
    
    return 0;
  });
  

  console.log('result here', result)
  
  return result;
};


export const HistoryOrders = state => {
  if (!state || !state.orders) {
    return [];
  }
  
  const { items, searchTerm, statusFilter, dateFilter } = state.orders;
  
  if (!items || !Array.isArray(items)) {
    return [];
  }
  


  // let result = items;
  //here i return only order with is pickup and is finised are both true
  let result = items.filter(order => (order.isFinished === true && order.isPickUp === true));
  

  if (searchTerm) {
    result = result.filter(order => 
      order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerDisplayName.toLowerCase().includes(searchTerm.toLowerCase())
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
      result = result.filter(order => order.type === typeToFilter);
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


  

  console.log('result here', result)
  
  return result;
};




export default ordersSlice.reducer;