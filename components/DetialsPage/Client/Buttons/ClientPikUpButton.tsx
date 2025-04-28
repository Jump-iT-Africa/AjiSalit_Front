import { View, Text, TouchableOpacity, Modal, Image } from 'react-native'
import React, { useRef, useState } from 'react'
import CustomButton from '@/components/ui/CustomButton';
import { pickupButtonPressed } from '@/store/slices/OrderDetailsSlice';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { useDispatch, useSelector } from 'react-redux';
import successLeon from '@/assets/images/successLeon.png'



const ClientPikUpButton = () => {
    const dispatch = useDispatch();
    const pickupButtonClicked = useSelector(state => state.buttons.pickupButtonClicked);
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    const handleSubmit = () => {
        if (!pickupButtonClicked) {
            dispatch(pickupButtonPressed());
            setIsModalVisible(true);
        }
    };
    
    const closeModal = () => {
        setIsModalVisible(false);
    };
    
    const isEnabled = !pickupButtonClicked;
    
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
            
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={closeModal}
            >
                <TouchableOpacity 
                    style={{ flex: 1, backgroundColor: 'rgba(47, 117, 47, 0.48)' }}
                    activeOpacity={1}
                    onPress={closeModal}
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
                            <View>
                                <Image
                                    source={successLeon}
                                    resizeMode='contain'
                                    className='w-60 h-60 mx-auto'
                                />
                            </View>
                            <View>
                                <Text className="text-center text-[#2F752F] text-4xl font-tajawal pt-3 mt-0">تهانينا!</Text>
                                <Text className="text-black text-2xl text-center p-4 font-tajawalregular">
                                    تم إستلام طلبك بنجاح
                                </Text>
                                <Text className='font-tajawalregular text-[#FFA30E] text-l text-center'>
                                شكرًا على ثقتك بنا، وكنتمناو نكونو عند حسن ظنك
                                </Text>
                            </View>
                            <View className="w-full mt-4">
                                <CustomButton
                                    onPress={() => {
                                        closeModal();
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

export default ClientPikUpButton;