import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import Color from '@/constants/Colors';

const COMPANY_FIELDS = [
  'الخياطة',
  'غسيل السيارات',
  'غسيل الملابس/التنظيف الجاف',
  'مخبزة',
  'صيدلية',
];

const CompanyFieldDropDown = ({ 
  onFieldSelect,  
  initialValue,  
  errors,         
  isSubmitted    
}) => {
  const [selectedField, setSelectedField] = useState(initialValue || '');
  const [searchTerm, setSearchTerm] = useState('');
  const actionSheetRef = useRef(null);

  const filteredFields = COMPANY_FIELDS.filter(field => 
    field.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFieldSelection = (field) => {
    setSelectedField(field);
    onFieldSelect(field);  // Update parent's form data
    actionSheetRef.current?.hide();
  };

  return (
    
    <View className="mt-4 mb-6 w-full">
      <Text className="text-right text-gray-700 mb-2 font-tajawal" style={{ color: Color.green }}>
        مجال الشركة: <Text className="text-red-600">*</Text>
      </Text>
      
      <TouchableOpacity 
        onPress={() => actionSheetRef.current?.show()}
        className={`border ${isSubmitted && !selectedField ? 'border-red-500' : 'border-[#2e752f]'} rounded-lg p-3 bg-white`}
      >
        <Text className={`text-right font-tajawalregular ${selectedField ? 'text-black' : 'text-gray-400'}`}>
          {selectedField || 'اختر مجال الشركة'}
        </Text>
      </TouchableOpacity>

      {isSubmitted && !selectedField ? (
        <Text className="text-red-500 text-right mt-1 font-tajawalregular text-[13px]">
          مجال الشركة مطلوب
        </Text>
      ) : null}

      <ActionSheet
        ref={actionSheetRef}
        id="company-field-sheet"
        containerStyle={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: '90%',
        }}
        gestureEnabled={true}
        closable={true}
        snapPoints={[90]}
      >
        <View className="p-4">
          {/* <TextInput
            placeholder="ابحث عن مجال الشركة"
            placeholderTextColor="#888"
            value={searchTerm}
            onChangeText={setSearchTerm}
            className="border border-gray-300 rounded-lg p-3 mb-4 text-right bg-white font-tajawalregular"
          /> */}

          <FlatList
            data={filteredFields}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity 
                onPress={() => handleFieldSelection(item)}
                className="p-3 border-b border-gray-200"
              >
                <Text className="text-right font-tajawalregular">{item}</Text>
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
      </ActionSheet>
    </View>
    
  );
};

export default CompanyFieldDropDown;