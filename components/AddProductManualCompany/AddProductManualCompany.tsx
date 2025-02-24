
import { View, Text, TouchableOpacity, Linking, Alert , Image} from 'react-native'
import React, { useRef, useState } from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ActionSheetToAddProduct from '../ActionSheetToAddProduct/ActionSheetToAddProduct';
import { useCameraPermissions } from "expo-camera";
import { useRouter } from 'expo-router';
import AddIcon from "@/assets/images/Addicone.png"


export default function AddProductManualCompany()
{
    const [permission, requestPermission] = useCameraPermissions();
    const isPermissionGranted = Boolean(permission?.granted);
    const router = useRouter(); 

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

    const actionSheetRef = useRef(null);
    const [isSheetVisible, setIsSheetVisible] = useState(false);
  
    const handleCloseActionSheet = () => {
        setIsSheetVisible(false);
      };

    return(
       <>
        <View className='flex flex-row justify-between '>
                <View>
                    <TouchableOpacity 
                    activeOpacity={0.7} 
                    className='bg-[#F52525] rounded-full min-h-[50px] w-auto px-9 flex-row items-center justify-center text-white mt-6 '
                    onPress={() =>{

                        setIsSheetVisible(true);
                        actionSheetRef.current?.show();
                        
                    }}>
                        <Text className='font-semibold text-[16px] text-white font-tajawal text-center mr-2'>أضف يدويا</Text>
                        <Image 
                          source={AddIcon}
                          className='w-4 h-4'
                        />
                    </TouchableOpacity>
                </View>

                <View>
                    <TouchableOpacity 
                        activeOpacity={0.7} 
                        className='bg-[#2e752f] rounded-full min-h-[50px] w-auto px-9 flex-row items-center justify-center text-white mt-6 '
                        onPress={handleScanPress}>
                            <Text className='font-semibold text-[16px] text-white font-tajawal text-center mr-2'>مسح QR</Text>
                            <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
                    </TouchableOpacity>
                </View>
        </View>

        <ActionSheetToAddProduct 
        ref={actionSheetRef}
        isVisible={isSheetVisible}
        onClose={handleCloseActionSheet}/>
       
       </>
    )
}
