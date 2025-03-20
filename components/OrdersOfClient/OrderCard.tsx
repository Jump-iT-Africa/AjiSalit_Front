import { View, Text, Image, Modal, TouchableOpacity, Pressable } from 'react-native';
import React, { useState } from 'react';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import AjiSalit from "@/assets/images/logo.png";
import { useRouter } from 'expo-router';

const OrderCard = ({ item }) => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const getColorTheme = (order) => {
    if (order.CompanyName === "خياط") {
      return {
        primary: "purple-500",      
        secondary: "purple-100",    
        icon: "cut",              
        iconColor: "#ae52d4"      
      };
    } else if (order.CompanyName === "صيدلية") {
      return {
        primary: "green-500",
        secondary: "green-100", 
        icon: "pills",
        iconColor: "#4caf50"
      };
    } else {
      return {
        primary: "blue-500",
        secondary: "blue-100",
        icon: "tshirt",
        iconColor: "#2196f3"
      };
    }
  };

  const theme = getColorTheme(item);
  const companyOrCustomer = item.CompanyName || (item.customerName || "");

  return (
    <View className={`bg-white rounded-xl mb-4 overflow-hidden shadow-sm border-t-4 border-${theme.primary} w-[100%]`}>
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => {
          console.log('Item pressed:', item.orderCode);
          router.push({
            pathname: '/DetailsPage',
            params: { id: item.orderCode }
          });
        }}
        style={{ width: '100%' }}>
        <View className="flex-row items-end justify-end space-x-2 p-4 border-b border-gray-100">
          <View className='flex-row-reverse items-center justify-between w-full'>
            <View className='flex-row items-end justify-end space-x-2'>
              <View className="flex items-end ">
                <Text className={`text-lg font-bold text-${theme.primary} font-tajawal`}>{companyOrCustomer}</Text>
                <Text className="text-black text-sm ">#{item.orderCode.substring(0, 7)}</Text>
              </View>
              <View className={`w-11 h-11 rounded bg-${theme.secondary} items-center justify-center`}>
                <FontAwesome5 name={theme.icon} size={20} color={theme.iconColor} />
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

        <View className="flex-row justify-between p-2">
          <View className="flex-1">
            <View className="bg-gray-100 rounded-lg mx-1 p-2 items-center border border-gray-300 border-1">
              <Text className=" text-gray-600 mb-1 font-tajawalregular ">الباقي</Text>
              <Text className="text-base font-bold font-tajawal text-[13px]">
                {item.amount && (item.amount.value ? `${item.amount.value} ${item.amount.currency || 'درهم'}` : '100 درهم')}
              </Text>
            </View>
          </View>

          <View className="flex-1">
            <View className="bg-gray-100 rounded-lg mx-1 p-2 items-center border border-gray-300 border-1">
              <Text className=" text-cyan-500 mb-1 font-tajawalregular font-[12px]">التسبيق</Text>
              <Text className="text-base font-bold font-tajawal text-[13px]">
                {item.deposit ? `${item.deposit} درهم` : '50 درهم'}
              </Text>
            </View>
          </View>

          <View className="flex-1">
            <View className="bg-gray-100 rounded-lg mx-1 p-2 items-center border border-gray-300 border-1">
              <Text className=" text-gray-600 mb-1 font-tajawalregular text-[13px]">إجمالي</Text>
              <Text className="text-base font-bold font-tajawal text-[13px]">
                {item.total ? `${item.total} درهم` : '150 درهم'}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row justify-between items-center p-3 mt-1 mx-2 bg-gray-100 border border-gray-300 border-1 rounded-lg mb-2">
          {item.isEdited && item.previousDate ? (
            <View className="flex-row items-center space-x-2 ">
              <Pressable 
                className="flex-row items-center" 
                onPress={() => setModalVisible(true)}
              >
                <Text className="text-cyan-500 mr-1 font-tajawalregular text-[10px] mt-0">سجل التعديلات</Text>
                <Ionicons name="information-circle-outline" size={18} color="#00bcd4" />
              </Pressable>
            </View>
          ) : (
            <Text></Text>
          )}

          <View className="flex-row items-center">
            {item.CompanyName === "خياط" && item.isEdited && (
              <View className="flex-row items-center bg-amber-50 px-2 py-1 rounded-full mt-1 mr-1">
                <Text className="text-sm text-amber-500 mr-1 font-tajawalregular text-[8px] ">تم التعديل</Text>
                <MaterialIcons name="edit" size={16} color="#ffb300" />
              </View>
            )}
            <View>
              <Text className="text-sm text-black mr-2 font-tajawalregular mt-2">{item.date}</Text>
              {item.isEdited && item.previousDate && (
                <Text className="text-sm text-gray-400 mr-2 font-tajawalregular line-through">{item.previousDate}</Text>
              )}
            </View>
            <View className={`bg-${theme.secondary} p-2 rounded-lg`}>
              <MaterialIcons name="calendar-today" size={18} color={theme.iconColor} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <EditHistoryModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        order={item} 
      />
    </View>
  );
};

// Add EditHistoryModal component here
const EditHistoryModal = ({ visible, onClose, order }) => {
  if (!order) return null;

  const getColorTheme = (order) => {
    if (order.CompanyName === "خياط") {
      return {
        primary: "purple-500",      
        secondary: "purple-100",    
        icon: "cut",              
        iconColor: "#ae52d4"      
      };
    } else if (order.CompanyName === "صيدلية") {
      return {
        primary: "green-500",
        secondary: "green-100", 
        icon: "pills",
        iconColor: "#4caf50"
      };
    } else {
      return {
        primary: "blue-500",
        secondary: "blue-100",
        icon: "tshirt",
        iconColor: "#2196f3"
      };
    }
  };

  const theme = getColorTheme(order);
  
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-11/12 bg-white rounded-lg overflow-hidden">
          <View className={`bg-[#2F752F] p-4 flex-row items-center justify-between`}>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome5 name="times-circle" size={24} color="white" />
            </TouchableOpacity>
            <View className="flex-row items-center space-x-2 ">
              <Text className="text-white font-tajawalregular text-lg ml-2 mt-1">سجل التعديلات</Text>
              <Ionicons name="warning-outline" size={24} color="#FFC107" />
            </View>
          </View>
          
          {/* Order Code */}
          <View className="p-4 border-b border-gray-200">
            <Text className="text-right font-tajawalregular text-gray-600 text-sm">رقم الطلب</Text>
            <Text className="text-right font-tajawal font-bold text-lg">#{order.orderCode}</Text>
          </View>
          
          {order.isEdited && order.previousDate ? (
            <View className="p-4">
              <View className="border-r-4 border-amber-500 pr-4 mb-4 rounded">
                <View className="flex-row-reverse items-center justify-between">
                  <Text className="text-right font-tajawal font-bold">{order.CompanyName}</Text>
                  <View className="bg-amber-500 px-3 py-0 rounded-full">
                    <Text className="text-amber-100 font-tajawal text-xs pt-2">
                      {order.editHistory && order.editHistory[0]?.date || "12/03/2025"}
                    </Text>
                  </View>
                </View>
                <View className="flex-row-reverse items-center mt-2">
                  <MaterialIcons name="schedule" size={18} color="gray" />
                  <Text className="text-right font-tajawalregular text-gray-600 mr-2">
                    {order.editHistory && order.editHistory[0]?.reason || "غياب الخياط بسبب المرض"}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View>
              <Text className='text-center my-4 font-tajawalregular text-[#2e752f]'>ليست هنالك تعديلات</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default OrderCard;