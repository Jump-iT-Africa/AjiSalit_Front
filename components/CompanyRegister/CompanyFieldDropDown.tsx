import React, { useState, useEffect } from 'react';
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
import { COMPANY_FIELDS } from './companyFieldsData';

const CompanyFieldDropDown = ({
  onFieldSelect,
  initialValue,
  selectedField = "",
  errors,
  isSubmitted,
  isRequired = true,
}) => {
  const [localSelectedField, setLocalSelectedField] = useState(initialValue || selectedField);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (selectedField) {
      setLocalSelectedField(selectedField);
    } else if (initialValue) {
      setLocalSelectedField(initialValue);
    }
  }, [selectedField, initialValue]);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleFieldSelection = (field) => {
    setLocalSelectedField(field.name);
    onFieldSelect(field.name);
    Keyboard.dismiss();
    closeModal();
  };

  return (
    <View className="mb-3">
      <TouchableOpacity
        onPress={openModal}
        className={`border ${
          isSubmitted && isRequired && !localSelectedField ? 'border-red-500' : 'border-[#2e752f]'
        } rounded-lg p-3 bg-white flex-row justify-between items-center`}
      >
        <AntDesign name="down" size={16} color="#888" />
        <Text
          className={`text-right flex-1 font-tajawal ${
            localSelectedField ? "text-black" : "text-gray-400"
          }`}
        >
          {localSelectedField || 'اختر مجال الشركة'}
        </Text>
      </TouchableOpacity>

      {isSubmitted && isRequired && !localSelectedField ? (
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
              height: '60%',
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