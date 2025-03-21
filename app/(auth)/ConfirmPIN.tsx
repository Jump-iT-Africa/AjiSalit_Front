// @ts-nocheck

import { useLocalSearchParams } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  ActivityIndicator,
  Vibration,
} from "react-native";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux"; 
import AppGradient from "@/components/ui/AppGradient";
import Color from "@/constants/Colors";
import HeaderWithBack from "@/components/ui/HeaderWithToolTipAndback";
import Whitelogo from "@/assets/images/whiteLogo.png";
import { useToast } from "react-native-toast-notifications";
import { Audio } from 'expo-av';
import soundEffect from "@/assets/sounds/success.mp3"


export default function ConfirmPIN() {
  const { pin } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch(); // Add this
  const [code, setCode] = useState("");

  const [lastVisibleIndex, setLastVisibleIndex] = useState(-1);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);
  const toast = useToast();
  const [isValidating, setIsValidating] = useState(false);
  const [isError, setIsError] = useState(false);
  const createdPin = useSelector((state) => state.user.password);

  const handleBack = () => {
    setTimeout(() => {
      router.replace("(tabs)");
    }, 100);
  };

  const PIN_LENGTH = 6;

  const handlePinChange = (value) => {
    const newValue = value.replace(/[^0-9]/g, "").slice(0, PIN_LENGTH);
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

  useEffect(() => {
    if (code.length === PIN_LENGTH) {
      validateAndStorePin();
    }
  }, [code]);



const playSuccessSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/success.mp3'), 
        { shouldPlay: true }
      );
      
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          await sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("Error playing success sound:", error);
    }
  };

  const validateAndStorePin = async () => {
    if (code.length === PIN_LENGTH) {
        setIsValidating(true);
        try {
            if (code === createdPin) {
                await playSuccessSound();
                
                setTimeout(() => {
                    router.replace("AccountType");
                }, 500);
            } else {
                Vibration.vibrate([0, 400]);
                
                setIsError(true);
                
                setTimeout(() => {
                    setIsError(false);
                    setCode(''); 
                }, 1000);
                
                
            }
        } catch (err) {
            console.error('Error validating PIN:', err);
        } finally {
            setIsValidating(false);
        }
    }
};

  return (
    <AppGradient colors={[Color.red, Color.red]} className="flex-1">
      <TouchableOpacity onPress={handleBack}>
        <HeaderWithBack
          onPress={() => router.replace("(tabs)")}
          tooltipVisible={tooltipVisible}
          setTooltipVisible={setTooltipVisible}
          content="فهاد صفحة غادي تأكد الكود ديالك"
        />
      </TouchableOpacity>
      <View
        className={`flex-1 justify-start items-center ${
          Platform.OS == "ios" ? "mt-[14%]" : "mt-[4%]"
        }`}
      >
        <Image
          source={Whitelogo}
          resizeMode="contain"
          className="w-40 h-40 mb-12"
        />
        <Text className="text-white font-tajawal text-center mb-8 text-xl px-10 ">
          أكد الكود السري ديالك للتطبيق باش تكمل.
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

        {isValidating && (
          <View className="mt-8">
            <ActivityIndicator size="large" color="white" />
            <Text className="text-white text-center mt-2 font-tajawal">جاري التحقق...</Text>
          </View>
        )}
      </View>
    </AppGradient>
  );
}
