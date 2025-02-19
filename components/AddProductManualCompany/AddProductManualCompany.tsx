
import { View, Text, TouchableOpacity} from 'react-native'
import React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


export default function AddProductManualCompany()
{
    return(
       <View className='flex flex-row justify-between '>
            <View>
                <TouchableOpacity 
                activeOpacity={0.7} 
                className='bg-[#F52525] rounded-full min-h-[62px] w-auto px-10 flex-row items-center justify-center text-white mt-6'
                onPress={() =>console.log('hello')}>
                    <Text className='font-semibold text-[16px] text-white font-tajawal text-center'>أضف يدويا</Text>
                    <MaterialIcons name="add-circle" size={24} color="white"/>
                </TouchableOpacity>
            </View>

            <View>
                <TouchableOpacity 
                    activeOpacity={0.7} 
                    className='bg-[#2e752f] rounded-full min-h-[62px] w-auto px-10 flex-row items-center justify-center text-white mt-6'
                    onPress={() =>console.log('hello')}>
                        <Text className='font-semibold text-[16px] text-white font-tajawal text-center'>مسح QR</Text>
                        <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
                </TouchableOpacity>
            </View>
       </View>
    )
}