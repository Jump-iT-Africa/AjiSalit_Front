import { View, Text, SafeAreaView, Image } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import ProfilePicture from '@/assets/images/profilePage.jpeg';
import Notifications from '../Notifications/Notifications';
import SettingsIconComponent from '../Settings/SettingsIconComponent';
import Colors from '@/constants/Colors';
import { selectUserData } from '@/store/slices/userSlice'; 
import InitialsAvatar from '@/components/CreateUserAvatar/AvatarUserProfile';
import {selectUserRole} from "@/store/slices/userSlice";


const ProfileHeader = () => {
  const userData = useSelector(selectUserData);
  console.log('user data is', userData);
  
  const role = useSelector(selectUserRole);
  console.log('role form profile is', role);
  
  return (
    <SafeAreaView className='w-100 p-0'>
      <View className='flex-row-reverse items-center justify-between pt-2'>
        <View className='flex-row-reverse items-center gap-2'>
          <View>
            < InitialsAvatar name={userData.Fname} />
          </View>
          <View className='flex items-end justify-start'>
            <Text className='text-start font-tajawal' style={{color: Colors.green}}>
              مرحبا بك،
            </Text>
            <Text className='font-tajawalregular -mt-1'>
              {role === "company" ?
                userData.companyName || 'محمد أيت الحاج'
              :
                userData.Fname || 'محمد أيت الحاج'
              }
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