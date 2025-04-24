import React, { forwardRef, useState, useRef, useImperativeHandle, useEffect } from 'react';
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
  ActivityIndicator
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


const ActionSheetToAddProduct = forwardRef(({ isVisible, onClose }: any, ref) => {
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
  console.log("errors",errors);
  

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

  // Reset redux state when component unmounts
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

    if (!formData.RecieveDate) {
      newErrors.RecieveDate = 'تاريخ التسليم مطلوب';
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
    if (!validateStep2()) return;
    

    verificationSheetRef.current?.show();

    // const newUniqueId = generateUniqueId(12);
    // setUniqueId(newUniqueId);
    
    // const formatDateToIso = (date) => {
    //   if (!(date instanceof Date)) return '';
    //   return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    // };
    
    // const deliveryDate = formData.RecieveDate;
    // const pickupDate = new Date(deliveryDate);
    // pickupDate.setDate(pickupDate.getDate() + 2);
    
    // // Prepare orderdata

  
    // const orderData = {
    //   price: parseFloat(formData.price),
    //   situation: formData.situation || "خالص",
    //   status: "جاهزة للتسليم",
    //   advancedAmount: formData.situation === 'تسبيق' ? formData.advancedAmount : null,
    //   deliveryDate: formatDateToIso(deliveryDate),
    //   pickupDate: formatDateToIso(pickupDate),
    //   qrCode: newUniqueId,
    //   isFinished: false,
    //   isPickUp: false
    // };

    // console.log("Component - Order data before dispatch:", JSON.stringify(orderData));
    //   dispatch(createOrder(orderData));
    //   setShowIdModal(true);
  };

  const processOrderSubmission = () => {
    const newUniqueId = generateUniqueId(12);
    setUniqueId(newUniqueId);
    
    const formatDateToIso = (date) => {
      if (!(date instanceof Date)) return '';
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };
    
    const deliveryDate = formData.RecieveDate;
    const pickupDate = new Date(deliveryDate);
    pickupDate.setDate(pickupDate.getDate() + 2);
    
    const orderData = {
      price: parseFloat(formData.price),
      situation: formData.situation || "خالص",
      status: "في طور الانجاز",
      advancedAmount: formData.situation === 'تسبيق' ? formData.advancedAmount : null,
      deliveryDate: formatDateToIso(deliveryDate),
      pickupDate: formatDateToIso(pickupDate),
      qrCode: newUniqueId,
      isFinished: false,
      isPickUp: false
    };
  
    console.log("Component - Order data before dispatch:", JSON.stringify(orderData));
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

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setFormData({ ...formData, RecieveDate: date });
    setShowCalendar(false);
  };

  const formatDate = (date) => {
    if (!(date instanceof Date)) return '';
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
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
          zIndex:9,
        }}
      >
        <Text className="text-center text-[#F52525] text-xl font-bold mb-6 font-tajawal">
          معلومات الطلب
        </Text>



        <View >
          <View>

          <View className="mb-4 mt-4">
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

        <View className="mb-0 mt-0">
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



          <View className="mt-4 mb-6">
            <Text className="text-right text-gray-700 mb-2 font-tajawal text-[12px]" style={{ color: Color.green }}>
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
                <View className="flex-1 justify-center items-center bg-[#2e752f] bg-opacity-50">
                  <View className="bg-white rounded-lg p-4 w-5/5">
                    <View className="flex-row justify-end mb-4">
                      <TouchableOpacity onPress={() => setShowCalendar(false)}>
                        <AntDesign name="calendar" size={24} color="black" />
                      </TouchableOpacity>
                    </View>
                  {/* !!! change the color from blue to green */}
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
            <Divider />

          <View className='mt-2'>
            <View className="mt-0 ">
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
  
        <View className="my-2">
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
            <View className="  ">
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
                      {image.uri ? (
                        <Image 
                          source={{ uri: image.uri }} 
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
          ) : (
            <View className='w-full  flex items-center'>
              <Image
                source={Noimages}
                resizeMode='contain'
                className='flex w-50 h-45 '
              />
              <Text className='font-tajawal text-[#2e752f] mt-2 text-xl'>
              لا يوجد صور 
              </Text>
              <Text className='font-tajawalregular'>
              قم بتحميل صورك الآن
              </Text>
            </View>
          )}
        </View>
  
        <Divider />
  
        <View className="mt-6 flex-row justify-between ">
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

        <UniqueIdModal
        visible={showIdModal} 
        onClose={handleModalClose} 
        uniqueId={uniqueId} 
        />
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