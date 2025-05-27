import React, { useState, useRef, useEffect } from "react";
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
  Animated,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import RegisterBackImage from "@/assets/images/register2.jpg";
import RegisterFocusBackImage from "@/assets/images/register3.jpeg";
import AdrarImage from "@/assets/images/adrar.png"; // Import the new background image
import AppGradient from "../../components/ui/AppGradient";
import HeaderWithBack from "@/components/ui/HeaderWithToolTipAndback";
import { useDispatch, useSelector } from 'react-redux';
import { LinearGradient } from "expo-linear-gradient";

import { 
  setPhoneNumber, 
  verifyPhoneNumber,
  selectVerificationLoading,
  selectVerificationSuccess,
  selectError
} from "@/store/slices/userSlice";


const Register: React.FC = () => {

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [phone, setPhone] = useState('+212 ');
  const [inputFocused, setInputFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showLoadingBackground, setShowLoadingBackground] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const isVerifying = useSelector(selectVerificationLoading);
  const verificationSuccess = useSelector(selectVerificationSuccess);
  const error = useSelector(selectError);
  const backgroundTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: inputFocused ? 1 : 0,
      duration: 500, 
      useNativeDriver: true,
    }).start();
  }, [inputFocused, fadeAnim]);
  
  useEffect(() => {
    if (isVerifying) {
      setShowLoadingBackground(true);
      if (backgroundTimeoutRef.current) {
        clearTimeout(backgroundTimeoutRef.current);
      }
    } else if (showLoadingBackground) {
      backgroundTimeoutRef.current = setTimeout(() => {
        setShowLoadingBackground(false);
      }, 1500); // Minimum display time of 1.5 seconds
    }
    
    // Cleanup timeout on component unmount
    return () => {
      if (backgroundTimeoutRef.current) {
        clearTimeout(backgroundTimeoutRef.current);
      }
    };
  }, [isVerifying, showLoadingBackground]);
  
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
    
    let remainder = '';
    if (cleaned.length > 4) {
      remainder = cleaned.slice(4);
      
      
      let maxLength = 4; 
      if (remainder[0] === '0') {
        
        maxLength += 10;
      } else if (['6', '7', '5'].includes(remainder[0])) {
        
        maxLength += 9;
      }
      
      
      cleaned = cleaned.slice(0, maxLength);
    }
  
    
    if (cleaned.length > 4) {
      remainder = cleaned.slice(4);
      cleaned = cleaned.slice(0, 4) + ' ' + remainder;
    }
  
    return cleaned;
  };
  
  
  const isValidMoroccanNumber = (number: string) => {
    
    const testNumber = number.replace(/\s/g, '');
    
    
    if (!testNumber.startsWith('+212')) {
      return { isValid: false, message: "رقم الهاتف خاصو يبدا ب +212" };
    }
    
    const remainingDigits = testNumber.slice(4); 
    const firstDigit = remainingDigits[0];
    
    
    if (['6', '7', '5'].includes(firstDigit)) {
      
      if (remainingDigits.length !== 9) {
        return { isValid: false, message: "رقم الهاتف خاصو يكون فيه 9 أرقام بعد +212" };
      }
    }
    
    else if (['0'].includes(firstDigit)) {
      const secondDigit = remainingDigits[1];
      if (!['6', '7', '5'].includes(secondDigit)) {
        return { isValid: false, message: "رقم الهاتف خاصو يبدا ب 06 ولا 07 ولا 05 بعد +212" };
      }
      
      if (remainingDigits.length !== 10) {
        return { isValid: false, message: "رقم الهاتف خاصو يكون فيه 10 أرقام بعد +212" };
      }
    } 
    else {
      return { isValid: false, message: "رقم الهاتف خاصو يبدا ب 6 ولا 7 ولا 5 ولا 06 ولا 07 ولا 05 بعد +212" };
    }
    
    return { isValid: true, message: "" };
  };
  
  
  const handlePhoneNumberChange = (text: string) => {
    const formattedNumber = formatPhoneNumber(text);
    setPhone(formattedNumber);
  };

  const handleSubmit = () => {
    setErrorMessage('');
    
    const validation = isValidMoroccanNumber(phone);
    if (!validation.isValid) {
      console.log('error in validation', validation.message);
      setErrorMessage(validation.message);
      return;
    }
    
    dispatch(setPhoneNumber(phone));
    
    console.log('Submitting phone number with format:', phone);
    
    // Set a minimum display time for the processing background
    setShowLoadingBackground(true);
    
    dispatch(verifyPhoneNumber(phone))
      .unwrap()
      .then((response) => {
        console.log('Verification response:', response);
        
        backgroundTimeoutRef.current = setTimeout(() => {
          if (response.statusCode === 409 && response.isExist === true) {
            console.log('User exists, redirecting to password screen');
            router.navigate({
              pathname: '/interPassword',
              params: { 
                phoneNumber: phone, 
                userName: response.UserName
              }
            });
          } else {
            console.log('Phone verification successful');
            router.navigate('/CreatePIN');
          }
        }, 1000); // Add a small delay for smoother transition
      })
      .catch((err) => {
        console.log('Failed to verify phone:', err);
        setErrorMessage(err.message || "حدث خطأ ما");
        // Keep loading background for minimum time even on error
        backgroundTimeoutRef.current = setTimeout(() => {
          setShowLoadingBackground(false);
        }, 1500);
      });
  };

  const handleFocus = () => {
    setInputFocused(true);
  };

  const handleBlur = () => {
    setInputFocused(false);
  };

  useEffect(() => {
    if (error) {
      console.log(error);
      if (error.message === "Phone number already exists") {
        // Add delay before navigation for smooth transition
        backgroundTimeoutRef.current = setTimeout(() => {
          router.navigate({
            pathname: '/InterPassword',
            params: {
              userName: error.UserName,
              phoneNumber: phone
            }
          });
        }, 1500); // Use minimum display time for the background
      } else {
        setErrorMessage(error.message || "حدث خطأ ما");
        // Keep loading background for minimum time even on error
        backgroundTimeoutRef.current = setTimeout(() => {
          setShowLoadingBackground(false);
        }, 1500);
      }
    }
  }, [error]);

  // Determine which background image to show
  const backgroundImage = showLoadingBackground ? AdrarImage : RegisterBackImage;
  const focusBackgroundImage = showLoadingBackground ? AdrarImage : RegisterFocusBackImage;

  return (
    <KeyboardAvoidingView className="flex-1">
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View className="flex-1">
          <View className="absolute w-full h-full">
            <ImageBackground
              source={backgroundImage}
              resizeMode="cover"
              className="flex-1"
            />
            <LinearGradient
                colors={['#25000B', '#390000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.30 }}
              />
          </View>
          
          <Animated.View className="absolute w-full h-full" style={{ opacity: fadeAnim }}>
          <ImageBackground
            source={focusBackgroundImage}
            resizeMode="cover"
            className="flex-1"
          />
          <LinearGradient
            colors={['#25000B', '#390000']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ 
              position: 'absolute', 
              left: 0, 
              right: 0, 
              top: 0, 
              bottom: 0, 
              opacity: 0.40,
              zIndex:1
            }}
          />
        </Animated.View>
          <View className="flex-1">
            <AppGradient colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.0)"]}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <SafeAreaView className="flex-1">
                <HeaderWithBack 
                  tooltipVisible={tooltipVisible} 
                  setTooltipVisible={setTooltipVisible} 
                  content="فهاد الصفحة تقدر تزيد رقم الهاتف تاعك 😊"
                  onPress={()=>router.push('(tabs)')}
                /> 
                <View className="flex-1 justify-center px-0 lg:px-10">
                  <Text className="text-white text-center text-[20px] leading-[24px] font-tajawal mb-8 pt-4 px-4 sm:px-6 md:px-8">
                    دخل رقم الهاتف ديالك باش تسجل فالطبيق.
                  </Text>

                  <View className="flex-row items-center mb-4 justify-center">
                    <View
                      className={`flex-row items-center bg-[#ffffff5f] rounded-full ${
                        Platform.OS === "android" ? "p-[5]" : "p-[12]"
                      } pr-2 ${Platform.OS === "android" ? "w-[100%]" : "w-[90%]"} pl-5`}
                    >
                      <Feather name="phone" size={21} color="#F52525" className="pl-8" />
                      <TextInput
                        value={phone}
                        onChangeText={handlePhoneNumberChange}
                        keyboardType="phone-pad"
                        className="flex-1 text-white text-lg font-tajawal mx-3 rtl:text-right"
                        style={{
                          paddingTop: Platform.OS === "android" ? 10 : 10,
                        }}
                        placeholderTextColor="rgba(255, 255, 255, 0.7)"
                        placeholder="+212 0697042864"
                        selectionColor="white"
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        editable={!isVerifying}
                      />
                      
                    </View>
                    
                    <TouchableOpacity
                      onPress={handleSubmit}
                      className="bg-[#2e752f] rounded-full p-[19] ml-[-56] w-19 h-19 items-center justify-center"
                      disabled={isVerifying}
                    >
                      {isVerifying ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Feather name="arrow-right" size={24} color="white" />
                      )}
                    </TouchableOpacity>
                  </View>
                  {errorMessage === "Phone number already exists" ? (
                      <Text className="text-[#2e752f] text-center text-[12px] mb-4 font-tajawal">
                        رقم الهاتف موجود بالفعل
                      </Text>
                    ) : (
                    <Text className="text-[#F52525] text-center text-[12px] mb-4 font-tajawal">
                      {errorMessage}
                    </Text>
                  )}
                  
                  {showLoadingBackground && (
                    <Text className="text-white text-center text-[16px] mt-4 font-tajawal">
                      جاري التحقق من رقم الهاتف...
                    </Text>
                  )}
                </View>
              </SafeAreaView>
              </KeyboardAvoidingView>
            </AppGradient>
          </View>
          <StatusBar style="light" />
        </View>
      </TouchableWithoutFeedback> 
    </KeyboardAvoidingView>
  );
};

export default Register;