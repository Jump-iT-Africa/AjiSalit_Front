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
import AjiSalit from "@/assets/images/coloredLogo.png";
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
import {setCurrentOrder} from '@/store/slices/OrdersManagment'
import { finishButtonPressed } from '@/store/slices/OrderDetailsSlice';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateOrderDate } from '@/store/slices/OrdersManagment';
import NoSearchResult from '@/assets/images/NoSearchResult.png'



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
  const pickupButtonClicked = useSelector(state => state.buttons.pickupButtonClicked);
  const isPickedUp = pickupButtonClicked;
  const allOrders = useSelector(state => state.orders.orders);
  const searchTerm = useSelector(state => state.orders.searchTerm);
 
  console.log('search code', SearchCode);
  

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
        })
        .catch(err => {
          setOrdersLoaded(true);
        });
    } else {
      console.log("User is not authenticated, cannot fetch orders");
      setOrdersLoaded(true); 
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

  
  const handleItemPress = async (item) => {
    console.log('items pressed',item);
    try {
      const saved = await AsyncStorage.setItem('lastScannedOrder', JSON.stringify(item));
      console.log('this is saved data', saved);
      
    } catch (storageError) {
      console.log("Failed to store order in AsyncStorage:", storageError);
    }
    // dispatch(setCurrentOrder(item));
    router.push('/DetailsPage');
  };


  const OrderItem = ({ item }) => {


    

    // console.log('this is item', item);
    
    const [localFinished, setLocalFinished] = useState(item.isFinished);
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

    useEffect(() => {
      setLocalFinished(item.isFinished);
    }, [item.isFinished]);
  
    const handleConfirm = () => {
      setLocalFinished(true);
      
      dispatch(finishButtonPressed());
      dispatch(markOrderFinished(item.id));
      dispatch(updateOrderDate({
        orderId: item.id,
        dateData: {
          isFinished: true
        } 
      }));
      
      setShowModal(false);
      
      setTimeout(() => {
        dispatch(fetchOrders());
      }, 500);
    };

    const borderStyle = item.isToday 
    ? "bg-white rounded-3xl p-4 mb-3 border-2 border-[#FD8900] flex-row-reverse justify-between items-center border" 
    : "bg-white rounded-3xl p-4 mb-3 border border-[#295f2b] flex-row-reverse justify-between items-center ";

    return (
      <View>
        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={() => handleItemPress(item)}
          style={{ width: '100%' }}>
          <View className={borderStyle}>
            <View>
              <View className="flex flex-row-reverse justify-between items-center mb-1">
                <View className="flex flex-row-reverse items-center">
                  <Text className="text-black mr-2 font-tajawalregular text-[14px]">رمز الطلب:</Text>
                  <Text className="font-bold text-[#295f2b]">{item.orderCode}</Text>
                </View>
              </View>
              <View className='w-full flex-row-reverse items-center mb-1'>
                <Text className="text-black mr-2 font-tajawalregular text-[14px] ml-1">المبلغ:</Text>
                <View className={`px-2 py-0 rounded-full w-auto text-start flex flex-row ${getStatusColor(item.type)}`}>
                  {item.value !== null && (
                    <Text className="font-bold text-white font-tajawalregular text-[9px] flex flex-row-reverse">
                      {item.advancedAmount} {item.currency}
                    </Text>
                  )}
                  <Text className="text-white text-[9px] font-medium font-tajawalregular">
                    {item.label}
                  </Text>
                </View>
              </View>
              <View className="flex flex-row-reverse justify-between">
                <View className="flex flex-col items-end">
                  <View className='flex-row-reverse mb-1 gap-1'>
                    <Text className="text-black mr-2 font-tajawalregular text-[14px]">صاحب(ة) الطلب:</Text>
                    <Text className="text-gray-900 font-tajawalregular text-[#295f2b]">{item.customerDisplayName}</Text>
                  </View>
                  <View className='flex flex-row gap-1 mr-2'>
                    <Text className="text-black">{item.newDate === 'غير محدد' ? item.date : item.newDate}</Text>
                    <AntDesign name="calendar" size={15} color="#F52525" />
                  </View>
                </View>
              </View>
            </View>
            <Pressable 
            onPress={() => !localFinished && setShowModal(true)}
            disabled={localFinished}
          >
            <Image 
              source={AjiSalit}
              style={{
                width: 30,
                height: 30,
                // Use localFinished for immediate visual feedback
                tintColor: localFinished ? undefined : 'gray',
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
    return <OrderItem key={`${item.id}-${item.isFinished}`} item={item} />;
  }, []);

  if (loading && !refreshing && !ordersLoaded) {
    return (
      <View className='flex-1'>
        <ActivityIndicator size="large" color="#2e752f" />
        <Text className="text-center p-4 font-tajawalregular">جاري تحميل الطلبات...</Text>
      </View>
    );
  }

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

  const hasOrders = Array.isArray(allOrders) && allOrders.length > 0;
  const hasFilteredResults = Array.isArray(filteredOrders) && filteredOrders.length > 0;
  const isSearchActive = searchTerm && searchTerm.trim() !== '';

  if (ordersLoaded && hasOrders && !hasFilteredResults && isSearchActive) {
    return (
      <View className="flex-1 items-center justify-center">
        <View className="w-80 h-80">
          <Image 
            source={NoSearchResult}
            resizeMode="contain"
            className="w-full h-full"
          />
        </View>
        <View>
          <Text className="font-tajawal text-xl mt-8 text-center">
            لا توجد أي نتائج!
          </Text>
        </View>
      </View>
    );
  }

  if (Array.isArray(filteredOrders) && filteredOrders.length === 0) {
    console.log("No orders found, showing NoOrdersExists component");
    return (
      <SafeAreaView className="flex-1 bg-gray-100 ">
        <NoOrdersExists />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-4 pb-10">
      <FlashList
        data={filteredOrders || []}
        renderItem={renderOrder}
        estimatedItemSize={200}
        extraData={filteredOrders.map(order => order.isFinished).join(',')}
        keyExtractor={item => `${item.id}-${item.isFinished ? 'finished' : 'unfinished'}`}
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
    shadowColor: 'red',
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