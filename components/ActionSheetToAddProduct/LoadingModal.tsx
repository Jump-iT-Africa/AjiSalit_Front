import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  Platform
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Color from '@/constants/Colors';

const LoadingModal = ({ visible, onClose, uploadProgress = 0 }) => {
  console.log('LoadingModal render:', { visible, uploadProgress });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="overFullScreen" // Important for Android
      statusBarTranslucent={true} // Important for Android
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker background for visibility
        justifyContent: 'flex-end',
        zIndex: 9999, // High z-index
      }}>
        <View style={{
          backgroundColor: 'white',
          borderTopLeftRadius: wp('6%'),
          borderTopRightRadius: wp('6%'),
          paddingTop: wp('4%'),
          paddingHorizontal: wp('6%'),
          paddingBottom: wp('8%'),
          minHeight: hp('40%'),
          // Android specific styles
          ...(Platform.OS === 'android' && {
            elevation: 50, // Very high elevation for Android
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }),
          // iOS specific styles  
          ...(Platform.OS === 'ios' && {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }),
        }}>
          {/* Handle bar */}
          <View style={{ 
            width: wp('15%'), 
            height: hp('0.8%'), 
            backgroundColor: Color.green, 
            borderRadius: wp('2%'), 
            alignSelf: 'center',
            marginBottom: hp('3%')
          }} />
          
          {/* Content */}
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: hp('2%')
          }}>
            <Image 
              source={require('@/assets/images/loader.gif')}
              style={{ 
                width: wp('30%'), 
                height: wp('30%'),
                marginBottom: hp('3%')
              }}
              resizeMode="contain"
            />
            
            {/* Title */}
            <Text style={{
              fontSize: wp('6%'),
              fontFamily: 'Tajawal',
              color: Color.green,
              textAlign: 'center',
              marginBottom: hp('2%'),
              fontWeight: 'bold' // Make it more visible
            }}>
              جاري إنشاء الطلب...
            </Text>
            
            {/* Description */}
            <Text style={{
              fontSize: wp('4%'),
              fontFamily: 'TajawalRegular',
              color: '#374151', // Darker color for better visibility
              textAlign: 'center',
              marginBottom: hp('3%'),
              lineHeight: wp('6%')
            }}>
              يرجى الانتظار، جاري رفع الصور ومعالجة البيانات
            </Text>
            
            {/* Progress Bar */}
            {uploadProgress > 0 && (
              <View style={{
                width: '90%',
                marginTop: hp('1%'),
              }}>
                <View style={{
                  height: 6, // Thicker progress bar
                  backgroundColor: '#e5e7eb',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}>
                  <View style={{
                    height: '100%',
                    backgroundColor: Color.green,
                    width: `${uploadProgress}%`,
                    borderRadius: 3,
                  }} />
                </View>
                <Text style={{
                  fontSize: wp('3.5%'),
                  fontFamily: 'TajawalRegular',
                  color: '#6b7280',
                  textAlign: 'center',
                  marginTop: hp('1%'),
                  fontWeight: '600'
                }}>
                  {uploadProgress.toFixed(0)}%
                </Text>
              </View>
            )}
            
            {/* Debug text for testing - remove in production */}
            {__DEV__ && (
              <Text style={{
                fontSize: wp('3%'),
                color: 'red',
                marginTop: hp('2%'),
                textAlign: 'center'
              }}>
                Modal is visible: {visible ? 'YES' : 'NO'}
              </Text>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LoadingModal;