import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';




const API_URL = 'https://api.ajisalit.com';

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('No authentication token available');
      }
      
      const UserId = await AsyncStorage.getItem('userId');

      console.log('these are user info', UserId);
      if (!UserId) {
        return rejectWithValue('User data not available');
      }
      
      const userRole = await AsyncStorage.getItem('user');
      const role =  JSON.parse(userRole);

      console.log('role is', role.role);

      const response = await axios.get(`${API_URL}/order`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data === "ماكين حتا طلب" || !Array.isArray(response.data)) {
        return []; 
      }

      let items = response.data;
      let result = items.filter(items => !(items.isFinished === true && items.isPickUp === true));
      
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
  console.log('Order companyId:', apiOrders);

  console.log('after',formatDate("2025-04-24T00:00:00.000Z"));

  return apiOrders.map(order => ({
    orderCode: order.qrCode,
    status: order.status,
    clientId:{
      Fname: order?.clientId?.Fname || 'عميل غير معروف',
    },
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
    isTomorrow: isTomorrow(order.deliveryDate),
    isExpired: isExpired(order.deliveryDate),
    newDate: formatDate(order.newDate),
    isDateChanged: order.isDateChanged,
    IsConfirmedByClient: order.IsConfirmedByClient,
    ChangeDateReason: order.ChangeDateReason,
    rawDeliveryDate: order.deliveryDate,
    companyId:{
      companyName: order.companyId.companyName,
      field: order.companyId.field
    },
    images: order.images
  }));
};

const getAmountType = (situation) => {
  switch (situation) {
    case 'paid':
      return 'paid';
    case 'unpaid':
      return 'unpaid';
    case 'prepayment':
      return 'installment';
    default:
      return 'unknown';
  }
};

// Helper function to check if date is today
const isToday = (dateString) => {
  if (!dateString) return false;
  const today = new Date();
  const date = new Date(dateString);
  
  // Reset time to compare only dates
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  
  return date.getTime() === today.getTime();
};

// Helper function to check if date is tomorrow or later
const isTomorrow = (dateString) => {
  if (!dateString) return false;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  
  return date.getTime() >= tomorrow.getTime();
};

// Helper function to check if date is expired (yesterday or before)
const isExpired = (dateString) => {
  if (!dateString) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(23, 59, 59, 999); // End of yesterday
  
  const date = new Date(dateString);
  
  return date.getTime() <= yesterday.getTime();
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
    dateFilter: null,
    tabFilter: 'all' 
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
    setTabFilter: (state, action) => {
      state.tabFilter = action.payload;
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
        
        state.items = transformOrderData(action.payload);

        AsyncStorage.setItem('cachedOrders', JSON.stringify(transformOrderData(action.payload)));
        AsyncStorage.setItem('lastOrdersFetchTime', new Date().toISOString());
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch orders';
        console.log('Fetch orders rejected:', action.error);
      });
  }
});

export const { setSearchTerm, setStatusFilter, setDateFilter, markOrderFinished, resetOrdersState,setTabFilter } = ordersSlice.actions;

export const selectAllOrders = state => state?.orders?.items || [];
export const selectOrdersLoading = state => state?.orders?.loading || false;
export const selectOrdersError = state => state?.orders?.error || null;
export const selectSearchTerm = state => state?.orders?.searchTerm || '';
export const selectStatusFilter = state => state?.orders?.statusFilter || null;
export const selectDateFilter = state => state?.orders?.dateFilter || null;
export const selectTabFilter = state => state?.orders?.tabFilter || 'all';

const getOrderItems = state => state?.orders?.items || [];
const getSearchTerm = state => state?.orders?.searchTerm || '';
const getStatusFilter = state => state?.orders?.statusFilter || null;
const getDateFilter = state => state?.orders?.dateFilter || null;
const getTabFilter = state => state?.orders?.tabFilter || 'all';

export const selectFilteredOrders = createSelector(
  [getOrderItems, getSearchTerm, getStatusFilter, getDateFilter, getTabFilter],
  (items, searchTerm, statusFilter, dateFilter, tabFilter) => {
    if (!items || !Array.isArray(items)) {
      return [];
    }
    
    console.log('🔍 SELECTOR DEBUG - Total items:', items.length);
    console.log('🔍 SELECTOR DEBUG - Tab filter:', tabFilter);
    console.log('🔍 SELECTOR DEBUG - tabFilter type:', typeof tabFilter);
    
    // Helper functions to recalculate dates in real-time
    const isOrderToday = (order) => {
      if (!order.rawDeliveryDate && !order.deliveryDate) return false;
      const today = new Date();
      const orderDate = new Date(order.rawDeliveryDate || order.deliveryDate);
      
      today.setHours(0, 0, 0, 0);
      orderDate.setHours(0, 0, 0, 0);
      
      return orderDate.getTime() === today.getTime();
    };
    
    const isOrderTomorrow = (order) => {
      if (!order.rawDeliveryDate && !order.deliveryDate) return false;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const orderDate = new Date(order.rawDeliveryDate || order.deliveryDate);
      orderDate.setHours(0, 0, 0, 0);
      
      return orderDate.getTime() >= tomorrow.getTime();
    };
    
    const isOrderExpired = (order) => {
      if (!order.rawDeliveryDate && !order.deliveryDate) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const orderDate = new Date(order.rawDeliveryDate || order.deliveryDate);
      orderDate.setHours(0, 0, 0, 0);
      
      const isExpired = orderDate.getTime() < today.getTime();
      return isExpired;
    };
    
    let result = [];
    
    // 🚨 IMPORTANT: Check what happens when tabFilter is undefined or null
    console.log('🔍 SELECTOR DEBUG - Checking tabFilter value...');
    
    // Check if tabFilter is undefined/null/empty - this might be the issue!
    if (!tabFilter || tabFilter === '' || tabFilter === null || tabFilter === undefined) {
      console.log('🚨 TAB FILTER IS EMPTY/NULL/UNDEFINED - Using default behavior');
      console.log('🚨 This might be why you see different results on refresh vs navigation');
      
      // Default behavior when no tab filter is set - show all active orders
      result = items.filter(order => !(order.isFinished === true && order.isPickUp === true));
      console.log('🚨 DEFAULT: Showing all active orders:', result.length);
    } else {
      console.log('✅ TAB FILTER IS SET:', tabFilter);
      
      switch (tabFilter) {
        case 'all': 
          result = items.filter(order => 
            isOrderTomorrow(order) && !(order.isFinished === true && order.isPickUp === true)
          );
          console.log('📅 ALL TAB: Tomorrow orders:', result.length);
          break;
          
        case 'today':
          result = items.filter(order => 
            isOrderToday(order) && !(order.isFinished === true && order.isPickUp === true)
          );
          console.log('📅 TODAY TAB: Today orders:', result.length);
          break;
          
        case 'completed':
        case 'late':
        case 'overdue':
          result = items.filter(order => 
            isOrderExpired(order) && !(order.isFinished === true && order.isPickUp === true)
          );
          console.log('⏰ COMPLETED TAB: Expired orders:', result.length);
          
          // Extra debugging for completed tab
          const allActiveOrders = items.filter(order => !(order.isFinished === true && order.isPickUp === true));
          console.log('🔍 COMPLETED TAB DEBUG:', {
            totalActiveOrders: allActiveOrders.length,
            expiredOrders: result.length,
            sampleActiveOrders: allActiveOrders.slice(0, 3).map(o => ({
              orderCode: o.orderCode,
              deliveryDate: o.rawDeliveryDate || o.deliveryDate,
              isExpiredCached: o.isExpired,
              isExpiredRealTime: isOrderExpired(o),
              isToday: isOrderToday(o),
              isTomorrow: isOrderTomorrow(o)
            }))
          });
          break;
          
        default:
          console.log('🚨 UNKNOWN TAB FILTER:', tabFilter);
          result = items.filter(order => !(order.isFinished === true && order.isPickUp === true));
      }
    }
    
    console.log('SELECTOR DEBUG - After tab filter (' + tabFilter + '):', result.length);
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(order => 
        order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerDisplayName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('SELECTOR DEBUG - After search filter:', result.length);
    }
    
    // Apply status filter
    if (statusFilter) {
      let typeToFilter;
      
      switch(statusFilter) {
        case 'paid':
          typeToFilter = 'paid';
          break;
        case 'unpaid':
          typeToFilter = 'unpaid';
          break;
        case 'prepayment':
          typeToFilter = 'installment';
          break;
        default:
          typeToFilter = null;
      }
      
      if (typeToFilter) {
        result = result.filter(order => order.type === typeToFilter);
        console.log('SELECTOR DEBUG - After status filter:', result.length);
      }
    }
    
    // Apply date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      
      result = result.filter(order => {
        if (!order.date || order.date === "غير محدد") return false;
        
        const [day, month, year] = order.date.split('/').map(Number);
        const orderDate = new Date(year, month - 1, day);
        
        return orderDate.toDateString() === filterDate.toDateString();
      });
      console.log('SELECTOR DEBUG - After date filter:', result.length);
    }

    // Sort results
    if (tabFilter === 'completed') {
      // Sort expired orders by date (oldest first)
      result.sort((a, b) => {
        if (a.rawDeliveryDate && b.rawDeliveryDate) {
          return new Date(a.rawDeliveryDate) - new Date(b.rawDeliveryDate);
        }
        return 0;
      });
    } else {
      // Sort other tabs by delivery date (earliest first)
      result.sort((a, b) => {
        if (a.rawDeliveryDate && b.rawDeliveryDate) {
          return new Date(a.rawDeliveryDate) - new Date(b.rawDeliveryDate);
        }
        
        if (!a.rawDeliveryDate && b.rawDeliveryDate) return 1;
        if (a.rawDeliveryDate && !b.rawDeliveryDate) return -1;
        
        return 0;
      });
    }
    
    console.log(`SELECTOR DEBUG - Final filtered orders for tab "${tabFilter}":`, result.length);
    
    // Debug: Log details of each order in completed tab
    if (tabFilter === 'completed') {
      result.forEach(order => {
        console.log('COMPLETED ORDER:', {
          orderCode: order.orderCode,
          deliveryDate: order.date,
          rawDeliveryDate: order.rawDeliveryDate,
          isExpired: order.isExpired,
          isToday: order.isToday,
          isTomorrow: order.isTomorrow,
          isFinished: order.isFinished,
          isPickUp: order.isPickUp
        });
      });
    }
    
    return result;
  }
);

export const selectFilteredExpiredOrdersCount = createSelector(
  [getOrderItems, getSearchTerm, getStatusFilter, getDateFilter],
  (items, searchTerm, statusFilter, dateFilter) => {
    if (!items || !Array.isArray(items)) {
      return 0;
    }
    
    // Start with expired orders that are not finished and picked up
    let result = items.filter(order => 
      order.isExpired && !(order.isFinished === true && order.isPickUp === true)
    );
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(order => 
        order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerDisplayName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      let typeToFilter;
      
      switch(statusFilter) {
        case 'paid':
          typeToFilter = 'paid';
          break;
        case 'unpaid':
          typeToFilter = 'unpaid';
          break;
        case 'prepayment':
          typeToFilter = 'installment';
          break;
        default:
          typeToFilter = null;
      }
      
      if (typeToFilter) {
        result = result.filter(order => order.type === typeToFilter);
      }
    }
    
    // Apply date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      
      result = result.filter(order => {
        if (!order.date || order.date === "غير محدد") return false;
        
        const [day, month, year] = order.date.split('/').map(Number);
        const orderDate = new Date(year, month - 1, day);
        
        return orderDate.toDateString() === filterDate.toDateString();
      });
    }
    
    return result.length;
  }
);

export const selectExpiredOrders = createSelector(
  [getOrderItems],
  (items) => {
    if (!items || !Array.isArray(items)) {
      return [];
    }
    
    return items.filter(order => 
      order.isExpired && !(order.isFinished === true && order.isPickUp === true)
    );
  }
);

export const selectClientOrders = createSelector(
  [getOrderItems, getSearchTerm, getStatusFilter],
  (items, searchTerm, statusFilter) => {
    if (!items || !Array.isArray(items)) {
      return [];
    }
    
    console.log('CLIENT SELECTOR - Raw items count:', items.length);
    

    let result = items.filter(order => 
      !(order.isFinished === true && order.isPickUp === true)
    );
    
    console.log('CLIENT SELECTOR - After basic filter:', result.length);
    
    if (searchTerm) {
      result = result.filter(order => 
        order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerDisplayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.companyId?.companyName && order.companyId.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      console.log('CLIENT SELECTOR - After search filter:', result.length);
    }
    
    if (statusFilter) {
      let typeToFilter;
      
      switch(statusFilter) {
        case 'paid':
          typeToFilter = 'paid';
          break;
        case 'unpaid':
          typeToFilter = 'unpaid';
          break;
        case 'prepayment':
          typeToFilter = 'installment';
          break;
        default:
          typeToFilter = null;
      }
      
      if (typeToFilter) {
        result = result.filter(order => order.type === typeToFilter);
        console.log('CLIENT SELECTOR - After status filter:', result.length);
      }
    }
    
    result.sort((a, b) => {
      if (a.rawDeliveryDate && b.rawDeliveryDate) {
        return new Date(a.rawDeliveryDate) - new Date(b.rawDeliveryDate);
      }
      
      if (!a.rawDeliveryDate && b.rawDeliveryDate) return 1;
      if (a.rawDeliveryDate && !b.rawDeliveryDate) return -1;
      
      return 0;
    });
    
    console.log('CLIENT SELECTOR - Final result count:', result.length);
    return result;
  }
);

export const HistoryOrders = createSelector(
  [getOrderItems, getSearchTerm, getStatusFilter, getDateFilter],
  (items, searchTerm, statusFilter, dateFilter) => {
    if (!items || !Array.isArray(items)) {
      return [];
    }
    
    // Only show completed orders (finished and picked up)
    let result = items.filter(order => (order.isFinished === true && order.isPickUp === true));
    console.log('this is filtered data', result);
    
    if (searchTerm) {
      result = result.filter(order => 
        order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerDisplayName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter) {
      let typeToFilter;
      
      switch(statusFilter) {
        case 'paid':
          typeToFilter = 'paid';
          break;
        case 'unpaid':
          typeToFilter = 'unpaid';
          break;
        case 'prepayment':
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
    
    return result;
  }
);

export default ordersSlice.reducer;