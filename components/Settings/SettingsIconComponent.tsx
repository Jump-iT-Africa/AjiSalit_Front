import { View, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { useDispatch } from 'react-redux';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '@/constants/Colors';
import { logout } from '@/store/slices/userSlice'; 
import { logoutUser } from '@/store/slices/userSlice';
const SettingsIconComponent = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    Alert.alert(
      "تسجيل الخروج",
      "هل أنت متأكد من تسجيل الخروج؟",
      [
        {
          text: "إلغاء",
          style: "cancel"
        },
        { 
          text: "تسجيل الخروج", 
          onPress: () => dispatch(logoutUser()),
          style: "destructive"
        }
      ]
    );
  };

  return (
    <TouchableOpacity onPress={handleLogout}>
      <View className='p-2 rounded-full' style={{backgroundColor:Colors.green}}>
        <Ionicons name="settings-outline" size={24} color="white" />
      </View>
    </TouchableOpacity>
  );
};

export default SettingsIconComponent;