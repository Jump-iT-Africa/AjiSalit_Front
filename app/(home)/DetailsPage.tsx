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
import { selectCurrentOrder, selectUserOrders, setCurrentOrder, fetchORderById } from "@/store/slices/OrdersManagment";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSearchParams } from "expo-router/build/hooks";

export default function DetailsPage() {
  const [remaining, setRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);

  console.log('order to be fetched', orderData);
  
  const ViewShotRef = useRef();
  const dispatch = useDispatch();
  const [role, setRole] = useState(null);

useEffect(() => {
  const loadRole = async () => {
    try {
      const storedRole = await AsyncStorage.getItem('user');
      if (storedRole) {
        const role =  JSON.parse(storedRole);
        setRole(role.role);
      }
    } catch (error) {
      console.log("Error loading role from AsyncStorage:", error);
    }
  };
  
  loadRole();
}, []);
  
  console.log('role from details is', role);
  
  const {ItemID} = useLocalSearchParams();
  console.log('this is the id of the command from details', ItemID);
  
  const router = useRouter();
  
  
  const currentOrder = useSelector(selectCurrentOrder);
  const userOrders = useSelector(selectUserOrders);

  useEffect(() => {
    console.log('Current order updated:', currentOrder);
  }, [currentOrder]);
  
  
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
        
        if (ItemID) {
          console.log("Looking for order with ID:", ItemID);
          
          const foundOrder = userOrders.find(order => 
            order.id === ItemID || order._id === ItemID || order.orderCode === ItemID
          );
          
          if (foundOrder) {
            console.log("Found order in userOrders:", foundOrder);
            dispatch(setCurrentOrder(foundOrder));
            setOrderData(foundOrder);
            setIsLoading(false);
            return;
          }
          
          console.log("Fetching order from API");
          try {
            const result = await dispatch(fetchORderById(ItemID)).unwrap();
            if (result) {
              dispatch(setCurrentOrder(result)); 
              setOrderData(result);
              setIsLoading(false);
              return;
            }
          } catch (fetchError) {
            console.log("Error fetching order:", fetchError);
          }
        }
        
        try {
          const storedOrder = await AsyncStorage.getItem('lastScannedOrder');
          if (storedOrder) {
            const parsedOrder = JSON.parse(storedOrder);
            console.log("Using order from AsyncStorage:", parsedOrder);
            dispatch(setCurrentOrder(parsedOrder));
            setOrderData(parsedOrder);
          } else {
            console.log("No order data found anywhere");
          }
        } catch (storageError) {
          console.log("Error accessing AsyncStorage:", storageError);
        }
      } catch (error) {
        console.log("General error loading order data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOrderData();
  }, [currentOrder, ItemID, dispatch, userOrders]);
  
  
  useEffect(() => {
    if (!orderData) return;
    
    if (orderData.situation === 'خالص') {
      setRemaining(0);
    } else {
      setRemaining((orderData.price || 0) - (orderData.advancedAmount || 0));
    }
  }, [orderData]);

    const handleDateChange = async (newDate, reason) => {
      console.log('New delivery date:', newDate);
      console.log('Reason for change:', reason);
      
      if (orderData?.id) {
        try {
          await dispatch(fetchORderById(orderData.id));
          console.log('Order data refreshed after date change');
        } catch (error) {
          console.log('Failed to refresh order data:', error);
        }
      }
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
      console.log("There was an error sharing:", error);
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
          onPress={() => router.back()}
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
              deliveryDate={orderData?.deliveryDate}
              currency="درهم"
              situation={orderData?.label}
              images={orderData?.images || []}
              onDateChange={handleDateChange}
              orderId={orderData?.id}
            />
          )}
          <QrCodeInfo uniqueId={orderData?.orderCode || orderData?.qrCode} />
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
