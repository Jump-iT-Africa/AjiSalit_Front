import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import SettingsButtons from '@/components/Settings/SettingsButtons';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Settings = () => {

  const settingsInfo =[
    {
      id:1,
      name: "حسابي",
      icon: <FontAwesome name="user-circle-o" size={18} color="#2e752f"/>,
      redirection: "/adasd"
    },
    {
      id:2,
      name: "إشعارات",
      icon: <Ionicons name="notifications-circle-sharp" size={21} color="#2e752f" />,
      redirection: "/adasd"
    },
    {
      id:3,
      name: "إحالة",
      icon: <Ionicons name="gift" size={20} color="#2e752f" />,
      redirection: "/adasd"
    },
    {
      id:4,
      name: "الدعم",
      icon: <AntDesign name="customerservice" size={20} color="#2e752f" />,
      redirection: "/adasd"
    },
    {
      id:5,
      name: "الأمان",
      icon: <FontAwesome5 name="lock" size={18} color="#2e752f" />  ,
      redirection: "/adasd"
    },
    {
      id:6,
      name: "بخصوصنا",
      icon: <AntDesign name="exclamationcircle" size={18} color="#2e752f" />,
      redirection: "/adasd"
    },
  ]

  return (
    <SafeAreaView className='flex-1 '>
        <View className=''>
            <View>
                <Text>إعدادات</Text>
            </View>
            <View>
            {settingsInfo.map((info)=>(
              <SettingsButtons content={info.name} key={info.id}>
              {info.icon}
            </SettingsButtons>
            ))}
              
              
            </View>
        </View>
    </SafeAreaView>
  )
}

export default Settings;