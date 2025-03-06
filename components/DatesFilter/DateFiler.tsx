import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScaledSize } from 'react-native';

export interface TimeFilterProps {
  onFilterChange?: (filter: string) => void;
}

const DateFiler = ({ onFilterChange }: TimeFilterProps) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  const filters = [
    { id: 'month', label: 'هذا الشهر' },
    { id: 'week', label: 'هذا الأسبوع' },
    { id: 'today', label: 'هذا اليوم' },
    { id: 'all', label: 'الكل' },
  ];

  // Update screen width on dimension changes
  useEffect(() => {
    const updateLayout = ({ window }: { window: ScaledSize }) => {
      setScreenWidth(window.width);
    };

    // Use the newer subscription method
    const subscription = Dimensions.addEventListener('change', updateLayout);

    // Cleanup subscription on unmount
    return () => subscription.remove();
  }, []);

  const handlePress = (filterId: string) => {
    setActiveFilter(filterId);
    onFilterChange?.(filterId);
  };

  return (
    <View className="w-full px-4">
      <View className="flex-row justify-between items-center space-x-2 w-full">
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            onPress={() => handlePress(filter.id)}
            className={`flex-1 py-2 rounded-full border-[1.5px] border-green-700 
              ${activeFilter === filter.id 
                ? 'bg-green-700' 
                : 'bg-white'
              }`}
            style={{ flexGrow: 1 }}
          >
            <Text
              className={`text-center font-tajawalregular text-[12px]
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
    </View>
  );
};

export default DateFiler;