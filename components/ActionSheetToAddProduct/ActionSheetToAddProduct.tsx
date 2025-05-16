//@ts-nocheck
import React, { forwardRef, useState, useRef, useImperativeHandle, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  Animated,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ActivityIndicator,
  Dimensions
} from 'react-native';

import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, resetOrderState } from '@/store/slices/CreateOrder';
import Color from '@/constants/Colors';
import CustomButton from '../ui/CustomButton';
import BottomSheetComponent from '../ui/BottomSheetComponent';
import Divider from '../ui/Devider';
import DateTimePicker from '@react-native-community/datetimepicker';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import Noimages from "@/assets/images/noImages.png"
import UniqueIdModal from '../QrCodeGeneration/GenerateQrCode';
import PaymentStatus from './PaymenStatus';
import OrderVerificationBottomSheet from './OrderVerificationBottomSheet';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const ActionSheetToAddProduct = forwardRef(({ isVisible, onClose }: any, ref) => {


  const { width, height } = Dimensions.get('window');
  const isSmallScreen = height < 700; 
  
  const bottomSheetHeight = useMemo(() => {
      return isSmallScreen ? hp('80%') : hp('62%');
  }, [isSmallScreen]);

  
  const actionSheetRef = useRef(null);
  const dispatch = useDispatch();
  const verificationSheetRef = useRef(null);

  const { loading, error, success, currentOrder } = useSelector((state) => state.order);

  const [formData, setFormData] = useState({
    price: '',
    RecieveDate: '',
    fieldOfCompany: '',
    status:"في طور الانجاز",
    situation: '',
    advancedAmount: '', 
    pickupDate: '',
    isFinished:false,
    isPickUp: false
  });

  const [errors, setErrors] = useState({
    price: '',
    RecieveDate: '',
    fieldOfCompany: '',
    advancedAmount: '', 
  });
  
  
  const [isDatePickerEnabled, setIsDatePickerEnabled] = useState(false);
  
  const [step, setStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const step1Animation = useRef(new Animated.Value(1)).current;
  const step2Animation = useRef(new Animated.Value(0)).current;
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [uniqueId, setUniqueId] = useState('');
  const [showIdModal, setShowIdModal] = useState(false);
  const [photoCounter, setPhotoCounter] = useState(1);



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

  
  useEffect(() => {
    return () => {
      dispatch(resetOrderState());
    };
  }, [dispatch]);

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
        name: `photo_${photoCounter}.jpg`,
        size: `${Math.round(result.assets[0].fileSize / 1024)}kb`,
      };
      
      setUploadedImages([...uploadedImages, newImage]);
      
      setPhotoCounter(prevCounter => prevCounter + 1);
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
        RecieveDate: '',
        fieldOfCompany: '',
        advancedAmount: '',
        status: '',
        situation: '',
        pickupDate: '',
        isFinished:false,
        isPickUp: false
      });
      setErrors({
        price: '',
        RecieveDate: '',
        fieldOfCompany: '',
        advancedAmount: '', 
      });
      step1Animation.setValue(1);
      step2Animation.setValue(0);
      
      setIsDatePickerEnabled(false);
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
    
    // Add validation for payment status
    if (!formData.situation || formData.situation.trim() === '') {
      newErrors.status = 'الحالة مطلوبة';
      valid = false;
    } else {
      newErrors.status = '';
      
      // Check if advanced amount is valid when تسبيق is selected
      if (formData.situation === 'تسبيق') {
        if (!formData.advancedAmount || formData.advancedAmount.trim() === '') {
          newErrors.advancedAmount = 'مبلغ التسبيق مطلوب';
          valid = false;
        } else if (parseFloat(formData.advancedAmount) > parseFloat(formData.price)) {
          newErrors.advancedAmount = 'مبلغ التسبيق لا يمكن أن يتجاوز المبلغ الإجمالي';
          valid = false;
        } else {
          newErrors.advancedAmount = '';
        }
      }
    }
  
    newErrors.RecieveDate = '';
  
    setErrors(newErrors);
    return valid;
  };

  const validateStep2 = () => {
    let valid = true;
    let newErrors = { ...errors };

    
    newErrors.RecieveDate = '';

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
    if (!validateStep2()) return;
    verificationSheetRef.current?.show();
  };

  
  const formatDateForBackend = (date) => {
    if (!(date instanceof Date)) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  

const validateAndFormatDate = (date) => {
  
  if (!date) return '';
  
  try {
    
    if (date instanceof Date) {
      
      if (isNaN(date.getTime())) {
        console.error('Invalid date object');
        return '';
      }
      
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    
    const isoFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (typeof date === 'string' && isoFormatRegex.test(date)) {
      return date;
    }
    
    
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      console.error('Could not parse date string:', date);
      return '';
    }
    
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};


const formatDateToYYYYMMDD = (date) => {
  if (!date) return '';
  
  let dateObject;
  
  
  if (typeof date === 'string') {
    dateObject = new Date(date);
  } else if (date instanceof Date) {
    dateObject = date;
  } else {
    console.error('Invalid date format:', date);
    return '';
  }
  
  
  if (isNaN(dateObject.getTime())) {
    console.error('Invalid date:', date);
    return '';
  }
  
  
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, '0');
  const day = String(dateObject.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};


const processOrderSubmission = () => {
  const newUniqueId = generateUniqueId(12);
  setUniqueId(newUniqueId);
  
  const today = new Date();
  
  
  const deliveryDate = isDatePickerEnabled ? (formData.RecieveDate || selectedDate) : today;
  const formattedDeliveryDate = formatDateToYYYYMMDD(deliveryDate);
  
  
  const pickupDateObj = new Date(deliveryDate);
  pickupDateObj.setDate(pickupDateObj.getDate() + 2);
  const formattedPickupDate = formatDateToYYYYMMDD(pickupDateObj);
  
  
  const orderData = {
    price: parseFloat(formData.price),
    situation: formData.situation || "خالص",
    status: "في طور الانجاز",
    advancedAmount: parseFloat(formData.advancedAmount) || null,
    deliveryDate: formattedDeliveryDate, 
    pickupDate: formattedPickupDate,     
    qrCode: newUniqueId,
    isFinished: false,
    isPickUp: false
  };
  
  console.log("Component - Order data before dispatch:", JSON.stringify(orderData));
  
  
  if (!formattedDeliveryDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    alert('خطأ في تنسيق التاريخ. يرجى التأكد من أن التاريخ بتنسيق YYYY-MM-DD');
    return;
  }
  
  dispatch(createOrder(orderData));
  setShowIdModal(true);
};

  const handleModalClose = () => {
    setShowIdModal(false);
    setFormSubmitted(true);
    
    if (success) {
      setTimeout(() => {
        actionSheetRef.current?.hide();
        handleClose();
        router.replace('(home)');
      }, 1000);
    }
  };

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  console.log('this is the selected date', selectedDate);
  
  
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setFormData({ ...formData, RecieveDate: date });
    setShowCalendar(false);
  };

  
  const formatDateForDisplay = (date) => {
    if (!date) return "";
    
    let dateObject;
    
    
    if (typeof date === 'string') {
      dateObject = new Date(date);
    } else if (date instanceof Date) {
      dateObject = date;
    } else {
      return "";
    }
    
    
    if (isNaN(dateObject.getTime())) {
      return "";
    }
    
    
    return `${dateObject.getDate()}/${dateObject.getMonth() + 1}/${dateObject.getFullYear()}`;
  };

  const handleStatusChange = (status, advancedAmount) => {
    console.log("handleStatusChange received:", status, advancedAmount);
    
    const processedAmount = advancedAmount ? advancedAmount : '';
    
    console.log("Setting formData with:", status, processedAmount);
    
    setFormData(prevData => {
      const newData = {
        ...prevData,
        situation: status,
        advancedAmount: status === 'تسبيق' ? processedAmount : ''
      };
      console.log("New formData:", newData);
      return newData;
    });
  };
  
  const Step1Form = (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} >
    <KeyboardAvoidingView >
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
          zIndex: 9,
        }}
      >
        <Text className="text-center text-[#F52525] text-xl font-bold mb-6 font-tajawal">
          معلومات الطلب
        </Text>

        <View>
          <View>
          <View className="mb-4 mt-6">
            <Text className="text-right text-gray-700 mb-2 font-tajawal text-[12px]" style={{ color: Color.green }}>
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

          <View className="mb-0 mt-2">
            <Text className="text-right text-gray-700 mb-2 font-tajawal text-[12px]" style={{ color: Color.green }}>
              الحالة: <Text className="text-red-500">*</Text>
            </Text>

            <PaymentStatus 
              onStatusChange={(status, advancedAmount) => {
                console.log("PaymentStatus callback with:", status, advancedAmount);
                setFormData({
                  ...formData,
                  situation: status,
                  advancedAmount: advancedAmount
                });
              }} 
              currentPrice={formData.price}
            />

            {errors.status ? (
              <Text className="text-red-500 text-right mt-1 font-tajawalregular text-[13px]">
                {errors.status}
              </Text>
            ) : null}
          </View>

          <View className="mb-0 mt-8">
            <TouchableOpacity 
              onPress={() => setIsDatePickerEnabled(!isDatePickerEnabled)}
              className="flex-row items-center justify-end space-x-2"
            >
               <View className={`w-5 h-5 border rounded ${isDatePickerEnabled ? 'bg-[#2e752f] border-[#2e752f]' : 'bg-white border-[#2e752f]'} justify-center items-center ml-2`}>
                {isDatePickerEnabled && <AntDesign name="check" size={14} color="white" />}
              </View>

              <Text className="text-right text-gray-700 mr-2 font-tajawal text-[14px]" style={{ color: Color.green }}>
                تاريخ التسليم
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-2 mb-6">
            <TouchableOpacity
              onPress={() => isDatePickerEnabled && setShowCalendar(true)}
              disabled={!isDatePickerEnabled}
              className={`border ${errors.RecieveDate ? 'border-red-500' : 'border-[#2e752f]'} rounded-lg p-3 bg-white flex-row justify-between items-center ${!isDatePickerEnabled ? 'opacity-50' : 'opacity-100'}`}
            >
              <AntDesign name="calendar" size={20} color={"white"} />
              <Text className={`${isDatePickerEnabled ? 'text-gray-500' : 'text-gray-400'} text-right font-tajawalregular`}>
                {formData.RecieveDate instanceof Date 
                  ? formatDateForDisplay(formData.RecieveDate) 
                  : (isDatePickerEnabled ? formatDateForDisplay(selectedDate) : 'يرجى إدخال تاريخ التسليم')}
              </Text>
            </TouchableOpacity>

            {Platform.OS === 'ios' ? (
              <Modal
                transparent={true}
                animationType="slide"
                visible={showCalendar}
                onRequestClose={() => setShowCalendar(false)}
              >
                <View className="flex-1 justify-center items-center bg-[#2e752f] bg-opacity-50">
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
                      className="mt-4 p-3 bg-[#F52525] rounded-full"
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
          </View>

          <View className='mt-2'>
            <View className="mt-0 ">
              <CustomButton
                title="التالي"
                onPress={() => {
                  if (validateStep1()) {
                    Keyboard.dismiss()
                    animateToNextStep();
                  }
                }}
                containerStyles="p-3 bg-[#2e752f] rounded-full"
                textStyles="text-white text-center font-tajawal text-[15px]"
              />
            </View>
          </View>
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
  
        <View style={{ marginVertical: hp('1%') }}>
          <Text style={{
            textAlign: 'right',
            color: Color.green,
            fontSize: isSmallScreen ? wp('3.5%') : wp('4%'),
            marginBottom: hp('2.5%'),
            fontFamily: 'Tajawal',
          }}>
            تحميل الصور:
          </Text>
          
          <View style={{
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: '#2e752f',
            borderRadius: wp('3%'),
            padding: hp('2%'),
            alignItems: 'center',
            marginBottom: hp('2%'),
          }}>
            <AntDesign name="camera" size={wp('8%')} color="#2e752f" />
            <Text style={{
              textAlign: 'center',
              color: '#6b7280',
              marginTop: hp('1%'),
              fontFamily: 'TajawalRegular',
              fontSize: wp('3.5%'),
            }}>
              حمل صورك (JPG, PNG)
            </Text>
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: hp('1.5%'),
            }}>
              <TouchableOpacity 
                style={{
                  borderWidth: 1,
                  borderColor: '#2e752f',
                  borderRadius: wp('10%'),
                  paddingVertical: hp('1%'),
                  paddingHorizontal: wp('3%'),
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={takePhoto}
              >
                <AntDesign name="camera" size={wp('4%')} color="#2e752f" style={{ marginRight: wp('1.2%') }} />
                <Text style={{
                  color: '#2e752f',
                  fontFamily: 'TajawalRegular',
                  fontSize: wp('3.5%'),
                }}>التقط صورة</Text>
              </TouchableOpacity>
            </View>
          </View>
       
          {uploadedImages.length > 0 ? (
            <View>
              {uploadedImages.map((image) => (
                <View key={image.id} style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#f3f4f6',
                  borderRadius: wp('3%'),
                  padding: hp('1.5%'),
                  marginBottom: hp('1%'),
                }}>
                  <TouchableOpacity onPress={() => removeImage(image.id)}>
                    <View style={{
                      width: wp('6%'),
                      height: wp('6%'),
                      borderRadius: wp('3%'),
                      backgroundColor: '#ef4444',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <AntDesign name="close" size={wp('4%')} color="white" />
                    </View>
                  </TouchableOpacity>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                    justifyContent: 'flex-end',
                  }}>
                    <Text 
                      style={{
                        color: 'black',
                        fontFamily: 'TajawalRegular',
                        fontSize: wp('3.5%'),
                        maxWidth: wp('45%'),
                      }}
                      numberOfLines={1} 
                      ellipsizeMode="middle"
                    >
                      {image.name}
                    </Text>
                    <View style={{
                      height: wp('10%'),
                      width: wp('10%'),
                      backgroundColor: '#d1d5db',
                      borderRadius: wp('1%'),
                      marginLeft: wp('2%'),
                      overflow: 'hidden',
                    }}>
                      {image.uri ? (
                        <Image 
                          source={{ uri: image.uri }} 
                          style={{ width: '100%', height: '100%' }} 
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={{
                          height: '100%',
                          width: '100%',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <AntDesign name="picture" size={wp('5%')} color="#666" />
                        </View>
                      )}
                    </View>  
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={{
              width: '100%',
              flex: 1,
              alignItems: 'center',
              marginTop: hp('1%'),
            }}>
              <Image
                source={Noimages}
                resizeMode='contain'
                style={{
                  width: isSmallScreen ? wp('30%') : wp('30%'),
                  height: isSmallScreen ? wp('30%') : wp('30%'),
                }}
              />
              <Text style={{
                fontFamily: 'Tajawal',
                color: '#2e752f',
                marginTop: hp('1%'),
                fontSize: isSmallScreen ? wp('4%') : wp('4%'),
              }}>
                لا يوجد صور 
              </Text>
              <Text style={{
                fontFamily: 'TajawalRegular',
                fontSize: wp('3%'),
              }}>
                قم بتحميل صورك الآن
              </Text>
            </View>
          )}
        </View>
  
  
        <View className="mt- flex-row justify-between ">
          <CustomButton
            title="رجوع"
            onPress={animateToPreviousStep}
            containerStyles="p-3 bg-gray-500 rounded-full w-[48%] mr-2"
            textStyles="text-white text-center font-tajawal text-[15px]"
          />
          <CustomButton
            title={loading ? "جاري الإرسال..." : "إنشاء طلب"}
            onPress={handleSubmit}
            containerStyles={`p-3 ${loading ? "bg-gray-400" : "bg-[#2e752f]"} rounded-full w-[48%]`}
            textStyles="text-white text-center font-tajawal text-[15px]"
            disabled={loading}
          />
        </View>

        {error && (
        <>
          {console.log("the Error is lharbaa:", error)}
          <Text className="text-red-500 text-center mt-2 font-tajawalregular">
            {typeof error === 'string' ? error : 'حدث خطأ أثناء إنشاء الطلب'}
          </Text>
        </>
      )}

        {error ?  
        
          null
        
        :
          <View>

              <UniqueIdModal
              visible={showIdModal} 
              onClose={handleModalClose} 
              uniqueId={uniqueId} 
              />
          </View>
        
        }
        
      </Animated.View>
    </KeyboardAvoidingView>
  );

  const SuccessView = (
    <View className="flex-1 items-center justify-center h-full w-full">
      {loading ? (
        <ActivityIndicator size="large" color="#2e752f" />
      ) : (
        <>
          <View>
            <AntDesign name="checkcircleo" size={190} color="white" />
          </View>
          <View>
            <Text className="text-center text-white text-6xl font-tajawal pt-7 mt-4">مبروك!</Text>
            <Text className="text-white text-lg font-bold text-center p-4 font-tajawalregular">
              تم إنشاء الطلب بنجاح.
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
        </>
      )}
    </View>
  );

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <BottomSheetComponent 
          ref={actionSheetRef} 
          containerStyle={{ backgroundColor: 'white' }} 
          onClose={handleClose}
          customHeight="80%" 
        >
          {formSubmitted && success ? (
            SuccessView
          ) : (
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              className="flex"
              style={{ minHeight: 1000 }}
            >
              <View style={{ position: 'relative', height: 1000 }} >
                {Step1Form}
                {Step2Form}
              </View>
            </KeyboardAvoidingView>
          )}
        </BottomSheetComponent>
      </TouchableWithoutFeedback>
      
      <OrderVerificationBottomSheet
        ref={verificationSheetRef}
        formData={formData}
        uploadedImages={uploadedImages}
        loading={loading}
        onConfirm={processOrderSubmission}
        onEdit={() => {
          
        }}
      />
    </>
  );
});

export default ActionSheetToAddProduct;