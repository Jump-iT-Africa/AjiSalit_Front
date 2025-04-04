import HeaderWithBack from "@/components/ui/HeaderWithToolTipAndback";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import { Platform, ScrollView, TouchableOpacity, View, Text, ActivityIndicator } from "react-native";
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import TooltipComponent from "@/components/ui/TooltipComponent";
import ImagesSlider from "@/components/DetialsPage/ImagesSlider";
import OrderDetailsCard from "@/components/DetialsPage/OrderDetails";
import QrCodeInfo from "@/components/DetialsPage/QrCodeInfo";
import DoneAndPickUp from "@/components/DetialsPage/DoneAndPickUp";
import { useSelector, useDispatch } from "react-redux";
import ClientOrderCards from "@/components/DetialsPage/Client/ClientOrderCards";
import ClientPikUpButton from '@/components/DetialsPage/Client/Buttons/ClientPikUpButton';
import Viewshot from "react-native-view-shot";
import { shareAsync } from "expo-sharing";
import { Image } from "react-native";
import DetailsOrdersNoImages from "@/assets/images/DetailsOrdersNoImages.png";
import { selectCurrentOrder, selectUserOrders, setCurrentOrder, fetchOrderByQrCodeOrId } from "@/store/slices/OrdersOfClient";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetailsPage() {
  const [remaining, setRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const ViewShotRef = useRef();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.role.role);
  const params = useLocalSearchParams();
  const router = useRouter();
  
  
  const currentOrder = useSelector(selectCurrentOrder);
  const userOrders = useSelector(selectUserOrders);
  
  
  useEffect(() => {
    const loadOrderData = async () => {
      setIsLoading(true);
      try {
        
        if (currentOrder) {
          console.log("Using current order from Redux:", currentOrder);
          setOrderData(currentOrder);
          setIsLoading(false);
          return;
        }
        
        
        if (params.id) {
          console.log("Looking for order with ID:", params.id);
          
          const foundOrder = userOrders.find(order => 
            order.id === params.id || order._id === params.id || order.orderCode === params.id
          );
          
          if (foundOrder) {
            console.log("Found order in userOrders:", foundOrder);
            dispatch(setCurrentOrder(foundOrder));
            setOrderData(foundOrder);
            setIsLoading(false);
            return;
          }
          
          
          console.log("Fetching order from API");
          const result = await dispatch(fetchOrderByQrCodeOrId(params.id)).unwrap();
          if (result) {
            setOrderData(result);
            setIsLoading(false);
            return;
          }
        }
        
        
        const storedOrder = await AsyncStorage.getItem('lastScannedOrder');
        if (storedOrder) {
          const parsedOrder = JSON.parse(storedOrder);
          console.log("Using order from AsyncStorage:", parsedOrder);
          dispatch(setCurrentOrder(parsedOrder));
          setOrderData(parsedOrder);
        }
      } catch (error) {
        console.error("Error loading order data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOrderData();
  }, []);
  
  
  useEffect(() => {
    if (!orderData) return;
    
    if (orderData.situation === 'خالص') {
      setRemaining(0);
    } else {
      setRemaining((orderData.price || 0) - (orderData.advancedAmount || 0));
    }
  }, [orderData]);

  const handleDateChange = (newDate, reason) => {
    console.log('New delivery date:', newDate);
    console.log('Reason for change:', reason);
  };

  const handleShare = async () => {
    try {
      const uri = await ViewShotRef.current.capture();
      await shareAsync(uri, {
        mimeType: "image/jpeg",
        dialogTitle: "Share this image",
        UTI: "public.jpeg",
      });
    } catch (error) {
      console.error("There was an error sharing:", error);
    }
  };

  const [tooltipVisible, setTooltipVisible] = useState(false);
  
  const containerClassName = Platform.OS === 'ios'
    ? "flex-row justify-between mx-5 mt-16"
    : "flex-row justify-between mx-0 mt-14";

  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#295f2b" />
        <Text style={{ marginTop: 10 }}>جاري تحميل بيانات الطلب...</Text>
      </View>
    );
  }

  
  if (!orderData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
          لم يتم العثور على بيانات الطلب
        </Text>
        <TouchableOpacity 
          onPress={() => router.replace('(tabs)')}
          style={{ 
            backgroundColor: '#295f2b', 
            paddingHorizontal: 20, 
            paddingVertical: 10, 
            borderRadius: 8 
          }}
        >
          <Text style={{ color: 'white', fontSize: 16 }}>العودة</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className={containerClassName}>
          <TouchableOpacity onPress={() => router.replace('(home)')}>
            <View className="bg-[#461e04b3] rounded-full w-8 h-8 flex justify-center items-center">
              <Feather name="chevron-left" size={22} color="white" />
            </View>
          </TouchableOpacity>
          <TooltipComponent
            isVisible={tooltipVisible}
            onClose={() => setTooltipVisible(false)}
            onOpen={() => setTooltipVisible(true)}
            content={'test test test'}
            placement="bottom"
          />
        </View>

        {!orderData.images || orderData.images.length === 0 ? (
          <View className="w-80 h-80 m-auto">
            <Image
              source={DetailsOrdersNoImages}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          </View>
        ) : (
          <ImagesSlider images={orderData.images} />
        )}

        <Viewshot ref={ViewShotRef} options={{ format: "jpg", quality: 1 }}>
          {role === "client" ? (
            <ClientOrderCards item={orderData} />
          ) : (
            <OrderDetailsCard
              totalAmount={orderData?.price || 0}
              paidAmount={orderData?.advancedAmount || 0}
              remainingAmount={remaining}
              deliveryDate={orderData?.deliveryDate ? new Date(orderData.deliveryDate).toLocaleDateString() : 'N/A'}
              currency="درهم"
              situation={orderData?.situation}
              images={orderData?.images || []}
              onDateChange={handleDateChange}
            />
          )}
          <QrCodeInfo uniqueId={orderData?.qrCode} />
        </Viewshot>

        {role === "client" ? (
          <View className="bg-gray-100 border-t border-gray-200 w-full py-5 pb-5 px-4">
            <View className="flex-row justify-between items-center space-x-2">
              <TouchableOpacity
                className={` w-[48%] h-14 rounded-full flex-row justify-center items-center bg-[#F52525]`}
                onPress={handleShare}
              >
                <Text className="text-white text-lg font-bold ml-2 font-tajawalregular pt-1 pr-2">مشاركة</Text>
                <Feather name="share-2" size={24} color="white" />
              </TouchableOpacity>

              <ClientPikUpButton orderData={orderData} />
            </View>
          </View>
        ) : (
          <DoneAndPickUp orderData={orderData} />
        )}
      </ScrollView>
    </>
  );
}