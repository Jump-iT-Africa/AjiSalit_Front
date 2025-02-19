import { View, Text } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '@/constants/Colors';


const settingsIconComponent = () => {
  return (
    <View className='p-2 rounded-full' style={{backgroundColor:Colors.green}}>
        <Ionicons name="settings-outline" size={24} color="white" />
    </View>
  )
}   

export default settingsIconComponent