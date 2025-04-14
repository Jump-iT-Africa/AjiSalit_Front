

import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Colors from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import Divider from '../ui/Devider';
import * as Clipboard from 'expo-clipboard';

const UniqueIdModal = ({ visible, onClose, uniqueId }:any) => {


  const copyToClipboard = async (uniqueId:string) => {
    await Clipboard.setStringAsync(uniqueId);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View className='flex-row items-center justify-between w-full'>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <FontAwesome5 name="times-circle" size={24} color="black" />
            </TouchableOpacity>
            
            <Text style={styles.title} className='font-tajawalregular' >رمز الطلب</Text>
          </View>
          
          <Text style={styles.subTitle} className='font-tajawalregular'>
            يرجى مسح رمز QR أو إدخال رمز التتبع لتتبع طلبك بسهولة!
          </Text>
          
          <View style={styles.qrContainer}>
            <QRCode 
              value={uniqueId}
              size={200}
              logo={require('@/assets/images/logo.png')}
              logoSize={50}
              logoBackgroundColor="white"
            />
          </View>
          
          <View style={styles.divider} />
          <Text style={styles.manualEntryText} className='font-tajawalregular'>أو أدخل الرمز يدويًا</Text>
          
          <View style={styles.idContainer}>
            <Text style={styles.idText}>{uniqueId}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={()=>copyToClipboard(uniqueId)}>
              <Ionicons name="copy-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
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
    padding: 15,
    backgroundColor: 'white',
    borderWidth: 1.5,
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
    borderColor: Colors.green,
    borderRadius: 50,
    padding: 0,
    paddingRight: 0,
    width: '100%',
  },
  idText: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    fontWeight:600
  },
  copyButton: {
    backgroundColor: '#2e752f',
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UniqueIdModal;