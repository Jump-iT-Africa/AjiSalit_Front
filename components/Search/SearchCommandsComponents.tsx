import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';

export interface SearchBarProps {
  onSearch: (text: string) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder = "بحث..." }: SearchBarProps) => {
  return (
    <View className=" bg-gray-100 mt-2">
      <View className="flex-row items-center bg-white rounded-full px-2.5 h-[50px] shadow-sm border-[#2e752f] border-[1.5px]">
        <TouchableOpacity className="p-1 bg-[#2e752f] rounded-full">
          <Ionicons name="options-outline" size={24} color="white" />
        </TouchableOpacity>
        
        <TextInput
          className="flex-1 text-base px-2.5 text-gray-700 font-tajawalregular pt-6 h-full placeholder:-mt-4 "
          placeholder={placeholder}
          placeholderTextColor="#999"
          textAlign="right"
          onChangeText={onSearch}
        />        
        <TouchableOpacity className="p-2">
          <AntDesign name="search1" size={24} color="#2E7D32" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchBar;