import { View, Text, SafeAreaView, Image, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import ProfileHeader from "@/components/HomeHeader/ProfileHeader"
import AddProductManualClient from '@/components/AddProductManualClient/AddproductManual'
import SearchBar from '@/components/Search/SearchCommandsComponents'
import DateFiler from "@/components/DatesFilter/DateFiler"
import OrdersOfCompany from '@/components/OrdersComponentFromCompany/OrderOfCompany'
import AddProductManualCompany from '@/components/AddProductManualCompany/AddProductManualCompany'
import { useSelector, useDispatch } from 'react-redux';
import OrdersManagment from "@/components/OrdersOfClient/OrdersOfClient"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { selectUserRole, selectUserData, restoreAuthState } from "@/store/slices/userSlice";
import Wallet from "@/assets/images/wallet.png"
import WalletPoor from "@/assets/images/walletPoor.png"
import WalletRich from "@/assets/images/walletRich.png"
import { useFocusEffect } from '@react-navigation/native';

const Home = () => {
  const dispatch = useDispatch();
  const role = useSelector(selectUserRole);
  const userData = useSelector(selectUserData);
  
  const [userPocket, setUserPocket] = useState(0);
  const [searchCode, setSearchCode] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  
  const refreshPocketValue = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('user');
      if (userDataStr) {
        const user = JSON.parse(userDataStr);
        if (user && user.pocket !== undefined && user.pocket !== null) {
          setUserPocket(user.pocket);
          console.log('Refreshed pocket value from AsyncStorage:', user.pocket);
        }
      }
    } catch (error) {
      console.error('Error retrieving user data:', error);
    }
  };
  
  useEffect(() => {
    refreshPocketValue();
  }, []);
  
  useEffect(() => {
    if (userData && userData.pocket !== undefined && userData.pocket !== null) {
      setUserPocket(userData.pocket);
      console.log('Updated pocket from Redux state:', userData.pocket);
    }
  }, [userData]);
  
  useFocusEffect(
    React.useCallback(() => {
      refreshPocketValue();
      dispatch(restoreAuthState());
      
      return () => {
      };
    }, [dispatch])
  );

  const handleStatusFilter = (filters) => {
    console.log('Applying filters:', filters.status);
    setStatusFilter(filters.status);
  };
  
  const handleDateFilter = (filter) => {
    console.log('Selected date filter:', filter);
    setDateFilter(filter);
  };
  
  const getWalletColorAndMessage = () => {
    if (userPocket >= 54) {
      return {
        amountColor: '#295f2b', 
        messageColor: '#295f2b',
        message: 'رصيد ديالك كافي للطلبات الجديدة',
        walletImage: WalletRich
      };
    } else if (userPocket >= 25 && userPocket < 54) {
      return {
        amountColor: '#FFA30E', 
        messageColor: '#FFA30E',
        message: 'رصيد ديالك قرب يسالي',
        walletImage: Wallet
      };
    } else if (userPocket > 0 && userPocket < 24) {
      return {
        amountColor: '#F52525', 
        messageColor: '#F52525',
        message: ' لن تتمكن من إنشاء طلبات جديدة عندما يصل الرصيد إلى 0',
        walletImage: WalletPoor
      };
    } else {
      return {
        amountColor: '#F52525', 
        messageColor: '#F52525',
        message: 'رصيدك 0! لا يمكنك إنشاء طلبات جديدة. يرجى الشحن.',
        walletImage: WalletPoor
      };
    }
  };

  const { amountColor, messageColor, message, walletImage } = getWalletColorAndMessage();

  console.log('User role:', role);
  console.log('User pocket displayed in Home:', userPocket);

  return (
    <SafeAreaView className='flex'>
      <View className='px-0'>
        <View className='px-4'>
          <ProfileHeader />
          <View className='w-full m-auto'>
            {role === 'client' && <AddProductManualClient/>}
            {role === 'company' && <AddProductManualCompany />}
          </View>
          {role === 'client' ? (
            <View className='mt-20 w-full flex items-end'>
              <Text className='text-end text-xl font-tajawal'>الطلبات المتوفرة</Text>
            </View>
          ) : (
            <View className='mt-4 w-full flex items-end'>
              <View className='bg-white w-[100%] p-2 rounded-xl mx-auto mb-4 flex-row justify-between items-center'>
                <View>
                  <Image
                    source={walletImage}
                    resizeMode="contain"
                    className='w-14 h-14'
                  />
                </View>
                <View className='mr-2 flex-1'>
                  <View className='flex-row-reverse items-center gap-2'>
                    <Text style={{ color: amountColor }} className='text-[24px] font-tajawal'>{userPocket}</Text>
                    <Text className='font-tajawal text-[16px]'>درهم</Text>
                  </View>
                  <Text style={{ color: messageColor }} className='font-tajawalregular text-[12px] text-right'>
                    {message}
                  </Text>
                </View>
              </View>
              <Text className='text-end text-xl font-tajawal'>الطلبات المتوفرة</Text>
            </View>
          )}
        </View>
      </View>
      <View className='w-full h-full px-2 mt-4 '>
        {role === 'client' && <OrdersManagment 
          SearchCode={searchCode} 
        />}
        {role === 'company' && <OrdersOfCompany 
          SearchCode={searchCode} 
          statusFilter={statusFilter}
        />}
      </View>
    </SafeAreaView>
  );
}

export default Home