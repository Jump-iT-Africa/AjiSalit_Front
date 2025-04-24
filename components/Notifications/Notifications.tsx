import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';

const Notifications = () => {
  return (
    <TouchableOpacity onPress={() => router.push('(settings)')} className='p-2 rounded-full' style={{backgroundColor:Colors.green}}>
      <Ionicons name="notifications-outline" size={24} color="white" />
    </TouchableOpacity>
  )
}

export default Notifications