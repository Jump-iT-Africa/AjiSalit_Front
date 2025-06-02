import React, { useMemo, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image, Dimensions, Platform } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '@/constants/Colors';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import WhiteImage from "@/assets/images/ajisalit_white.png";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UniqueIdModal = ({ visible, onClose, uniqueId }) => {
  const { width, height } = Dimensions.get('window');
  const isSmallScreen = height < 700; 
  
  const bottomSheetHeight = isSmallScreen ? '80%' : '80%';
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const copyToClipboard = async (uniqueId) => {
    try {
      await Clipboard.setStringAsync(uniqueId);
      console.log("Copied to clipboard:", uniqueId);
    } catch (error) {
      console.log("Error copying to clipboard:", error);
    }
  };

  const closeModal = () => {
    onClose();
  };

  const handlePressed = async () => {
    // Prevent multiple taps
    if (isProcessing) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      console.log("Setting refresh flag before navigating to home");
      
      await AsyncStorage.setItem('REFRESH_ORDERS_ON_RETURN', 'true');
      console.log("Refresh flag set successfully");
      
      onClose();
      
      setTimeout(() => {
        try {
          router.replace({
            pathname: '/(home)',
            params: { 
              shouldRefreshOnReturn: true,
              timestamp: Date.now() 
            }
          });
        } catch (navigationError) {
          console.log("Navigation error:", navigationError);
          setIsProcessing(false);
        }
      }, 300);
      
    } catch (storageError) {
      console.log("Error setting refresh flag:", storageError);
      setIsProcessing(false);
      
      // Still navigate even if storage fails
      onClose();
      setTimeout(() => {
        router.replace({
          pathname: '/(home)',
          params: { 
            shouldRefreshOnReturn: true,
            timestamp: Date.now()
          }
        });
      }, 300);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View 
        style={{ 
          flex: 1, 
          backgroundColor: 'rgba(47, 117, 47, 0.48)',
          justifyContent: 'flex-end',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: width,
          height: height,
          zIndex: 999999
        }}
      >
        <View 
          style={{
            backgroundColor: '#F5F6F7',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: bottomSheetHeight,
            width: '100%',
            marginBottom: Platform.OS === "android" ? "-30" : "0"
          }}
        >
          {/* Top handle */}
          <View 
            style={{ 
              width: 60, 
              height: 5, 
              backgroundColor: Colors.green, 
              borderRadius: 5, 
              alignSelf: 'center',
              marginTop: 10,
              marginBottom: Platform.OS === "android" ? "-100" : "0"
            }} 
          />
          
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View className='flex-row items-center justify-end w-full'>
                <TouchableOpacity 
                  style={styles.closeButton} 
                  onPress={onClose}
                  disabled={isProcessing}
                >
                </TouchableOpacity>
                <Text style={[styles.title, { fontSize: wp('6%') }]} className='font-tajawalregular text-right mr-4'>رمز الطلب</Text>
              </View>
              
              <Text style={[styles.subTitle, { fontSize: wp('3.5%') }]} className='font-tajawalregular'>
                يرجى مسح رمز QR أو إدخال رمز التتبع لتتبع طلبك بسهولة!
              </Text>
              
              <View style={[styles.qrContainer, { padding: wp('2.5%'), marginBottom: hp('2.5%') }]}>
                <QRCode 
                  value={uniqueId}
                  size={wp('50%')}
                  logo={require('@/assets/images/MoroccoLogo.png')}
                  logoSize={wp('12.5%')}
                  logoBackgroundColor="white"
                />
              </View>
              
              <Text style={[styles.manualEntryText, { fontSize: wp('3.5%'), marginBottom: hp('2%') }]} className='font-tajawalregular'>
                أو أدخل الرمز يدويًا
              </Text>
              
              <View style={[styles.idContainer, { borderRadius: wp('12.5%'), padding: 0 }]}>
                <Text style={[styles.idText, { fontSize: wp('4.5%'), paddingLeft: wp('5%') }]}>
                  {uniqueId}
                </Text>
                <TouchableOpacity 
                  style={[styles.copyButton, { width: wp('15%'), height: wp('15%'), borderRadius: wp('12.5%') }]} 
                  onPress={() => copyToClipboard(uniqueId)}
                  disabled={isProcessing}
                >
                  <Ionicons name="copy-outline" size={wp('6%')} color="white" />
                </TouchableOpacity>
              </View>

              <View className='flex justify-center items-center w-full my-5'>
                {/* <Text style={{ fontSize: wp('3.5%') }} className='text-[#F52525] font-tajawalregular mb-5'>
                  تنويه:مع كل طلب سيتم خصم 1dh من رصيدك
                </Text> */}

                <TouchableOpacity 
                  onPress={handlePressed}
                  className="bg-[#2e752f] rounded-full flex-row items-center justify-center"
                  style={{ 
                    width: wp('48%'), 
                    padding: wp('3%'),
                    opacity: isProcessing ? 0.7 : 1 // Visual feedback when processing
                  }}
                  disabled={isProcessing}
                >
                  <Text style={{ fontSize: wp('4.5%') }} className="text-white text-center font-tajawal mr-2">
                    {isProcessing ? "جاري التأكيد..." : "تأكيد"}
                  </Text>
                  <Image 
                    source={WhiteImage}
                    style={{ width: wp('8%'), height: wp('8%') }}
                    resizeMode='contain'
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5F6F7',
    paddingHorizontal: 16,
  },
  modalContent: {
    width: '95%',
    borderRadius: 15,
    padding: 0,
    alignItems: 'center',
  },
  title: {
    fontWeight: '100',
    marginBottom: hp('1.2%'),
    marginTop: hp('1.2%'),
    textAlign: 'center',
  },
  subTitle: {
    color: Colors.green,
    textAlign: 'center',
    marginBottom: hp('2.5%'),
  },
  qrContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.green,
    borderRadius: wp('2.5%'),
  },
  manualEntryText: {
    color: '#999',
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: Colors.green,
    width: '100%',
  },
  idText: {
    flex: 1,
    textAlign: 'left',
    fontWeight: '600',
  },
  copyButton: {
    backgroundColor: Colors.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UniqueIdModal;