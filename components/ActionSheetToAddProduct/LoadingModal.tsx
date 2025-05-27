import React from 'react';
import {
  View,
  Text,
  Modal,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Image
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Color from '@/constants/Colors';

const LoadingModal = ({ visible, onClose, uploadProgress = 0 }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: wp('4%'),
            padding: wp('8%'),
            alignItems: 'center',
            width: wp('80%'),
          }}>
            {/* <ActivityIndicator 
              size="large" 
              color={Color.green} 
              style={{ marginBottom: hp('3%') }} 
            /> */}
            
            <Image 
              source={require('@/assets/images/loader.gif')}
              style={{ width: 100, height: 100 }}
              resizeMode="contain"
              className="mb-4 w-100 h-100"
            />
            {/* Title */}
            <Text style={{
              fontSize: wp('5%'),
              fontFamily: 'Tajawal',
              color: Color.green,
              textAlign: 'center',
              marginBottom: hp('2%'),
            }}>
              جاري إنشاء الطلب...
            </Text>
            
            {/* Description */}
            <Text style={{
              fontSize: wp('3.5%'),
              fontFamily: 'TajawalRegular',
              color: '#6b7280',
              textAlign: 'center',
              marginBottom: hp('2%'),
            }}>
              يرجى الانتظار، جاري رفع الصور ومعالجة البيانات
            </Text>
            
            {/* Progress Bar (optional) */}
            {uploadProgress > 0 && (
              <View style={{
                width: '100%',
                marginTop: hp('1%'),
              }}>
                <View style={{
                  height: 4,
                  backgroundColor: '#e5e7eb',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}>
                  <View style={{
                    height: '100%',
                    backgroundColor: Color.green,
                    width: `${uploadProgress}%`,
                    borderRadius: 2,
                  }} />
                </View>
                <Text style={{
                  fontSize: wp('3%'),
                  fontFamily: 'TajawalRegular',
                  color: '#9ca3af',
                  textAlign: 'center',
                  marginTop: hp('0.5%'),
                }}>
                  {uploadProgress.toFixed(0)}%
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default LoadingModal;