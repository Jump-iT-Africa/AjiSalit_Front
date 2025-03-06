// @ts-nocheck

import React, { useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ActionSheetComponent from "../../ui/ActionSheet";
import CustomButton from "../../ui/CustomButton";
import Colors from "@/constants/Colors";
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSelector, useDispatch } from 'react-redux';
import { pickupButtonPressed } from '@/store/slices/OrderDetailsSlice';

export default function PickUpButton() {
    const actionSheetRef = useRef(null);
    
    const dispatch = useDispatch();
    const finishButtonClicked = useSelector(state => state.buttons.finishButtonClicked);
    const pickupButtonClicked = useSelector(state => state.buttons.pickupButtonClicked);
    
    const handleSubmit = () => {
        if (finishButtonClicked && !pickupButtonClicked) {
            dispatch(pickupButtonPressed());
            actionSheetRef.current?.show();
        }
    };
    
    const isEnabled = finishButtonClicked && !pickupButtonClicked;
    
    return (
        <>
            <TouchableOpacity
                className={`${isEnabled ? 'bg-green-700' : 'bg-gray-400'} w-[48%] h-14 rounded-full flex-row justify-center items-center`}
                onPress={handleSubmit}
                disabled={!isEnabled}
            >
                <Text className="text-white text-lg font-bold ml-2 font-tajawalregular pt-1 pr-2">تم الاستلام</Text>
                <AntDesign name="checkcircle" size={24} color="white" />
            </TouchableOpacity>
            
            <ActionSheetComponent
                ref={actionSheetRef}
                containerStyle={{ backgroundColor: Colors.green, height: 600 }}
                contentStyle={{ backgroundColor: Colors.green }}
            >
                <View className="flex-1 items-center justify-left">
                    <View>
                        <Ionicons name="checkmark-done-circle-outline" size={190} color="white" />
                    </View>
                    <View>
                        <Text className="text-center text-white text-6xl font-tajawalregular pt-14 mt-0">تهانينا!</Text>
                        <Text className="text-white text-2xl font-direction text-center p-4">
                            تم استلام الطلب بنجاح
                        </Text>
                    </View>
                    <View className="w-full mt-7">
                        <CustomButton
                            onPress={() => {
                                actionSheetRef.current?.hide();
                                router.replace('/(home)');
                            }}
                            title="انتقل للصفحة الرئيسية"
                            textStyles="text-sm font-tajawal px-2 py-0 text-[#2e752f]"
                            containerStyles="w-[90%] m-auto bg-white"
                        />
                    </View>
                </View>
            </ActionSheetComponent>
        </>
    );
}