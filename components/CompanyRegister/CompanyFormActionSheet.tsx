// @ts-nocheck
import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Animated,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import CustomButton from "../ui/CustomButton";
import Divider from "../ui/Devider";
import Color from "@/constants/Colors";
import ActionSheetComponent from "@/components/ui/ActionSheet";
import { ActionSheetRef } from "react-native-actions-sheet";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import SuccessActionSheetComponent from "../ui/SuccessActionSheet";
import Colors from "@/constants/Colors";
import CompanyFieldDropDown from "./CompanyFieldDropDown";
import { useDispatch, useSelector } from 'react-redux';
import { setCompanyInfo, registerUser, selectLoading, selectError } from '@/store/slices/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage'; 



export default function CombinedCompanyForm() {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);
  const isLoading = useSelector(selectLoading);
  const error = useSelector(selectError);
  
  const [isCompanyFieldValid, setIsCompanyFieldValid] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    ice: "",
    field: "", 
  });

  const [errors, setErrors] = useState({
    name: "",
    ice: "",
    field: "",
  });

  const [step, setStep] = useState(1);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const actionSheetRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const step1Animation = useRef(new Animated.Value(1)).current;
  const step2Animation = useRef(new Animated.Value(0)).current;

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

    if (!formData.name.trim()) {
      newErrors.name = "الاسم و اللقب مطلوب";
      valid = false;
    } else {
      newErrors.name = "";
    }

    setErrors(newErrors);
    return valid;
  };

  const validateStep2 = () => {
    let valid = true;
    let newErrors = { ...errors };

    if (!formData.ice || formData.ice.trim() === "" ) {
      newErrors.ice = "معرف الضريبة مطلوب";
      valid = false;
    } else {
      if (!formData.ice || formData.ice.trim() === "") {
        newErrors.ice = "معرف الضريبة مطلوب";
        valid = false;
      } else if (formData.ice.trim().length < 14) {
        newErrors.ice = "معرف الضريبة يجب أن يكون أطول";
        valid = false;
      } else if (formData.ice.trim().length > 15) {
        newErrors.ice = "معرف الضريبة يجب أن لا يتجاوز 15 رقمًا";
        valid = false;
      } else {
        newErrors.ice = "";
      }
    }

    if (!formData.field.trim()) {
      newErrors.field = "مجال الشركة مطلوب";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
  
    if (validateStep2()) {
      dispatch(setCompanyInfo(formData));
      
      // Make sure phoneNumber is a string and not empty
      let phoneNum = userData.phoneNumber;
      if (!phoneNum || phoneNum.trim() === '') {
        setErrors(prev => ({...prev, phoneNumber: "رقم الهاتف مطلوب"}));
        return;
      }
      
      // Ensure phoneNumber is a string
      phoneNum = String(phoneNum).trim();
      
      const completeUserData = {
        name: formData.name, 
        city: formData.city,
        field: formData.field,
        ice: formData.ice,
        phoneNumber: phoneNum, // Use the validated phone number
        password: userData.password.replace(/\s/g, ""),
        role: userData.role
      };
      
      console.log("Submitting user data:", completeUserData); // Add this for debugging
      
      const resultAction = await dispatch(registerUser(completeUserData));
      
      if (registerUser.fulfilled.match(resultAction)) {
        setIsSheetVisible(true);
        await AsyncStorage.setItem("registered", "true"); // Use await here
        actionSheetRef.current?.show();
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
        zIndex:9
      }}
    >
      <Text className="text-center text-[#F52525] text-xl font-bold mb-6 font-tajawal">
        أدخل معلومات شركتك
      </Text>
      <Divider />

      <View className="mb-4 mt-4">
        <Text
          className="text-right text-gray-700 mb-2 font-tajawal"
          style={{ color: Color.green }}
        >
          الاسم و اللقب: <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          placeholder="أدخل الاسم و اللقب"
          placeholderTextColor="#888"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          className={`border ${
            errors.name ? "border-red-500" : "border-[#2e752f]"
          } rounded-lg p-3 text-black text-right bg-white font-tajawalregular`}
        />
        {errors.name ? (
          <Text className="text-red-500 text-right mt-1 font-tajawalregular text-[13px]">
            {errors.name}
          </Text>
        ) : null}
      </View>

      <View className="mt-4 mb-6">
        <Text
          className="text-right text-gray-700 mb-2 font-tajawal"
          style={{ color: Color.green }}
        >
          العنوان و المدينة (الموقع):
        </Text>
        <TextInput
          placeholder="أدخل العنوان، المدينة"
          placeholderTextColor="#888"
          value={formData.city}
          onChangeText={(text) => setFormData({ ...formData, city: text })}
          className={`border border-[#2e752f] rounded-lg p-3 text-black text-right bg--white font-tajawalregular`}
        />
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
      <Text className="text-center text-[#F52525] text-xl font-bold mb-6 font-tajawal">
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
          className="text-right text-gray-700 mb-2 font-tajawal"
          style={{ color: Color.green }}
        >
          معرف الضريبة: <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          placeholder="أدخل معرف الضريبة"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={formData.ice}
          onChangeText={(text) => setFormData({ ...formData, ice: text })}
          maxLength={14}
          className={`border ${
            errors.ice ? "border-red-500" : "border-[#2e752f]"
          } rounded-lg p-3 text-black text-right bg-white font-tajawalregular`}
        />
        {errors.ice ? (
          <Text className="text-red-500 text-right mt-1 font-tajawalregular text-[13px]">
            {errors.ice}
          </Text>
        ) : null}
      </View>

      <Divider />

      <View className="mt-6 flex-row justify-between gap">
        <CustomButton
          title="رجوع"
          onPress={animateToPreviousStep}
          containerStyles="p-3 bg-gray-500 rounded-full w-2/4 mr-2"
          textStyles="text-white text-center font-tajawal text-[15px]"
        />
        {isLoading ? (
          <View className="p-3 bg-[#2e752f] rounded-full w-2/4 justify-center items-center">
            <ActivityIndicator size="small" color="#ffffff" />
          </View>
        ) : (
          <CustomButton
            title="إنشاء حساب"
            onPress={handleSubmit}
            containerStyles="p-3 bg-[#2e752f] rounded-full w-2/4"
            textStyles="text-white text-center font-tajawal text-[15px]"
          />
        )}
      </View>
      
      {error && (
        <Text className="text-red-500 text-center mt-4 font-tajawalregular text-[13px]">
          {typeof error === 'string' ? error : 'حدث خطأ أثناء التسجيل'}
        </Text>
      )}
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className={`flex p-4 ${isSheetVisible ? "opacity-50" : "bg-white"}`}
      style={{ minHeight: 500 }}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View>
          <ActionSheetComponent
            ref={actionSheetRef}
            containerStyle={{ backgroundColor: Colors.green }}
            contentStyle={{ backgroundColor: Colors.green }}
          >
            <View className="flex-1 items-center justify-center h-full ">
              <View>
                <AntDesign name="checkcircleo" size={190} color="white" />
              </View>
              <View>
                <Text className="text-center text-white text-6xl font-tajawal pt-7 mt-4">
                  مبروك!
                </Text>
                <Text className="text-white text-lg font-bold text-center p-4 font-tajawalregular">
                  تم إنشاء حسابك بنجاح.
                </Text>
              </View>
              <View className="w-full mt-20">
                <CustomButton
                  onPress={() => {
                    setIsSheetVisible(false);
                    actionSheetRef.current?.hide();
                    router.replace("(home)");
                  }}
                  title="انتقل للصفحة الرئيسية"
                  textStyles="text-sm font-tajawal px-2 py-0 text-[#2e752f]"
                  containerStyles="w-[90%] m-auto bg-white"
                />
              </View>
            </View>
          </ActionSheetComponent>

          <View style={{ position: "relative", height: 500 }}>
            {Step1Form}
            {Step2Form}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}