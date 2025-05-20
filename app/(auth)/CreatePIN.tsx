import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
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
          content="فهد الصفحة زيد الكود ديال التطبيق"
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
          دخل كود سري جديد للتطبيق باش تكمل.
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
                    fontFamily: 'Tajawal', 
                    fontSize: Math.min(wp('5.5%'), hp('1.4%'))
                  }}>
                    {code[index]}
                  </Text>
                ) : (
                  <View
                    style={{
                      width: dotSize,
                      height: dotSize,
                      borderRadius: dotSize / 2,
                      backgroundColor: code.length > index ? 'white' : 'rgba(255, 255, 255, 0.3)'
                    }}
                  />
                )}
              </View>
            );
          })}
        </View>
        
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