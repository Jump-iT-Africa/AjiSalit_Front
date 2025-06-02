import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  Easing
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from '@expo/vector-icons/AntDesign';
import Color from '@/constants/Colors';

const SmoothLoadingOverlay = ({ 
  visible, 
  uploadProgress = 0, 
  success = false, 
  error = null, 
  loading = false 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(hp('50%'))).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const iconScaleAnim = useRef(new Animated.Value(0)).current;
  const successPulseAnim = useRef(new Animated.Value(1)).current;
  
  // Add state to control the 2000ms delay
  const [showingSuccess, setShowingSuccess] = useState(false);
  const [allowHide, setAllowHide] = useState(true);

  // Determine current state
  const isLoading = loading && !success && !error;
  const isSuccess = (success && !loading) || showingSuccess;
  const isError = error && !loading && !showingSuccess;

  // Handle success delay
  useEffect(() => {
    if (success && !loading && !showingSuccess) {
      setShowingSuccess(true);
      setAllowHide(false);
      
      // Set 2000ms delay before allowing hide
      setTimeout(() => {
        setAllowHide(true);
        setShowingSuccess(false);
      }, 2000);
    }
  }, [success, loading]);

  // Reset states when component is hidden
  useEffect(() => {
    if (!visible && allowHide) {
      setShowingSuccess(false);
      setAllowHide(true);
    }
  }, [visible, allowHide]);

  useEffect(() => {
    if (visible) {
      // Show animation - smooth entrance
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: false,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: false,
        }),
      ]).start();
    } else if (allowHide) {
      // Hide animation - smooth exit (only if allowed)
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.in(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(slideAnim, {
          toValue: hp('50%'),
          duration: 600,
          easing: Easing.in(Easing.back(1.2)),
          useNativeDriver: false,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 500,
          easing: Easing.in(Easing.quad),
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [visible, allowHide]);

  // Animate progress bar smoothly
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: uploadProgress,
      duration: 300,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [uploadProgress]);

  // Animate success/error icons
  useEffect(() => {
    if (isSuccess || isError) {
      // Scale in the icon
      Animated.spring(iconScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();

      // Pulse animation for success
      if (isSuccess) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(successPulseAnim, {
              toValue: 1.1,
              duration: 800,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(successPulseAnim, {
              toValue: 1,
              duration: 800,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        ).start();
      }
    } else {
      iconScaleAnim.setValue(0);
      successPulseAnim.setValue(1);
    }
  }, [isSuccess, isError]);

  // Don't render if not visible and allowed to hide
  if (!visible && fadeAnim._value === 0 && allowHide) return null;
  
  // Keep visible during success delay even if visible prop is false
  if (!visible && showingSuccess && !allowHide) {
    // Override visible behavior during success delay
  }

  return (
    <Animated.View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.7)']
      }),
      zIndex: 99999,
      elevation: 99999,
      justifyContent: 'flex-end',
      opacity: fadeAnim,
    }}>
      <Animated.View style={{
        backgroundColor: 'white',
        borderTopLeftRadius: wp('6%'),
        borderTopRightRadius: wp('6%'),
        paddingTop: wp('4%'),
        paddingHorizontal: wp('6%'),
        paddingBottom: wp('10%'),
        minHeight: hp('40%'),
        elevation: 100,
        transform: [
          { translateY: slideAnim },
          { scale: scaleAnim }
        ],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      }}>
        {/* Dynamic handle bar */}
        <Animated.View style={{ 
          width: wp('15%'), 
          height: hp('0.8%'), 
          backgroundColor: isSuccess ? '#10B981' : isError ? '#EF4444' : Color.green,
          borderRadius: wp('2%'), 
          alignSelf: 'center',
          marginBottom: hp('4%'),
          transform: [{
            scaleX: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1]
            })
          }]
        }} />
        
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: hp('2%')
        }}>
        
          {/* Loading State */}
          {isLoading && (
            <>
              <Image 
                source={require('@/assets/images/loader.gif')}
                style={{ 
                  width: wp('32%'), 
                  height: wp('32%'),
                  marginBottom: hp('3%')
                }}
                resizeMode="contain"
              />
            
              <Animated.Text style={{
                fontSize: wp('6%'),
                fontFamily: 'Tajawal',
                color: Color.green,
                textAlign: 'center',
                marginBottom: hp('2%'),
                opacity: fadeAnim,
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })
                }]
              }}>
                جاري إنشاء الطلب...
              </Animated.Text>
              
              <Animated.Text style={{
                fontSize: wp('4%'),
                fontFamily: 'TajawalRegular',
                color: '#374151',
                textAlign: 'center',
                marginBottom: hp('4%'),
                lineHeight: wp('6%'),
                opacity: fadeAnim,
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0]
                  })
                }]
              }}>
                يرجى الانتظار، جاري رفع الصور ومعالجة البيانات
              </Animated.Text>
              
              {/* Progress bar */}
              <Animated.View style={{
                width: '90%',
                marginTop: hp('1%'),
                opacity: uploadProgress > 0 ? 1 : 0,
                transform: [{
                  scale: uploadProgress > 0 ? 1 : 0.8
                }]
              }}>
                <View style={{
                  height: 8,
                  backgroundColor: '#e5e7eb',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}>
                  <Animated.View style={{
                    height: '100%',
                    backgroundColor: Color.green,
                    borderRadius: 4,
                    width: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                      extrapolate: 'clamp'
                    }),
                  }} />
                </View>
                <Animated.Text style={{
                  fontSize: wp('3.8%'),
                  fontFamily: 'TajawalRegular',
                  color: '#6b7280',
                  textAlign: 'center',
                  marginTop: hp('1.5%'),
                  fontWeight: '600',
                  opacity: fadeAnim
                }}>
                  {uploadProgress.toFixed(0)}%
                </Animated.Text>
              </Animated.View>
              
              {/* Pulsing dots */}
              <View style={{
                flexDirection: 'row',
                marginTop: hp('3%'),
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {[0, 1, 2].map((index) => (
                  <Animated.View
                    key={index}
                    style={{
                      width: wp('2%'),
                      height: wp('2%'),
                      borderRadius: wp('1%'),
                      backgroundColor: Color.green,
                      marginHorizontal: wp('1%'),
                      opacity: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 1]
                      }),
                      transform: [{
                        scale: fadeAnim.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [0.5, 1.2, 1],
                          extrapolate: 'clamp'
                        })
                      }]
                    }}
                  />
                ))}
              </View>
            </>
          )}

          {/* Success State */}
          {isSuccess && (
            <>
              <Animated.View style={{
                width: wp('32%'),
                height: wp('32%'),
                borderRadius: wp('16%'),
                backgroundColor: '#10B981',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: hp('3%'),
                transform: [
                  { scale: iconScaleAnim },
                  { scale: successPulseAnim }
                ],
                shadowColor: '#10B981',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.4,
                shadowRadius: 15,
                elevation: 20,
              }}>
                <AntDesign name="check" size={wp('16%')} color="white" />
              </Animated.View>
              
              <Animated.Text style={{
                fontSize: wp('6%'),
                fontFamily: 'Tajawal',
                color: '#10B981',
                textAlign: 'center',
                marginBottom: hp('2%'),
                opacity: fadeAnim,
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })
                }]
              }}>
                تم إنشاء الطلب بنجاح! 
              </Animated.Text>
              
              <Animated.Text style={{
                fontSize: wp('4%'),
                fontFamily: 'TajawalRegular',
                color: '#374151',
                textAlign: 'center',
                marginBottom: hp('2%'),
                opacity: fadeAnim,
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0]
                  })
                }]
              }}>
                سيتم عرض رمز QR للطلب الآن
              </Animated.Text>
            </>
          )}

          {/* Error State */}
          {isError && (
            <>
              <Animated.View style={{
                width: wp('32%'),
                height: wp('32%'),
                borderRadius: wp('16%'),
                backgroundColor: '#EF4444',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: hp('3%'),
                transform: [{ scale: iconScaleAnim }],
                shadowColor: '#EF4444',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.4,
                shadowRadius: 15,
                elevation: 20,
              }}>
                <AntDesign name="close" size={wp('16%')} color="white" />
              </Animated.View>
              
              <Animated.Text style={{
                fontSize: wp('6%'),
                fontFamily: 'Tajawal',
                color: '#EF4444',
                textAlign: 'center',
                marginBottom: hp('2%'),
                opacity: fadeAnim,
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })
                }]
              }}>
                فشل في إنشاء الطلب 
              </Animated.Text>
              
              <Animated.Text style={{
                fontSize: wp('4%'),
                fontFamily: 'TajawalRegular',
                color: '#374151',
                textAlign: 'center',
                marginBottom: hp('2%'),
                opacity: fadeAnim,
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0]
                  })
                }]
              }}>
                {typeof error === 'string' ? error : 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى'}
              </Animated.Text>
            </>
          )}
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default SmoothLoadingOverlay;