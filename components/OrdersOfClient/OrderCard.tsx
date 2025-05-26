import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, {useEffect, useState} from 'react';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
// import AjiSalit from "@/assets/images/logo.png";
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setCurrentOrder } from "@/store/slices/OrdersManagment";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AjiSalit from "@/assets/images/coloredLogo.png";
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';


const OrderCard = ({ item }) => {
  
  const [localFinished, setLocalFinished] = useState(item.isFinished);


  useEffect(() => {
    setLocalFinished(item.isFinished);
  }, [item.isFinished]);


  console.log('item here', item);
  
  const icons = [
    {
      id: 0,
      icon: '🧵',
      name: "الخياطة"
    },
    {
      id: 1,
      icon: '🚗',
      name: "غسيل السيارات"
    },
    {
      id: 2,
      icon: '👕',
      name: "غسيل الملابس/التنظيف الجاف"
    },
    {
      id: 3,
      icon: '🍞',
      name: "مخبزة"
    },
    {
      id: 4,
      icon: '💊',
      name: "صيدلية"
    },
  ];



 
  const dispatch = useDispatch();
  const router = useRouter();

  
  if (!item) {
    return null;
  }

  const handleNavigateToDetails = async (item) => {
    
    try {
      console.log('the whole item is ', item);
      
      await AsyncStorage.setItem('lastScannedOrder', JSON.stringify(item));
      
    } catch (storageError) {
      console.log("Failed to store order in AsyncStorage:", storageError);
    }
    
    
      router.push({
        pathname:'/DetailsPage',
        params:{
          ItemID: item.id
        }     
      });
  };

  const customerDisplay = item.customerName || "كليان";

  return (
    <View className={`bg-white rounded-xl mb-4 overflow-hidden shadow-sm w-[100%]`}>
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={()=>handleNavigateToDetails(item)}
        style={{ width: '100%' }}>
        <View className="flex-row items-end justify-end space-x-2 p-4 border-b border-gray-100">
          <View className='flex-row-reverse items-center justify-between w-full'>
            <View className='flex-row items-end justify-end space-x-2'>
              <View className="flex items-end">
                <Text className={`text-lg font-thin text-[#000] font-tajawal`}>{item.companyId.field}</Text>
                <Text className="text-[#6f706f] text-sm">#{item.orderCode}</Text>
              </View>
              {icons.filter(icon => icon.name === item.companyId.field).map((icon) => (
                  <View key={icon.id} className={`w-11 h-11 rounded items-center justify-center `}>
                    <Text className='text-3xl -mt-3 '>{icon.icon}</Text>
                  </View>
                ))}
            </View>
            <View>
              <Image 
                source={AjiSalit}
                style={{
                  width: 36,
                  height: 36,
                  opacity: 1,
                  tintColor: localFinished ? "red" : 'gray',
                }}
                resizeMode='contain'
              />
            </View>
          </View>
        </View>

        <View className="flex-row justify-between p-2">
          <View className="flex-1">
            <View className="bg-gray-100 rounded-lg mx-1 p-2 items-center border border-gray-300 border-1">
              <Text className="text-gray-600 mb-1 font-tajawalregular ">الحالة</Text>
              <Text className={`text-base font-thin font-tajawal text-[12px] ${item.label ==='غير خالص'  ? "text-[#F52525]" : "text-[#2e752f]" } `}>
                {item.label || "جاهزة للتسليم"}
              </Text>
            </View>
          </View>

          <View className="flex-1">
            <View className="bg-gray-100 rounded-lg mx-1 p-2 items-center border border-gray-300 border-1">
              <Text className="text-[#000] mb-1 font-tajawalregular font-[13px] ">التسبيق</Text>
              <Text className="text-base font-thin font-tajawal text-[12px] text-[#FFA30E]">
                {item.advancedAmount || ' 0'} درهم
              </Text>
            </View>
          </View>

          <View className="flex-1">
            <View className="bg-gray-100 rounded-lg mx-1 p-2 items-center border border-gray-300 border-1">
              <Text className="text-gray-600 mb-1 font-tajawalregular text-[14px]">الإجمالي</Text>
              <Text className="text-base font-thin font-tajawal text-[13px] text-[#2e752f]">
                {item.price ? `${item.price} درهم` : '-'}

              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row justify-between items-center p-3 mt-1 mx-2 bg-gray-100 border border-gray-300 border-1 rounded-lg mb-2">
          <View className="flex-row items-center space-x-2">
            <Text className="text-[#000] mr-1 font-tajawalregular text-[10px] mt-0">
              {/* {item.deliveryDate ? `استلام: ${item.deliveryDate}` : ''} */}
            </Text>
          </View>

          <View className="flex-row items-center">
            <View>
              <Text className="text-sm text-black mr-2 font-tajawalregular mt-2">
                {/* {item.deliveryDate ? `تسليم: ${item.date}` : item.date || 'N/A'} */}
                تسليم: {item.newDate === "غير محدد" ?  item.date : item.newDate }
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