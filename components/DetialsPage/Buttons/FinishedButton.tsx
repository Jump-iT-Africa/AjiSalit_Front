import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal, Dimensions, Platform } from "react-native";
import Logowhite from "@/assets/images/ajisalit_white.png";
import BottomSheetComponent from "../../ui/BottomSheetComponent";
import CustomButton from "../../ui/CustomButton";
import Colors from "@/constants/Colors";
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { finishButtonPressed, selectOrderButtonState } from '@/store/slices/OrderDetailsSlice';
import { updateOrderDate, setCurrentOrder, updateToDone } from '@/store/slices/OrdersManagment';
import successLeon from '@/assets/images/successLeon.png'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function FinishedButton({orderData}) {
    const { width, height } = Dimensions.get('window');
    const isSmallScreen = height < 400; 
    
    const bottomSheetHeight = useMemo(() => {
        return isSmallScreen ? hp('60%') : hp('60%');
    }, [isSmallScreen]);

    const actionSheetRef = useRef(null);
    const dispatch = useDispatch();
    const currentOrder = useSelector(state => state.orders.currentOrder || {});
    
    // Get the button state for this specific order pz
    const orderId = currentOrder?.id || orderData?.id;
    const orderButtonState = useSelector(state => selectOrderButtonState(state, orderId));
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    // Check if finished based on order data or button state for this specific order
    const isFinished = currentOrder?.isFinished || orderData?.isFinished || orderButtonState.finishButtonClicked;
    
    console.log('FinishedButton - Order ID:', orderId);
    console.log('FinishedButton - isFinished status:', isFinished);
    
    const handleSubmit = () => {
        if (!isFinished) {
            
            dispatch(finishButtonPressed({ orderId }));
            
            dispatch(updateToDone({
                orderId: orderId,
                dateData: {"status": "جاهزة للتسليم" }
            }));

            dispatch(updateOrderDate({
                orderId: orderId,
                dateData: { isFinished: true}
            }));
            
            dispatch(setCurrentOrder({
                ...currentOrder,
                isFinished: true
            }));
            
            setIsModalVisible(true)
        }
    };
    
    const closeBottomSheet = () => {
        setIsModalVisible(false);
    };

    const buttonColor = isFinished ? 'bg-gray-400' : 'bg-[#F52525]';

    return (
        <>
            <TouchableOpacity
                className={`${buttonColor} w-[48%] h-14 rounded-full flex-row justify-center items-center mt-0`}
                onPress={handleSubmit}
                disabled={isFinished}
            >
                <Text className="text-white text-lg  ml-2 font-tajawalregular pt-0 pr-2">تم الانتهاء</Text>
                <Image source={Logowhite} resizeMode="contain" className="w-10 h-10 pr-2" />
            </TouchableOpacity>
            
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={closeBottomSheet}
                statusBarTranslucent={true}
            >  
                <TouchableOpacity 
                    style={{ 
                        flex: 1, 
                        backgroundColor: 'rgba(47, 117, 47, 0.48)',
                        justifyContent: 'flex-end',
                        width: width,
                        height: height,
                    }}
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
                            height: bottomSheetHeight,
                            marginBottom: Platform.OS === "android" ? "-30" : "0",
                        }}
                        onPress={(e) => e.stopPropagation()}
                    >
                        {/* Top handle */}
                        <View 
                            style={{ 
                                width: 60, 
                                height: 5, 
                                backgroundColor: Colors.green, 
                                borderRadius: 5, 
                                alignSelf: 'center',
                                marginTop: 10,
                                marginBottom: 10
                            }} 
                        />

                        <View className="flex-1 items-center justify-left h-full px-4">
                            <View>
                                <Image
                                    source={successLeon}
                                    resizeMode="contain"
                                    className=""
                                />
                            </View>
                            <View>
                                <Text className="text-center text-[#2F752F] text-4xl font-tajawal pt-3 mt-0">مبروك!</Text>
                                <Text className="text-black text-2xl text-center p-4 font-tajawalregular">
                                    تم إكمال الطلب بنجاح
                                </Text>
                            </View>
                            <View className="w-full mt-4">
                                <CustomButton
                                    onPress={() => {
                                        actionSheetRef.current?.hide();
                                        router.replace('/(home)');
                                    }}
                                    title="انتقل للصفحة الرئيسية"
                                    textStyles="text-sm font-tajawal pt-2 py-0 text-white"
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