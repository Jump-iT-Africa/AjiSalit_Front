// @ts-nocheck

import { View, Text, SafeAreaView } from 'react-native'
import React, { useState, useEffect } from 'react'
import ProfileHeader from "@/components/HomeHeader/ProfileHeader"
import AddProductManualClient from '@/components/AddProductManualClient/AddproductManual'
import SearchBar from '@/components/Search/SearchCommandsComponents'
import DateFiler from "@/components/DatesFilter/DateFiler"
import OrdersOfCompany from '@/components/OrdersComponentFromCompany/OrderOfCompany'
import AddProductManualCompany from '@/components/AddProductManualCompany/AddProductManualCompany'
import { useSelector, useDispatch } from 'react-redux';
import OrdersOfClient from "@/components/OrdersOfClient/OrdersOfClient"
import getAuthToken from "@/services/api"
import getUserData from "@/services/api"
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {

  const checkStoredData = async () => {
    const token = await AsyncStorage.getItem('token')
    const userData = await AsyncStorage.getItem('user');
    // console.log("this is user data", userData);
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


  const role = useSelector((state) => state.role.role); 
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
          <View className='mt-8  w-full flex items-end'>
            <Text className='text-end text-xl font-tajawal'>الطلبات المتوفرة</Text>
          </View>
        </View>
        <View className='px-4'>
          <SearchBar
            onSearch={(newSearchCode) => {
              setSearchCode(newSearchCode);
              console.log(newSearchCode);
            }}
            onFilter={handleStatusFilter}
            placeholder="بحث..."
          />
        </View>
        <View className='pt-2'>
          <DateFiler
            onFilterChange={handleDateFilter}
          />
        </View>
      </View>
      <View className='w-full h-full px-2 mt-4 '>

        {role === 'client' && <OrdersOfClient 
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