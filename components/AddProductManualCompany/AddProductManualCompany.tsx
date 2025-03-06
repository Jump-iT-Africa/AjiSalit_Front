// @ts-nocheck
import { View, Text, TouchableOpacity, Linking, Alert, Image } from 'react-native'
import React, { useRef, useState } from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCameraPermissions } from "expo-camera";
import { useRouter } from 'expo-router';
import AddIcon from "@/assets/images/Addicone.png"
import AddManuallyTheId from '../AddManuallyTheId/AddManuallyTheId';

export default function AddProductManualCompany()
{
    const [permission, requestPermission] = useCameraPermissions();
    const [modalVisible, setModalVisible] = useState(false);
    const isPermissionGranted = Boolean(permission?.granted);
    const router = useRouter(); 

    const handleOpenModal = () => {
      setModalVisible(true);
    };

    const handleCloseModal = () => {
      setModalVisible(false);
    };
  
    const handleSubmit = (id: string) => {
      if (id.trim()) {
        console.log('Submitted ID:', id);
        setModalVisible(false);
      }
    };

    const handleScanPress = async () => {
        console.log(isPermissionGranted);
        if (!isPermissionGranted) {
          if (permission?.canAskAgain === false) {
            Alert.alert(
              "مطلوب إذن الكاميرا",
              "لقد رفضت الوصول إلى الكاميرا مسبقًا. يرجى تمكينها في إعدادات جهازك لاستخدام الماسح qr.",
              [
                { text: "يلغي", style: "cancel" },
                { text: "افتح الإعدادات", onPress: () => Linking.openSettings() }
              ]
            );
          } else {
            const result = await requestPermission();
            if (result.granted) {
              router.push('/Scanner');
            }
          }
        } else {
            console.log("here");
            router.navigate('/Scanner');
        }
    };

    return(
       <View className="w-full  ">
        <View className="flex-row justify-between space-x-2 w-full">
            <TouchableOpacity 
                activeOpacity={0.7} 
                className='flex-1 bg-[#F52525] rounded-full min-h-[50px] flex-row items-center justify-center mt-6'
                onPress={handleOpenModal}>
                <Text className='font-semibold text-[16px] text-white font-tajawal text-center mr-2'>أضف يدويا</Text>
                <Image 
                    source={AddIcon}
                    className='w-4 h-4'
                />
            </TouchableOpacity>

            <TouchableOpacity 
                activeOpacity={0.7} 
                className='flex-1 bg-[#2e752f] rounded-full min-h-[50px] flex-row items-center justify-center mt-6'
                onPress={handleScanPress}>
                <Text className='font-semibold text-[16px] text-white font-tajawal text-center mr-2'>مسح QR</Text>
                <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
            </TouchableOpacity>
        </View>

        <AddManuallyTheId
            visible={modalVisible}
            onClose={handleCloseModal}
            onSubmit={handleSubmit}
            useBlur={true}
            blurIntensity={80}
        />
       </View>
    )
}