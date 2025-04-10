
// @ts-nocheck
import React, { useRef } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Logowhite from "@/assets/images/whiteLogo.png";
import ActionSheetComponent from "../../ui/ActionSheet";
import CustomButton from "../../ui/CustomButton";
import Colors from "@/constants/Colors";
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { finishButtonPressed } from '@/store/slices/OrderDetailsSlice';
import { updateOrderDate, setCurrentOrder } from '@/store/slices/OrdersManagment';

export default function FinishedButton({orderData}) {
    const actionSheetRef = useRef(null);
    const dispatch = useDispatch();
    
    
    const currentOrder = useSelector(state => state.orders.currentOrder || {});
    const finishBtnClicked = useSelector(state => state.buttons.finishButtonClicked);
    
    
    const orderId = currentOrder?.id || orderData?.id;
    
    
    const isFinished = currentOrder?.isFinished || finishBtnClicked || orderData?.isFinished;
    
    console.log('FinishedButton - isFinished combined status:', isFinished);
    
    const handleSubmit = () => {
        if (!isFinished) {
            
            dispatch(finishButtonPressed());
            
            
            dispatch(updateOrderDate({
                orderId: orderId,
                dateData: { isFinished: true }
            }));
            
            
            dispatch(setCurrentOrder({
                ...currentOrder,
                isFinished: true
            }));
            
            actionSheetRef.current?.show();
        }
    };
    
    const buttonColor = isFinished ? 'bg-gray-400' : 'bg-[#F52525]';
    
    return (
        <>
            <TouchableOpacity
                className={`${buttonColor} w-[48%] h-14 rounded-full flex-row justify-center items-center mt-0`}
                onPress={handleSubmit}
                disabled={isFinished}
            >
                <Text className="text-white text-lg font-bold ml-2 font-tajawalregular pt-2 pr-2">تم الانتهاء</Text>
                <Image source={Logowhite} resizeMode="contain" className="w-10 h-10 pr-2" />
            </TouchableOpacity>
            
            <ActionSheetComponent
                ref={actionSheetRef}
                containerStyle={{ backgroundColor: Colors.green, height: 600 }}
                contentStyle={{ backgroundColor: Colors.green }}
            >
                <View className="flex-1 items-center justify-left h-full">
                    <View>
                        <Ionicons name="checkmark-done-circle-outline" size={190} color="white" />
                    </View>
                    <View>
                        <Text className="text-center text-white text-6xl font-tajawalregular pt-14 mt-0">تهانينا!</Text>
                        <Text className="text-white text-2xl font-direction text-center p-4">
                            تم إكمال الطلب بنجاح
                        </Text>
                    </View>
                    <View className="w-full mt-10">
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