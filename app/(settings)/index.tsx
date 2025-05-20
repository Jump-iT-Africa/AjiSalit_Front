import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert, Modal, TouchableWithoutFeedback, Linking } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SettingsButtons from '@/components/Settings/SettingsButtons';
import HeaderWithBack from '@/components/ui/HeaderWithToolTipAndback';
import { router, useNavigation } from 'expo-router';
import { logoutUser } from '@/store/slices/userSlice';
import { useDispatch } from 'react-redux';
import Color from "@/constants/Colors.js"


const Settings = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);

  const settingsInfo = [
    {
      id: 1,
      name: "حسابي",
      icon: <FontAwesome name="user-circle-o" size={18} color="#2e752f" />,
      redirection: "(profile)/Profile"
    },
    {
      id: 2,
      name: "الرمز السري",
      icon: <Ionicons name="key-sharp" size={20} color="#2e752f" />,
      redirection: "/UpdatePassword"
    },
    // {
    //   id: 3,
    //   name: "إحالة",
    //   icon: <Ionicons name="gift" size={20} color="#2e752f" />,
    //   redirection: "/adasd"
    // },
    {
      id: 3,
      name: "الدعم",
      icon: <AntDesign name="customerservice" size={20} color="#2e752f" />,
      action: () => setModalVisible(true)
    },
    {
      id: 4,
      name: "الأمان",
      icon: <FontAwesome5 name="lock" size={18} color="#2e752f" />,
      redirection: "/Security"
    },
    {
      id: 5,
      name: "بخصوصنا",
      icon: <AntDesign name="exclamationcircle" size={18} color="#2e752f" />,
      redirection: "/About"
    },
  ];

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
    <SafeAreaView className='flex-1'>
      <HeaderWithBack onPress={() => router.push('(home)')} />
      <View className=''>
        <View className='mx-auto my-7'>
          <Text className='font-tajawal text-2xl text-[#F52525]'>إعدادات</Text>
        </View>
        <View>
          {settingsInfo.map((info) => (
            <SettingsButtons 
              content={info.name} 
              key={info.id} 
              onPress={info.action ? info.action : () => router.push(`${info.redirection}`)}
            >
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

      {/* Support Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View className="bg-white rounded-lg p-6 w-[85%] items-center">
                <Text className="text-red-500 text-2xl font-thin text-center mb-6 font-tajawal pt-2">رقم الإستفسار</Text>
                <TouchableOpacity className="flex-row items-center mb-6"  onPress={() =>
                    Linking.openURL(
                      "https://wa.me/212652235487?text=" + encodeURIComponent("allooo?")
                    )
                  }>
                  <View className=" rounded-full p-2">
                    <Ionicons name="logo-whatsapp" size={24} color="#2e752f" />
                  </View>
                  <Text className="text-xl font-tajawalregular ml-2 mt-2">+212 652 235 487</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center mb-6"  onPress={() =>
                    Linking.openURL(
                      "https://wa.me/212622236154?text=" + encodeURIComponent("allooo?")
                    )
                  }>
                  <View className="rounded-full p-2">
                    <Ionicons name="logo-whatsapp" size={24} color="#2e752f" />
                  </View>
                  <Text className="text-xl font-tajawalregular ml-2 mt-2">+212 622 236 154</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="bg-gray-200 py-2 px-6 rounded-full"
                  onPress={() => setModalVisible(false)}
                >
                  <Text className="font-tajawal">إغلاق</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
      <TouchableOpacity 
        style={{ flex: 1, backgroundColor: 'rgba(47, 117, 47, 0.48)' }}
        activeOpacity={1}
        onPress={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          activeOpacity={1}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#F5F6F7',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: '30%',
            padding: 16
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={{ 
            width: 60, 
            height: 5, 
            backgroundColor: Color.red, 
            borderRadius: 5, 
            alignSelf: 'center',
            marginBottom: 10
          }} />

          <Text className="text-center text-[#F52525] text-[20px] font-thin mb-4 font-tajawal">
            كولشي هو هذاك ؟
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal> */}
    </SafeAreaView>
  );
};

export default Settings;