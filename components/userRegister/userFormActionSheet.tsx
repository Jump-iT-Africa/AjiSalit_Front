// @ts-nocheck
import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import CustomButton from "../ui/CustomButton";
import Divider from "../ui/Devider";
import Color from "@/constants/Colors";
import BottomSheetComponent from "@/components/ui/BottomSheetComponent";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import { useDispatch, useSelector } from 'react-redux';
import { setPersonalInfo, registerUser, selectLoading, selectError } from '@/store/slices/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserFormActionSheet() {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);
  const isLoading = useSelector(selectLoading);
  const error = useSelector(selectError);
  
  const [formData, setFormData] = useState({
    name: "",
    city: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    city: "",
  });

  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const actionSheetRef = useRef(null);

  const validateInputs = () => {
    let valid = true;
    let newErrors = { ...errors };

    if (!formData.name.trim()) {
      newErrors.name = "الاسم و اللقب مطلوب";
      valid = false;
    } else {
      newErrors.name = "";
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
    if (validateInputs()) {
      // Save form data to Redux
      dispatch(setPersonalInfo(formData));
      
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
        phoneNumber: phoneNum,
        password: userData.password.replace(/\s/g, ""),
        role: 'client' 
      };
      
      console.log("Submitting user data:", completeUserData);
      
      const resultAction = await dispatch(registerUser(completeUserData));
      
      if (registerUser.fulfilled.match(resultAction)) {
        setIsSheetVisible(true);
        await AsyncStorage.setItem("registered", "true");
        actionSheetRef.current?.show();
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className={`flex p-4 ${isSheetVisible ? "opacity-50" : "bg-white"}`}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <Text className="text-center text-[#F52525] text-xl font-bold mb-6 font-tajawal">
            أدخل معلوماتك الشخصية
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
              المدينة: <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              placeholder="أدخل المدينة"
              placeholderTextColor="#888"
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
              className={`border ${
                errors.city ? "border-red-500" : "border-[#2e752f]"
              } rounded-lg p-3 text-black text-right bg-white font-tajawalregular`}
            />
            {errors.city ? (
              <Text className="text-red-500 text-right mt-1 font-tajawalregular text-[13px]">
                {errors.city}
              </Text>
            ) : null}
          </View>

          <Divider />

          <View className="mt-6">
            {isLoading ? (
              <View className="p-3 bg-[#2e752f] rounded-full justify-center items-center">
                <ActivityIndicator size="small" color="#ffffff" />
              </View>
            ) : (
              <CustomButton
                title="إنشاء حساب"
                onPress={handleSubmit}
                containerStyles="p-3 bg-[#2e752f] rounded-full"
                textStyles="text-white text-center font-tajawal text-[15px]"
              />
            )}
          </View>
          
          {error && (
            <Text className="text-red-500 text-center mt-4 font-tajawalregular text-[13px]">
              {typeof error === 'string' ? error : 'حدث خطأ أثناء التسجيل'}
            </Text>
          )}

          <BottomSheetComponent
            ref={actionSheetRef}
            containerStyle={{ backgroundColor: Colors.green }}
            contentStyle={{ backgroundColor: Colors.green }}
          >
            <View className="flex-1 items-center justify-center h-full">
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
          </BottomSheetComponent>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}