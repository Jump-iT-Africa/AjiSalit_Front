
import { View, Text, SafeAreaView,Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import ProfileHeader from "@/components/HomeHeader/ProfileHeader"
import AddProductManualClient from '@/components/AddProductManualClient/AddproductManual'
import SearchBar from '@/components/Search/SearchCommandsComponents'
import DateFiler from "@/components/DatesFilter/DateFiler"
import OrdersOfCompany from '@/components/OrdersComponentFromCompany/OrderOfCompany'
import AddProductManualCompany from '@/components/AddProductManualCompany/AddProductManualCompany'
import { useSelector, useDispatch } from 'react-redux';
import OrdersManagment from "@/components/OrdersOfClient/OrdersOfClient"
import getAuthToken from "@/services/api"
import getUserData from "@/services/api"
import AsyncStorage from '@react-native-async-storage/async-storage';
import {selectUserRole} from "@/store/slices/userSlice";
import Wallet from "@/assets/images/wallet.png"

const Home = () => {
  const checkStoredData = async () => {
    const token = await AsyncStorage.getItem('token')
    const userData = await AsyncStorage.getItem('user');
  };
  
  checkStoredData();
  
  
  const [searchCode, setSearchCode] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);

  const handleStatusFilter = (filters) => {
    console.log('Applying filters:', filters.status);
    setStatusFilter(filters.status);
  };
  
  const handleDateFilter = (filter) => {
    console.log('Selected date filter:', filter);
    setDateFilter(filter);
  };



  const role = useSelector(selectUserRole);
  
  const dispatch = useDispatch();

  console.log(role);

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

          <View className='mt-20  w-full flex items-end'>
          <Text className='text-end text-xl font-tajawal'>الطلبات المتوفرة</Text>
          </View>
          ):(
              <View className='mt-4  w-full flex items-end'>
                <View className='bg-white w-[100%] p-2 rounded-xl  mx-auto mb-4 flex-row justify-between items-center '>
                  <View>
                    <Image
                      source={Wallet}
                      resizeMode="contain"
                      className='w-19 h-19'
                    />
                  </View>
                  <View className='mr-2'>
                      <View className='flex-row-reverse items-center gap-2'>
                        <Text className='text-[24px] font-tajawal text-[#FAD513] '>25</Text>
                        <Text className='font-tajawal text-[16px]'>درهم</Text>
                      </View>
                      <Text className='font-tajawalregular text-[12px] text-[#FAD513]'>رصيد ديالك قرب يسالي</Text>
                  </View>
                </View>
            <Text className='text-end text-xl font-tajawal'>الطلبات المتوفرة</Text>
          </View>
          )

        }
         
        </View>
        {/* <View className='px-4'>
          <SearchBar
            onSearch={(newSearchCode) => {
              setSearchCode(newSearchCode);
              console.log(newSearchCode);
            }}
            onFilter={handleStatusFilter}
            placeholder="بحث..."
          />
        </View> */}
        {/* <View className='pt-2'> */}
          {/* {role === 'company' &&
            <DateFiler
            onFilterChange={handleDateFilter}
          />
          } */}
        {/* </View> */}
      </View>
      <View className='w-full h-full px-2 mt-4 '>

        {role === 'client' && <OrdersManagment 
              SearchCode={searchCode} 
        />}
        {role === 'company' && <OrdersOfCompany 
            SearchCode={searchCode} 
            statusFilter={statusFilter}
          />
          }
      </View>
    </SafeAreaView>
  );
}

export default Home