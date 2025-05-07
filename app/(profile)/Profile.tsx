import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Alert, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import DefaultImage from '@/assets/images/imagePlaceHolder.jpg';
import HeaderWithBack from '@/components/ui/HeaderWithToolTipAndback';
import Feather from '@expo/vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import WhiteLogo from '@/assets/images/ajisalit_white.png';
import { UpdateUser, selectUserData } from '@/store/slices/userSlice'; 
import { selectUserRole } from "@/store/slices/userSlice";
import CitySelector from '@/components/CompanyRegister/CitySelector';
import regionsAndCitiesData from "@/constants/Cities/Cities.json";
import CompanyFieldDropDown from '@/components/CompanyRegister/CompanyFieldDropDown';
import Color from "@/constants/Colors";
import CustomButton from '@/components/ui/CustomButton';



const Profile = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUserData); 
    const [profileImage, setProfileImage] = useState(null);
    const [initialProfileImage, setInitialProfileImage] = useState(null);
    const [Fname, setFname] = useState('');
    const [initialFname, setInitialFname] = useState('');
    const [Lname, setLname] = useState('');
    const [initialLname, setInitialLname] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [initialCompanyName, setInitialCompanyName] = useState('');
    const [field, setfield] = useState(''); 
    const [initialField, setInitialField] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const role = useSelector(selectUserRole);
    const [selectedCity, setSelectedCity] = useState('');
    const [initialSelectedCity, setInitialSelectedCity] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const [isChanged, setIsChanged] = useState(false);
        
    // Save initial values when component loads
    useEffect(() => {
      if (user) {
        // Set current values
        setFname(user.Fname || '');
        setLname(user.Lname || '');
        setCompanyName(user.companyName || '');
        setfield(user.field || ''); 
        if (user.city) {
          setSelectedCity(user.city);
        }
        if (user.profileImage) {
          setProfileImage(user.profileImage);
        }
        
        // Save initial values to compare against
        setInitialFname(user.Fname || '');
        setInitialLname(user.Lname || '');
        setInitialCompanyName(user.companyName || '');
        setInitialField(user.field || '');
        setInitialSelectedCity(user.city || '');
        setInitialProfileImage(user.profileImage || null);
      }
    }, [user]);

    // Check if any field has changed from initial value
    useEffect(() => {
      const hasChanges = 
        Fname !== initialFname ||
        Lname !== initialLname || 
        companyName !== initialCompanyName ||
        field !== initialField ||
        selectedCity !== initialSelectedCity ||
        profileImage !== initialProfileImage;
      
      setIsChanged(hasChanges);
    }, [
      Fname, Lname, companyName, field, selectedCity, profileImage,
      initialFname, initialLname, initialCompanyName, initialField, initialSelectedCity, initialProfileImage
    ]);

    const handleCitySelect = (city) => {
      setSelectedCity(city.names.ar);
      setErrors((prev) => ({ ...prev, city: "" }));
    };

    const handleFieldSelect = (fieldName) => {
      setfield(fieldName);
      setErrors((prev) => ({ ...prev, field: "" }));
    };

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

    const validateForm = () => {
      const newErrors = {};
      
      if (!Fname.trim()) {
        newErrors.fname = "الرجاء إدخال الإسم";
        setIsChanged(false)
      }
      
      if (!Lname.trim()) {
        newErrors.lname = "الرجاء إدخال اللقب";
        setIsChanged(false)

      }
      
      if (!selectedCity) {
        newErrors.city = "الرجاء اختيار المدينة";
        setIsChanged(false)

      }
      
      setErrors(newErrors);
      setIsSubmitted(true);
      
      return Object.keys(newErrors).length === 0;
    };

    const handleUpdateUser = async () => {
      try {
        if (!validateForm()) {
          return;
        }
        
        setLoading(true);
        
        const updateData = {
          Fname,
          Lname,
          companyName,
          field,
          city: selectedCity,
        };

        
        if (profileImage && !profileImage.startsWith('http')) {
          const base64Image = await uriToBase64(profileImage);
          if (base64Image) {
            updateData.profileImage = `data:image/jpeg;base64,${base64Image}`;
          }
        }
        
        const resultAction = await dispatch(UpdateUser(updateData));
        
        if (UpdateUser.fulfilled.match(resultAction)) {
          // Show success modal when update is successful
          setIsSuccessModalVisible(true);
          
          // Update initial values to reflect new state after successful update
          setInitialFname(Fname);
          setInitialLname(Lname);
          setInitialCompanyName(companyName);
          setInitialField(field);
          setInitialSelectedCity(selectedCity);
          setInitialProfileImage(profileImage);
          setIsChanged(false);
        } else {
          if (resultAction.payload) {
            Alert.alert('خطأ', resultAction.payload);
          } else {
            Alert.alert('خطأ', 'فشل في تحديث معلومات المستخدم');
          }
        }
      } catch (error) {
        console.error('Error updating user:', error);
        Alert.alert('خطأ', 'حدث خطأ غير متوقع');
      } finally {
        setLoading(false);
      }
    };

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <HeaderWithBack onPress={() => router.back()} />
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
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

              <View className="items-end mt-2 pb-32">
                <View style={{ width: '100%' }}>
                  <View>
                    <View className='flex items-end justify-end mb-4'>
                      <Text className='font-bold text-l text-[#F52525] text-end font-tajawal'>المعلومات الشخصية</Text>
                    </View>
                    <View className='flex-row-reverse justify-between w-full'>
                      <View className='w-[47%]'>
                        <View className='flex justify-center items-end'>
                          <Text className='text-start font-tajawalregular mb-2 text-[#2e752f]'>إسم</Text>
                        </View>
                        <TextInput
                          placeholder="الإسم"
                          value={Fname}
                          onChangeText={(text) => {
                            setFname(text);
                            setErrors((prev) => ({ ...prev, fname: "" }));
                          }}
                          placeholderTextColor="#888"
                          className={`border ${errors.fname && isSubmitted ? 'border-[#F52525]' : 'border-[#9ca3af]'} rounded-lg p-3 text-black text-right bg-white font-tajawalregular `}
                        />
                        {errors.fname && isSubmitted && (
                          <Text className="text-[#F52525] text-right text-xs mt-1 font-tajawalregular">
                            {errors.fname}
                          </Text>
                        )}
                      </View>
                      <View className='w-[47%]'>
                        <View className='flex justify-center items-end'>
                          <Text className='text-start font-tajawalregular mb-2 text-[#2e752f]'>اللقب</Text>
                        </View>
                        <TextInput
                          placeholder="اللقب"
                          value={Lname}
                          onChangeText={(text) => {
                            setLname(text);
                            setErrors((prev) => ({ ...prev, lname: "" }));
                          }}
                          placeholderTextColor="#888"
                          className={`border ${errors.lname && isSubmitted ? 'border-[#F52525]' : 'border-[#9ca3af]'} rounded-lg p-3 text-black text-right bg-white font-tajawalregular `}
                        />
                        {errors.lname && isSubmitted && (
                          <Text className="text-[#F52525] text-right text-xs mt-1 font-tajawalregular">
                            {errors.lname}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View className='flex-row-reverse justify-between w-full'>
                      {role === 'company' ? 
                      <View className='w-[47%] mt-3'>
                      <View className='flex justify-center items-end'>
                        <Text className='text-start font-tajawalregular mb-2 text-[#2e752f]'>إسم الشركة</Text>
                      </View>
                      <TextInput
                        placeholder="إسم الشركة"
                        value={companyName}
                        onChangeText={setCompanyName}
                        placeholderTextColor="#888"
                        className={`border border-[#9ca3af] rounded-lg p-3 text-black text-right bg-white font-tajawalregular `}
                      />
                    </View>

                    :null
                    
                    }
                      
                      <View className={`${role === 'company' ? 'w-[47%]' :  'w-[100%]'} mt-4`}>
                        <View className='flex justify-center items-end'>
                        </View>
                        <CitySelector 
                          onCitySelect={handleCitySelect} 
                          regionsAndCities={regionsAndCitiesData}
                          initialValue={selectedCity}
                          selectedCity={selectedCity}
                          errors={errors}
                          isSubmitted={isSubmitted}
                          isRequired={false}
                          borderColor='#9ca3af'
                        />
                      </View>
                    </View>
                    {role === 'company' ?
                    <View className='mt-0' >
                      <View className='flex justify-center items-end'>
                        <Text className='text-start font-tajawalregular mb-2 text-[#2e752f]'>مجال الشركة</Text>
                      </View>
                      <CompanyFieldDropDown
                        errors={errors}
                        isSubmitted={isSubmitted}
                        initialValue={field}
                        selectedField={field}
                        onFieldSelect={handleFieldSelect}
                        isRequired={false}
                        borderColor='#9ca3af'
                      />
                    </View>
                    :
                      null
                    }
                    <View className='w-full flex items-center pt-4 mb-10'>
                      <TouchableOpacity 
                        onPress={handleUpdateUser}
                        disabled={loading || !isChanged}
                        className={`flex-row items-center ${isChanged ? 'bg-[#F52525]' : 'bg-[#9ca3af]' } rounded-full px-12 py-3 w-[50%] justify-center space-x-2`}
                      >
                        <Text className="text-white font-tajawal text-[13px]">
                          {loading ? 'جاري التأكيد' : 'تأكيد'}
                        </Text>
                        <Image
                          source={WhiteLogo}
                          className="w-8 h-8"
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Photo Selection Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity style={styles.centeredView} onPress={() => setModalVisible(false)}>
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
          </TouchableOpacity>
        </Modal>

        <Modal
          visible={isSuccessModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsSuccessModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsSuccessModalVisible(false)}>
            <View style={{ flex: 1, backgroundColor: 'rgba(47, 117, 47, 0.48)' }}>
              <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                <View style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  height: '60%',
                  padding: 16
                }}>
                  <View style={{ 
                    width: 60, 
                    height: 5, 
                    backgroundColor: Color.green, 
                    borderRadius: 5, 
                    alignSelf: 'center',
                    marginBottom: 10
                  }} />
                  
                  <View className="flex-1 items-center justify-center h-full py-8">
                    <Image 
                      source={require('@/assets/images/happyLeon.png')}
                      style={{ width: 240, height: 240 }}
                      resizeMode="contain"
                    />
                    <Text className="text-center text-[#2e752f] text-2xl font-tajawal font-bold" style={styles.FontText}>
                      مبروك!
                    </Text>
                    <Text className="text-gray-700 text-base text-center p-2 font-tajawalregular">
                      تم تحديث معلوماتك بنجاح.
                    </Text>
                    <View className="w-full mt-8">
                      <CustomButton
                        onPress={() => {
                          setIsSuccessModalVisible(false);
                        }}
                        title="رجوع"
                        textStyles="text-lg font-tajawal px-2 py-0 text-white pt-2"
                        containerStyles="w-[90%] m-auto bg-[#F52525] rounded-full p-3"
                        disabled={false}
                      />
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
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