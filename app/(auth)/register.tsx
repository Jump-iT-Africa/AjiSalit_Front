import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { useToast } from "react-native-toast-notifications";
import RegisterBackImage from "@/assets/images/home.jpg";
import AppGradient from "../../components/ui/AppGradient";
import HeaderWithBack from "@/components/ui/HeaderWithToolTipAndback";
import { useDispatch } from 'react-redux';


//redux imports 

import {setPhoneNumber} from "@/store/slices/userSlice"





const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Register: React.FC = () => {

  const [tooltipVisible, setTooltipVisible] = useState(false);
  // const [phoneNumber, setPhone] = useState("+212 ");
  const [phone, setPhone] = useState('+212 ');

  const dispatch = useDispatch();


  const toast = useToast();

  const formatPhoneNumber = (text: string) => {
    let cleaned = text.replace(/[^\d+]/g, '');

    if (!cleaned) {
      return "+212 ";
    }

    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    if (!cleaned.startsWith('+212')) {
      cleaned = '+212' + cleaned.slice(1);
    }

    if (cleaned.length > 4) {
      let remainder = cleaned.slice(4);
      cleaned = cleaned.slice(0, 4) + ' ' + remainder;
      cleaned = cleaned.slice(0, 15);
    }

    return cleaned;
  };
 

  const isValidMoroccanNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    
    if (!/^\+212\d{9,10}$/.test(cleaned)) {
      return { isValid: false, message: "رقم الهاتف خاصو يبدا ب +212 و يكون فيه 8 أرقام أو 10" };
    }
  
    const prefix = cleaned.slice(4, 6); 
    const firstDigit = cleaned[4]; 
    console.log(firstDigit);
  
    const validPrefixes = ['06', '07', '05'];
    const validSingleDigits = ['7', '6', '5'];
  
    if (!validPrefixes.includes(prefix) && !validSingleDigits.includes(firstDigit)) {
      return { isValid: false, message: "رقم الهاتف خاصو يبدا ب 06 ولا 07 ولا 05 ولا 7 ولا 6 ولا 5" };
    }
  
    return { isValid: true, message: "" };
  };
  

  const handlePhoneNumberChange = (text: string) => {
    const formattedNumber = formatPhoneNumber(text);
    setPhone(formattedNumber);
  };





  const handleSubmit = () => {
    const validation = isValidMoroccanNumber(phone);
    if (!validation.isValid) {
      console.log('error in 87 page register');
      // toast.show(validation.message, { type: "danger" });
      return;
    }

      dispatch(setPhoneNumber(phone));
      router.navigate('/CreatePIN');

    // router.push({
    //   pathname: "OtpVerification",
    //   params: { phoneNumber: phoneNumber.replace(/\s/g, '') } 
    // });
  };




  return (
    <KeyboardAvoidingView className="flex-1">
       <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
      <View className="flex-1">
        <ImageBackground
          source={RegisterBackImage}
          resizeMode="cover"
          className="flex-1"
        >
          <AppGradient colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.0)"]}>
            <SafeAreaView className="flex-1">
              <HeaderWithBack 
                    tooltipVisible={tooltipVisible} 
                    setTooltipVisible={setTooltipVisible} 
                    content="فهاد الصفحة تقدر تزيد رقم الهاتف تاعك 😊"
                    onPress={()=>router.push('(tabs)')}
                    /> 
              <View className="flex-1 justify-center px-0">
                <Text className="text-white text-center text-[20px] leading-[24px] font-tajawal mb-8 pt-4">
                  دخل رقم الهاتف ديالك باش تسجل فالطبيق.
                </Text>
                <View className="flex-row items-center mb-8 justify-center">
                <View
                    className={`flex-row items-center bg-[#ffffff5f] rounded-full ${
                      Platform.OS === "android" ? "p-[5]" : "p-[12]"
                    } pr-2 ${Platform.OS === "android" ? "w-[100%]" : "w-[90%]"} pl-5`}
                  >
                    <Feather name="phone" size={21} color="#F52525" className="pl-8" />
                    <TextInput
                      autoFocus
                      value={phone}
                      onChangeText={handlePhoneNumberChange}
                      keyboardType="phone-pad"
                      className="flex-1 text-white text-lg font-tajawal mx-3 rtl:text-right"
                      style={{
                        paddingTop: Platform.OS === "android" ? 10 : 6,
                      }}
                      placeholderTextColor="rgba(255, 255, 255, 0.7)"
                      placeholder="+212 0697042864"
                    />
                  </View>
                  <TouchableOpacity
                    onPress={handleSubmit}
                    className="bg-[#F52525] rounded-full p-4 ml-[-56] w-19 h-19 items-center justify-center"
                  >
                    <Feather name="arrow-right" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </AppGradient>
        </ImageBackground>
        <StatusBar style="light" />
      </View>
      </TouchableWithoutFeedback> 
    </KeyboardAvoidingView>
  );
};

export default Register;