import { View, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import SettingsButtons from '@/components/Settings/SettingsButtons';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import HeaderWithBack from '@/components/ui/HeaderWithToolTipAndback';
import { router, useNavigation } from 'expo-router';
import { logoutUser } from '@/store/slices/userSlice'; 
import { useDispatch } from 'react-redux';
import coloredLogo from '@/assets/images/coloredLogo.png'


const Settings = () => {
  const navigation = useNavigation(); 
  const dispatch = useDispatch();

  const settingsInfo =[
    {
      id:1,
      name: "حسابي",
      icon: <FontAwesome name="user-circle-o" size={18} color="#2e752f"/>,
      redirection: "(profile)/Profile"
    },
    {
      id:2,
      name: "الرمز السري",
      icon: <Ionicons name="key-sharp" size={20} color="#2e752f" />,
      redirection: "/UpdatePassword"
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
    <SafeAreaView className='flex-1 '>
      <HeaderWithBack onPress={() => router.push('(home)')} />
        <View className=''>
            <View className='mx-auto my-7'>
                <Text className='font-tajawal text-2xl text-[#F52525]'>إعدادات</Text>
            </View>
            <View>
            {settingsInfo.map((info)=>(
              <SettingsButtons content={info.name} key={info.id} onPress={()=>router.push(`${info.redirection}`)}>
              {info.icon}
            </SettingsButtons>
            ))}
              
              
            </View>
        </View>
        <TouchableOpacity onPress={handleLogout}>
            <View className='bg-[#F52525] m-auto rounded-full p-2 mt-10'>
              <AntDesign name="logout" size={40} color="white" />
            </View>
        </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Settings;