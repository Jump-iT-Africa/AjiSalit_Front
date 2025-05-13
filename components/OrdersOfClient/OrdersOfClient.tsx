import { View, Text, ActivityIndicator, RefreshControl, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import NoOrdersExists from '../NoOrderExists/NoOrdersExists';
import OrderCard from './OrderCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, selectFilteredOrders } from '@/store/slices/OrdersSlice';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const OrdersOfClient = ({ SearchCode }) => {
  const dispatch = useDispatch();
  
  // Use the selectFilteredOrders selector to get only active orders
  const filteredOrders = useSelector(selectFilteredOrders);
  const loading = useSelector(state => state.orders.loading);
  const error = useSelector(state => state.orders.error);
  const isAuthenticated = useSelector(state => state.user?.isAuthenticated);
  const token = useSelector(state => state.user?.token);
  
  const [refreshing, setRefreshing] = useState(false);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(SearchCode);
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());

  console.log('Active Orders length:', filteredOrders?.length);
  console.log('Search term:', searchTerm);
  console.log('Loading state:', loading);
  console.log('Orders loaded:', ordersLoaded);
  console.log('Last refresh time:', new Date(lastRefreshTime).toLocaleTimeString());
  
  useEffect(() => {
    setSearchTerm(SearchCode);
  }, [SearchCode]);

  const fetchOrdersData = useCallback(() => {
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

  console.log('Final filtered orders count:', searchFilteredOrders?.length);

  if (loading && !refreshing && !ordersLoaded) {
    return (
      <View className=''>
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

  if (ordersLoaded && searchFilteredOrders.length === 0) {
    console.log("No active orders found, showing NoOrdersExists component");
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