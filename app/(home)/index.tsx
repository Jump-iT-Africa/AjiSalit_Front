// @ts-nocheck

import { View, Text, SafeAreaView } from 'react-native'
import React, { useState, useEffect } from 'react'
import ProfileHeader from "@/components/HomeHeader/ProfileHeader"
import AddproductManual from '@/components/AddProductManual/AddproductManual'
import SearchBar from '@/components/Search/SearchCommandsComponents'
import DateFiler from "@/components/DatesFilter/DateFiler"
import OrdersOfCompany from '@/components/OrdersComponentFromCompany/OrderOfCompany'
import AddProductManualCompany from '@/components/AddProductManualCompany/AddProductManualCompany'

const Home = () => {
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

  return (
    <SafeAreaView className='flex'>
      <View className='px-0'>
        <View className='px-4'>
          <ProfileHeader />
          <View className='w-full m-auto'>
            <AddProductManualCompany />
          </View>
          <View className='mt-5 w-full flex items-end'>
            <Text className='text-end text-xl font-tajawal'>الطلبات ديالك</Text>
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
      <View className='w-full h-full px-4 mt-4'>
        <OrdersOfCompany 
          SearchCode={searchCode} 
          statusFilter={statusFilter}
        />
      </View>
    </SafeAreaView>
  );
}

export default Home