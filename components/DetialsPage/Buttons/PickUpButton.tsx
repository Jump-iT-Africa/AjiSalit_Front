import React, { useRef, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, Image } from "react-native";
import BottomSheetComponent from "../../ui/BottomSheetComponent";
import CustomButton from "../../ui/CustomButton";
import Colors from "@/constants/Colors";
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSelector, useDispatch } from 'react-redux';
import { pickupButtonPressed, selectOrderButtonState } from '@/store/slices/OrderDetailsSlice';
import { updateOrderDate, setCurrentOrder, updateToPickUp } from '@/store/slices/OrdersManagment';
import successLeon from '@/assets/images/successLeon.png'

export default function PickUpButton({orderData}) {
    const actionSheetRef = useRef(null);
    const dispatch = useDispatch();
    
    const currentOrder = useSelector(state => state.orders.currentOrder || {});
    
    const orderId = currentOrder?.id || orderData?.id;
    const orderButtonState = useSelector(state => selectOrderButtonState(state, orderId));
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    const orderIsFinished = currentOrder?.isFinished || orderData?.isFinished || orderButtonState.finishButtonClicked;
    const isPickedUp = currentOrder?.isPickUp || orderData?.isPickUp || orderButtonState.pickupButtonClicked;
    
    console.log('PickUpButton - Order ID:', orderId);
    console.log('PickUpButton - Order is finished:', orderIsFinished);
    console.log('PickUpButton - Order is picked up:', isPickedUp);
    
    const handleSubmit = () => {
        if (orderIsFinished && !isPickedUp) {
            dispatch(pickupButtonPressed({ orderId }));

            dispatch(updateOrderDate({
                orderId: orderId,
                dateData: { isPickUp: true }
            }));

            
            
            dispatch(setCurrentOrder({
                ...currentOrder,
                isPickUp: true
            }));
            
            setIsModalVisible(true)
        }
    };

    const closeBottomSheet = () => {
        setIsModalVisible(false);
    };
    
    const isEnabled = orderIsFinished && !isPickedUp;
    const buttonColor = isEnabled ? 'bg-green-700' : 'bg-gray-400';
    
    return (
        <>
            <TouchableOpacity
                className={`${buttonColor} w-[48%] h-14 rounded-full flex-row justify-center items-center`}
                onPress={handleSubmit}
                disabled={!isEnabled}
            >
                <Text className="text-white text-lg font-bold ml-2 font-tajawalregular pt-1 pr-2">تم الاستلام</Text>
                <AntDesign name="checkcircle" size={24} color="white" />
            </TouchableOpacity>
            
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={closeBottomSheet}
            >
                <TouchableOpacity 
                style={{ flex: 1, backgroundColor: 'rgba(47, 117, 47, 0.48)' }}
                activeOpacity={1}
                onPress={closeBottomSheet}
                >
                    <TouchableOpacity 
                        activeOpacity={1}
                        style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        height: '55%',
                        padding: 16
                        }}
                    >
                        <View className="flex-1 items-center justify-left h-full">
                            <View >
                                <Image
                                    source={successLeon}
                                    resizeMode="contain"
                                    className=""
                                />
                            </View>
                            <View>
                                <Text className="text-center text-[#2F752F] text-4xl font-tajawal pt-3 mt-0">مبروك!</Text>
                                <Text className="text-black text-2xl text-center p-4 font-tajawalregular">
                                تم استلام الطلب بنجاح   
                                </Text>
                            </View>
                            <View className="w-full mt-4">
                                <CustomButton
                                    onPress={() => {
                                        actionSheetRef.current?.hide();
                                        router.replace('/(home)');
                                    }}
                                    title="انتقل للصفحة الرئيسية"
                                    textStyles="text-sm font-tajawal pt-4 py-0 text-white"
                                    containerStyles="w-[90%] m-auto bg-[#F52525] pt-2"
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </>
    );
}