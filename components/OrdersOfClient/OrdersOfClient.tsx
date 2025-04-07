import { View, Text } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import NoOrdersExists from '../NoOrderExists/NoOrdersExists';
import OrderCard from './OrderCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders, selectUserOrders, selectOrderLoading } from '@/store/slices/OrdersOfClient';
import { fetchOrders } from '@/store/slices/OrdersSlice';




const OrdersOfClient = ({ SearchCode }) => {
  const dispatch = useDispatch();
  
  const orders = useSelector(state => state.orders.items) || []; 
  const loading = useSelector(state => state.orders.loading); 
  
  const [searchTerm, setSearchTerm] = useState(SearchCode);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    setSearchTerm(SearchCode);
  }, [SearchCode]);

  const filteredOrders = useMemo(() => {
    if (!searchTerm) {
      return orders;
    }
    return orders.filter(order =>
      order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.CompanyName && order.CompanyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customerName && order.customerDisplayName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, orders]);

  if (loading) {
    return <View className="flex-1 justify-center items-center"><Text>Loading...</Text></View>;
  }

  if (orders.length === 0) {
    return <NoOrdersExists />;
  }

  return (
    <View className="flex-1 bg-gray-100 p-2">
      <FlashList
        showsVerticalScrollIndicator={false}
        data={orders}
        renderItem={({ item }) => <OrderCard item={item} />}
        keyExtractor={item => item.orderCode}
        ListFooterComponent={<View style={{ height: 800 }} />}
        estimatedItemSize={200}
      />
    </View>
  );
};

export default OrdersOfClient;