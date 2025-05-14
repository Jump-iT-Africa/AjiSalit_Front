import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, ActivityIndicator, Vibration } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AppGradient from '@/components/ui/AppGradient';
import Color from '@/constants/Colors';
import HeaderWithBack from '@/components/ui/HeaderWithToolTipAndback';
import Whitelogo from "@/assets/images/whiteLogo.png";
import { useDispatch } from 'react-redux';
import { login } from "@/store/slices/userSlice";
import { Feather } from "@expo/vector-icons";

export default function interPassword() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [lastVisibleIndex, setLastVisibleIndex] = useState(-1);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const timeoutRef = useRef(null);
  const dispatch = useDispatch();
  const { phoneNumber } = useLocalSearchParams();
  const { userName } = useLocalSearchParams();
  console.log('this is phone number', phoneNumber);
  
  const PIN_LENGTH = 6;

  const handleBack = () => {
    setTimeout(() => {
      router.replace('(tabs)');
    }, 100);
  };

  const handleDigitPress = (digit) => {
    if (code.length < PIN_LENGTH && !isLoading) {
      const newValue = code + digit;
      console.log('Setting new PIN value:', newValue, 'Length:', newValue.length);
      
      setCode(newValue);
      
      setLastVisibleIndex(newValue.length - 1);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setLastVisibleIndex(-1);
      }, 1000);
      
      // Handle login when PIN is complete
      if (newValue.length === PIN_LENGTH) {
        console.log('PIN complete, preparing to login with:', newValue);
        setTimeout(() => {
          handleLogin(newValue);
        }, 300);
      }
    }
  };

  const handleBackspace = () => {
    if (code.length > 0 && !isLoading) {
      const newValue = code.slice(0, -1);
      setCode(newValue);
      
      if (newValue.length > 0) {
        setLastVisibleIndex(newValue.length - 1);
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          setLastVisibleIndex(-1);
        }, 1000);
      }
    }
  };

  const handleLogin = (pinCode) => {
    setIsLoading(true);
    setErrorMessage('');
    
    const loginPayload = {
      phoneNumber: phoneNumber,
      password: pinCode || code 
    };
    
    console.log('Dispatching login with data:', loginPayload);
    
    dispatch(login(loginPayload))
      .unwrap()
      .then((response) => {
        console.log('Login successful:', response);
        setIsLoading(false);
        console.log('login success');
        
        setTimeout(() => {
          if (response.user) {
            router.replace('(home)');
          }
        }, 500);
      })
      .catch((err) => {
        console.log('Login error:', err);
        setIsLoading(false);
        setErrorMessage('كلمة المرور غير صحيحة');
        setCode('');
        console.log('login failed');
        
        setIsError(true);
        Vibration.vibrate([0, 400]);
        
        setTimeout(() => {
          setIsError(false);
            setCode('');
        }, 1000);
      });
  };

  // Custom keypad rendering
  const renderKeypad = () => {
    const keys = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['', '0', 'backspace']
    ];

    return (
      <View className="w-full px-8">
        {keys.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} className="flex-row justify-around my-2">
            {row.map((key, keyIndex) => {
              if (key === '') {
                return <View key={`key-${rowIndex}-${keyIndex}`} className="w-16 h-16" />;
              } else if (key === 'backspace') {
                return (
                  <TouchableOpacity
                    key={`key-${rowIndex}-${keyIndex}`}
                    onPress={handleBackspace}
                    disabled={isLoading}
                    className="w-16 h-16 rounded-full justify-center items-center"
                  >
                    <Feather name="delete" size={24} color="white" />
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity
                    key={`key-${rowIndex}-${keyIndex}`}
                    onPress={() => handleDigitPress(key)}
                    disabled={isLoading}
                    className="w-16 h-16 rounded-full justify-center items-center"
                  >
                    <Text className="text-white text-2xl font-bold">{key}</Text>
                  </TouchableOpacity>
                );
              }
            })}
          </View>
        ))}
      </View>
    );
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <AppGradient colors={[Color.red, Color.red]} className="flex-1">
      <TouchableOpacity onPress={() => router.replace('(tabs)')}>
        <HeaderWithBack
          onPress={() => router.replace('(tabs)')}
          tooltipVisible={tooltipVisible}
          setTooltipVisible={setTooltipVisible}
          content="فهد الصفحة زيد الكود ديال التطبيق"
        />
      </TouchableOpacity>
      <View className={`flex-1 justify-start items-center ${Platform.OS == "ios" ? "mt-[14%]" : "mt-[4%]"}`}>
        <Image
          source={Whitelogo}
          resizeMode="contain"
          className="w-40 h-40 mb-12"
        />
        <Text className="text-white font-tajawal text-center mb-8 text-xl px-10 ">
          سلام {userName}
        </Text>
        
        {/* PIN Dots */}
        <View className="flex-row justify-center items-center space-x-5 mb-8">
          {[...Array(PIN_LENGTH)].map((_, index) => (
            <View key={index} className="w-5 h-5 justify-center items-center">
              {index === lastVisibleIndex ? (
                <Text className="text-white font-tajawal text-xl">
                  {code[index]}
                </Text>
              ) : (
                <View
                  className={`w-5 h-5 rounded-full ${
                    isError
                      ? "bg-red-400" 
                      : code.length > index
                      ? "bg-white"
                      : "bg-white/30"
                  }`}
                  style={isError ? { transform: [{ scale: 1.3 }] } : {}}
                />
              )}
            </View>
          ))}
        </View>
        
        {/* Error message display */}
        {errorMessage ? (
          <Text className="text-[#FAD513] text-center text-[16px] mt-4 font-tajawal ">
            {errorMessage}
          </Text>
        ) : null}
        
        {/* Loading indicator */}
        {isLoading && (
          <View className="mt-4">
            <ActivityIndicator size="small" color="white" />
          </View>
        )}
        
        {/* Custom Numeric Keypad */}
        <View className="flex-1 justify-end pb-0 w-full">
          {renderKeypad()}
        </View>
      </View>
    </AppGradient>
  );
}