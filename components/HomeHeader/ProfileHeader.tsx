import { View, Text, SafeAreaView, Image } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import ProfilePicture from '@/assets/images/profilePage.jpeg';
import Notifications from '../Notifications/Notifications';
import SettingsIconComponent from '../Settings/SettingsIconComponent';
import Colors from '@/constants/Colors';
import { selectUserData } from '@/store/slices/userSlice'; 
import InitialsAvatar from '@/components/CreateUserAvatar/AvatarUserProfile';



const ProfileHeader = () => {
  const userData = useSelector(selectUserData);
  
  return (
    <SafeAreaView className='w-100 p-0'>
      <View className='flex-row-reverse items-center justify-between pt-2'>
        <View className='flex-row-reverse items-center gap-2'>
          <View>
            < InitialsAvatar name={userData.name} />
          </View>
          <View className='flex items-end justify-start'>
            <Text className='text-start font-tajawal' style={{color: Colors.green}}>
              مرحبا بك،
            </Text>
            <Text className='font-tajawalregular -mt-1'>
              {userData.name || 'محمد أيت الحاج'}
            </Text>
          </View>
        </View>
        
        <View className='flex-row gap-2 justify-center items-center'>
          <View>
            <Notifications />
          </View>
          <View>
            <SettingsIconComponent />
          </View>
        </View>
      </View>
      <View></View>
    </SafeAreaView>
  );
};

export default ProfileHeader;