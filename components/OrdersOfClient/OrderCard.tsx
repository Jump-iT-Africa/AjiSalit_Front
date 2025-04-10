import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, {useEffect} from 'react';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import AjiSalit from "@/assets/images/logo.png";
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setCurrentOrder } from "@/store/slices/OrdersManagment";
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderCard = ({ item }) => {
  useEffect(() => {
    console.log("Order info in OrderCard:", item);
  }, []);
  const dispatch = useDispatch();
  const router = useRouter();

  
  if (!item) {
    return null;
  }

  const handleNavigateToDetails = async (item) => {
    
    try {
      await AsyncStorage.setItem('lastScannedOrder', JSON.stringify(item));
      
    } catch (storageError) {
      console.log("Failed to store order in AsyncStorage:", storageError);
    }
   
      router.push('/DetailsPage');
  };

  const customerDisplay = item.customerName || "كليان";

  return (
    <View className={`bg-white rounded-xl mb-4 overflow-hidden shadow-sm border-t-4 border-[#295f2b] w-[100%]`}>
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={()=>handleNavigateToDetails(item)}
        style={{ width: '100%' }}>
        {/* Card content remains the same... */}
        <View className="flex-row items-end justify-end space-x-2 p-4 border-b border-gray-100">
          <View className='flex-row-reverse items-center justify-between w-full'>
            <View className='flex-row items-end justify-end space-x-2'>
              <View className="flex items-end">
                <Text className={`text-lg font-bold text-[#295f2b] font-tajawal`}>{item.field}</Text>
                <Text className="text-black text-sm">#{item.orderCode}</Text>
              </View>
              <View className={`w-11 h-11 rounded bg-green-100 items-center justify-center`}>
                <FontAwesome5 name="tshirt" size={20} color="#295f2b" />
              </View>
            </View>
            <View>
              <Image 
                source={AjiSalit}
                style={{
                  width: 36,
                  height: 36,
                }}
                resizeMode='contain'
              />
            </View>
          </View>
        </View>

        {/* Rest of the card content... */}
        <View className="flex-row justify-between p-2">
          <View className="flex-1">
            <View className="bg-gray-100 rounded-lg mx-1 p-2 items-center border border-gray-300 border-1">
              <Text className="text-gray-600 mb-1 font-tajawalregular">الحالة</Text>
              <Text className="text-base font-bold font-tajawal text-[12px]">
                {item.label || "في طور الانجاز"}
              </Text>
            </View>
          </View>

          <View className="flex-1">
            <View className="bg-gray-100 rounded-lg mx-1 p-2 items-center border border-gray-300 border-1">
              <Text className="text-cyan-500 mb-1 font-tajawalregular font-[13px]">التسبيق</Text>
              <Text className="text-base font-bold font-tajawal text-[12px]">
                {item.advancedAmount || ' 0'} درهم
              </Text>
            </View>
          </View>

          <View className="flex-1">
            <View className="bg-gray-100 rounded-lg mx-1 p-2 items-center border border-gray-300 border-1">
              <Text className="text-gray-600 mb-1 font-tajawalregular text-[14px]">الإجمالي</Text>
              <Text className="text-base font-bold font-tajawal text-[13px]">
                {item.price ? `${item.price} درهم` : '-'}

              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row justify-between items-center p-3 mt-1 mx-2 bg-gray-100 border border-gray-300 border-1 rounded-lg mb-2">
          <View className="flex-row items-center space-x-2">
            <Text className="text-cyan-500 mr-1 font-tajawalregular text-[10px] mt-0">
              {item.deliveryDate ? `استلام: ${item.deliveryDate}` : ''}
            </Text>
          </View>

          <View className="flex-row items-center">
            <View>
              <Text className="text-sm text-black mr-2 font-tajawalregular mt-2">
                {item.deliveryDate ? `تسليم: ${item.date}` : item.date || 'N/A'}
              </Text>
            </View>
            <View className={`bg-green-100 p-2 rounded-lg`}>
              <MaterialIcons name="calendar-today" size={18} color="#295f2b" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default OrderCard;