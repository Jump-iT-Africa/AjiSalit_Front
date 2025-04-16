import { View, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native'; // <-- import navigation hook
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '@/constants/Colors';
import { logoutUser } from '@/store/slices/userSlice'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsIconComponent = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation(); // <-- use navigation

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
          onPress: async () => {
            
            dispatch(logoutUser());
            
            navigation.reset({
              index: 0,
              routes: [{ name: '(tabs)' }]
            });
          },
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
