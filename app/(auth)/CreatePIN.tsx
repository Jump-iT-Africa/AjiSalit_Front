import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import AppGradient from '@/components/ui/AppGradient';
import Color from '@/constants/Colors';
import HeaderWithBack from '@/components/ui/HeaderWithToolTipAndback';
import Whitelogo from "@/assets/images/whiteLogo.png";
import { useToast } from 'react-native-toast-notifications';

export default function CreatePIN() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [lastVisibleIndex, setLastVisibleIndex] = useState(-1);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);
  const toast = useToast();


  console.log(code);
  

  const handleBack = () => {
    setTimeout(() => {
      router.replace('(tabs)');
    }, 100);
  };

  const PIN_LENGTH = 4;

  const handlePinChange = (value) => {
    const newValue = value.replace(/[^0-9]/g, '').slice(0, PIN_LENGTH);
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
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);



  useEffect(()=>
  {
      if(code.length === 4)
      {
        toast.show("تم حفظ هد الرقم ✅", { type: "success" });
        setTimeout(() => {
          router.push({
            pathname:'ConfirmPIN',
            params:{pin: code}
          });
        }, 1000);
      }
  },[code])

  return (
    <AppGradient colors={[Color.red, Color.red]} className="flex-1">
      <TouchableOpacity onPress={handleBack}>
        <HeaderWithBack
        onPress={() => router.replace('(tabs)')}
          tooltipVisible={tooltipVisible}
          setTooltipVisible={setTooltipVisible}
          content="فهد الصفحة زيد الكود ديال التطبيق"
        />

      </TouchableOpacity>
      <View className="flex-1 justify-start items-center mt-[30%]">
        <Image
          source={Whitelogo}
          resizeMode="contain"
          className="w-40 h-40 mb-12"
        />
        <Text className="text-white font-tajawal text-center mb-8 text-xl px-10 ">
          دخل كود سري جديد للتطبيق باش تكمل.
        </Text>
        
        <TouchableOpacity 
          onPress={() => inputRef.current?.focus()}
          activeOpacity={1}
        >
          <View className="flex-row justify-center items-center space-x-5 ">
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
        </TouchableOpacity>

        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={handlePinChange}
          keyboardType="numeric"
          maxLength={PIN_LENGTH}
          className="absolute opacity-0 w-px h-px"
          autoFocus={true}
        />
      </View>
    </AppGradient>
  );
}