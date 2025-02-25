import React, { useState } from 'react';
import { View, Dimensions, Text, Image, TouchableOpacity } from 'react-native';
import Colors from "@/constants/Colors";
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomButton from '@/components/ui/CustomButton';
import AddIcon from '@/assets/images/Addicone.png';
import { router } from 'expo-router';
import AddManuallyTheId from '@/components/AddManuallyTheId/AddManuallyTheId';

const { width, height } = Dimensions.get("window");
const innerDimension = 300;

const topMargin = 230;
const bottomSpace = height - innerDimension - topMargin;

export const Overlay = ({ flashEnabled, toggleFlash, hasFlashPermission, onManualIdSubmit }:any) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleIdSubmit = (id) => {
    if (onManualIdSubmit) {
      onManualIdSubmit(id);
    }
    setModalVisible(false);
  };

  return (
    <View className="absolute inset-0">
      <View className="absolute z-20 w-full flex-row items-center h-40 px-3 pt-8">
        <Ionicons name="chevron-back-outline" size={24} color="white" onPress={() => router.back()}/>
        <View className="flex-1 items-center">
          <Text className="text-white text-xl font-tajawal">مسح QR</Text>
        </View>
        <TouchableOpacity
          onPress={toggleFlash}
          className="p-2"
          disabled={!hasFlashPermission}
        >
          {flashEnabled ? (
            <Ionicons name="flash" size={24} color="white" />
          ) : (
            <Ionicons name="flash-outline" size={24} color="white" />
          )}
        </TouchableOpacity>
      </View>
      
      <View style={{
        backgroundColor: Colors.green,
        width: '100%',
        height: topMargin,
      }} />
      
      <View className="flex-row" style={{ height: innerDimension }}>
        <View style={{
          backgroundColor: Colors.green,
          width: (width - innerDimension) / 2,
        }} />
        <View className="relative" style={{ width: innerDimension, height: innerDimension }}>
          <View className="absolute inset-0 border-2 border-transparent" />
          <View className="absolute -top-4 -left-4 w-6 h-6 rounded-full">
            <View className="absolute top-0 left-0 w-12 h-2 bg-white rounded-full" />
            <View className="absolute top-0 left-0 w-2 h-12 bg-white rounded-full" />
          </View>
          <View className="absolute -top-4 -right-4 w-12 h-12 z-10">
            <View className="absolute top-0 right-0 w-12 h-2 bg-white rounded-full" />
            <View className="absolute top-0 right-0 w-2 h-12 bg-white rounded-full" />
          </View>
          <View className="absolute -bottom-4 -left-4 w-12 h-12 z-10">
            <View className="absolute bottom-0 left-0 w-12 h-2 bg-white rounded-full" />
            <View className="absolute bottom-0 left-0 w-2 h-12 bg-white rounded-full" />
          </View>
          <View className="absolute -bottom-4 -right-4 w-12 h-12 z-10">
            <View className="absolute bottom-0 right-0 w-12 h-2 bg-white rounded-full" />
            <View className="absolute bottom-0 right-0 w-2 h-12 bg-white rounded-full" />
          </View>
        </View>
        <View style={{
          backgroundColor: Colors.green,
          width: (width - innerDimension) / 2,
        }} />
      </View>
      
      <View style={{
        backgroundColor: Colors.green,
        width: '100%',
        height: bottomSpace,
      }} />
      
      <View className="absolute z-20 w-full bottom-44 flex items-center justify-center">
        <TouchableOpacity onPress={handleOpenModal}>
          <View className="flex-row items-center bg-[#F52525] rounded-full px-12 py-0">
            <CustomButton
              title="أضف يدويا"
              containerStyles=""
              textStyles="text-white font-tajawal"
              onPress={handleOpenModal}
            />
            <Image
              source={AddIcon}
              className="w-4 h-4 ml-2"
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </View>
      <View className="absolute z-20 w-full items-center px-10 bottom-24">
        <Text className="text-white font-tajawalregular text-center">
          إلا ما خدمش المسح، دخل رمز الطلب يدويًا بالضغط على الزر أسفله!
        </Text>
      </View>

        <AddManuallyTheId
          visible={modalVisible}
          onClose={handleCloseModal}
          onSubmit={handleIdSubmit}
          containerStyle="bg-[#2e752f]"
        />
    </View>
  );
};