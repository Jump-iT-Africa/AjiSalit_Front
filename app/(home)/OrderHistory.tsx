import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Modal,
  ScrollView,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from "@shopify/flash-list";
import ProfileHeader from "@/components/HomeHeader/ProfileHeader";
import SearchBar, { FilterOptions } from "@/components/Search/SearchCommandsComponents";
import { HistoryOrders } from '@/store/slices/OrdersSlice';
import { useSelector } from "react-redux";
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Color from '@/constants/Colors';
import Noimages from "@/assets/images/noImages.png";
// import NoOrdersExists from "@/components/NoOrderExists/NoOrdersExists";
import NoOrdersExistsHistory from "@/components/NoOrderExists/NoOrdersExistsHistory";

const OrderDetailsModal = ({ isVisible, onClose, orderData }) => {

  console.log('This is Order Data ', orderData);

  const formatDate = (dateValue) => {
    console.log('date to be formatted', dateValue);
    
    if (typeof dateValue === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateValue)) {
      return dateValue;
    }
    
    if (dateValue instanceof Date) {
      return `${dateValue.getDate()}/${dateValue.getMonth() + 1}/${dateValue.getFullYear()}`;
    }
    
    if (typeof dateValue === 'string' && dateValue) {
      try {
        const dateObj = new Date(dateValue);
        if (!isNaN(dateObj.getTime())) { // Check if valid date
          return `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
        }
      } catch (error) {
        console.log('Error parsing date:', error);
      }
    }
    
    return ''; 
  };
  

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={{ flex: 1, backgroundColor: 'rgba(47, 117, 47, 0.48)' }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity 
          activeOpacity={1}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#F5F6F7',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: '58%',
            padding: 16
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={{ 
            width: 60, 
            height: 5, 
            backgroundColor: Color.green, 
            borderRadius: 5, 
            alignSelf: 'center',
            marginBottom: 10
          }} />

          <Text className="text-center text-[#F52525] text-[20px] font-bold mb-0 font-tajawal">
            تفاصيل الطلب
          </Text>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className='bg-white flex justify-center items-center rounded-[20px] shadow-l p-8 mx-1 mt-4'>
              <View className='flex-row-reverse gap-3 items-center'>
                <View className="flex-row items-center justify-end mb-4">
                  <Text className="text-[#000] text-[10px] font-tajawal mr-2">
                    رقم الطلب : 
                  </Text>
                  <AntDesign name="filetext1" size={20} color="#F5B225" />
                </View>
                <Text className="text-right text-[11px] font-bold mb-4 font-tajawal text-[#E23744]">
                  {orderData?.orderCode || ''}
                </Text>
              </View>
              
              <View className='flex-row-reverse gap-3 items-center'>
                <View className="flex-row items-center justify-end mb-4">
                  <Text className="text-[#000] text-[10px] font-tajawal mr-2">
                    صاحب(ة) الطلب : 
                  </Text>
                  <AntDesign name="user" size={20} color="#F5B225" />
                </View>
                <Text className="text-right text-[11px] font-bold mb-4 font-tajawal text-[#2F752F]">
                  {orderData?.clientId.Fname || ''}
                </Text>
              </View>

              <View className='flex-row-reverse gap-3 items-center'>
                <View className="flex-row items-center justify-end mb-4">
                  <Text className="text-[#000] text-[10px] font-tajawal mr-2">
                    المبلغ الإجمالي : 
                  </Text>
                  <FontAwesome name="money" size={20} color="#F5B225" />
                </View>
                <Text className="text-right text-[11px] font-bold mb-4 font-tajawal text-[#2F752F]">
                  {orderData?.price || '0'} درهم
                </Text>
              </View>

              <View className='flex-row-reverse gap-3 items-center'>
                <View className="flex-row items-center justify-end mb-4">
                  <Text className="text-[#000] text-[10px] font-tajawal mr-2">
                     التسليم تاريخ: 
                  </Text>
                  <AntDesign name="calendar" size={20} color="#F5B225" />
                </View>
                <Text className="text-right text-[11px] font-bold mb-4 font-tajawal text-[#2F752F]">
                  {formatDate(orderData?.rawDeliveryDate)}  
                </Text>
              </View>
            </View>

            {orderData?.images && orderData.images.length > 0 ? (
              <View className="mb-6">
                <SafeAreaView>
                  <ScrollView className='my-10' style={{ flex: 1 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View className="flex-row my-4">
                      {orderData.images.map((image, index) => (
                        <View key={index} className="mr-3 bg-gray-100 rounded-lg overflow-hidden w-20 h-20">
                          <Image 
                            source={{ uri: image.uri }} 
                            style={{ width: '100%', height: '100%' }} 
                            resizeMode="cover"
                          />
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                </SafeAreaView>
              </View>
            ) : (
              <View className='w-full flex items-center mt-4'>
                <Image 
                  source={Noimages}
                  resizeMode='contain'
                  className='flex items-center justify-center w-40 h-40'
                />
              </View>
            )}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default function OrderHistory() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const filteredOrders = useSelector(HistoryOrders);
  
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  
  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const renderOrderItem = ({ item }) => {
    console.log('wohoooo item', item);
    
    return (
      <View className={`mb-3 px-3 `}>
        <TouchableOpacity
          className={`bg-white rounded-2xl p-4 flex-row-reverse justify-between items-center shadow`}
          activeOpacity={0.7}
          onPress={() =>  showOrderDetails(item)
          }
        >
          <View className="flex-row-reverse items-center justify-center">
            <View className="flex-col items-end justify-center pr-4">
              <Text className={`text-base font-bold text-[#E23744] mb-2`}>{item.orderCode}</Text>
              <View className={`flex-1 items-end px-0 flex-row-reverse text-sm`}>
                <Text className='text-sm text-[#000] font-tajawalregular pt-2'>صاحب(ة) الطلب: </Text>
                <Text className={`text-base text-[#295f2b] font-semibold pb-[0.7]`}> {item?.clientId.Fname} </Text>
              </View>
            </View>
          </View>
          <View>
            <TouchableOpacity 
              className={`p-1`} 
              onPress={() => showOrderDetails(item)}
            >
              <Ionicons name="eye" size={20} color="#757575" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // if (filteredOrders.length === 0) {
  //   return (
  //     <View className={`flex-1 justify-center items-center`}>
  //       <NoOrdersExists />
  //     </View>
  //   );
  // }



  return (
    <SafeAreaView className={`flex-1 bg-gray-100 p-9 `}>
      <View className={`px-4 ${filteredOrders.length === 0 ?  "mt-0": "mb-12"} `} >
        <View>
          <ProfileHeader />
        </View>
        {/* <View className="mt-2 mb-4">
          <SearchBar 
            onSearch={(text) => {
              
            }} 
            onFilter={(filters) => {
              
            }} 
          />
        </View> */}
      </View>
    {filteredOrders.length === 0 ?
      (
        <View className={`flex-1  mt-[40%] items-center `}>
          <NoOrdersExistsHistory />
        </View>
      ):(
            <FlashList
              data={filteredOrders || []}
              renderItem={renderOrderItem}
              estimatedItemSize={100}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              showsVerticalScrollIndicator={false}
              ListFooterComponent={<View className={`h-[100px] `} />}
            />
        )}
        
      <OrderDetailsModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        orderData={selectedOrder}
      />
    </SafeAreaView>
  );
}