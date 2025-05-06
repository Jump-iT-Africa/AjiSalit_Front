import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import CustomButton from '../ui/CustomButton';
import { router } from 'expo-router/build/imperative-api';

const RestrictedAccessModal = ({ visible, onClose }) => {
   
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Image 
            source={require('../../assets/images/restricted.avif')} 
            style={styles.image} 
            resizeMode="contain"
          />
          <Text style={styles.textWarning}>
            ماعندكش الحق تدخل تشوف🫣
          </Text>
          <View className="flex-row-reverse items-center justify-center w-[50%] mt-6 space-x-10" >
            <CustomButton onPress={()=>{
                router.push('(home)');
                onClose();
            }} title={'رجوع'} 
                containerStyles='w-[90%]'
                textStyles="font-tajawalregular mt-1"
            />
             <CustomButton onPress={onClose} title={'اعاده'}  containerStyles='w-[90%]  mr-2 ' textStyles="font-tajawalregular mt-1" />
          </View>

        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  textWarning: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
    fontFamily:"TajawalRegular"
  }
});

export default RestrictedAccessModal;