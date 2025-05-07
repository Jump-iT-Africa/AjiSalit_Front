

import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Colors from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
// import Divider from '../ui/Devider';
import * as Clipboard from 'expo-clipboard';
import CustomButton from '../ui/CustomButton';
import { router } from 'expo-router';
import WhiteImage from "@/assets/images/ajisalit_white.png";



const UniqueIdModal = ({ visible, onClose, uniqueId }:any) => {

  const [isModalVisible, setIsModalVisible] = useState(false);

  const copyToClipboard = async (uniqueId:string) => {
    await Clipboard.setStringAsync(uniqueId);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };


  const handlePressed = () =>
  {
    router.replace('(home)')
  }


  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >

      <TouchableOpacity 
          style={{ flex: 1,  backgroundColor: 'rgba(47, 117, 47, 0.80)' }}
          onPress={closeModal}
        >
        <TouchableOpacity 
          activeOpacity={1}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#F5F6F7',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: '80%',
            padding: 16,
            
          }}
          onPress={(e) => e.stopPropagation()}
        >


          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View className='flex-row items-center justify-end w-full'>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                </TouchableOpacity>
                
                <Text style={styles.title} className='font-tajawalregular text-right mr-4' >رمز الطلب</Text>
              </View>
              
              <Text style={styles.subTitle} className='font-tajawalregular text-sm'>
                يرجى مسح رمز QR أو إدخال رمز التتبع لتتبع طلبك بسهولة!
              </Text>
              
              <View style={styles.qrContainer}>
                <QRCode 
                  value={uniqueId}
                  size={200}
                  logo={require('@/assets/images/MoroccoLogo.png')}
                  logoSize={50}
                  logoBackgroundColor="white"
                />
              </View>
              
              <Text style={styles.manualEntryText} className='font-tajawalregular'>أو أدخل الرمز يدويًا</Text>
              
              <View style={styles.idContainer}>
                <Text style={styles.idText}>{uniqueId}</Text>
                <TouchableOpacity style={styles.copyButton} onPress={()=>copyToClipboard(uniqueId)}>
                  <Ionicons name="copy-outline" size={24} color="white" />
                </TouchableOpacity>
              </View>

              <View className='flex justify-center items-center w-[100%] mt-10 '>
                <TouchableOpacity 
                 onPress={handlePressed}
                  className="bg-[#2e752f] rounded-full p-3 flex-row items-center justify-center"
                  style={{ width: '48%' }}>
                    <>
                      <Text className="text-white text-center font-tajawal text-[17.99px] mr-2">تأكيد</Text>
                      
                      <Image 
                        source={WhiteImage}
                        className='w-8 h-8'
                        resizeMode='contain'
                      />
                    </>
                </TouchableOpacity>


                {/* <Image 
                  source={WhiteImage}
                  resizeMode='contain'
                  className='w-2 h-2'
                /> */}
              </View>
            </View>
          </View>
      </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5F6F7',
  },
  modalContent: {
    width: '95%',
    borderRadius: 15,
    padding: 0,
    alignItems: 'center',
  },
 
  title: {
    fontSize: 24,
    fontWeight: 100,
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 14,
    color:Colors.green,
    textAlign: 'center',
    marginBottom: 20,
  },
  qrContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.green,
    borderRadius: 10,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  manualEntryText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 15,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    borderWidth: 1.5,
    borderColor: Colors.red,
    borderRadius: 50,
    padding: 0,
    paddingRight: 0,
    width: '100%',
  },
  idText: {
    flex: 1,
    fontSize: 18,
    textAlign: 'left',
    fontWeight:600,
    paddingLeft:20
  },
  copyButton: {
    backgroundColor: Colors.red,
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UniqueIdModal;