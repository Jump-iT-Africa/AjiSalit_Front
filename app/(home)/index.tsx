import { View, Text, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import ProfileHeader from "@/components/HomeHeader/ProfileHeader"
import AddproductManual from '@/components/AddProductManual/AddproductManual'
import SearchBar  from '@/components/Search/SearchCommandsComponents'
import DateFiler from "@/components/DatesFilter/DateFiler"
import OrdersOfCompany from '@/components/OrdersComponentFromCompany/OrderOfCompany'
import AddProductManualCompany from '@/components/AddProductManualCompany/AddProductManualCompany'

const Home = () => {

    const [SearchCode, SetsearchCode] = useState('');

  return (
    <SafeAreaView className='flex'>
      <View className='px-4'>
        <View>
          <ProfileHeader />
          <View className='  w-full m-auto ' >
              <AddProductManualCompany />  
          </View>
          <View className='mt-5  w-full flex items-end '>
            <Text className='text-end text-xl font-tajawal'>الطلبات ديالك</Text>
          </View>
        </View>
        <SearchBar 
          onSearch={(newSearchCode) => {
            SetsearchCode(newSearchCode);
            console.log(newSearchCode);
            
          }}
          placeholder="بحث..."
        />
        <View className='px-4'>
          <DateFiler 
              onFilterChange={(filter) => {
                console.log('Selected filter:', filter);
              }}
            />
        </View>
      </View>
      <View className=' w-full h-full px-4 mt-4'>
          <OrdersOfCompany SearchCode={SearchCode} />
      </View>
    </SafeAreaView>
  )
}

export default Home