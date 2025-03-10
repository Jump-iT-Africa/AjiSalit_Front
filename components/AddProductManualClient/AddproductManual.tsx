import { View, Text, TouchableOpacity , Image} from 'react-native'
import React from 'react'
import AddProductImage from "@/assets/images/addProduct.svg"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors  from '@/constants/Colors';


const AddproductManual = () => {
  return (
    <View>
        <TouchableOpacity 
          activeOpacity={0.7} 
          className='bg-[#F52525] rounded-full min-h-[62px] w-full flex-row items-center justify-center text-white mt-6'
          onPress={() =>console.log('hello')}>
            <Text className='font-semibold text-lg text-white font-tajawal text-center'>أضف يدويا</Text>
            <MaterialIcons name="add-circle" size={24} color="white"/>
        </TouchableOpacity>


        <View className='flex-row-reverse items-center justify-center mt-1 '>
            <Ionicons name="information-circle-outline" size={19} color={Colors.green} />
            <Text className='font-tajawalregular text-[10px]' style={{color:Colors.green}}>إلا ما خدمش المسح، دخل رمز الطلب يدويًا بالضغط على الزر أعلاه!</Text>
        </View>
    </View>
  )
}

export default AddproductManual