import { View, Text, Pressable, Modal, TouchableOpacity, StyleSheet, ActivityIndicator, TouchableWithoutFeedback } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { useSelector, useDispatch } from 'react-redux'
import { fetchOrderByQrCodeOrId,selectCurrentOrder } from '@/store/slices/OrdersManagment' 
import { fetchOrders } from '@/store/slices/OrdersSlice'


const EditHistoryModal = ({ visible, onClose, orderCode, reason,newDate }) => {

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
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
            <Text className="text-right font-tajawal font-bold text-lg">#{orderCode}</Text>
          </View>
          <View className="p-4">
            <View className="border-r-4 border-amber-500 pr-4 mb-4 rounded">
              <View className="flex-row-reverse items-center justify-between">
                <Text className="text-right font-tajawal font-bold">خياط</Text>
                <View className="bg-amber-500 px-3 py-0 rounded-full">
                  <Text className="text-amber-100 font-tajawal text-xs pt-2">{newDate}</Text>
                </View>
              </View>
              <View className="flex-row-reverse items-center mt-2">
                <MaterialIcons name="schedule" size={18} color="gray" />
                <Text className="text-right font-tajawalregular text-gray-600 mr-2">{reason || 'مول الشركة محددش سبب التأجيل'}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const ClientOrderCards = ({ item, orderId }) => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const currentOrder = useSelector(selectCurrentOrder);
  const [currentColor,setCurrentColor] = useState('#FAD513');
  const orderData = item || currentOrder;

  
  useEffect(() => {
    if (orderId && !orderData) {
      dispatch(fetchOrderByQrCodeOrId(orderId));
    }
  }, [orderId, dispatch, orderData]);
  
  useEffect(() => {
    if (!item) return;
    
    if (item.situation === 'خالص' || item.label === 'خالص') {
      setRemaining(0);
    } else {
      setRemaining((item.price || 0) - (item.advancedAmount || 0));
    }
  }, [item]);
  
  if (!item) {
    return (
      <View className='bg-white mx-3 my-3 rounded-lg p-2 border-t-4 border-[#f290fd]' style={styles.CardContainer}>
         <ActivityIndicator size="large" color="#2e752f" />
         <Text className="text-center p-4 font-tajawalregular">جاري تحميل الطلبات...</Text>
      </View>
    );
  }

  console.log('this item for client', item);
  
  const orderCode = item?.qrCode || item?.orderCode || "HFH83923nsh";
  const orderType = item?.customerField || item?.companyField;
  const orderTypeColor = item?.orderTypeColor || "#d83ce9";
  const orderTypeBgColor = item?.orderTypeBgColor || "#f290fd";
  const totalAmount = item?.price || 150;
  const paidAmount = item?.advancedAmount || 0;
  const remainingAmount = remaining;
  
  const customerField = item.customerField

  let orderStatus = item?.label || item?.situation;

  useEffect(()=>
    {
      if(orderStatus === "تسبيق")
      {
        setCurrentColor("#FAD513")
      }
      else if(orderStatus === "غير خالص")
      {
        setCurrentColor("#F52525")
      }else
      {
        setCurrentColor("#2F752F")
      }
    },[])
  
  
  
  let formattedPickupDate = "08/03/2025";
  if (item?.pickupDate) {
    const date = new Date(item.pickupDate);
    formattedPickupDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }
  

  function cleanDate(input) {
    if (!input) return null;
  
    
    if (typeof input === 'string' && input.includes('T')) {
      return input.split('T')[0]; 
    }
  
    return input; 
  }


  function formatDate(input) {
    if (!input) return null;
  
    
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(input)) {
      return input;
    }
  
    
    if (typeof input === 'string' && input.includes('T')) {
      input = input.split('T')[0]; 
    }
  
    const date = new Date(input);
    if (isNaN(date)) return null;
  
    const day = String(date.getDate()).padStart(1, '0');
    const month = String(date.getMonth() + 1).padStart(1, '0');
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  }
  
  
  const formattedDeliveryDate = formatDate(item.deliveryDate);
  
  const originalDeliveryDate = item?.originalDeliveryDate || formattedPickupDate;

  const isDateChanged = item?.isDateChanged || false;
  console.log('is date changed', isDateChanged);
  
  const companyName = item?.companyId?.name || "Ajisalit";
  
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

  return (
    <View className='bg-white mx-3 my-3 rounded-lg p-2' style={styles.CardContainer}>
      
      <View className="flex-row items-end justify-end space-x-2 p-4 border-b border-gray-100">
        <View className='flex-row-reverse items-center justify-between w-full'>
          <View className='flex-row items-center justify-center space-x-2 '>
            <View className="flex items-end ">
              <Text className={`text-lg font-bold text-[${orderTypeColor}] font-tajawal text-[#2e752f]`}>{orderType}</Text>
              <Text className="text-black text-sm ">{orderCode}</Text>
            </View>
              {icons.filter(icon => icon.name === item.customerField).map((icon) => (
                <View key={icon.id} className={`w-11 h-11 rounded items-center justify-center `}>
                  <Text className='text-3xl -mt-3 '>{icon.icon}</Text>
                </View>
              ))}
          </View>
          <TouchableOpacity style={{ backgroundColor: currentColor, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 50 }}>
            <Text className="text-white font-bold text-center font-tajawalregular text-xs pt-1">{orderStatus}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row justify-between p-2">
        <View className="flex-1">
          <View className="bg-gray-100 rounded-lg mx-1 p-2 items-center border border-gray-300 border-1">
            <Text className=" text-gray-600 mb-1 font-tajawalregular ">الباقي</Text>
            <Text className="text-base font-bold font-tajawal text-[13px] text-[#2F752F]">{remainingAmount} درهم</Text>
          </View>
        </View>

        <View className="flex-1">
          <View className="bg-[#2F752F] rounded-lg mx-1 p-2 items-center border border-gray-300 border-1">
            <Text className=" text-[#fff] mb-1 font-tajawalregular font-[12px]">التسبيق</Text>
            <Text className="text-base font-bold font-tajawal text-[13px] text-[#FAD513]">{paidAmount} درهم</Text>
          </View>
        </View>

        <View className="flex-1">
          <View className="bg-gray-100 rounded-lg mx-1 p-2 items-center border border-gray-300 border-1">
            <Text className=" text-gray-600 mb-1 font-tajawalregular text-[13px]">إجمالي</Text>
            <Text className="text-base font-bold font-tajawal text-[13px] text-[#2F752F]">{totalAmount} درهم</Text>
          </View>
        </View>
      </View>

      <View className="flex-row justify-between items-center p-3 mt-1 mx-2 bg-gray-100 border border-gray-300 border-1 rounded-lg mb-2">
        
        <Pressable 
          className="flex-row items-center" 
          onPress={() => setModalVisible(true)}
        >
          {isDateChanged && (
            <View className='flex-row items-center'>
              <Text className="text-amber-500 mr-1 font-tajawalregular text-[10px] mt-0">سجل التعديلات</Text>
              <Ionicons name="information-circle-outline" size={18} color="#FFA30E" />
            </View>
          )}
        </Pressable>
        
        <View className="flex-row items-center ">
          {/* {isDateChanged && (
            <View className="flex-row items-center bg-amber-50 px-2 py-1 rounded-full mt-0 mr-1">
              <Text className="text-sm text-amber-500 mr-1 font-tajawalregular text-[6px] ">تم التعديل</Text>
              <MaterialIcons name="edit" size={8} color="#ffb300" />
            </View>
          )} */}
            <View className='flex items-end space-x-0'>
              {isDateChanged ? (
                <View className="flex-1 mx-3 items-end justify-between">
                  <Text className="text-gray-800 text-right font-tajawalregular text-xs pt-2">تاريخ التسليم:</Text>
                  <View className='flex-row-reverse items-center gap-x-2'>
                    <Text className="text-sm text-black mr-0 font-tajawalregular mt-1">{formatDate(item.newDate)}</Text>
                    <Text className="text-[12px] text-slate-400 mr-0 font-tajawalregular line-through">{formatDate(item.deliveryDate)}</Text>
                  </View>
              </View>
              ):(
                <View className="flex-1 mx-3 items-end justify-between">
                  <Text className="text-gray-800 text-right font-tajawalregular text-xs pt-2">تاريخ التسليم:</Text>
                  <Text className="text-sm text-black mr-0 font-tajawalregular ">{formattedDeliveryDate}</Text>
                </View>
              )}
            </View>
          <View className="bg-green-100 p-3 rounded-lg">
            <Ionicons name="calendar-outline" size={24} color="#4A8646" />
          </View>
        </View>
      </View>

      <EditHistoryModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        orderCode={orderCode}
        newDate={formatDate(item.newDate)} 
        reason={item.ChangeDateReason}        
      />

    </View>
  );
};

const styles = StyleSheet.create({
  CardContainer:{
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
});

export default ClientOrderCards;