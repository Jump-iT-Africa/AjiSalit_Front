import React, { useState, useRef, useEffect,useMemo } from "react";
import {
  View,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Animated,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  Dimensions
} from "react-native";
import CustomButton from "../ui/CustomButton";
import Divider from "../ui/Devider";
import Color from "@/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import CompanyFieldDropDown from "./CompanyFieldDropDown";
import { useDispatch, useSelector } from 'react-redux';
import { setCompanyInfo, registerUser, selectLoading, selectError } from '@/store/slices/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import CitySelector from "./CitySelector";
import regionsAndCitiesData from "@/constants/Cities/Cities.json";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function CombinedCompanyForm({ onInputFocus, onLoadingModalChange }) {


  const { width, height } = Dimensions.get('window');
  const isSmallScreen = height < 700; 
  const isAndoird = Platform.OS === 'android';

  const bottomSheetHeight = useMemo(() => {
      return isSmallScreen ? hp('70%') : hp('53%');
  }, [isSmallScreen]);




  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);
  const isLoading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [isLoadingModalVisible, setIsLoadingModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isCompanyFieldValid, setIsCompanyFieldValid] = useState(false);

  const [formData, setFormData] = useState({
    Fname: "",
    Lname: "",
    city: "",
    cityObject: null,
    companyName: "",
    field: "",
  });

  const [errors, setErrors] = useState({
    Fname: "",
    Lname: "",
    city: "",
    companyName: "",
    field: "",
  });

  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const step1Animation = useRef(new Animated.Value(1)).current;
  const step2Animation = useRef(new Animated.Value(0)).current;

  const handleInputFocus = () => {
    if (onInputFocus) onInputFocus(true);
  };

  const handleInputBlur = () => {
    if (onInputFocus) onInputFocus(false);
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

    if (!formData.Fname.trim()) {
      newErrors.Fname = "الاسم مطلوب";
      valid = false;
    } else {
      newErrors.Fname = "";
    }

    if (!formData.Lname.trim()) {
      newErrors.Lname = "اللقب مطلوب";
      valid = false;
    } else {
      newErrors.Lname = "";
    }
    if (!formData.city.trim()) {
      newErrors.city = "المدينة مطلوبة";
      valid = false;
    } else {
      newErrors.city = "";
    }

    setErrors(newErrors);
    return valid;
  };

  const validateStep2 = () => {
    let valid = true;
    let newErrors = { ...errors };

    if (!formData.field.trim()) {
      newErrors.field = "مجال الشركة مطلوب";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  useEffect(() => {
    if (onLoadingModalChange) {
      onLoadingModalChange(isLoadingModalVisible);
    }
  }, [isLoadingModalVisible]);

  useEffect(() => {
    if (isLoading) {
      setIsLoadingModalVisible(true);
    } else if (isLoadingModalVisible && userData.registered) {
      const minLoadingTime = 2000;

      setTimeout(() => {
        setIsLoadingModalVisible(false);
        
        setTimeout(() => {
          setIsSuccessModalVisible(true);
          
          setTimeout(() => {
            setIsSuccessModalVisible(false);
          }, 5000);
        }, 300);
      }, minLoadingTime);
    }
  }, [isLoading, userData.registered, isLoadingModalVisible]);

  const handleSubmit = async () => {
    setIsSubmitted(true);

    if (validateStep2()) {
      try {
        await AsyncStorage.setItem('isRegistering', 'true');
        
        dispatch(setCompanyInfo(formData));
        
        let phoneNum = userData.phoneNumber;
        if (!phoneNum || phoneNum.trim() === '') {
          setErrors(prev => ({...prev, phoneNumber: "رقم الهاتف مطلوب"}));
          return;
        }
        
        phoneNum = String(phoneNum).trim();
        
        const completeUserData = {
          Fname: formData.Fname, 
          Lname: formData.Lname, 
          city: formData.city,
          field: formData.field,
          companyName: formData.companyName,
          phoneNumber: phoneNum,
          password: userData.password.replace(/\s/g, ""),
          role: userData.role
        };
        
        console.log("Submitting user data:", completeUserData); 
        
        setButtonDisabled(true);
        
        setIsLoadingModalVisible(true);
        
        const resultAction = await dispatch(registerUser(completeUserData));
        
        if (registerUser.fulfilled.match(resultAction)) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          setIsLoadingModalVisible(false);
          
          setIsSuccessModalVisible(true);
          
          await AsyncStorage.setItem("isAuthenticated", "true");
          await AsyncStorage.setItem("user", JSON.stringify(completeUserData));
          await AsyncStorage.setItem("registered", "true");
        }
      } catch (error) {
        console.error('Registration error:', error);
        setIsLoadingModalVisible(false);
        await AsyncStorage.removeItem('isRegistering');
        setButtonDisabled(false);
      }
    }
  };

  const Step1Form = (
    <Animated.View
      style={{
        opacity: step1Animation,
        transform: [
          {
            translateX: step1Animation.interpolate({
              inputRange: [0, 1],
              outputRange: [-300, 0],
            }),
          },
        ],
        position: "absolute",
        width: "100%",
        zIndex: 9
      }}
    >
      <Text className="text-center text-[#F52525] text-lg  mb-6 font-tajawal" style={styles.textConfig}>
        أدخل معلومات شركتك
      </Text>
      <Divider />

      <View className="mb-2 mt-2">
        <Text
          className="text-right text-gray-700 mb-2 font-tajawal text-[12px]"
          style={{ color: Color.green }}
        >
          الاسم: <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          placeholder="أدخل الاسم "
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholderTextColor="#888"
          value={formData.Fname}
          onChangeText={(text) => setFormData({ ...formData, Fname: text })}
          className={`border ${errors.Fname ? "border-red-500" : "border-[#2e752f]"
            } rounded-lg p-3 text-black text-right bg-white font-tajawalregular`}
        />
        {errors.Fname ? (
          <Text className="text-red-500 text-right mt-0 -mb-1 font-tajawalregular text-[10px]">
            {errors.Fname}
          </Text>
        ) : null}
      </View>
      <View className="mb-2 mt-2">
        <Text
          className="text-right text-gray-700 mb-2 font-tajawal text-[12px]"
          style={{ color: Color.green }}
        >
          اللقب : <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          placeholder="أدخل اللقب  "
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholderTextColor="#888"
          value={formData.Lname}
          onChangeText={(text) => setFormData({ ...formData, Lname: text })}
          className={`border ${errors.Lname ? "border-red-500" : "border-[#2e752f]"
            } rounded-lg p-3 text-black text-right bg-white font-tajawalregular`}
        />
        {errors.Lname ? (
          <Text className="text-red-500 text-right mt-0 -mb-1 font-tajawalregular text-[10px]">
            {errors.Lname}
          </Text>
        ) : null}
      </View>

      <CitySelector
        onCitySelect={(cityObj) => {
          setFormData({
            ...formData,
            city: cityObj.names.ar,
            cityObject: cityObj
          });
          setErrors((prev) => ({ ...prev, city: "" }));
        }}
        initialValue={formData.city}
        errors={errors}
        isSubmitted={isSubmitted}
        regionsAndCities={regionsAndCitiesData}
      />
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
          textStyles="text-white text-center font-tajawal text-[15px] pt-1"
        />
      </View>
    </Animated.View>
  );

  const Step2Form = (
    <Animated.View
      style={{
        opacity: step2Animation,
        transform: [
          {
            translateX: step2Animation.interpolate({
              inputRange: [0, 1],
              outputRange: [300, 0],
            }),
          },
        ],
        position: "relative",
        width: "100%",
      }}
    >
      <Text className="text-center text-[#F52525] text-lg  mb-6 font-tajawal">
        أدخل تفاصيل الشركة
      </Text>
      <Divider />

      <View className="mt-4 mb-0  w-full">
        <CompanyFieldDropDown
          onFieldSelect={(field) => {
            setFormData((prev) => ({ ...prev, field: field }));
            setErrors((prev) => ({ ...prev, field: "" }));
          }}
          initialValue={formData.field}
          errors={errors}
          isSubmitted={isSubmitted}
        />
      </View>

      <View className="mb-4">
        <Text
          className="text-right text-gray-700 mb-2 font-tajawal text-[12px]"
          style={{ color: Color.green }}
        >
          اسم شركتك
        </Text>
        <TextInput
          placeholder="أدخل اسم شركتك (إذا كان متوفر)"
          placeholderTextColor="#888"
          value={formData.companyName}
          onChangeText={(text) => setFormData({ ...formData, companyName: text })}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className={`border border-[#2e752f] rounded-lg p-3 text-black text-right bg-white font-tajawalregular`}
        />
      </View>

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
          textStyles="text-white text-center font-tajawal text-[15px] "
        />
      </View>
    
      {error && (
        <Text className="text-red-500 text-center mt-4 font-tajawalregular text-[13px]">
          {typeof error === 'string' ? error : 'حدث خطأ أثناء التسجيل'}
        </Text>
      )}
    </Animated.View>
  );




  const LoadingModal = (
    <Modal
      visible={isLoadingModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setIsLoadingModalVisible(false)}
    >
      <TouchableOpacity 
        style={{ flex: 1, backgroundColor: 'rgba(47, 117, 47, 0.48)' }}
        activeOpacity={1}
      >
        <TouchableOpacity 
          activeOpacity={1}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: bottomSheetHeight,
            padding: 16
          }}
        >
          <View style={{ 
            width: 60, 
            height: 5, 
            backgroundColor: Color.green, 
            borderRadius: 5, 
            alignSelf: 'center',
            marginBottom: 10
          }} />
          
          <View className="flex-1 items-center justify-center h-full py-12">
            <View className="mb-4 items-center">
              <Image 
                source={require('@/assets/images/loader.gif')}
                style={{ width: 200, height: 200 }}
                resizeMode="contain"
              className="mb-4 rounded-full"
              />
            </View>
            <Text className="text-center text-[#000000] text-3xl font-tajawal pt-2">
              جار إنشاء حسابك
            </Text>
            <Text className="text-[#2e752f] text-base text-center p-4 font-tajawalregular">
              يرجى الانتظار...
            </Text>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  const SuccessModal = (
    <Modal
      visible={isSuccessModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setIsSuccessModalVisible(false)}

    >
      <TouchableOpacity 
        style={{ flex: 1, backgroundColor: 'rgba(47, 117, 47, 0.48)' }}
        activeOpacity={1}
      >
        <TouchableOpacity 
          activeOpacity={1}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: bottomSheetHeight,
            padding: 16
          }}
        >
          <View style={{ 
            width: 60, 
            height: 5, 
            backgroundColor: Color.green, 
            borderRadius: 5, 
            alignSelf: 'center',
            marginBottom: 10
          }} />
          
          <View className="flex-1 items-center justify-center h-full py-8">
            <Image 
              source={require('@/assets/images/happyLeon.png')}
              className={`${isAndoird ? "w-[200] h-[200]" : "w-[240] h-[240]"}`}
              resizeMode="contain"
            />
            <Text className="text-center text-black text-2xl font-tajawal " style={styles.FontText}>
              مبروك!
            </Text>
            <Text className="text-gray-700 text-base text-center p-2 font-tajawalregular">
              تم إنشاء حسابك بنجاح.
            </Text>
            <View className="w-full mt-8">
              <CustomButton
                onPress={() => {
                  router.replace("/(home)");
                }}
                title="انتقل للصفحة الرئيسية"
                textStyles="text-sm font-tajawal px-2 py-0 text-white"
                containerStyles="w-[90%] m-auto bg-[#F52525] rounded-full  pt-0"
                disabled={false}
              />
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className={`flex p-4 ${isLoadingModalVisible || isSuccessModalVisible ? "opacity-50" : "bg-white"}`}
      style={{ minHeight: 300 }}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View>
          {LoadingModal}
          {SuccessModal}
  
          <View style={{ position: "relative", height: 500 }}>
            {Step1Form}
            {Step2Form}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  FontText: {
    fontFamily: 'Tajawal',
  },
});