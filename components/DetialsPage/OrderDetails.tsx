// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux';
import { updateOrderDate, selectOrderLoading,fetchORderById } from '@/store/slices/OrdersManagment'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderDetailsCard = ({ 
  totalAmount = 150, 
  paidAmount = 50, 
  remainingAmount = 100, 
  deliveryDate,
  currency = "درهم",
  situation,
  orderId, 
  onDateChange = (newDate, reason) => {}
}) => {

  console.log(orderId);
  
  console.log('delivey date', deliveryDate);
  useEffect(() => {
    console.log('Delivery date prop updated:', deliveryDate);
    setSelectedDate(deliveryDate);
  }, [deliveryDate]);
  
  const dispatch = useDispatch();
  const isLoading = useSelector(selectOrderLoading);

  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reason, setReason] = useState('');
  const [selectedDate, setSelectedDate] = useState(deliveryDate);
  const [currentColor, setCurrentColor] = useState('#2e752f');
  const [updateStatus, setUpdateStatus] = useState(''); 

  const openDatePicker = () => {
    setShowDatePicker(true);
  };
  
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
    
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    
    setSelectedDate(formattedDate);
  };
  
const saveChanges = async () => {
  const dateParts = selectedDate.split('/');
  const formattedForAPI = dateParts.length === 3 
    ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}` 
    : selectedDate;
  
  try {
    const result = await dispatch(updateOrderDate({
      orderId: orderId,
      dateData: {
        deliveryDate: formattedForAPI,
        reason: reason 
      }
    })).unwrap();

    useEffect(async() =>
    {
        const localStoragValuue=  await AsyncStorage.getItem('lastScannedOrder');
        const parsedOrder = JSON.parse(localStoragValuue);
        console.log("last scanned order from order details", parsedOrder);
    },[])
    
    console.log('Date updated successfully:', result);
    setUpdateStatus('تم تحديث التاريخ بنجاح');
    
    // Call the parent function to notify about the change
    onDateChange(selectedDate, reason);
    
    setTimeout(() => {
      setUpdateStatus('');
      setModalVisible(false);
      setReason('');
    }, 1500);
  } catch (error) {
    console.log('Failed to update date:', error);
    setUpdateStatus(`فشل في تحديث التاريخ ${error}` );
    
    setTimeout(() => {
      setUpdateStatus('');
    }, 3000);
  }
};

  

  console.log("this is situation", situation);

  useEffect(() => {
    if (situation === "تسبيق") {
      setCurrentColor("#FAD513");
    } else if (situation === "غير خالص") {
      setCurrentColor("#F52525");
    } else {
      setCurrentColor("#2F752F");
    }
  }, [situation]);

  return (
    <View className="border-4 border-[#2e752f] border-l-0 border-r-0 border-b-0 rounded-lg p-4 bg-white my-3 w-[95%] mx-auto" style={styles.detailscontainer}>
      <View className="flex-row-reverse justify-between items-center border-b border-gray-200 pb-2 mb-4">
        <Text className="font-bold text-green-700 text-right font-tajawalregular text-smt">تفاصيل الطلب:</Text>
        <TouchableOpacity style={{ backgroundColor: currentColor, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 50 }}>
          <Text className=" font-bold text-center font-tajawalregular text-xs text-white">{situation}</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row-reverse justify-between border border-gray-200 rounded-lg mb-4 overflow-hidden">
        <View className="flex-1 p-3 items-center bg-gray-100">
          <Text className="mb-1.5 text-center font-bold font-tajawalregular text-xs">المبلغ الإجمالي</Text>
          <Text className="font-bold text-center text-green-700 font-tajawalregular text-xs">
            {totalAmount} {currency}
          </Text>
        </View>
        <View className="flex-1 p-3 items-center bg-green-700">
          <Text className="mb-1.5 text-center font-bold text-white font-tajawalregular text-xs">التسبيق</Text>
          <Text className="font-bold text-center text-yellow-400 font-tajawalregular text-xs">
            {paidAmount} {currency}
          </Text>
        </View>
        <View className="flex-1 p-3 items-center bg-gray-100">
          <Text className="mb-1.5 text-center font-bold font-tajawalregular text-xs">الباقي</Text>
          <Text className="font-bold text-center text-green-700 font-tajawalregular text-xs">
            {remainingAmount} {currency}
          </Text>
        </View>
      </View>
      
      <View className="flex-row-reverse items-center border border-gray-200 rounded-lg p-2.5">
        <View className="bg-green-100 p-3 rounded-lg">
          <Ionicons name="calendar-outline" size={24} color="#4A8646" />
        </View>
        <View className="flex-1 mx-3 items-end justify-between">
          <Text className="text-gray-800 text-right font-tajawalregular text-xs">تاريخ التسليم:</Text>
          <Text className="font-bold text-green-700 text-right font-tajawalregular text-xs">{deliveryDate} </Text>
        </View>
        <TouchableOpacity className="ml-2" onPress={() => setModalVisible(true)}>
          <Feather name="edit" size={21} color="#2e752f"/>
        </TouchableOpacity>
      </View>
           
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>تعديل تاريخ التسليم</Text>
                       
            <View style={styles.dateContainer}>
              <Text style={styles.label}>التاريخ الجديد:</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={openDatePicker}
              >
                <Text style={styles.dateText}>{selectedDate}</Text>
                <Ionicons name="calendar-outline" size={20} color="#2e752f" />
              </TouchableOpacity>
            </View>
                       
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
                       
            <View style={styles.reasonContainer}>
              <Text style={styles.label}>سبب التغيير:</Text>
              <TextInput
                style={styles.reasonInput}
                multiline={true}
                numberOfLines={3}
                placeholder="أدخل سبب تغيير التاريخ هنا..."
                placeholderTextColor="#888"
                textAlign="right"
                value={reason}
                onChangeText={setReason}
              />
            </View>
            
            {updateStatus ? (
              <Text style={[
                styles.statusMessage, 
                updateStatus.includes('فشل') ? styles.errorStatus : styles.successStatus
              ]}>
                {updateStatus}
              </Text>
            ) : null}
                       
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setModalVisible(false)}
                disabled={isLoading}
              >
                <Text style={styles.buttonCancelText}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonSave]}
                onPress={saveChanges}
                disabled={isLoading}
              >
                <Text style={styles.buttonSaveText}>
                  {isLoading ? 'جاري التحديث...' : 'حفظ'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  detailscontainer: {
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'TajawalRegular',
    color: '#2e752f',
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 15,
  },
  dateContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontFamily: 'TajawalRegular',
    color: '#333',
    marginBottom: 8,
    textAlign: 'right',
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2e752f',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'TajawalRegular',
    color: '#333',
  },
  reasonContainer: {
    marginBottom: 20,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    textAlign: 'right',
    fontFamily: 'TajawalRegular',
    fontSize: 14,
    color: '#333',
    height: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 25,
    padding: 12,
    elevation: 2,
    width: '48%',
  },
  buttonSave: {
    backgroundColor: '#2e752f',
  },
  buttonCancel: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonSaveText: {
    color: 'white',
    fontFamily: 'TajawalRegular',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonCancelText: {
    color: '#666',
    fontFamily: 'TajawalRegular',
    textAlign: 'center',
  },
  statusMessage: {
    textAlign: 'center',
    marginBottom: 15,
    padding: 8,
    borderRadius: 4,
    fontFamily: 'TajawalRegular',
  },
  successStatus: {
    backgroundColor: '#e6f7e9',
    color: '#2e752f',
  },
  errorStatus: {
    backgroundColor: '#ffeeee',
    color: '#F52525',
  }
});

export default OrderDetailsCard;