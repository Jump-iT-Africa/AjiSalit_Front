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
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
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
import NoSearchResult from '@/assets/images/NoSearchResult.png';
import { convertToFrontendFormat } from '@/components/ActionSheetToAddProduct/statusMappings';

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;

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

  // Helper function to convert status and situation to Arabic
  const getDisplayText = (value, type) => {
    if (!value) return value;
    
    // Convert English backend values to Arabic display
    const arabicValue = convertToFrontendFormat(value, type);
    console.log(`Converting ${type}: ${value} -> ${arabicValue}`);
    return arabicValue || value; // Fallback to original if no conversion found
  };

  // Helper function to get status color based on situation
  const getStatusColor = (situation) => {
    switch (situation) {
      case 'paid':
      case 'خالص':
        return '#10b981'; // Green
      case 'unpaid':
      case 'غير مدفوع':
        return '#ef4444'; // Red  
      case 'prepayment':
      case 'تسبيق':
        return '#f97316'; // Orange
      default:
        return '#6b7280'; // Gray
    }
  };

  // Helper function to get status display text
  const getStatusDisplayText = (item) => {
    // Convert situation to Arabic
    const arabicSituation = getDisplayText(item.situation, 'situation');
    
    // If there's an advanced amount and it's a prepayment, show the amount
    if (item.advancedAmount && (item.situation === 'prepayment' || item.situation === 'تسبيق')) {
      return `${item.advancedAmount} ${item.currency || 'درهم'} - ${arabicSituation}`;
    }
    
    return arabicSituation;
  };

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
    router.push('/DetailsPage');
  };

  const OrderItem = ({ item }) => {
    const [localFinished, setLocalFinished] = useState(item.isFinished);
    const [showModal, setShowModal] = useState(false);

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

    // Get Arabic translation for situation only
    const arabicSituation = getDisplayText(item.label, 'situation');

    const containerStyle = {
      backgroundColor: 'white',
      borderRadius: wp('7%'),
      padding: wp('4%'),
      marginBottom: hp('1.5%'),
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: item.isToday ? 1 : 1,
      borderColor: '#295f2b'
    };

    const textBaseStyle = {
      fontFamily: 'TajawalRegular',
      fontSize: wp('3.5%')
    };

    const labelTextStyle = {
      ...textBaseStyle,
      color: 'black',
      marginRight: wp('2%'),
      fontFamily: 'TajawalRegular',
      fontSize: wp('3.4%')
    };

    const valueTextStyle = {
      ...textBaseStyle,
      color: '#295f2b'
    };

    const statusStyle = {
      paddingHorizontal: wp('2%'),
      paddingVertical: hp('0.3%'),
      borderRadius: wp('10%'),
      flexDirection: 'row'
    };

    const statusTextStyle = {
      color: 'white',
      fontSize: wp('2.2%'),
      fontFamily: 'TajawalRegular'
    };

    const dateTextStyle = {
      ...textBaseStyle,
      color: 'black',
      fontSize: wp('2.6%')
    };

    return (
      <View>
        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={() => handleItemPress(item)}
          style={{ width: '100%' }}>
          <View style={containerStyle}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp('0.5%') }}>
                <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                  <Text style={labelTextStyle}>رمز الطلب:</Text>
                  <Text style={valueTextStyle}>{item.qrCode || item.orderCode}</Text>
                </View>
              </View>
              <View style={{ width: '100%', flexDirection: 'row-reverse', alignItems: 'center', marginBottom: hp('0.5%') }}>
                <Text style={labelTextStyle}>الحالة:</Text>
                <View className='flex space-x-1' style={[statusStyle, { backgroundColor: item.type === 'paid' ? '#10b981' : item.type === 'unpaid' ? '#ef4444' : item.type === 'installment' ? '#f97316' : '#6b7280' }]}>
                  {item.advancedAmount && (
                    <Text style={[statusTextStyle, ]}>
                      {item.advancedAmount} {item.currency || 'درهم'} 
                    </Text>
                  )}

                  <Text style={statusTextStyle}>
                    {arabicSituation || item.situation || 'غير محدد'}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'column', alignItems: 'flex-end', justifyContent:'center'}}>
                  <View style={{ flexDirection: 'row-reverse', marginBottom: hp('0.5%'), gap: wp('0.5%') }}>
                    <Text style={labelTextStyle}>صاحب(ة) الطلب:</Text>
                    <Text style={[valueTextStyle, { color: '#295f2b' }]}>
                      {item.clientId?.Fname || 'عميل غير معروف'}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: wp('0.5%'), marginRight: wp('2%') , justifyContent:'center', alignItems:'center'}}>
                    <Text style={dateTextStyle}>
                      {item.newDate === 'غير محدد' ? item.deliveryDate || item.date : item.newDate}
                    </Text>
                    <AntDesign name="calendar" size={wp('3.5%')} color="#F52525" />
                  </View>
                </View>
              </View>
            </View>
            <Pressable 
              onPress={() => !localFinished && setShowModal(true)}
              disabled={localFinished}
              style={{ paddingLeft: wp('2%') }}
            >
              <Image 
                source={AjiSalit}
                style={{
                  width: wp('7%'),
                  height: wp('7%'),
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
              <Text style={[styles.modalText, { fontFamily: 'TajawalRegular' }]}>
                هل أنت متأكد من أنك تريد تأكيد اكتمال هذا الطلب؟
              </Text>
              <View style={styles.buttonContainer}>
                <Pressable
                  style={[styles.button, styles.buttonConfirm]}
                  onPress={handleConfirm}
                >
                  <Text style={[styles.textStyle, { fontFamily: 'Tajawal' }]}>نعم</Text>
                </Pressable>
                
                <Pressable
                  style={[styles.button, styles.buttonCancel]}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={[styles.textStyle, { fontFamily: 'Tajawal' }]}>إلغاء</Text>
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2e752f" />
        <Text style={{ textAlign: 'center', padding: wp('4%'), fontFamily: 'TajawalRegular', fontSize: wp('4%') }}>
          جاري تحميل الطلبات...
        </Text>
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <SafeAreaView >
        <NoOrdersExists />
      </SafeAreaView>
    );
  }
  
  if (Array.isArray(filteredOrders) && filteredOrders.length === 0) {
    return (
      <SafeAreaView >
        <NoOrdersExists />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: '#f3f4f6', 
      padding: wp('0%'),
      paddingBottom: hp('5%')
    }}>
      <FlashList
        data={filteredOrders || []} 
        renderItem={renderOrder}
        estimatedItemSize={wp('50%')}
        extraData={filteredOrders.map(order => order.isFinished).join(',')}
        keyExtractor={item => `${item.id}-${item.isFinished ? 'finished' : 'unfinished'}`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: hp('100%') }} />}
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
    margin: wp('5%'),
    backgroundColor: 'white',
    borderRadius: wp('5%'),
    padding: wp('9%'),
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
    gap: wp('2.5%'),
    marginTop: hp('2.5%')
  },
  button: {
    borderRadius: wp('2.5%'),
    padding: wp('2.5%'),
    elevation: 2,
    minWidth: wp('20%'),
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
    textAlign: 'center',
    fontSize: wp('3.8%')
  },
  modalText: {  
    marginBottom: hp('2%'),
    textAlign: 'center',
    fontSize: wp('4.2%'),
  }
});

export default OrdersOfCompany;