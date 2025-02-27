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
  Keyboard,
  Image
} from 'react-native';
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { router } from 'expo-router';
import Color from '@/constants/Colors';
import CustomButton from '../ui/CustomButton';
import ActionSheetComponent from '../ui/ActionSheet';
import Divider from '../ui/Devider';
import DateTimePicker from '@react-native-community/datetimepicker';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import Noimages from "@/assets/images/noImages.png"
import UniqueIdModal from '../QrCodeGeneration/GenerateQrCode';

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
  const [uniqueId, setUniqueId] = useState('');
  const [showIdModal, setShowIdModal] = useState(false);

  

  useImperativeHandle(ref, () => ({
    show: () => {
      actionSheetRef.current?.show();
    },
    hide: () => {
      actionSheetRef.current?.hide();
      if (onClose) onClose();
    }
  }));




const [uploadedImages, setUploadedImages] = useState([]);



const takePhoto = async () => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert(' يرجى تمكينها في إعدادات جهازك لاستخدام الكاميرا!');
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImage = {
        id: Date.now(),
        uri: result.assets[0].uri,
        name: `photo_${Date.now()}.jpg`,
        size: `${Math.round(result.assets[0].fileSize / 1024)}kb`,
      };
      setUploadedImages([...uploadedImages, newImage]);
    }
  } catch (error) {
    console.log('Error taking photo:', error);
  }
};

const removeImage = (id) => {
  const newImages = uploadedImages.filter(img => img.id !== id);
  setUploadedImages(newImages);
};

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

  const generateUniqueId = (length = 12) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };


  

  const handleSubmit = () => {
    console.log('Button clicked');
      const newUniqueId = generateUniqueId(12);
      setUniqueId(newUniqueId);
      console.log('Generated ID:', newUniqueId); 
      setShowIdModal(true);
  };

const handleModalClose = () => {
  setShowIdModal(false);
  setFormSubmitted(true);
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
          المدينة:<Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            placeholder="يرجى إدخال المدينة"
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
  
        <View className="my-8">
          <Text className="text-right text-gray-700 font-tajawal mb-5" style={{ color: Color.green }}>
            تحميل الصور:
          </Text>
          
          <View className="border border-dashed border-[#2e752f] rounded-lg p-4 items-center mb-4 ">
            <AntDesign name="camera" size={32} color="#2e752f" />
            <Text className="text-center text-gray-500 mt-2 font-tajawalregular">
              حمل صورك (JPG, PNG)
            </Text>
            
            <View className="flex-row justify-center space-x-2 mt-3">
              <TouchableOpacity 
                className="border border-[#2e752f] rounded-full px-4 py-2 flex-row items-center"
                onPress={takePhoto}
              >
                <AntDesign name="camera" size={16} color="#2e752f" style={{ marginRight: 5 }} />
                <Text className="text-[#2e752f] font-tajawalregular">التقط صورة</Text>
              </TouchableOpacity>
              
              
            </View>
          </View>
       
          {uploadedImages.length > 0 ? (
            <View className="mb-4">
              {uploadedImages.map((image) => (
                <View key={image.id} className="flex-row justify-between items-center bg-gray-100 rounded-lg p-3 mb-2">
                  <TouchableOpacity onPress={() => removeImage(image.id)}>
                    <View className="w-6 h-6 rounded-full bg-red-500 items-center justify-center">
                      <AntDesign name="close" size={16} color="white" />
                    </View>
                  </TouchableOpacity>
                  <View className="flex-row items-center flex-1 justify-end">
                    <Text className="text-gray-500 mr-2 font-tajawalregular">{image.size}</Text>
                    <Text className="text-black font-tajawalregular" numberOfLines={1} ellipsizeMode="middle" style={{ maxWidth: 180 }}>
                      {image.name}
                    </Text>
                      <View className="h-10 w-10 bg-gray-300 rounded ml-2 overflow-hidden">
                        {uploadedImages[0]?.uri ? (
                          <Image 
                            source={{ uri: uploadedImages[0].uri }} 
                            style={{ width: '100%', height: '100%' }} 
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="h-full w-full items-center justify-center">
                            <AntDesign name="picture" size={20} color="#666" />
                          </View>
                        )}
                      </View>  
                  </View>
                </View>
              ))}
            </View>
          ) :(
              <View className='w-full h-40 flex items-center'>
                <Image
                  source={Noimages}
                  resizeMode='contain'
                  className='flex-1 w-full h-100'
                />
                <Text className='font-tajawal text-[#2e752f] mt-2 text-xl'>
                لا يوجد صور 
                </Text>
                <Text className='font-tajawalregular'>
                قم بتحميل صورك الآن
                </Text>
              </View>
            )
          }
        </View>
  
        <Divider />
  
        <View className="mt-6 flex-row justify-between">
          <CustomButton
            title="رجوع"
            onPress={animateToPreviousStep}
            containerStyles="p-3 bg-gray-500 rounded-full w-2/4 mr-2"
            textStyles="text-white text-center font-tajawal text-[15px]"
          />
          <CustomButton
            title="إنشاء طلب"
            onPress={handleSubmit}
            containerStyles="p-3 bg-[#2e752f] rounded-full w-2/4"
            textStyles="text-white text-center font-tajawal text-[15px]"
          />
        </View>
        <UniqueIdModal 
          visible={showIdModal} 
          onClose={handleModalClose} 
          uniqueId={uniqueId} 
        />
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