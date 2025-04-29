import React, { useState, useRef, useEffect } from 'react';
import { View, Text, SafeAreaView, Image, StyleSheet, TouchableOpacity, Modal, Pressable, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import DefaultImage from '@/assets/images/profilePage.jpeg';
import LeonImage from "@/assets/images/noImages.png";
import HeaderWithBack from '@/components/ui/HeaderWithToolTipAndback';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '@/components/ui/CustomButton';
import WhiteLogo from '@/assets/images/ajisalit_white.png';
import { UpdateUser,selectUser } from '@/store/slices/userSlice'; 
import {selectUserRole} from "@/store/slices/userSlice";



const Profile = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser); 
    const [profileImage, setProfileImage] = useState(null);
    const [Fname, setFname] = useState('');
    const [Lname, setLname] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [password, setPassword] = useState('******');
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const role = useSelector(selectUserRole);
        

    useEffect(() => {
      if (user) {
        setFname(user.Fname || '');
        setLname(user.Lname || '');
        setCompanyName(user.companyName || '');
        if (user.profileImage) {
          setProfileImage(user.profileImage);
        }
      }
    }, [user]);

    const takePhoto = async () => {
      try {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
          return;
        }

        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
        });

        if (!result.canceled) {
          setProfileImage(result.assets[0].uri);
          setModalVisible(false);
        }
      } catch (error) {
        console.log('Error taking photo:', error);
        Alert.alert('Error', 'Failed to take photo');
      }
    };

    const pickImage = async () => {
      try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Sorry, we need gallery permissions to make this work!');
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
        });

        if (!result.canceled) {
          setProfileImage(result.assets[0].uri);
          setModalVisible(false);
        }
      } catch (error) {
        console.log('Error picking image:', error);
        Alert.alert('Error', 'Failed to pick image from gallery');
      }
    };

    
    const uriToBase64 = async (uri) => {
      try {
        const response = await fetch(uri);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error('Error converting image to base64:', error);
        return null;
      }
    };

    const handleUpdateUser = async () => {
      try {
        setLoading(true);
        
        const updateData = {
          Fname,
          Lname,
          companyName
        };

        
        if (profileImage && !profileImage.startsWith('http')) {
          
          const base64Image = await uriToBase64(profileImage);
          if (base64Image) {
            updateData.profileImage = `data:image/jpeg;base64,${base64Image}`;
          }
        }
        console.log('info user ', updateData);
        
        
        const resultAction = await dispatch(UpdateUser(updateData));
        
        if (UpdateUser.fulfilled.match(resultAction)) {
          Alert.alert('Success', 'User information updated successfully');
        } else {
          if (resultAction.payload) {
            Alert.alert('Error', resultAction.payload);
          } else {
            Alert.alert('Error', 'Failed to update user information');
          }
        }
      } catch (error) {
        console.error('Error updating user:', error);
        Alert.alert('Error', 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    return (
      <SafeAreaView className="flex-1 bg-white">
        <HeaderWithBack onPress={() => router.push('(home)')} />
        
        <View className="px-4">
          <View className="mx-auto my-2">
            <Text className="font-bold text-xl text-[#F52525] text-center font-tajawal">معلومات الحساب</Text>
          </View>

          <View className="items-center justify-center my-4">
            <TouchableOpacity 
              onPress={() => setModalVisible(true)}
              className="mb-2"
            >
              <View className="relative">
                <Image 
                  source={profileImage ? {uri: profileImage} : DefaultImage} 
                  className="rounded-full bg-gray-200"
                  style={styles.profileImage}
                />
                <View className="absolute bottom-0 right-0 bg-white p-2 rounded-full border border-gray-200">
                  <Feather name="camera" size={20} color="black" />
                </View>
              </View>
            </TouchableOpacity>
            <Text className="font-bold text-lg mt-2 font-tajawalregular">
              {Fname} {Lname}
            </Text>
          </View>

          <View className="items-end mt-2">
            <View>
              <View>
                <View className='flex items-end justify-end mb-4'>
                  <Text className='font-bold text-l text-[#F52525] text-end font-tajawal'>المعلومات الشخصية</Text>
                </View>
                <View className='flex-row-reverse justify-between w-full '>
                  <View className='w-[49%]'>
                    <View className='flex justify-center items-end'>
                      <Text className='text-start font-tajawalregular mb-2 text-[#2e752f]'>إسم</Text>
                    </View>
                    <TextInput
                      placeholder="الإسم"
                      value={Fname}
                      onChangeText={setFname}
                      placeholderTextColor="#888"
                      className={`border border-[#2e752f] rounded-lg p-3 text-black text-right bg-white font-tajawalregular shadow`}
                    />
                  </View>
                  <View className='w-[49%]'>
                    <View className='flex justify-center items-end'>
                      <Text className=' text-start font-tajawalregular mb-2 text-[#2e752f]'>اللقب</Text>
                    </View>
                    <TextInput
                      placeholder="اللقب"
                      value={Lname}
                      onChangeText={setLname}
                      placeholderTextColor="#888"
                      className={`border border-[#2e752f] rounded-lg p-3 text-black text-right bg-white font-tajawalregular shadow`}
                    />
                  </View>
                  
                </View>
                <View className='w-[100%] mt-4'>
                    <View className='flex justify-center items-end'>
                      <Text className=' text-start font-tajawalregular mb-2 text-[#2e752f]'>إسم الشركة</Text>
                    </View>
                    <TextInput
                      placeholder="إسم الشركة"
                      value={companyName}
                      onChangeText={setCompanyName}
                      placeholderTextColor="#888"
                      className={`border border-[#2e752f] rounded-lg p-3 text-black text-right bg-white font-tajawalregular shadow`}
                    />
                  </View>
                <View className='w-full flex items-center pt-4'>
                  <TouchableOpacity 
                    onPress={handleUpdateUser}
                    disabled={loading}
                    className="flex-row items-center bg-[#F52525] rounded-full px-12 py-3 w-[50%] justify-center space-x-2"
                  >
                    <Text className="text-white font-tajawal text-[14px]">
                      {loading ? 'جاري التأكيد...' : 'تأكيد'}
                    </Text>
                    <Image
                      source={WhiteLogo}
                      className="w-8 h-8"
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/* <View>
                <View className='flex items-end justify-end mt-4 '>
                  <Text className='font-bold text-l text-[#F52525] text-end font-tajawal'>
                    معلومات الأمان
                  </Text>
                </View>
                <View>
                  <View className='flex justify-center items-end'>
                    <Text className='text-start font-tajawalregular mb-2 text-[#2e752f]'>الرمز السري </Text>
                  </View>
                  <TextInput
                    placeholder="الرمز السري"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#888"
                    className='border border-[#2e752f] rounded-lg p-3 text-black text-right bg-white font-tajawalregular shadow'
                  />
                </View>
              </View> */}
            </View>
          </View>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle} className='font-tajawal text-[#2e752f]'>تحديث الصورة الشخصية</Text>
              
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={takePhoto}
              >
                <Text style={styles.modalButtonText} className='font-tajawalregular'>التقاط صورة</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={pickImage}
              >
                <Text style={styles.modalButtonText} className='font-tajawalregular'>اختيار من المعرض</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText} className='font-tajawalregular'>إلغاء</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ddd'
  },
  lionImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(47, 117, 47, 0.6)'
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    backgroundColor: '#f0f0f0'
  },
  modalButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333'
  },
  cancelButton: {
    backgroundColor: '#eee',
    marginTop: 5
  },
  cancelButtonText: {
    color: '#F52525',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default Profile;