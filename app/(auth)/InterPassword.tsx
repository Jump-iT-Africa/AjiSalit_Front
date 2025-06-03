import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, ActivityIndicator, Vibration, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AppGradient from '@/components/ui/AppGradient';
import Color from '@/constants/Colors';
import HeaderWithBack from '@/components/ui/HeaderWithToolTipAndback';
import Whitelogo from "@/assets/images/ajisalit_white.png";
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
  
  // Get screen dimensions
  const { width, height } = Dimensions.get('window');
  const isSmallScreen = height < 700; // Define what constitutes a small screen
  
  const PIN_LENGTH = 6;

  const handleBack = () => {
    setTimeout(() => {
      router.replace('(tabs)');
    }, 100);
  };

  const handleDigitPress = (digit) => {
    if (code.length < PIN_LENGTH && !isLoading) {
      const newValue = code + digit;
      
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
    
    dispatch(login(loginPayload))
      .unwrap()
      .then((response) => {
        setIsLoading(false);
        
        setTimeout(() => {
          if (response.user) {
            router.replace('(home)');
          }
        }, 500);
      })
      .catch((err) => {
        setIsLoading(false);
        setErrorMessage('كلمة المرور غير صحيحة');
        setCode('');
        
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
                    disabled={isLoading}
                    style={{
                      width: keySize,
                      height: keySize,
                      borderRadius: keySize / 3,
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
                    disabled={isLoading}
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

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <AppGradient colors={[Color.red, Color.red]} style={{ flex: 1 }}>
      <TouchableOpacity onPress={() => router.replace('(tabs)')}>
        <HeaderWithBack
          onPress={() => router.replace('(tabs)')}
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
          سلام {userName}
        </Text>
        
        {/* PIN Dots */}
        <View 
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: hp('4%'),
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
                    fontSize: Math.min(wp('4.5%'), hp('2.2%'))
                    
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
        
        {/* Error message display */}
        {errorMessage ? (
          <Text 
            style={{ 
              color: '#FAD513', 
              textAlign: 'center', 
              marginTop: hp('2%'),
              fontFamily: 'Tajawal',
              fontSize: wp('4%') 
            }}
          >
            {errorMessage}
          </Text>
        ) : null}
        
        {/* Loading indicator */}
        {isLoading && (
          <View style={{ marginTop: hp('2%') }}>
            <ActivityIndicator size="small" color="white" />
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