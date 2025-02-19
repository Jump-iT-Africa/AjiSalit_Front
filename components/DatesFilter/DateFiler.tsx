

import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface TimeFilterProps {
  onFilterChange?: (filter: string) => void;
}

const DateFiler = ({ onFilterChange }: TimeFilterProps) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    
      { id: 'month', label: 'هذا الشهر' },
      { id: 'week', label: 'هذا الأسبوع' },
      { id: 'today', label: 'هذا اليوم' },
      { id: 'all', label: 'الكل' },
  ];

  const handlePress = (filterId: string) => {
    setActiveFilter(filterId);
    onFilterChange?.(filterId);
  };

  return (
    <View className="flex-row items-center justify-center gap-3 pt-3 px-7 ">
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.id}
          onPress={() => handlePress(filter.id)}
          className={`px-[13] py-2 rounded-full border-[1.5px] border-green-700 
            ${activeFilter === filter.id 
              ? 'bg-green-700' 
              : 'bg-white'
            }`}
        >
          <Text
            className={`text-base text-[13.9px] text-center font-tajawalregular
              ${activeFilter === filter.id 
                ? 'text-white' 
                : 'text-green-700'
              }`}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default DateFiler;