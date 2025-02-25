import React, { forwardRef, useState, useRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  Animated,
  Modal,
  FlatList,
  TouchableWithoutFeedback, 
  Keyboard
} from 'react-native';
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { router } from 'expo-router';
import Color from '@/constants/Colors';
import CustomButton from '../ui/CustomButton';
import ActionSheetComponent from '../ui/ActionSheet';
import Divider from '../ui/Devider';
import DateTimePicker from '@react-native-community/datetimepicker';
import AntDesign from '@expo/vector-icons/AntDesign';

const ActionSheetToAddProduct = forwardRef(({ isVisible, onClose }: any, ref) => {
  const actionSheetRef = useRef(null);

  const [formData, setFormData] = useState({
    price: '',
    referralCode: '',
    RecieveDate: '',
    fieldOfCompany: '',
    status: '',
    advanceAmount: '', 
  });

  const [errors, setErrors] = useState({
    price: '',
    RecieveDate: '',
    fieldOfCompany: '',
    advanceAmount: '', 
  });

  const [step, setStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const step1Animation = useRef(new Animated.Value(1)).current;
  const step2Animation = useRef(new Animated.Value(0)).current;
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);


  useImperativeHandle(ref, () => ({
    show: () => {
      actionSheetRef.current?.show();
    },
    hide: () => {
      actionSheetRef.current?.hide();
      if (onClose) onClose();
    }
  }));


  const handleClose = () => {
    setTimeout(() => {
      setStep(1);
      setFormSubmitted(false);
      setFormData({
        price: '',
        referralCode: '',
        RecieveDate: '',
        fieldOfCompany: '',
        advanceAmount: '',
        status: '',
      });
      setErrors({
        price: '',
        RecieveDate: '',
        fieldOfCompany: '',
        advanceAmount: '', 
      });
      step1Animation.setValue(1);
      step2Animation.setValue(0);
    }, 300);
    if (onClose) onClose();
  };


  const animateToNextStep = () => {
    Animated.parallel([
      Animated.timing(step1Animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(step2Animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setStep(2);
    });
  };

  const animateToPreviousStep = () => {
    Animated.parallel([
      Animated.timing(step1Animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(step2Animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setStep(1);
    });
  };


  const validateStep1 = () => {
    let valid = true;
    let newErrors = { ...errors };

    if (!formData.price.trim()) {
      newErrors.price = 'المبلغ مطلوب ';
      valid = false;
    } else {
      newErrors.price = '';
    }



    setErrors(newErrors);
    return valid;
  };

  const validateStep2 = () => {
    let valid = true;
    let newErrors = { ...errors };

    if (!formData.RecieveDate.trim()) {
      newErrors.RecieveDate = 'معرف الضريبة مطلوب';
      valid = false;
    }
    if (!formData.fieldOfCompany.trim()) {
      newErrors.fieldOfCompany = 'مجال الشركة مطلوب';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (validateStep2()) {
      setFormSubmitted(true);
    }
  };



  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setFormData({ ...formData, RecieveDate: date });
    setShowCalendar(false);
  };

  const formatDate = (date) => {
    if (!(date instanceof Date)) return '';
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };



  const statusOptions = [
    { id: 1, label: 'خالص' },
    { id: 2, label: 'غير خالص' },
    { id: 3, label: 'تسبيق'}
    ]


  const Step1Form = (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAvoidingView>
      <Animated.View
        style={{
          opacity: step1Animation,
          transform: [{
            translateX: step1Animation.interpolate({
              inputRange: [0, 1],
              outputRange: [-300, 0],
            }),
          }],
          position: 'absolute',
          width: '100%',
        }}
      >
        <Text className="text-center text-[#F52525] text-xl font-bold mb-6 font-tajawal">
          معلومات الطلب
        </Text>
        <Divider />

        

        <View className="mb-4 mt-4">
          <Text className="text-right text-gray-700 mb-2 font-tajawal" style={{ color: Color.green }}>
            المبلغ (بالدرهم): <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            placeholder="يرجى إدخال المبلغ"
            placeholderTextColor="#888"
            value={formData.price}
            keyboardType='number-pad'
            onChangeText={(text) => setFormData({ ...formData, price: text })}
            className={`border ${errors.price ? 'border-red-500' : 'border-[#2e752f]'} rounded-lg p-3 text-black text-right bg-white font-tajawalregular`}
          />
          {errors.price ? <Text className="text-red-500 text-right mt-1 font-tajawalregular text-[13px]">{errors.price}</Text> : null}
        </View>



        <View className="mb-4 mt-4">
          <Text className="text-right text-gray-700 mb-2 font-tajawal" style={{ color: Color.green }}>
            الحالة: <Text className="text-red-500">*</Text>
          </Text>

          <TouchableOpacity
            onPress={() => setShowStatusDropdown(true)}
            className={`border ${errors.status ? 'border-red-500' : 'border-[#2e752f]'} rounded-lg p-3 bg-white flex-row justify-between items-center`}
          >
            <AntDesign name="down" size={16} color="#2e752f" />
            <Text className="text-black text-right font-tajawalregular">
              {formData.status || "اختر الحالة"}
            </Text>
          </TouchableOpacity>

          <Modal
            visible={showStatusDropdown}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowStatusDropdown(false)}
          >
            <TouchableOpacity
              style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
              activeOpacity={1}
              onPress={() => setShowStatusDropdown(false)}
            >
              <View className="bg-white rounded-lg mx-4 mt-32 overflow-hidden">
                <FlatList
                  data={statusOptions}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setFormData({ ...formData, status: item.label });
                        setShowStatusDropdown(false);
                      }}
                      className="p-4 border-b border-gray-200"
                    >
                      <Text className="text-right font-tajawalregular text-black">{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableOpacity>
          </Modal>

          {errors.status ? (
            <Text className="text-red-500 text-right mt-1 font-tajawalregular text-[13px]">
              {errors.status}
            </Text>
          ) : null}
        </View>

        {formData.status === 'تسبيق' && (
          <View className="mb-4 mt-4">
            <Text className="text-right text-gray-700 mb-2 font-tajawal" style={{ color: Color.green }}>
              مبلغ التسبيق (بالدرهم): <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              placeholder="يرجى إدخال مبلغ التسبيق"
              placeholderTextColor="#888"
              value={formData.advanceAmount}
              keyboardType='number-pad'
              onChangeText={(text) => setFormData({ ...formData, advanceAmount: text })}
              className={`border ${errors.advanceAmount ? 'border-red-500' : 'border-[#2e752f]'} rounded-lg p-3 text-black text-right bg-white font-tajawalregular`}
            />
            {errors.advanceAmount ? <Text className="text-red-500 text-right mt-1 font-tajawalregular text-[13px]">{errors.advanceAmount}</Text> : null}
          </View>
        )}

        <View className="mt-4 mb-6">
          <Text className="text-right text-gray-700 mb-2 font-tajawal" style={{ color: Color.green }}>
            كود الإحالة (اختياري):
          </Text>
          <TextInput
            placeholder="يرجى إدخال كود الإحالة (إن كان متوفراً)"
            placeholderTextColor="#888"
            value={formData.referralCode}
            onChangeText={(text) => setFormData({ ...formData, referralCode: text })}
            className="border border-[#2e752f] rounded-lg p-3 text-black text-right bg-white font-tajawalregular"
          />
        </View>

        <View className="mt-4 mb-6">
          <Text className="text-right text-gray-700 mb-2 font-tajawal" style={{ color: Color.green }}>
            تاريخ التسليم:<Text className="text-red-500">*</Text>
          </Text>

          <TouchableOpacity
            onPress={() => setShowCalendar(true)}
            className={`border ${errors.RecieveDate ? 'border-red-500' : 'border-[#2e752f]'} rounded-lg p-3 bg-white flex-row justify-between items-center`}
          >
            <AntDesign name="calendar" size={20} color="gray" />
            <Text className="text-gray-500 text-right font-tajawalregular">
              {formData.RecieveDate instanceof Date ? formatDate(formData.RecieveDate) : 'يرجى إدخال تاريخ التسليم'}
            </Text>
          </TouchableOpacity>

          {Platform.OS === 'ios' ? (
            <Modal
              transparent={true}
              animationType="slide"
              visible={showCalendar}
              onRequestClose={() => setShowCalendar(false)}
            >
              <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                <View className="bg-white rounded-lg p-4 w-5/5">
                  <View className="flex-row justify-end mb-4">
                    <TouchableOpacity onPress={() => setShowCalendar(false)}>
                      <AntDesign name="calendar" size={24} color="black" />
                    </TouchableOpacity>
                  </View>

                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="inline"
                    onChange={(_, date) => date && setSelectedDate(date)}
                    minimumDate={new Date()}
                    style={{ height: 300, width: '100%' }}
                  />

                  <TouchableOpacity
                    onPress={() => handleDateSelect(selectedDate)}
                    className="mt-4 p-3 bg-[#2e752f] rounded-full"
                  >
                    <Text className="text-white text-center font-tajawal text-[15px]">تأكيد</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          ) : (
            showCalendar && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="calendar"
                onChange={(_, date) => date && handleDateSelect(date)}
                minimumDate={new Date()}
              />
            )
          )}

          {errors.RecieveDate ?
            <Text className="text-red-500 text-right mt-1 font-tajawalregular text-[13px]">{errors.RecieveDate}</Text> :
            null
          }
        </View>

        <Divider />

        <View className="mt-6">
          <CustomButton
            title="التالي"
            onPress={() => {
              if (validateStep1()) {
                animateToNextStep();
              }
            }}
            containerStyles="p-3 bg-[#2e752f] rounded-full"
            textStyles="text-white text-center font-tajawal text-[15px]"
          />
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );

  const Step2Form = (
    <KeyboardAvoidingView>
      <Animated.View
        style={{
          opacity: step2Animation,
          transform: [{
            translateX: step2Animation.interpolate({
              inputRange: [0, 1],
              outputRange: [300, 0],
            }),
          }],
          position: 'absolute',
          width: '100%',
        }}
      >
        <Text className="text-center text-[#F52525] text-xl font-bold mb-6 font-tajawal">
          معلومات الطلب
        </Text>
        <Divider />



        <Divider />

        <View className="mt-6 flex-row justify-between gap">
          <CustomButton
            title="رجوع"
            onPress={animateToPreviousStep}
            containerStyles="p-3 bg-gray-500 rounded-full w-2/4 mr-2"
            textStyles="text-white text-center font-tajawal text-[15px]"
          />
          <CustomButton
            title="إنشاء حساب"
            onPress={handleSubmit}
            containerStyles="p-3 bg-[#2e752f] rounded-full w-2/4"
            textStyles="text-white text-center font-tajawal text-[15px]"
          />
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );

  const SuccessView = (
    <View className="flex-1 items-center justify-center h-full">
      <View>
        <AntDesign name="checkcircleo" size={190} color="white" />
      </View>
      <View>
        <Text className="text-center text-white text-6xl font-tajawal pt-7 mt-4">مبروك!</Text>
        <Text className="text-white text-lg font-bold text-center p-4 font-tajawalregular">
          تم إنشاء حسابك بنجاح.
        </Text>
      </View>
      <View className="w-full mt-20">
        <CustomButton
          onPress={() => {
            actionSheetRef.current?.hide();
            handleClose();
            router.replace('(home)');
          }}
          title="انتقل للصفحة الرئيسية"
          textStyles="text-sm font-tajawal px-2 py-0 text-[#2e752f]"
          containerStyles="w-[90%] m-auto bg-white"
        />
      </View>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ActionSheetComponent ref={actionSheetRef} containerStyle={{ backgroundColor: 'white' }} onClose={handleClose}>
        {formSubmitted ? SuccessView : (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex"
            style={{ minHeight: 500 }}
          >
            <View style={{ position: 'relative', height: 500 }} >
              {Step1Form}
              {Step2Form}
            </View>
          </KeyboardAvoidingView>
        )}
      </ActionSheetComponent>
    </TouchableWithoutFeedback>
  );
});


export default ActionSheetToAddProduct;