import { View, Text, TouchableOpacity , Image} from 'react-native'
import React, { useState } from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors  from '@/constants/Colors';
import AddManuallyTheId from '@/components/AddManuallyTheId/AddManuallyTheId';


const AddproductManual = () => {

  const [modalVisible, setModalVisible] = useState(false);

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

  return (
    <View>
        <TouchableOpacity 
          activeOpacity={0.7} 
          className='flex-1 bg-[#F52525] rounded-full min-h-[50px] flex-row items-center justify-center mt-6'
          onPress={handleOpenModal}>
          <Text className='font-semibold text-[16px] text-white font-tajawal text-center mr-2'>أضف يدويا</Text>
            <MaterialIcons name="add-circle" size={24} color="white"/>
        </TouchableOpacity>


        <View className='flex-row-reverse items-center justify-center mt-1 '>
            <Ionicons name="information-circle-outline" size={19} color={Colors.green} />
            <Text className='font-tajawalregular text-[10px]' style={{color:Colors.green}}>إلا ما خدمش المسح، دخل رمز الطلب يدويًا بالضغط على الزر أعلاه!</Text>
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

export default AddproductManual