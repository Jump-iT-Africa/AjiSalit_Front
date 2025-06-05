import { View, Text, ActivityIndicator, RefreshControl, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import NoOrdersExists from '../NoOrderExists/NoOrdersExists';
import OrderCard from './OrderCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, selectClientOrders } from '@/store/slices/OrdersSlice';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrdersOfClient = ({ SearchCode }) => {
  const dispatch = useDispatch();
  
  const filteredOrders = useSelector(selectClientOrders);
  const loading = useSelector(state => state.orders.loading);
  const error = useSelector(state => state.orders.error);
  const isAuthenticated = useSelector(state => state.user?.isAuthenticated);
  const token = useSelector(state => state.user?.token);
  
  const [refreshing, setRefreshing] = useState(false);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(SearchCode);
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());

  console.log('CLIENT - Active Orders length:', filteredOrders?.length);
  console.log('CLIENT - Search term:', searchTerm);
  console.log('CLIENT - Loading state:', loading);
  console.log('CLIENT - Orders loaded:', ordersLoaded);
  console.log('CLIENT - Last refresh time:', new Date(lastRefreshTime).toLocaleTimeString());

  // Handle refresh when returning from scanner or details page
  useFocusEffect(
    useCallback(() => {
      const checkRefreshFlag = async () => {
        try {
          const shouldRefresh = await AsyncStorage.getItem('REFRESH_ORDERS_ON_RETURN');
          console.log('CLIENT - Refresh flag value:', shouldRefresh);
          
          if (shouldRefresh === 'true') {
            console.log("CLIENT - Screen focused with refresh flag, fetching orders...");
            await fetchOrdersData();
            await AsyncStorage.setItem('REFRESH_ORDERS_ON_RETURN', 'false');
          } else {
            // Even if no refresh flag, fetch orders if we don't have any loaded yet
            if (!ordersLoaded || filteredOrders.length === 0) {
              console.log("CLIENT - No orders loaded yet, fetching...");
              await fetchOrdersData();
            }
          }
        } catch (error) {
          console.log("CLIENT - Error checking refresh flag:", error);
        }
      };
      
      checkRefreshFlag();
      
      return () => {
        // Cleanup if needed
      };
    }, [ordersLoaded, filteredOrders.length])
  );

  // Update search term when SearchCode prop changes
  useEffect(() => {
    setSearchTerm(SearchCode);
  }, [SearchCode]);

  const fetchOrdersData = useCallback(async () => {
    const isRefreshing = ordersLoaded;
    
    if (isRefreshing) {
      setRefreshing(true);
    }
    
    console.log(`CLIENT - ${isRefreshing ? 'Refreshing' : 'Initially fetching'} orders...`);
    
    const authCheck = isAuthenticated !== undefined ? (isAuthenticated && token) : true;
    
    if (authCheck) {
      try {
        const response = await dispatch(fetchOrders());
        console.log('CLIENT - Orders fetch response:', response);
        
        setOrdersLoaded(true);
        setLastRefreshTime(Date.now());
        if (isRefreshing) setRefreshing(false);
        
        return response;
      } catch (err) {
        console.log("CLIENT - Error fetching orders:", err);
        setOrdersLoaded(true);
        if (isRefreshing) setRefreshing(false);
        throw err;
      }
    } else {
      console.log("CLIENT - Authentication required but user not authenticated");
      setOrdersLoaded(true);
      if (isRefreshing) setRefreshing(false);
      return Promise.reject("User not authenticated");
    }
  }, [dispatch, isAuthenticated, token, ordersLoaded]);

  // Initial fetch when component mounts
  useEffect(() => {
    if (!ordersLoaded) {
      console.log('CLIENT - Component mounted, fetching orders...');
      fetchOrdersData();
    }
  }, []);

  const onRefresh = useCallback(() => {
    console.log("CLIENT - Manual refresh triggered");
    fetchOrdersData();
  }, [fetchOrdersData]);

  const searchFilteredOrders = useMemo(() => {
    if (!searchTerm) {
      return filteredOrders;
    }
    return filteredOrders.filter(order =>
      order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.companyId?.companyName && order.companyId.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customerDisplayName && order.customerDisplayName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, filteredOrders]);

  console.log('CLIENT - Final filtered orders count:', searchFilteredOrders?.length);

  // Show loading only on initial load, not on refresh
  if (loading && !refreshing && !ordersLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2e752f" />
        <Text className="text-center p-4 font-tajawalregular">جاري تحميل الطلبات...</Text>
      </View>
    );
  }

  // Show error state
  if (error && !refreshing && ordersLoaded) {
    return (
      <SafeAreaView className="flex-1">
      <NoOrdersExists />
    </SafeAreaView>
    );
  }

  if (ordersLoaded && searchFilteredOrders.length === 0) {
    console.log("CLIENT - No active orders found, showing NoOrdersExists component");
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
        data={searchFilteredOrders}
        renderItem={({ item }) => <OrderCard item={item} />}
        keyExtractor={item => item.id || item.orderCode}
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