import React, { useState, forwardRef, useImperativeHandle, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Color from '@/constants/Colors';
import WhiteImage from "@/assets/images/ajisalit_white.png";
import Noimages from "@/assets/images/noImages.png";
import NoMoneyYellow from "@/assets/images/createProductIcons/noMoney-yellow.png";
import PaidYellow from "@/assets/images/createProductIcons/paid-yellow.png";
import AdvancedMoneyYellow from "@/assets/images/createProductIcons/givingMoney-yellow.png";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const OrderVerificationModal = forwardRef(({
  formData,
  uploadedImages,
  onConfirm,
  onEdit,
  loading
}, ref) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { width, height } = Dimensions.get('window');
  const isSmallScreen = height < 700;

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  const bottomSheetHeight = isSmallScreen ? '80%' : '70%';

  useImperativeHandle(ref, () => ({
    show: () => {
      setIsModalVisible(true);
    },
    hide: () => {
      setIsModalVisible(false);
    }
  }));

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const formatDate = (date) => {
    if (!(date instanceof Date)) return '';
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const statusOptions = [
    {
      id: 1,
      label: 'غير خالص',
      iconYellow: NoMoneyYellow,
    },
    {
      id: 2,
      label: 'تسبيق',
      iconYellow: AdvancedMoneyYellow,
    },
    {
      id: 3,
      label: 'خالص',
      iconYellow: PaidYellow,
    },
  ];

  return (
    <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={closeModal}
      statusBarTranslucent={true}
    >
      <View 
        style={{ 
          flex: 1, 
          backgroundColor: 'rgba(47, 117, 47, 0.48)',
          justifyContent: 'flex-end' 
        }}
      >
        <View 
          style={{
            backgroundColor: '#F5F6F7',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: bottomSheetHeight,
            width: '100%'
          }}
        >
          <View 
            style={{ 
              width: 60, 
              height: 5, 
              backgroundColor: Color.green, 
              borderRadius: 5, 
              alignSelf: 'center',
              marginTop: 10,
              marginBottom: 10
            }} 
          />

          <Text 
            style={{
              textAlign: 'center',
              color: '#F52525',
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 16,
              fontFamily: 'tajawal'
            }}
          >
            كولشي هو هذاك ؟
          </Text>

          <ScrollView 
            style={{ 
              paddingHorizontal: 16,
              flex: 1
            }}
            contentContainerStyle={{ 
              paddingBottom: 20
            }}
            showsVerticalScrollIndicator={false}
          >
            <View 
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: 16,
                marginTop: 16,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
                  <FontAwesome name="money" size={24} color="#FD8900" />
                  <Text style={{ color: '#000', fontSize: 12, fontFamily: 'tajawal', marginRight: 8 }}>
                    المبلغ الإجمالي : 
                  </Text>
                </View>
                <Text style={{ color: '#2F752F', fontSize: 11, fontWeight: 'bold', fontFamily: 'tajawal' }}>
                  {formData.price} درهم
                </Text>
              </View>

              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
                  <AntDesign name="calendar" size={24} color="#FD8900" />
                  <Text style={{ color: '#000', fontSize: 12, fontFamily: 'tajawal', marginRight: 8 }}>
                    تاريخ التسليم : 
                  </Text>
                </View>
                <Text style={{ color: '#2F752F', fontSize: 11, fontWeight: 'bold', fontFamily: 'tajawal' }}>
                  {formData.RecieveDate instanceof Date ? formatDate(formData.RecieveDate) : 'غير محدد'}
                </Text>
              </View>

              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
                  {statusOptions.map((option) => (
                    option.label === formData.situation ? (
                      <Image
                        key={option.id}
                        source={option.iconYellow}
                        style={{ width: 24, height: 24 }}
                        resizeMode='contain'
                      />
                    ) : null
                  ))}
                  <Text style={{ color: '#000', fontSize: 12, fontFamily: 'tajawal', marginRight: 8 }}>
                    الحالة : 
                  </Text>
                </View>
                <Text style={{ color: '#2F752F', fontSize: 11, fontWeight: 'bold', fontFamily: 'tajawal' }}>
                  {formData.situation}
                </Text>
              </View>

              {formData.advancedAmount ? (
                <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
                    <Text style={{ color: '#000', fontSize: 12, fontFamily: 'tajawal', marginRight: 8 }}>
                      مبلغ التسبيق :
                    </Text>
                  </View>
                  <Text style={{ color: '#2F752F', fontSize: 11, fontWeight: 'bold', fontFamily: 'tajawal' }}>
                    {formData.advancedAmount} درهم 
                  </Text>
                </View>
              ) : null}
            </View>

            {uploadedImages.length > 0 ? (
              <View style={{ marginVertical: 16 }}>
                <FlatList
                  data={uploadedImages}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => item.id || index.toString()}
                  initialNumToRender={4}
                  maxToRenderPerBatch={5}
                  windowSize={5}
                  removeClippedSubviews={true}
                  snapToInterval={90} 
                  decelerationRate="fast"
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={{ 
                        marginRight: 10, 
                        backgroundColor: '#f0f0f0', 
                        borderRadius: 10,
                        width: 80, 
                        height: 80, 
                        overflow: 'hidden',
                        marginVertical: 10
                      }}
                    >
                      <Image 
                        source={{ uri: item.uri }} 
                        style={{ width: '100%', height: '100%' }} 
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  )}
                  style={{ height: 100 }}
                />
              </View>
            ) : (
              <View style={{ width: '100%', alignItems: 'center', marginTop: 16 }}>
                <Image 
                  source={Noimages}
                  style={{
                    width: isSmallScreen ? wp('30%') : wp('30%'),
                    height: isSmallScreen ? wp('30%') : wp('30%'),
                  }}
                  resizeMode='contain'
                />
                <Text style={{ color: '#2F752F', fontSize: 16, fontWeight: 'bold', marginTop: 8, fontFamily: 'tajawal' }}>
                  لا يوجد صور
                </Text>
                <Text style={{ color: '#666', fontSize: 12, fontFamily: 'tajawal' }}>
                  قم بتحميل صورك الآن
                </Text>
              </View>
            )}
          </ScrollView>

          <View 
            style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              paddingHorizontal: 16,
              paddingVertical: 16,
              borderTopWidth: 1,
              borderTopColor: '#E5E5E5'
            }}
          >
            <TouchableOpacity 
              onPress={() => {
                closeModal();
                if (onEdit) onEdit();
              }}
              style={{ 
                backgroundColor: '#F52525',
                borderRadius: 50,
                padding: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48%'
              }}
              disabled={loading}
            >
              <AntDesign name="edit" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={{ color: 'white', textAlign: 'center', fontFamily: 'tajawal', fontSize: 15 }}>تعديل</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => {
                closeModal();
                if (onConfirm) onConfirm();
              }}
              style={{ 
                backgroundColor: '#2e752f',
                borderRadius: 50,
                padding: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48%'
              }}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Image 
                    source={WhiteImage}
                    style={{ width: 24, height: 24, marginRight: 8 }}
                    resizeMode='contain'
                  />
                  <Text style={{ color: 'white', textAlign: 'center', fontFamily: 'tajawal', fontSize: 15 }}>ساليت</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
});

export default OrderVerificationModal;