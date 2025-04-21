import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Color from '@/constants/Colors';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import WhiteImage from "@/assets/images/ajisalit_white.png";


const OrderVerificationModal = forwardRef(({
  formData,
  uploadedImages,
  onConfirm,
  onEdit,
  loading
}, ref) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    show: () => {
      setIsModalVisible(true);
    },
    hide: () => {
      setIsModalVisible(false);
    }
  }));

  const closeModal = () => {
    setIsModalVisible(false);
  };

  // Format date for display
  const formatDate = (date) => {
    if (!(date instanceof Date)) return '';
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
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
            backgroundColor: '#F5F6F7',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: '50%',
            padding: 16
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={{ 
            width: 60, 
            height: 5, 
            backgroundColor: Color.green, 
            borderRadius: 5, 
            alignSelf: 'center',
            marginBottom: 10
          }} />

          <Text className="text-center text-[#F52525] text-[20px] font-bold mb-4 font-tajawal">
            كولشي هو هذاك ؟
          </Text>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              <View className='bg-white flex justify-between items-center rounded-[20px] shadow-l p-8 mx-1 mt-4'>
                <View className='flex-row-reverse gap-3 items-center'>
                    <View className="flex-row items-center justify-end mb-4">
                        <Text className="text-[#000] text-[12px] font-tajawal mr-2">
                        المبلغ الإجمالي : 
                        </Text>
                        <FontAwesome name="money" size={24} color="#F5B225" />
                    </View>
                    <Text className="text-right text-[11px] font-bold mb-4 font-tajawal text-[#2F752F]">
                        {formData.price} درهم
                    </Text>
                </View>

                <View className='flex-row-reverse gap-3 items-center'>
                    <View className="flex-row items-center justify-end mb-4">
                        <Text className="text-[#000] text-[12px] font-tajawal mr-2">
                          تاريخ التسليم : 
                        </Text>
                        <AntDesign name="calendar" size={24} color="#F5B225" />
                    </View>
                    <Text className="text-right text-[11px] font-bold mb-4 font-tajawal text-[#2F752F]">
                        {formData.RecieveDate instanceof Date ? formatDate(formData.RecieveDate) : 'غير محدد'}
                    </Text>
                </View>
              </View>

            {/* Uploaded Images Gallery */}
            {uploadedImages.length > 0 && (
              <View className="mb-6">
                <Text className="text-right text-[#000] text-[12px] mb-3 font-tajawal">الصور المرفقة:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row">
                    {uploadedImages.map((image) => (
                      <View key={image.id} className="mr-3 bg-gray-100 rounded-lg overflow-hidden w-20 h-20">
                        <Image 
                          source={{ uri: image.uri }} 
                          style={{ width: '100%', height: '100%' }} 
                          resizeMode="cover"
                        />
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}
          </ScrollView>

         
          <View className="flex-row justify-between mt-4 mb-4">
            <TouchableOpacity 
              onPress={() => {
                closeModal();
                if (onEdit) onEdit();
              }}
              className="bg-[#F52525] rounded-full p-4 flex-row items-center justify-center"
              style={{ width: '48%' }}
              disabled={loading}
            >
              <Text className="text-white text-center font-tajawal text-[17.99px] m">تعديل</Text>
              <AntDesign name="edit" size={20} color="white" style={{ marginRight: 8 }} />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => {
                closeModal();
                if (onConfirm) onConfirm();
              }}
              className="bg-[#2e752f] rounded-full p-4 flex-row items-center justify-center"
              style={{ width: '48%' }}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text className="text-white text-center font-tajawal text-[17.99px]">ساليت</Text>
                  
                  <Image 
                    source={WhiteImage}
                    className='w-6 h-6'
                    resizeMode='contain'
                  />
                </>
              )}
            </TouchableOpacity>
            
            
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
});

export default OrderVerificationModal;