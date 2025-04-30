import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Color from '@/constants/Colors';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import WhiteImage from "@/assets/images/ajisalit_white.png";
import Noimages from "@/assets/images/noImages.png"
import NoMoneyYellow from "@/assets/images/createProductIcons/noMoney-yellow.png";
import PaidYellow from "@/assets/images/createProductIcons/paid-yellow.png";
import AdvancedMoneyYellow from "@/assets/images/createProductIcons/givingMoney-yellow.png";




const OrderVerificationModal = forwardRef(({
  formData,
  uploadedImages,
  onConfirm,
  onEdit,
  loading
}, ref) => {
  const [isModalVisible, setIsModalVisible] = useState(false);


    // console.log('hello', formData);
    

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

  const formatDate = (date) => {
    if (!(date instanceof Date)) return '';
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };




  const statusOptions = [
    {
      id: 1,
      label: 'غير خالص',
      iconYellow: NoMoneyYellow,
    },
    {
      id: 2,
      label: 'تسبيق',
      iconYellow: AdvancedMoneyYellow,
    },
    {
      id: 3,
      label: 'خالص',
      iconYellow: PaidYellow,
    },
  ];



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
            height: '58%',
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

          <ScrollView className="flex-1  " showsVerticalScrollIndicator={false}>
              <View className='bg-white flex justify-between items-center rounded-[20px] shadow-l p-8 mx-1 mt-4'>
                <View className='flex-row-reverse gap-3 items-center'>
                    <View className="flex-row items-center justify-end mb-4">
                        <Text className="text-[#000] text-[12px] font-tajawal mr-2">
                        المبلغ الإجمالي : 
                        </Text>
                        <FontAwesome name="money" size={24} color="#FD8900" />
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
                        <AntDesign name="calendar" size={24} color="#FD8900" />
                    </View>
                    <Text className="text-right text-[11px] font-bold mb-4 font-tajawal text-[#2F752F]">
                        {formData.RecieveDate instanceof Date ? formatDate(formData.RecieveDate) : 'غير محدد'}
                    </Text>
                </View>

                <View className='flex-row-reverse gap-3 items-center'>
                    <View className="flex-row items-center justify-end mb-4">
                        <Text className="text-[#000] text-[12px] font-tajawal mr-2">
                          الحالة : 
                        </Text>
                        {statusOptions.map((option) => (
                          <View key={option?.id}>
                              {option.label === formData.situation ?(
                                <Image
                                  source={option.iconYellow}
                                  resizeMode='contain'
                                  className='w-9 h-9'
                                />
                              )
                              :(
                                <View></View>
                              )}
                          </View>
                        ))}
                    </View>
                    <Text className="text-right text-[11px] font-bold mb-4 font-tajawal text-[#2F752F]">
                        {formData.situation}
                    </Text>
                </View>

                    {formData.advancedAmount ?
                      <View className='flex-row-reverse gap-3 items-center'>
                      <View className="flex-row items-center justify-end mb-4">
                          <Text className="text-[#000] text-[12px] font-tajawal mr-2">
                          مبلغ التسبيق :
                          </Text>
                      </View>
                      <Text className="text-right text-[11px] font-bold mb-4 font-tajawal text-[#2F752F]">
                          {formData.advancedAmount} درهم 
                      </Text>
                      </View>
                      :
                        null
                    }


              </View>

              {uploadedImages.length > 0 ? (
                <View style={{ marginVertical: 16 }} >
                  <FlatList
                    data={uploadedImages}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => item.id || index.toString()}
                    initialNumToRender={4}
                    maxToRenderPerBatch={5}
                    windowSize={5}
                    removeClippedSubviews={true}
                    snapToInterval={90} 
                    decelerationRate="fast"
                    renderItem={({ item }) => (
                      <TouchableOpacity 
                        style={{ 
                          marginRight: 10, 
                          backgroundColor: '#f0f0f0', 
                          borderRadius: 10,
                          width: 80, 
                          height: 80, 
                          overflow: 'hidden',
                          marginVertical: 10
                        }}
                      >
                        <Image 
                          source={{ uri: item.uri }} 
                          style={{ width: '100%', height: '100%' }} 
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    )}
                    style={{ height: 100 }}
                  />
                </View>
              ) : (
                <View className='w-full flex items-center mt-4'>
                  <Image 
                    source={Noimages}
                    resizeMode='contain'
                    className='flex items-center justify-center w-32 h-32'
                  />
                </View>
              )}
          </ScrollView>

         
          <View className="flex-row justify-between mt-4 mb-4">
            <TouchableOpacity 
              onPress={() => {
                closeModal();
                if (onEdit) onEdit();
              }}
              className="bg-[#F52525] rounded-full p-2 flex-row items-center justify-center"
              style={{ width: '48%' }}
              disabled={loading}
            >
              <Text className="text-white text-center font-tajawal text-[15px]">تعديل</Text>
              <AntDesign name="edit" size={20} color="white" style={{ marginRight: 8 }} />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => {
                closeModal();
                if (onConfirm) onConfirm();
              }}
              className="bg-[#2e752f] rounded-full p-0 flex-row items-center justify-center"
              style={{ width: '48%' }}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text className="text-white text-center font-tajawal text-[15px] mr-2">ساليت</Text>
                  
                  <Image 
                    source={WhiteImage}
                    className='w-8 h-8'
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