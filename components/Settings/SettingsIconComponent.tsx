import { View, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';

const SettingsIconComponent = () => {
  


  return (
    <TouchableOpacity onPress={()=> router.push('(settings)')}>
      <View className='p-2 rounded-full' style={{backgroundColor:Colors.green}}>
        <Ionicons name="settings-outline" size={24} color="white" />
      </View>
    </TouchableOpacity>
  );
};

export default SettingsIconComponent;
