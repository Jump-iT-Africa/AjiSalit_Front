import { View, Text, ActivityIndicator, RefreshControl, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import NoOrdersExists from '../NoOrderExists/NoOrdersExists';
import OrderCard from './OrderCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '@/store/slices/OrdersSlice';
import FontAwesome from '@expo/vector-icons/FontAwesome';


const OrdersOfClient = ({ SearchCode }) => {
  const dispatch = useDispatch();
  
  const orders = useSelector(state => state.orders.items) || [];
  const loading = useSelector(state => state.orders.loading);
  const error = useSelector(state => state.orders.error);
  const isAuthenticated = useSelector(state => state.user?.isAuthenticated);
  const token = useSelector(state => state.user?.token);
  
  const [refreshing, setRefreshing] = useState(false);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(SearchCode);
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());

  console.log('Orders length:', orders?.length);
  console.log('Search term:', searchTerm);
  console.log('Loading state:', loading);
  console.log('Orders loaded:', ordersLoaded);
  console.log('Last refresh time:', new Date(lastRefreshTime).toLocaleTimeString());

  console.log('all orders if cluent', orders);
  
  useEffect(() => {
    setSearchTerm(SearchCode);
  }, [SearchCode]);

  const fetchOrdersData = useCallback(() => {
    // Flag to track whether this is a refresh or initial load
    const isRefreshing = ordersLoaded;
    
    if (isRefreshing) {
      setRefreshing(true);
    }
    
    console.log(`${isRefreshing ? 'Refreshing' : 'Initially fetching'} orders...`);
    
    const authCheck = isAuthenticated !== undefined ? (isAuthenticated && token) : true;
    
    if (authCheck) {
      return dispatch(fetchOrders())
        .then(response => {
          setOrdersLoaded(true);
          setLastRefreshTime(Date.now());
          if (isRefreshing) setRefreshing(false);
          return response;
        })
        .catch(err => {
          console.log("Error fetching orders:", err);
          setOrdersLoaded(true);
          if (isRefreshing) setRefreshing(false);
          throw err;
        });
    } else {
      console.log("Authentication required but user not authenticated");
      setOrdersLoaded(true);
      if (isRefreshing) setRefreshing(false);
      return Promise.reject("User not authenticated");
    }
  }, [dispatch, isAuthenticated, token, ordersLoaded]);


  useEffect(() => {
    fetchOrdersData();
  }, [fetchOrdersData]);

  const onRefresh = useCallback(() => {
    console.log("Manual refresh triggered");
    fetchOrdersData();
  }, [fetchOrdersData]);

  const filteredOrders = useMemo(() => {
    if (!searchTerm) {
      return orders;
    }
    return orders.filter(order =>
      order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.CompanyName && order.CompanyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customerName && order.customerDisplayName?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, orders]);


  console.log('whole orders again', filteredOrders);
  

  if (loading && !refreshing && !ordersLoaded) {
    return (
      <View className='flex-1 justify-center items-center'>
        <ActivityIndicator size="large" color="#2e752f" />
        <Text className="text-center p-4 font-tajawalregular">جاري تحميل الطلبات...</Text>
      </View>
    );
  }

  if (error && !refreshing) {
 
    return (
      <SafeAreaView className="flex-1 bg-gray-100 ">
        <NoOrdersExists />
      </SafeAreaView>
    );
  }

  if (ordersLoaded && filteredOrders.length === 0) {
    console.log("No orders found, showing NoOrdersExists component");
    return (
      <SafeAreaView className="flex-1">
        <NoOrdersExists />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-2">
      <FlashList
        showsVerticalScrollIndicator={false}
        data={filteredOrders}
        renderItem={({ item }) => <OrderCard item={item} />}
        keyExtractor={item => item.orderCode}
        ListFooterComponent={<View style={{ height: 800 }} />}
        estimatedItemSize={200}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={["#2e752f"]}
            tintColor="#2e752f"
          />
        }
      />
    </SafeAreaView>
  );
};

export default OrdersOfClient;