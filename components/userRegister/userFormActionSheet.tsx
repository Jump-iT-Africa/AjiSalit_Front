import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  Modal,
  Image,
  StyleSheet,
} from "react-native";
import CustomButton from "../ui/CustomButton";
import Divider from "../ui/Devider";
import Color from "@/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import { useDispatch, useSelector } from 'react-redux';
import { setPersonalInfo, registerUser, selectLoading, selectError } from '@/store/slices/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CitySelector from "../CompanyRegister/CitySelector";
import regionsAndCitiesData from "@/constants/Cities/Cities.json";

export default function UserFormActionSheet() {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);
  const isLoading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [isLoadingModalVisible, setIsLoadingModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  
  const [formData, setFormData] = useState({
    Fname: "",
    Lname: "",
    cityObject: null,
    city: "",
  });

  const [errors, setErrors] = useState({
    Fname: "",
    Lname: "",
    city: "",
  });

  useEffect(() => {
    if (isLoading) {
      setIsLoadingModalVisible(true);
    } else if (isLoadingModalVisible && userData.registered) {
      const minLoadingTime = 2000;
      
      setTimeout(() => {
        setIsLoadingModalVisible(false);
        
        setTimeout(() => {
          setIsSuccessModalVisible(true);
        }, 300);
      }, minLoadingTime);
    }
  }, [isLoading, userData.registered, isLoadingModalVisible]);

  const validateInputs = () => {
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

  const handleSubmit = async () => {
    setIsSubmitted(true);
    
    if (validateInputs()) {
      try {
        await AsyncStorage.setItem('isRegistering', 'true');
        
        dispatch(setPersonalInfo(formData));
        
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
          phoneNumber: phoneNum,
          password: userData.password.replace(/\s/g, ""),
          role: 'client' 
        };
        
        console.log("Submitting user data:", completeUserData);
        
        // Disable button while submitting
        setButtonDisabled(true);
        
        // Show loading modal
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
            height: '50%',
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
            <View className="w-200 h-200 border-4 border-white ">
                <Image 
                  source={require('@/assets/images/loader.gif')}
                  style={{ width: 200, height: 200 }}
                  resizeMode="contain"
                  className="mb-4 w-200 h-200"
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
            height: '50%',
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
              style={{ width: 240, height: 240 }}
              resizeMode="contain"
            />
            <Text className="text-center text-[#2e752f] text-2xl font-tajawal font-bold" style={styles.FontText}>
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
                containerStyles="w-[90%] m-auto bg-[#F52525] rounded-full p-0 pt-2"
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
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          {LoadingModal}
          {SuccessModal}

          <Text className="text-center text-[#F52525] text-lg font-bold mb-6 font-tajawal">
            أدخل معلوماتك الشخصية
          </Text>
          <Divider />

          <View className="mb-2 mt-4">
            <Text
              className="text-right text-gray-700 mb-2 font-tajawal text-[12px]"
              style={{ color: Color.green }}
            >
              الاسم: <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              placeholder="أدخل الاسم"
              placeholderTextColor="#888"
              value={formData.Fname}
              onChangeText={(text) => setFormData({ ...formData, Fname: text })}
              className={`border ${
                errors.Fname ? "border-red-500" : "border-[#2e752f]"
              } rounded-lg p-3 text-black text-right bg-white font-tajawalregular`}
            />
            {errors.Fname ? (
              <Text className="text-red-500 text-right mt-1 font-tajawalregular text-[10px]">
                {errors.Fname}
              </Text>
            ) : null}
          </View>

          <View className="mb-2 mt-0">
            <Text
              className="text-right text-gray-700 mb-2 font-tajawal text-[12px]"
              style={{ color: Color.green }}
            >
              اللقب: <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              placeholder="أدخل اللقب"
              placeholderTextColor="#888"
              value={formData.Lname}
              onChangeText={(text) => setFormData({ ...formData, Lname: text })}
              className={`border ${
                errors.Lname ? "border-red-500" : "border-[#2e752f]"
              } rounded-lg p-3 text-black text-right bg-white font-tajawalregular`}
            />
            {errors.Lname ? (
              <Text className="text-red-500 text-right mt-1 font-tajawalregular text-[10px]">
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
              title="إنشاء حساب"
              onPress={handleSubmit}
              containerStyles="p-3 bg-[#2e752f] rounded-full"
              textStyles="text-white text-center font-tajawal text-[15px]"
              disabled={buttonDisabled || isLoading}
            />
          </View>
          
          {error && (
            <Text className="text-red-500 text-center mt-4 font-tajawalregular text-[10px]">
              {typeof error === 'string' ? error : 'حدث خطأ أثناء التسجيل'}
            </Text>
          )}
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