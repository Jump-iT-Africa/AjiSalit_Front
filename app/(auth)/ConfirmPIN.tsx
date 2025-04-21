
import { useLocalSearchParams } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
  Vibration,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux"; 
import AppGradient from "@/components/ui/AppGradient";
import Color from "@/constants/Colors";
import HeaderWithBack from "@/components/ui/HeaderWithToolTipAndback";
import Whitelogo from "@/assets/images/whiteLogo.png";
import { useToast } from "react-native-toast-notifications";
import { Audio } from 'expo-av';
import { Feather } from "@expo/vector-icons";

export default function ConfirmPIN() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [code, setCode] = useState("");
  const [lastVisibleIndex, setLastVisibleIndex] = useState(-1);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const timeoutRef = useRef(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isError, setIsError] = useState(false);
  const createdPin = useSelector((state) => state.user.password);



  console.log('pin from redux', createdPin);
  
  const handleBack = () => {
    setTimeout(() => {
      router.back();
    }, 100);
  };

  const PIN_LENGTH = 6;

  const handleDigitPress = (digit) => {
    if (code.length < PIN_LENGTH && !isValidating) {
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
    if (code.length > 0 && !isValidating) {
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
      console.log("Error playing success sound:", error);
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
        console.log('Error validating PIN:', err);
      } finally {
        setIsValidating(false);
      }
    }
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
                    disabled={isValidating}
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
                    disabled={isValidating}
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

        {isValidating && (
          <View className="mb-8">
            <ActivityIndicator size="large" color="white" />
            <Text className="text-white text-center mt-2 font-tajawal">جاري التحقق...</Text>
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