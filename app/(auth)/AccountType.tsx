import AppGradient from "@/components/ui/AppGradient";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Color from "@/constants/Colors";
import HeaderWithBack from "@/components/ui/HeaderWithToolTipAndback";
import Whitelogo from "@/assets/images/whiteLogo.png";
import CustomButton from "@/components/ui/CustomButton";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import PersonalInfoScreen from "@/components/ui/PersonalInfoScreen";
import { useDispatch } from 'react-redux';
import {setRole} from "@/store/slices/userSlice"
import React, { useState, useRef, useEffect } from "react";



export default function AccountnType() {
    const router = useRouter();
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const actionSheetRef = useRef<ActionSheetRef>(null);
    const [selectedAccountType, setSelectedAccountType] = useState('');
    const dispatch = useDispatch();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleInputFocus = (focused) => {
        setIsExpanded(focused);
      };
    const handleSheetClose = () => {
        setIsExpanded(false);
      };

    const handleBack = () => {
        setTimeout(() => {
            router.replace("(tabs)");
        }, 100);

        
    };

    

      const handleAccountTypeSelect = (type: string) => {
        actionSheetRef.current?.hide();
        setSelectedAccountType(type);
        setIsExpanded(false);
        setTimeout(() => {
          actionSheetRef.current?.show();
        }, 300);
      };


      useEffect(()=>{

        try{
            if(selectedAccountType === "شخص عادي" )
            {
                dispatch(setRole('client'))
            }else{
                dispatch(setRole('company'))
            }

        }catch(e)
        {
            console.log(e);
        }

      },[selectedAccountType])

    return (
        <AppGradient colors={[Color.red, Color.red]} className="flex-1">
            <TouchableOpacity onPress={handleBack}>
                <HeaderWithBack
                    onPress={() => router.replace('(tabs)')}
                    tooltipVisible={tooltipVisible}
                    setTooltipVisible={setTooltipVisible}
                    content="فهاد الصفحة غدي تختار واش نتا شركة ولا شخص عادي"
                />
            </TouchableOpacity>
            
            <View className="flex-1 justify-start items-center mt-[30%]">
                <Image
                    source={Whitelogo}
                    resizeMode="contain"
                    className="w-40 h-40 mb-12"
                />
                <Text className="text-white font-tajawal text-center mb-2 text-xl px-10">
                    واش نتا شركة ولا شخص عادي؟
                </Text>
                <Text className="font-tajawalregular font-thin color-white">
                    تقدر تبدل الوضعية من بعد.
                </Text>
            </View>
            
            <View className="px-10">
                <CustomButton
                    onPress={() => handleAccountTypeSelect('شركة')}
                    title={"شركة"}
                    containerStyles="bg-[#2e752f]"
                    textStyles="text-white font-tajawal text-[15px] pt-0"
                />
                <CustomButton
                    onPress={() => handleAccountTypeSelect('شخص عادي')}
                    title={"شخص عادي"}
                    containerStyles="bg-white mt-4"
                    textStyles="text-[#2e752f] font-tajawal text-[15px] pt-0 bg-white"
                />
            </View>
             
            <ActionSheet
                ref={actionSheetRef}
                id="account-type-sheet"
                containerStyle={{
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                height: isExpanded ? '90%' : '90%',
                }}
                gestureEnabled={true}
                closable={true}
                onClose={handleSheetClose}
                snapPoints={[isExpanded ? 100 :80]}>
                <PersonalInfoScreen
                accountType={selectedAccountType}
                onInputFocus={handleInputFocus}
                />
            </ActionSheet>
        </AppGradient>
    );
}

