import { View, Text } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '@/constants/Colors';

const Notifications = () => {
  return (
    <View className='p-2 rounded-full' style={{backgroundColor:Colors.green}}>
      <Ionicons name="notifications-outline" size={24} color="white" />
    </View>
  )
}

export default Notifications