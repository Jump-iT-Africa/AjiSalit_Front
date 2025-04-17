import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  Keyboard
} from 'react-native';
import AntDesign from "@expo/vector-icons/AntDesign";
import Color from '@/constants/Colors';

const COMPANY_FIELDS = [
  {
    id: '1',
    name: 'الخياطة',
    icon: '🧵',
  },
  {
    id: '2',
    name: 'غسيل السيارات',
    icon: '🚗',
  },
  {
    id: '3',
    name: 'غسيل الملابس/التنظيف الجاف',
    icon: '👕',
  },
  {
    id: '4',
    name: 'مخبزة',
    icon: '🍞',
  },
  {
    id: '5',
    name: 'صيدلية',
    icon: '💊',
  },
];

const CompanyFieldDropDown = ({
  onFieldSelect,
  initialValue,
  errors,
  isSubmitted,
}) => {
  const [selectedField, setSelectedField] = useState(initialValue || '');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleFieldSelection = (field) => {
    setSelectedField(field.name);
    onFieldSelect(field.name);
    Keyboard.dismiss();
    closeModal();
  };

  return (
    <View className="mb-3">
      <Text
        className="text-right text-gray-700 mb-2 font-tajawal text-[12px]"
        style={{ color: Color.green }}
      >
        أدخل تفاصيل الشركة <Text className="text-red-500">*</Text>
      </Text>

      <TouchableOpacity
        onPress={openModal}
        className={`border ${
          isSubmitted && !selectedField ? 'border-red-500' : 'border-[#2e752f]'
        } rounded-lg p-3 bg-white flex-row justify-between items-center`}
      >
        <AntDesign name="down" size={16} color="#888" />
        <Text
          className={`text-right flex-1 font-tajawal ${
            selectedField ? "text-black" : "text-gray-400"
          }`}
        >
          {selectedField || 'اختر مجال الشركة'}
        </Text>
      </TouchableOpacity>

      {isSubmitted && !selectedField ? (
        <Text className="text-red-500 text-right mt-1 font-tajawalregular text-[10px]">
          مجال الشركة مطلوب
        </Text>
      ) : null}

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <TouchableOpacity 
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
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
              height: '60%',
              padding: 16
            }}
          >
            <View style={{ 
              width: 60, 
              height: 5, 
              backgroundColor: Color.green, 
              borderRadius: 5, 
              alignSelf: 'center',
              marginBottom: 10
            }} />
            
            <Text className="text-center font-tajawal text-lg mb-4" style={{ color: Color.green }}>
              اختر مجال الشركة
            </Text>
            
            <FlatList
              data={COMPANY_FIELDS}
              keyExtractor={item => item.id}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => handleFieldSelection(item)}
                  className={`p-4 flex-row-reverse justify-between items-center ${
                    index % 2 === 0 ? 'bg-white' : 'bg-[#F5F6F7]'
                  } border-b border-gray-200`}
                  activeOpacity={0.7}
                >
                  <Text className="text-right font-tajawal text-[16px] text-gray-800">
                    {item.name}
                  </Text>
                  <Text className="text-[20px]">{item.icon}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <View className="flex-1 items-center justify-center py-8">
                  <Text className="text-center font-tajawal text-gray-500">
                    لا توجد نتائج
                  </Text>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default CompanyFieldDropDown;