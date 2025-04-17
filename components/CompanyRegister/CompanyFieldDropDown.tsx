import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import BottomSheetComponent from '@/components/ui/BottomSheetComponent';
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
  const actionSheetRef = useRef(null);

  const handleFieldSelection = (field) => {
    setSelectedField(field.name);
    onFieldSelect(field.name);
    actionSheetRef.current?.hide();
  };

  return (
    <View className="mt-4 mb-6 w-full">
      <Text
        className="text-right text-gray-700 mb-2 font-tajawal text-xs"
        style={{ color: Color.green }}
      >
        أدخل تفاصيل الشركة <Text className="text-red-600">*</Text>
      </Text>

      <TouchableOpacity
        onPress={() => actionSheetRef.current?.show()}
        className={`border ${
          isSubmitted && !selectedField ? 'border-red-500' : 'border-[#2e752f]'
        } rounded-lg p-3 bg-white`}
      >
        <Text
          className={`text-right font-tajawalregular ${
            selectedField ? 'text-black' : 'text-gray-400'
          }`}
        >
          {selectedField || 'اختر مجال الشركة'}
        </Text>
      </TouchableOpacity>

      {isSubmitted && !selectedField ? (
        <Text className="text-red-500 text-right mt-1 font-tajawalregular text-xs">
          مجال الشركة مطلوب
        </Text>
      ) : null}

      <BottomSheetComponent
        ref={actionSheetRef}
        id="company-field-sheet"
        containerStyle={{
          height: '50%',
          backgroundColor: 'white',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
        contentStyle={{
          padding: 0,
        }}
        gestureEnabled={true}
        closeOnTouchBackdrop={true}
      >
        <View className="flex-1">
          <FlatList
            data={COMPANY_FIELDS}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => handleFieldSelection(item)}
                className={`p-4 flex-row-reverse justify-between items-center ${
                  index % 2 === 0 ? 'bg-white' : 'bg-[#F5F6F7]'
                }`}
                activeOpacity={0.7}
              >
                <Text className="text-right font-tajawalregular">
                  {item.name}
                </Text>
                <Text className="text-2xl">{item.icon}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <View className="p-4 items-center">
                <Text className="text-gray-500 font-tajawalregular">
                  لا توجد نتائج
                </Text>
              </View>
            )}
          />
        </View>
      </BottomSheetComponent>
    </View>
  );
};

export default CompanyFieldDropDown;