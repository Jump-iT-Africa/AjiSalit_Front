import { View, Text, SafeAreaView, Image } from 'react-native'
import React from 'react'
import ProfilePicture from '@/assets/images/profilePage.jpeg'
import Notifications from '../Notifications/Notifications'
import SettingsIconComponent from '../Settings/SettingsIconComponent'
import Colors from '@/constants/Colors'


const ProfileHeader = () => {
  return (
    <SafeAreaView className=' w-100  p-0 '>
        <View className='flex-row-reverse items-center justify-between pt-2 '>
            <View className='flex-row-reverse items-center gap-2 '>
                <View>
                    <Image source={ProfilePicture}
                        className='rounded-full w-12 h-12'
                    />
                </View>
                <View className='flex items-end justify-start '>
                    <Text className='text-start font-tajawal ' style={{color:Colors.green}}>
                        مرحبا بك،
                    </Text>
                    <Text className='font-tajawalregular -mt-1'>
                        محمد أيت الحاج 
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
  )
}

export default ProfileHeader