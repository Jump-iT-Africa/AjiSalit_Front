import React, { useState } from 'react';
import { View, Dimensions, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Colors from "@/constants/Colors";
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomButton from '@/components/ui/CustomButton';
import AddIcon from '@/assets/images/Addicone.png';
import { router } from 'expo-router';
import AddManuallyTheId from '@/components/AddManuallyTheId/AddManuallyTheId';

const { width, height } = Dimensions.get("window");
const isSmallScreen = height < 700;

// Calculate dynamic dimensions based on screen size
const innerDimension = Math.min(wp('80%'), hp('40%'));
const cornerSize = Math.min(wp('3%'), hp('1.5%'));
const cornerLength = Math.min(wp('12%'), hp('6%'));

// Calculate top margin and bottom space dynamically
const topMargin = hp('30%');
const bottomSpace = height - innerDimension - topMargin;

export const Overlay = ({ flashEnabled, toggleFlash, hasFlashPermission, onManualIdSubmit, cameraReady }:any) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleIdSubmit = (id) => {
    if (onManualIdSubmit) {
      onManualIdSubmit(id);
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons 
          name="chevron-back-outline" 
          size={wp('6%')} 
          color="white" 
          onPress={() => router.back()}
        />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerTitle}>مسح QR</Text>
        </View>
        <TouchableOpacity
          onPress={toggleFlash}
          style={styles.flashButton}
          disabled={!hasFlashPermission}
        >
          {flashEnabled ? (
            <Ionicons name="flash" size={wp('6%')} color="white" />
          ) : (
            <Ionicons name="flash-outline" size={wp('6%')} color="white" />
          )}
        </TouchableOpacity>
      </View>
      
      {/* Top green area */}
      <View style={[styles.greenBackground, { height: topMargin }]} />
      
      {/* Scanner area with corners */}
      <View style={{ flexDirection: 'row', height: innerDimension }}>
        <View style={[
          styles.greenBackground, 
          { width: (width - innerDimension) / 2 }
        ]} />
        
        <View style={[styles.scannerFrame, { width: innerDimension, height: innerDimension }]}>
          {/* Top Left Corner */}
          <View style={[styles.cornerPosition, { top: -cornerSize, left: -cornerSize }]}>
            <View style={[styles.horizontalCorner, { top: 0, left: 0, width: cornerLength }]} />
            <View style={[styles.verticalCorner, { top: 0, left: 0, height: cornerLength }]} />
          </View>
          
          {/* Top Right Corner */}
          <View style={[styles.cornerPosition, { top: -cornerSize, right: -cornerSize }]}>
            <View style={[styles.horizontalCorner, { top: 0, right: 0, width: cornerLength }]} />
            <View style={[styles.verticalCorner, { top: 0, right: 0, height: cornerLength }]} />
          </View>
          
          {/* Bottom Left Corner */}
          <View style={[styles.cornerPosition, { bottom: -cornerSize, left: -cornerSize }]}>
            <View style={[styles.horizontalCorner, { bottom: 0, left: 0, width: cornerLength }]} />
            <View style={[styles.verticalCorner, { bottom: 0, left: 0, height: cornerLength }]} />
          </View>
          
          {/* Bottom Right Corner */}
          <View style={[styles.cornerPosition, { bottom: -cornerSize, right: -cornerSize }]}>
            <View style={[styles.horizontalCorner, { bottom: 0, right: 0, width: cornerLength }]} />
            <View style={[styles.verticalCorner, { bottom: 0, right: 0, height: cornerLength }]} />
          </View>
        </View>
        
        <View style={[
          styles.greenBackground, 
          { width: (width - innerDimension) / 2 }
        ]} />
      </View>
      
      {/* Bottom green area */}
      <View style={[styles.greenBackground, { height: bottomSpace }]} />
      
      {/* Manual add button */}
      <View style={styles.manualAddButtonContainer}>
        <TouchableOpacity onPress={handleOpenModal}>
          <View style={styles.manualAddButton}>
            <CustomButton
              title="أضف يدويا"
              containerStyles=""
              textStyles={`font-tajawalregular`}
              onPress={handleOpenModal}
            />
            <Image
              source={AddIcon}
              style={styles.addIcon}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Instructions text */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          إلا ما خدمش المسح، دخل رمز الطلب يدويًا بالضغط على الزر أسفله!
        </Text>
      </View>

      {/* Manual entry modal */}
      <AddManuallyTheId
        visible={modalVisible}
        onClose={handleCloseModal}
        onSubmit={handleIdSubmit}
        containerStyle="bg-[#2e752f]"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    position: 'absolute',
    zIndex: 20,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    height: hp('16%'),
    paddingHorizontal: wp('3%'),
    paddingTop: hp('4%'),
  },
  headerTitle: {
    color: 'white',
    fontSize: wp('5%'),
    fontFamily: 'Tajawal',
  },
  flashButton: {
    padding: wp('2%'),
  },
  greenBackground: {
    backgroundColor: Colors.green,
    width: '100%',
  },
  scannerFrame: {
    position: 'relative',
    
  },
  cornerPosition: {
    position: 'absolute',
    width: wp('12%'),
    height: hp('6%'),
    zIndex: 10,
  },
  horizontalCorner: {
    position: 'absolute',
    height: cornerSize,
    backgroundColor: 'white',
    borderRadius: cornerSize / 10,
  },
  verticalCorner: {
    position: 'absolute',
    width: cornerSize,
    backgroundColor: 'white',
    borderRadius: cornerSize / 10,
  },
  manualAddButtonContainer: {
    position: 'absolute',
    zIndex: 20,
    width: '100%',
    bottom: hp('15%'),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical:hp('3%')
  },
  manualAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F52525',
    borderRadius: wp('10%'),
    paddingHorizontal: wp('8%'),
    paddingVertical: hp('0%'),
  },
 
  addIcon: {
    width: wp('4%'),
    height: wp('4%'),
    marginLeft: wp('2%'),
  },
  instructionsContainer: {
    position: 'absolute',
    zIndex: 20,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: wp('10%'),
    bottom: hp('10%'),
  },
  instructionsText: {
    color: 'white',
    fontFamily: 'TajawalRegular',
    textAlign: 'center',
    fontSize: wp('3.5%'),
  },
});