import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const SettingsButtons = ({ children, content }) => {
  return (
    <TouchableOpacity className='bg-white mx-4 rounded-lg p-4 flex-row-reverse gap-x-2 items-center mb-4 w-[90%] mx-auto'>
      <View>
        {children}
      </View>
      <View>
        <Text className='font-tajawalregular text-[12px]'>{content}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SettingsButtons;