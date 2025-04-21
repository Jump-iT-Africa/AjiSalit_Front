import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchOrderByQrCodeOrId, 
  selectOrderLoading, 
  selectOrderError, 
  selectUserOrders, 
  selectCurrentOrder 
} from '@/store/slices/OrdersManagment';
import ClientOrderCards from '@/components/DetialsPage/Client/ClientOrderCards';
import NoOrdersExists from '@/components/NoOrderExists/NoOrdersExists';

export default function OrderDetailsScreen() {

  const params = useLocalSearchParams();
  const qrCode = params.qrCode;
  const orderId = params.orderId;

  console.log(qrCode);
  console.log(orderId);
  
  console.log("OrderDetailsScreen params:", params);
  
  const dispatch = useDispatch();
  const loading = useSelector(selectOrderLoading);
  const error = useSelector(selectOrderError);
  const orders = useSelector(selectUserOrders);
  const currentOrder = useSelector(selectCurrentOrder);
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (params.qrCode) {
        await dispatch(fetchOrderByQrCodeOrId(params.qrCode));
      }
    };
    
    if (!currentOrder && (params.orderId || params.qrCode)) {
      fetchOrderDetails();
    }
  }, [params, dispatch, currentOrder]);

  const orderToDisplay = currentOrder || (orders && orders.find(order => {
    if (orderId && (order._id === orderId || order.id === orderId)) {
      return true;
    }
    
    if (qrCode && 
        ((order.qrCode && order.qrCode.toLowerCase() === qrCode.toLowerCase()) || 
        (order.orderCode && order.orderCode.toLowerCase() === qrCode.toLowerCase()))
    ) {
      return true;
    }
    
    return false;
  })) || null;

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>جاري تحميل تفاصيل الطلب...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (!orderToDisplay) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>تفاصيل الطلب</Text>
        <Text style={styles.orderCode}>رمز الطلب: {qrCode || "غير معروف"}</Text>
        <NoOrdersExists />
      </SafeAreaView>
    );
  }

  // Get the QR code from the order, handling both field names
  const displayQrCode = orderToDisplay.qrCode || orderToDisplay.orderCode || qrCode || "غير معروف";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>تفاصيل الطلب</Text>
        <Text style={styles.orderCode}>رمز الطلب: {displayQrCode}</Text>
        
        {/* Display the order using your ClientOrderCards component */}
        <ClientOrderCards item={orderToDisplay} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
  },
  orderCode: {
    fontSize: 16,
    color: '#666',
    paddingHorizontal: 16,
    paddingBottom: 16,
    textAlign: 'center',
  }
});