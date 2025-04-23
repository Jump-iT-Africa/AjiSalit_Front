

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import AppGradient from '@/components/ui/AppGradient';
import Color from '@/constants/Colors';
import HeaderWithBack from '@/components/ui/HeaderWithToolTipAndback';
import Whitelogo from "@/assets/images/whiteLogo.png";
import { useDispatch } from 'react-redux';
import { setPassword } from "@/store/slices/userSlice";
import { Feather } from "@expo/vector-icons";

export default function CreatePIN() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [lastVisibleIndex, setLastVisibleIndex] = useState(-1);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const timeoutRef = useRef(null);
  const dispatch = useDispatch();
  const windowWidth = Dimensions.get('window').width;

  const handleBack = () => {
    setTimeout(() => {
      router.back();
    }, 100);
  };

  const PIN_LENGTH = 6;

  const handleDigitPress = (digit) => {
    if (code.length < PIN_LENGTH) {
      const newValue = code + digit;
      setCode(newValue);
      
      setLastVisibleIndex(newValue.length - 1);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setLastVisibleIndex(-1);
      }, 1000);
    }
  };

  const handleBackspace = () => {
    if (code.length > 0) {
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

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (code.length === 6) {
      setTimeout(() => {
        dispatch(setPassword(code));
        router.navigate('ConfirmPIN');
      }, 1000);
    }
  }, [code]);

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

  return (
    <AppGradient colors={[Color.red, Color.red]} className="flex-1">
      <TouchableOpacity onPress={handleBack}>
        <HeaderWithBack
          onPress={() => router.back()}
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
        <Text className="text-white font-tajawal text-center mb-8 text-xl px-10">
          دخل كود سري جديد للتطبيق باش تكمل.
        </Text>
        
        {/* PIN Dots */}
        <View className="flex-row justify-center items-center space-x-5 mb-12">
          {[...Array(PIN_LENGTH)].map((_, index) => (
            <View key={index} className="w-5 h-5 justify-center items-center">
              {index === lastVisibleIndex ? (
                <Text className="text-white font-tajawal text-xl">
                  {code[index]}
                </Text>
              ) : (
                <View
                  className={`w-5 h-5 rounded-full ${
                    code.length > index 
                      ? 'bg-white' 
                      : 'bg-white/30'
                  }`}
                />
              )}
            </View>
          ))}
        </View>
        
        {/* Custom Numeric Keypad */}
        <View className="flex-1 justify-end pb-0 w-full  ">
          {renderKeypad()}
        </View>
      </View>
    </AppGradient>
  );
}