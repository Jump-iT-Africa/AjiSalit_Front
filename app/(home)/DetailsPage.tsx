// @ts-nocheck
import HeaderWithBack from "@/components/ui/HeaderWithToolTipAndback";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Platform, ScrollView, TouchableOpacity, View } from "react-native";
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import TooltipComponent from "@/components/ui/TooltipComponent";
import ImagesSlider from "@/components/DetialsPage/ImagesSlider";
import OrderDetailsCard from "@/components/DetialsPage/OrderDetails";
import QrCodeInfo from "@/components/DetialsPage/QrCodeInfo";
import DoneAndPickUp from "@/components/DetialsPage/DoneAndPickUp";


export default function DetailsPage()
{
  const { id } = useLocalSearchParams();
  console.log(id);
  

  const handleDateChange = (newDate, reason) => {
    console.log('New delivery date:', newDate);
    console.log('Reason for change:', reason);
    
  };
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
          <ImagesSlider />
          <OrderDetailsCard 
            totalAmount={150}
            paidAmount={50}
            remainingAmount={100}
            deliveryDate="11/02/2025"
            currency="درهم"
            onDateChange={handleDateChange}
          />
          <QrCodeInfo uniqueId={'H1Hsqw2200bd'}/>
          <DoneAndPickUp />
          </ScrollView>
        </>
)
}