import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Modal,
  ScrollView,
  Image,
  Dimensions,
  Platform,
  StatusBar
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
import NoOrdersExistsHistory from "@/components/NoOrderExists/NoOrdersExistsHistory";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ImageViewer from 'react-native-image-zoom-viewer';

// Image Zoom Modal Component
const ImageZoomModal = ({ visible, onClose, images, initialIndex }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
      setIsLoading(true);
      // Give a small delay to ensure modal is fully rendered
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  }, [visible, initialIndex]);

  // Convert images array to format expected by ImageViewer
  const imageObjects = images.map((imageUrl, index) => ({
    url: imageUrl,
    // Add unique props for each image
    props: {
      resizeMode: 'contain',
      source: { uri: imageUrl }
    }
  }));

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <StatusBar hidden />
      
      {isLoading ? (
        // Loading state
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <ActivityIndicator size="large" color="white" />
          <Text style={{ color: 'white', marginTop: 10 }}>جاري تحميل الصورة...</Text>
        </View>
      ) : (
        <ImageViewer
          imageUrls={imageObjects}
          index={currentIndex}
          onSwipeDown={onClose}
          enableSwipeDown={true}
          backgroundColor="rgba(0, 0, 0, 0.95)"
          enableImageZoom={true}
          doubleClickInterval={250}
          maxOverflow={300}
          flipThreshold={80}
          swipeDownThreshold={100}
          onChange={(index) => setCurrentIndex(index)}
          loadingRender={() => (
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <ActivityIndicator size="large" color="white" />
              <Text style={{ color: 'white', marginTop: 10 }}>جاري التحميل...</Text>
            </View>
          )}
          renderHeader={(currentIndex) => (
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 100,
              zIndex: 1000,
              paddingTop: 50,
              paddingHorizontal: 20,
              backgroundColor: 'transparent',
            }}>
              <TouchableOpacity 
                style={{
                  alignSelf: 'flex-end',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: 20,
                  padding: 8,
                }}
                onPress={onClose}
              >
                <Ionicons name="close" size={30} color="white" />
              </TouchableOpacity>
            </View>
          )}
          renderFooter={(currentIndex) => (
            <View style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 100,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'transparent',
            }}>
              <Text style={{
                color: 'white',
                fontSize: 16,
                fontWeight: '500',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 15,
                textAlign: 'center',
              }}>
                {currentIndex + 1} / {images.length}
              </Text>
            </View>
          )}
          renderIndicator={(currentIndex, allSize) => (
            <View style={{
              position: 'absolute',
              bottom: 120,
              left: 0,
              right: 0,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              {images.length > 1 && images.map((_, index) => (
                <View
                  key={index}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'white',
                    marginHorizontal: 4,
                    opacity: index === currentIndex ? 1 : 0.3
                  }}
                />
              ))}
            </View>
          )}
          saveToLocalByLongPress={false}
          menuContext={{ saveToLocal: '', cancel: '' }}
          onLongPress={() => {}}
          minScale={1}
          maxScale={3}
          useNativeDriver={true}
          failImageSource={{ uri: 'https://via.placeholder.com/400x400?text=Image+Not+Found' }}
        />
      )}
    </Modal>
  );
};

const OrderDetailsModal = ({ isVisible, onClose, orderData }) => {
  const { width, height } = Dimensions.get('window');
  const isSmallScreen = height < 700; 
  const [imageZoomVisible, setImageZoomVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const bottomSheetHeight = useMemo(() => {
    return isSmallScreen ? hp('75%') : hp('55%');
  }, [isSmallScreen]);

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
        if (!isNaN(dateObj.getTime())) {
          return `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
        }
      } catch (error) {
        console.log('Error parsing date:', error);
      }
    }
    
    return ''; 
  };

  // Handle image tap to open zoom modal
  const handleImagePress = (index) => {
    console.log('Opening image at index:', index, 'URL:', orderData.images[index]);
    setSelectedImageIndex(index);
    setImageZoomVisible(true);
  };

  // Reset image index when modal opens with new data
  useEffect(() => {
    if (isVisible) {
      setImageZoomVisible(false);
      setSelectedImageIndex(0);
    }
  }, [isVisible, orderData]);

  const renderImageSlider = () => {
    if (!orderData?.images || orderData.images.length === 0) {
      return (
        <View className='w-full flex items-center mt-4'>
          <Image 
            source={Noimages}
            resizeMode='contain'
            className='flex items-center justify-center'
            style={{
              height: hp('15%'),
              width: hp('15%')
            }}
          />
        </View>
      );
    }

    return (
      <View style={{ marginVertical: 16 }}>
        <FlashList
          data={orderData.images}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          initialNumToRender={4}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
          snapToInterval={90}
          decelerationRate="fast"
          estimatedItemSize={90}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={{
                marginRight: 10,
                backgroundColor: '#f0f0f0',
                borderRadius: 10,
                width: 80,
                height: 80,
                overflow: 'hidden',
                marginVertical: 10,
                position: 'relative'
              }}
              onPress={() => handleImagePress(index)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: item }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
              
              {/* Zoom overlay indicator */}
              <View style={{
                position: 'absolute',
                top: 5,
                right: 5,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                borderRadius: 10,
                padding: 2
              }}>
                <Ionicons name="expand" size={12} color="white" />
              </View>
            </TouchableOpacity>
          )}
          style={{ height: 100 }}
        />
        
        {/* Image Zoom Modal */}
        {orderData?.images && orderData.images.length > 0 && (
          <ImageZoomModal
            visible={imageZoomVisible}
            onClose={() => setImageZoomVisible(false)}
            images={orderData.images}
            initialIndex={selectedImageIndex}
          />
        )}
      </View>
    );
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
            height: bottomSheetHeight,
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

          <Text className="text-center text-[#F52525] text-[20px] font-thin mb-0 font-tajawal">
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
                <Text className="text-right text-[11px] font-thin mb-4 font-tajawal text-[#2F752F]">
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
                <Text className="text-right text-[11px] font-thin mb-4 font-tajawal text-[#2F752F]">
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
                <Text className="text-right text-[11px] font-thin mb-4 font-tajawal text-[#2F752F]">
                  {formatDate(orderData?.rawDeliveryDate)}  
                </Text>
              </View>
            </View>

            {/* Enhanced Image Slider with Zoom */}
            {renderImageSlider()}
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
          onPress={() => showOrderDetails(item)}
        >
          <View className="flex-row-reverse items-center justify-center ">
            <View className="flex-col items-end justify-center pr-4">
              <Text className={`text-base font-bold text-[#ff3737] mb-2`}>{item.orderCode}</Text>
              <View className={`flex-1 items-end px-0 flex-row-reverse text-sm`}>
                <Text className='text-sm text-[#000] font-tajawalregular pt-2'>صاحب(ة) الطلب: </Text>
                <Text className={`text-base text-[#295f2b] pb-[0.7] font-tajawalregular`}> {item?.clientId.Fname} </Text>
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

  const platform = Platform.OS === "android" ? "0px" : "px-4";
  const { width, height } = Dimensions.get('window');
  const isBigScreen = height > 700; 
  const isAndroidAndBig = isBigScreen && Platform.OS === "android";
  const platforms = Platform.OS === "android" ? "px-0" : "px-4";

  return (
    <SafeAreaView className={`flex-1 bg-gray-100 py-0 ${platforms}`}>
      <View className={`px-0 ${filteredOrders.length === 0 ? "mt-0": "mb-12"} `}>
        <View className={`${platform} px-4`}>
          <ProfileHeader />
        </View>
      </View>
      
      {filteredOrders.length === 0 ? (
        <View className={`flex-1 items-center ${isAndroidAndBig ? "mt-[55%]" : "mt-[40%]"} `}>
          <NoOrdersExistsHistory />
        </View>
      ) : (
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