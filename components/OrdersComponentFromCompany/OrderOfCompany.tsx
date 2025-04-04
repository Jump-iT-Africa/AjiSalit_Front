
// @ts-nocheck
import React, { useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Image,
  Pressable,
  Modal,
  StyleSheet
} from 'react-native';
import NoOrdersExists from '../NoOrderExists/NoOrdersExists';
import AntDesign from '@expo/vector-icons/AntDesign';
import { FlashList } from "@shopify/flash-list";
import AjiSalit from "@/assets/images/logo.png";
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchOrders, 
  selectFilteredOrders, 
  selectOrdersLoading, 
  selectOrdersError,
  setSearchTerm,
  setStatusFilter,
  markOrderFinished
} from '@/store/slices/OrdersSlice';
import { finishButtonPressed } from '@/store/slices/OrderDetailsSlice';
import { useState } from 'react';

const OrdersOfCompany = ({ SearchCode, statusFilter = null }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const filteredOrders = useSelector(selectFilteredOrders);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const finishButtonClicked = useSelector(state => state.buttons.finishButtonClicked);
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const token = useSelector(state => state.user.token);
  const [refreshing, setRefreshing] = useState(false);
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  console.log('FilteredOrders length:', filteredOrders?.length);
  console.log('Search term:', SearchCode);
  console.log('Status filter:', statusFilter);
  console.log('Loading state:', loading);
  console.log('Orders loaded:', ordersLoaded);

  useEffect(() => {
    if (SearchCode !== undefined && SearchCode !== null) {
      dispatch(setSearchTerm(SearchCode));
    }
  }, [SearchCode, dispatch]);

  useEffect(() => {
    if (statusFilter !== undefined && statusFilter !== null) {
      dispatch(setStatusFilter(statusFilter));
    }
  }, [statusFilter, dispatch]);

  useEffect(() => {
    if (isAuthenticated && token) {
      console.log("User is authenticated, fetching orders");
      dispatch(fetchOrders())
        .then(() => {
          setOrdersLoaded(true);
          console.log("Orders fetched successfully");
        })
        .catch(err => {
          console.log("Error fetching orders:", err);
          setOrdersLoaded(true);
        });
    } else {
      console.log("User is not authenticated, cannot fetch orders");
    }
  }, [dispatch, isAuthenticated, token]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(fetchOrders())
      .then(() => {
        console.log("Orders refreshed");
        setRefreshing(false);
      })
      .catch(err => {
        console.log("Error refreshing orders:", err);
        setRefreshing(false);
      });
  }, [dispatch]);

  const OrderItem = ({ item }) => {
    const [isGray, setIsGray] = useState(true);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const getStatusColor = (type) => {
      switch (type) {
        case 'paid':
          return 'bg-green-500';
        case 'unpaid':
          return 'bg-red-500';
        case 'installment':
          return 'bg-orange-500';
        default:
          return 'bg-gray-500';
      }
    };

    const handleConfirm = () => {
      dispatch(finishButtonPressed());
      dispatch(markOrderFinished(item.id));
      setIsGray(!isGray);
      setIsConfirmed(true);
      setShowModal(false);
    };
  
    return (
      <View>
        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={() => {
            router.push({
              pathname: '/DetailsPage',
              params: { id: item.id }
            });
          }}
          style={{ width: '100%' }}>
          <View className="bg-white rounded-3xl p-4 mb-3 shadow-md border border-[#295f2b] flex-row-reverse justify-between items-center">
            <View>
              <View className="flex flex-row-reverse justify-between items-center mb-1">
                <View className="flex flex-row-reverse items-center">
                  <Text className="text-black mr-2 font-tajawalregular text-[14px]">رمز الطلب:</Text>
                  <Text className="font-bold text-[#295f2b]">{item.orderCode}</Text>
                </View>
              </View>
              <View className='w-full flex-row-reverse items-center mb-1'>
                <Text className="text-black mr-2 font-tajawalregular text-[14px] ml-1">المبلغ:</Text>
                <View className={`px-2 py-0 rounded-full w-auto text-start flex flex-row ${getStatusColor(item.amount.type)}`}>
                  {item.amount.value !== null && (
                    <Text className="font-bold text-white font-tajawalregular text-[9px] flex flex-row-reverse">
                      {item.amount.value} {item.amount.currency}
                    </Text>
                  )}
                  <Text className="text-white text-[9px] font-medium font-tajawalregular">
                    {item.amount.label}
                  </Text>
                </View>
              </View>
              <View className="flex flex-row-reverse justify-between">
                <View className="flex flex-col items-end">
                  <View className='flex-row-reverse mb-1 gap-1'>
                    <Text className="text-black mr-2 font-tajawalregular text-[14px]">صاحب(ة) الطلب:</Text>
                    <Text className="text-gray-900 font-tajawalregular text-[#295f2b]">{item.customerName}</Text>
                  </View>
                  <View className='flex flex-row gap-1 mr-2'>
                    <Text className="text-black">{item.date}</Text>
                    <AntDesign name="calendar" size={15} color="#F52525" />
                  </View>
                </View>
              </View>
            </View>
            <Pressable 
              onPress={() => !isConfirmed && setShowModal(true)}
              disabled={isConfirmed || item.isFinished}
            >
              <Image 
                source={AjiSalit}
                style={{
                  width: 36,
                  height: 36,
                  opacity: isConfirmed || item.isFinished ? 1 : 1,
                  tintColor: isConfirmed || item.isFinished ? 'red' : '#808080',
                }}
                resizeMode='contain'
              />
            </Pressable>
          </View>
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText} className='font-tajawalregular'>واش متأكد بغي تأكد الطلب ؟</Text>
              
              <View style={styles.buttonContainer}>
                <Pressable
                  style={[styles.button, styles.buttonConfirm]}
                  onPress={handleConfirm}
                >
                  <Text style={styles.textStyle} className='font-tajawal'>نعم</Text>
                </Pressable>
                
                <Pressable
                  style={[styles.button, styles.buttonCancel]}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={styles.textStyle} className='font-tajawal'>إلغاء</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const renderOrder = useCallback(({ item }) => {
    return <OrderItem item={item} />;
  }, []);

  // Show loading only when initially loading and not refreshing
  if (loading && !refreshing && !ordersLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  // Show error message if there's an error and not refreshing
  if (error && !refreshing) {
    const errorMessage = typeof error === 'object' 
      ? error.message || JSON.stringify(error) 
      : String(error);
      
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 mb-4">{errorMessage}</Text>
        <TouchableOpacity 
          className="bg-green-500 px-4 py-2 rounded" 
          onPress={() => dispatch(fetchOrders())}
        >
          <Text className="text-white font-medium">إعادة المحاولة</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (ordersLoaded && Array.isArray(filteredOrders) && filteredOrders.length === 0) {
    console.log("No orders found, showing NoOrdersExists component");
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <NoOrdersExists />
      </SafeAreaView>
    );
  }
  
  // Show the FlashList when we have orders
  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-4 pb-10">
      <FlashList
        data={filteredOrders || []}
        renderItem={renderOrder}
        estimatedItemSize={200}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: 800 }} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    minWidth: 80,
    alignItems: 'center'
  },
  buttonConfirm: {
    backgroundColor: '#295f2b',
  },
  buttonCancel: {
    backgroundColor: '#F52525',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
  }
});

export default OrdersOfCompany;