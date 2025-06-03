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
} from "react-native";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux"; 
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AppGradient from "@/components/ui/AppGradient";
import Color from "@/constants/Colors";
import HeaderWithBack from "@/components/ui/HeaderWithToolTipAndback";
import Whitelogo from "@/assets/images/ajisalit_white.png";
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

    // Calculate dynamic key size based on screen width
    const keySize = Math.min(wp('15%'), hp('8%'));
    const fontSize = Math.min(wp('5%'), hp('2.5%'));
    const iconSize = Math.min(wp('6%'), hp('3%'));

    return (
      <View style={{ width: wp('100%'), paddingHorizontal: wp('5%') }}>
        {keys.map((row, rowIndex) => (
          <View 
            key={`row-${rowIndex}`} 
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginVertical: hp('1%')
            }}
          >
            {row.map((key, keyIndex) => {
              if (key === '') {
                return <View key={`key-${rowIndex}-${keyIndex}`} style={{ width: keySize, height: keySize }} />;
              } else if (key === 'backspace') {
                return (
                  <TouchableOpacity
                    key={`key-${rowIndex}-${keyIndex}`}
                    onPress={handleBackspace}
                    disabled={isValidating}
                    style={{
                      width: keySize,
                      height: keySize,
                      borderRadius: keySize / 2,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Feather name="delete" size={iconSize} color="white" />
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity
                    key={`key-${rowIndex}-${keyIndex}`}
                    onPress={() => handleDigitPress(key)}
                    disabled={isValidating}
                    style={{
                      width: keySize,
                      height: keySize,
                      borderRadius: keySize / 2,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Text style={{ 
                      color: 'white', 
                      fontSize: fontSize, 
                      fontWeight: 'bold' 
                    }}>
                      {key}
                    </Text>
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
    <AppGradient colors={[Color.red, Color.red]} style={{ flex: 1 }}>
      <TouchableOpacity onPress={handleBack}>
        <HeaderWithBack
          onPress={() => router.back()}
          tooltipVisible={tooltipVisible}
          setTooltipVisible={setTooltipVisible}
          content="فهاد صفحة غادي تأكد الكود ديالك"
        />
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginTop: Platform.OS === "ios" ? hp('5%') : hp('2%')
        }}
      >
        <Image
          source={Whitelogo}
          resizeMode="contain"
          style={{
            width: wp('40%'),
            height: hp('20%'),
            marginBottom: hp('4%')
          }}
        />
        <Text 
          style={{
            color: 'white',
            fontFamily: 'Tajawal',
            textAlign: 'center',
            marginBottom: hp('4%'),
            fontSize: wp('4.5%'),
            paddingHorizontal: wp('10%')
          }}
        >
          أكد الكود السري ديالك للتطبيق باش تكمل.
        </Text>
        
        {/* PIN Dots */}
        <View 
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: hp('6%'),
          }}
        >
          {[...Array(PIN_LENGTH)].map((_, index) => {
            // Make PIN dots responsive based on screen size
            const dotSize = Math.min(wp('5%'), hp('5%'));
            
            return (
              <View 
                key={index} 
                style={{
                  width: dotSize,
                  height: dotSize,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: wp('2%')
                }}
              >
                {index === lastVisibleIndex ? (
                  <Text style={{ 
                    color: 'white', 
                    fontWeight:"bold",
                    fontSize: Math.min(wp('5.5%'), hp('2%'))


                  }}>
                    {code[index]}
                  </Text>
                ) : (
                  <View
                    style={{
                      width: dotSize,
                      height: dotSize,
                      borderRadius: dotSize / 2,
                      backgroundColor: isError
                        ? "#f87171" // red-400 equivalent
                        : code.length > index
                        ? "white"
                        : "rgba(255, 255, 255, 0.3)",
                      transform: isError ? [{ scale: 1.3 }] : []
                    }}
                  />
                )}
              </View>
            );
          })}
        </View>

        {isValidating && (
          <View style={{ marginBottom: hp('4%') }}>
            <ActivityIndicator size="large" color="white" />
            <Text style={{ 
              color: 'white', 
              textAlign: 'center', 
              marginTop: hp('1%'), 
              fontFamily: 'Tajawal',
              fontSize: wp('4%')
            }}>
              جاري التحقق...
            </Text>
          </View>
        )}
        
        {/* Custom Numeric Keypad */}
        <View style={{ 
          flex: 1, 
          justifyContent: 'flex-end', 
          paddingBottom: Platform.OS === "ios" ? hp('3%') : hp('2%'),
          width: wp('100%')
        }}>
          {renderKeypad()}
        </View>
      </View>
    </AppGradient>
  );
}