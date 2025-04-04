// @ts-nocheck

import HeaderWithBack from "@/components/ui/HeaderWithToolTipAndback";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import { Platform, ScrollView, TouchableOpacity, View,Text } from "react-native";
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import TooltipComponent from "@/components/ui/TooltipComponent";
import ImagesSlider from "@/components/DetialsPage/ImagesSlider";
import OrderDetailsCard from "@/components/DetialsPage/OrderDetails";
import QrCodeInfo from "@/components/DetialsPage/QrCodeInfo";
import DoneAndPickUp from "@/components/DetialsPage/DoneAndPickUp";
import {useSelector} from "react-redux"
import ClientOrderCards from "@/components/DetialsPage/Client/ClientOrderCards"
import FinishedButton from "@/components/DetialsPage/Buttons/FinishedButton"
import PickUpButton from "@/components/DetialsPage/Buttons/PickUpButton"
import ClientPikUpButton from '@/components/DetialsPage/Client/Buttons/ClientPikUpButton'
import Viewshot from "react-native-view-shot";
import { shareAsync } from  "expo-sharing";
import { AntDesign} from '@expo/vector-icons';
import { current } from "@reduxjs/toolkit";
import { Image } from "react-native";
import DetailsOrdersNoImages from "@/assets/images/DetailsOrdersNoImages.png";



export default function DetailsPage()
{
  const [remaining , setRemaining] = useState(0);
  const ViewShotRef = useRef();
  const role = useSelector((state) => state.role.role); 
  const { orderId, qrCode } = useLocalSearchParams();
  const currentOrder = useSelector(state => state.orderDetails.currentOrder);
  const [OrderImages, setOrderImages]= useState(currentOrder?.images || null);
  
  useEffect(()=>{
      if(currentOrder?.situation === 'خالص')
        {
          setRemaining(0);
        }
        else{
            setRemaining((currentOrder?.price || 0) - (currentOrder?.advancedAmount || 0));
        }
  }, [currentOrder])

  useEffect(() => {
    console.log('images are ', OrderImages);
    
    if(OrderImages?.length === 0)
    {
      console.log("no Images found 😢");
      setOrderImages([0])
    }else{
      setOrderImages(currentOrder?.images)
      console.log("wohooo there are", OrderImages?.length);
    }
  }, [])
    

    
    // console.log(currentOrder.images.length)
    





  const handleDateChange = (newDate, reason) => {
    console.log('New delivery date:', newDate);
    console.log('Reason for change:', reason);
    
  };

  const handleShare = async() =>{
    try{
      const uri = await ViewShotRef.current.capture();
      await shareAsync(uri, {
        mimeType: "image/jpeg",
        dialogTitle: "Share this image",
        UTI: "public.jpeg",
      });
    } catch(error)
    {
      console.error("there was an error", error);
      
    }
  }


  const [tooltipVisible, setTooltipVisible] = useState(false);
  const handleBack = () => {
    setTimeout(() => {
      router.replace('(tabs)');
    }, 100);
  };
  const containerClassName = Platform.OS === 'ios' 
  ? "flex-row justify-between mx-5 mt-16" 
  : "flex-row justify-between mx-0 mt-14";

    return(
        <>
        <ScrollView
        showsVerticalScrollIndicator={false}
        >
          <View className={containerClassName} >
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

        {currentOrder?.images?.length === 0 ? (
          <View className="w-80 h-80 m-auto">
              <Image 
              source={DetailsOrdersNoImages} 
              style={{ width: '100%', height: '100%' }} 
              resizeMode="contain"
            />
          </View>
        ):(
          <ImagesSlider />
        )}


          <Viewshot ref={ViewShotRef} options={{format:"jpg", quality:1}}>
              {role ==="client" ? (
              <ClientOrderCards />
                ):(
                  <OrderDetailsCard 
                      totalAmount={currentOrder?.price || 0}
                      paidAmount={currentOrder?.advancedAmount || 0}
                      remainingAmount={remaining}
                      deliveryDate={new Date(currentOrder?.deliveryDate).toLocaleDateString()}
                      currency="درهم"
                      situation={currentOrder?.situation}
                      images={currentOrder?.images}
                      onDateChange={handleDateChange}
                    />
                )}
              <QrCodeInfo uniqueId={currentOrder?.qrCode}/>
          </Viewshot>

          {role ==="client" ?(
            <View className="bg-gray-100 border-t border-gray-200 w-full py-5 pb-5 px-4">
              <View className="flex-row justify-between items-center space-x-2">
                <TouchableOpacity
                  className={` w-[48%] h-14 rounded-full flex-row justify-center items-center bg-[#F52525]`}
                  onPress={handleShare}
                  >
                  <Text className="text-white text-lg font-bold ml-2 font-tajawalregular pt-1 pr-2">مشاركة</Text>
                  <Feather name="share-2" size={24} color="white" />
                </TouchableOpacity>

                <ClientPikUpButton />
              </View>
            </View>

          ):(
            <DoneAndPickUp />
          )}
          </ScrollView>
        </>
)
}