import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import DefaultImage from '@/assets/images/imagePlaceHolder.jpg';
import HeaderWithBack from '@/components/ui/HeaderWithToolTipAndback';
import Feather from '@expo/vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import WhiteLogo from '@/assets/images/ajisalit_white.png';
import { UpdateUser, selectUserData, setPhoneNumber } from '@/store/slices/userSlice'; 
import { selectUserRole } from "@/store/slices/userSlice";
import CitySelector from '@/components/CompanyRegister/CitySelector';
import regionsAndCitiesData from "@/constants/Cities/Cities.json";
import CompanyFieldDropDown from '@/components/CompanyRegister/CompanyFieldDropDown';
import Color from "@/constants/Colors";
import CustomButton from '@/components/ui/CustomButton';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const Profile = () => {
  const { width, height } = Dimensions.get('window');
  const isSmallScreen = height < 700; 
  
  const bottomSheetHeight = useMemo(() => {
      return isSmallScreen ? hp('80%') : hp('62%');
  }, [isSmallScreen]);

  const dispatch = useDispatch();
  const user = useSelector(selectUserData); 
  console.log('this is info of user', user);
  
  const [profileImage, setProfileImage] = useState(null);
  const [initialProfileImage, setInitialProfileImage] = useState(null);
  const [Fname, setFname] = useState('');
  const [initialFname, setInitialFname] = useState('');
  const [Lname, setLname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [initialLname, setInitialLname] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [initialCompanyName, setInitialCompanyName] = useState('');
  const [initialphoneNumber, setInitialPhoneNumber] = useState('');
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
      
  
  useEffect(() => {
    if (user) {
      setFname(user.Fname || '');
      setLname(user.Lname || '');
      setPhoneNumber(user.phoneNumber || '');
      setCompanyName(user.companyName || '');
      setfield(user.field || ''); 
      if (user.city) {
        setSelectedCity(user.city);
      }
      if (user.image) {
        setProfileImage(user.image);
      }
      
      setInitialFname(user.Fname || '');
      setInitialLname(user.Lname || '');
      setInitialCompanyName(user.companyName || '');
      setInitialPhoneNumber(user.phoneNumber || '');
      setInitialField(user.field || '');
      setInitialSelectedCity(user.city || '');
      setInitialProfileImage(user.image || null);
      }
  }, [user]);

  useEffect(() => {
    const hasChanges = 
      Fname !== initialFname ||
      Lname !== initialLname || 
      companyName !== initialCompanyName ||
      phoneNumber !== initialphoneNumber ||
      field !== initialField ||
      selectedCity !== initialSelectedCity ||
      profileImage !== initialProfileImage;
    
    setIsChanged(hasChanges);
  }, [
    Fname, Lname, companyName, field, selectedCity, profileImage,phoneNumber,
    initialFname, initialLname, initialCompanyName, initialField, initialSelectedCity, initialProfileImage,initialphoneNumber
  ]);

  const handleCitySelect = (city) => {
    setSelectedCity(city.names.ar);
    setErrors((prev) => ({ ...prev, city: "" }));
  };

  const handleFieldSelect = (fieldName) => {
    setfield(fieldName);
    setErrors((prev) => ({ ...prev, field: "" }));
  };

  // FIXED IMAGE COMPRESSION WITH BETTER ERROR HANDLING
  const compressProfileImage = async (uri) => {
    try {
      console.log('Starting image compression for URI:', uri);
      
      // Validate input URI
      if (!uri || typeof uri !== 'string') {
        console.error('Invalid URI provided to compressProfileImage');
        return null;
      }

      // Clean the URI - remove Optional() wrapper if present
      let cleanUri = uri.trim();
      cleanUri = cleanUri.replace(/^Optional\("(.+)"\)$/, '$1');
      cleanUri = cleanUri.replace(/^"|"$/g, '');
      
      console.log('Cleaned URI:', cleanUri.substring(0, 100));
      
      // If it's already a data URI (base64), return it as-is
      if (cleanUri.startsWith('data:')) {
        console.log('URI is already a data URI, returning as-is');
        return cleanUri;
      }
      
      // If it's an HTTP URL, return as-is
      if (cleanUri.startsWith('http://') || cleanUri.startsWith('https://')) {
        console.log('URI is a web URL, returning as-is');
        return cleanUri;
      }
      
      // Ensure file:// prefix for local files
      if (!cleanUri.startsWith('file://')) {
        if (cleanUri.startsWith('/')) {
          cleanUri = 'file://' + cleanUri;
        } else {
          console.error('Unknown URI format:', cleanUri);
          return null;
        }
      }
      
      // Check if file exists before processing
      try {
        const fileInfo = await FileSystem.getInfoAsync(cleanUri);
        if (!fileInfo.exists) {
          console.error('File does not exist at URI:', cleanUri);
          return null;
        }
        
        const originalSizeKB = fileInfo.size / 1024;
        console.log(`Original file size: ${originalSizeKB.toFixed(2)} KB`);
        
        // Skip compression for very small images
        if (originalSizeKB < 100) {
          console.log('Image is small enough, skipping compression');
          return cleanUri;
        }
        
      } catch (fileError) {
        console.error('Error checking file info:', fileError);
        return null;
      }
      
      // Compress the image with conservative settings
      try {
        const manipResult = await manipulateAsync(
          cleanUri,
          [{ resize: { width: 400 } }], // Smaller size for profile images
          { 
            compress: 0.8, // Higher quality to avoid artifacts
            format: SaveFormat.JPEG 
          }
        );
        
        // Verify the compressed result
        const compressedInfo = await FileSystem.getInfoAsync(manipResult.uri);
        const compressedSizeKB = compressedInfo.size / 1024;
        console.log(`Compressed file size: ${compressedSizeKB.toFixed(2)} KB`);
        
        return manipResult.uri;
        
      } catch (compressError) {
        console.error('Error during image compression:', compressError);
        // Return original URI if compression fails
        return cleanUri;
      }
      
    } catch (error) {
      console.error('General error in compressProfileImage:', error);
      return null;
    }
  };
  
  // IMPROVED CAMERA FUNCTION WITH BETTER ERROR HANDLING
  const takePhoto = async () => {
    try {
      console.log('Requesting camera permissions...');
      
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'إذن مطلوب', 
          'نحتاج إلى إذن الكاميرا لالتقاط الصور.',
          [{ text: 'حسناً', style: 'default' }]
        );
        return;
      }

      console.log('Launching camera...');
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9, // Start with higher quality
      });

      console.log('Camera result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        console.log('Processing camera image:', asset.uri);
        
        // Compress the image before setting it
        const compressedUri = await compressProfileImage(asset.uri);
        
        if (compressedUri) {
          setProfileImage(compressedUri);
          setModalVisible(false);
        } else {
          Alert.alert('خطأ', 'فشل في معالجة الصورة. يرجى المحاولة مرة أخرى.');
        }
      }
    } catch (error) {
      console.error('Error in takePhoto:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء التقاط الصورة. يرجى المحاولة مرة أخرى.');
    }
  };

  // FIXED GALLERY PICKER WITH COMPREHENSIVE ERROR HANDLING
  const pickImage = async () => {
    try {
      console.log('Requesting media library permissions...');
      
      // Request permissions with better error handling
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Permission result:', permissionResult);
      
      if (permissionResult.status !== 'granted') {
        Alert.alert(
          'إذن مطلوب', 
          'نحتاج إلى إذن الوصول إلى معرض الصور لاختيار الصور.',
          [
            { text: 'إلغاء', style: 'cancel' },
            { 
              text: 'الإعدادات', 
              style: 'default',
              onPress: () => {
                // On iOS, this might open settings
                if (Platform.OS === 'ios') {
                  ImagePicker.requestMediaLibraryPermissionsAsync();
                }
              }
            }
          ]
        );
        return;
      }

      console.log('Launching image library...');
      
      // Use more conservative settings for gallery picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9, // Start with higher quality
        // Add these options for better stability
        allowsMultipleSelection: false,
        selectionLimit: 1,
      });

      console.log('Image picker result:', {
        canceled: result.canceled,
        assetsLength: result.assets?.length,
        firstAssetUri: result.assets?.[0]?.uri?.substring(0, 50)
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        // Validate the selected asset
        if (!asset.uri) {
          console.error('No URI in selected asset');
          Alert.alert('خطأ', 'فشل في اختيار الصورة. يرجى المحاولة مرة أخرى.');
          return;
        }
        
        console.log('Processing gallery image:', asset.uri);
        
        // Check if file exists before processing
        try {
          const fileInfo = await FileSystem.getInfoAsync(asset.uri);
          if (!fileInfo.exists) {
            console.error('Selected file does not exist');
            Alert.alert('خطأ', 'الصورة المختارة غير موجودة. يرجى اختيار صورة أخرى.');
            return;
          }
          
          console.log('File exists, size:', (fileInfo.size / 1024).toFixed(2), 'KB');
          
        } catch (fileCheckError) {
          console.error('Error checking file:', fileCheckError);
          Alert.alert('خطأ', 'فشل في التحقق من الصورة المختارة.');
          return;
        }
        
        // Compress the image
        const compressedUri = await compressProfileImage(asset.uri);
        
        if (compressedUri) {
          console.log('Image processed successfully, setting as profile image');
          setProfileImage(compressedUri);
          setModalVisible(false);
        } else {
          console.error('Image compression failed');
          Alert.alert('خطأ', 'فشل في معالجة الصورة. يرجى اختيار صورة أخرى أو المحاولة مرة أخرى.');
        }
      } else {
        console.log('Image selection was canceled or no assets returned');
      }
      
    } catch (error) {
      console.error('Error in pickImage:', error);
      
      // Provide more specific error messages
      let errorMessage = 'حدث خطأ أثناء اختيار الصورة.';
      
      if (error.message && error.message.includes('permissions')) {
        errorMessage = 'لا يمكن الوصول إلى معرض الصور. يرجى التحقق من الأذونات.';
      } else if (error.message && error.message.includes('cancelled')) {
        errorMessage = 'تم إلغاء اختيار الصورة.';
      } else if (error.message && error.message.includes('network')) {
        errorMessage = 'مشكلة في الشبكة. يرجى التحقق من الاتصال.';
      }
      
      Alert.alert('خطأ', errorMessage);
    }
  };

  // IMPROVED BASE64 CONVERSION WITH BETTER ERROR HANDLING
  const uriToBase64 = async (uri) => {
    try {
      console.log('Converting image to base64...');
      
      if (!uri) {
        console.error('No URI provided for base64 conversion');
        return null;
      }
      
      // If it's already a data URI, return just the base64 part
      if (uri.startsWith('data:')) {
        console.log('Image is already base64');
        const base64Part = uri.split(',')[1];
        return base64Part || null;
      }
      
      // Clean URI
      let cleanUri = uri.trim();
      cleanUri = cleanUri.replace(/^Optional\("(.+)"\)$/, '$1');
      cleanUri = cleanUri.replace(/^"|"$/g, '');
      
      // Use fetch with timeout for better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      try {
        const response = await fetch(cleanUri, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          
          reader.onloadend = () => {
            try {
              const result = reader.result;
              if (typeof result === 'string') {
                const base64String = result.split(',')[1];
                console.log(`Base64 conversion successful, size: ${(base64String.length * 0.75 / 1024).toFixed(2)} KB`);
                resolve(base64String);
              } else {
                reject(new Error('FileReader result is not a string'));
              }
            } catch (error) {
              reject(error);
            }
          };
          
          reader.onerror = () => {
            reject(new Error('FileReader error'));
          };
          
          reader.onabort = () => {
            reject(new Error('FileReader aborted'));
          };
          
          reader.readAsDataURL(blob);
        });
        
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }

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
        phoneNumber,
        field,
        city: selectedCity,
      };
  
      // Handle profile image with better error handling
      if (profileImage && !profileImage.startsWith('http')) {
        try {
          if (profileImage.startsWith('data:')) {
            // Already base64 - use as-is
            console.log('Image is already base64, using as-is');
            updateData.profileImage = profileImage;
          } else {
            // Local file - compress then convert to base64
            console.log('Image is local file, compressing and converting to base64');
            const compressedUri = await compressProfileImage(profileImage);
            
            if (compressedUri) {
              const base64Image = await uriToBase64(compressedUri);
              if (base64Image) {
                updateData.profileImage = `data:image/jpeg;base64,${base64Image}`;
              } else {
                console.warn('Failed to convert image to base64, proceeding without image update');
              }
            } else {
              console.warn('Failed to compress image, proceeding without image update');
            }
          }
        } catch (imageError) {
          console.error('Error processing profile image:', imageError);
          Alert.alert(
            'تحذير',
            'حدث خطأ في معالجة صورة الملف الشخصي. سيتم حفظ البيانات الأخرى بدون تحديث الصورة.',
            [
              { text: 'إلغاء', style: 'cancel' },
              { text: 'متابعة', style: 'default' }
            ]
          );
          return;
        }
      }
      
      console.log('Updating user with data:', { 
        ...updateData, 
        profileImage: updateData.profileImage ? 
          `${updateData.profileImage.substring(0, 30)}...` : 
          'no_image' 
      });
      
      const resultAction = await dispatch(UpdateUser(updateData));
      
      if (UpdateUser.fulfilled.match(resultAction)) {
        setIsSuccessModalVisible(true);
        
        // Update initial values
        setInitialFname(Fname);
        setInitialLname(Lname);
        setInitialCompanyName(companyName);
        setInitialPhoneNumber(phoneNumber);
        setInitialField(field);
        setInitialSelectedCity(selectedCity);
        setInitialProfileImage(profileImage);
        setIsChanged(false);
      } else {
        const errorMessage = resultAction.payload || 'فشل في تحديث معلومات المستخدم';
        Alert.alert('خطأ', errorMessage);
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
              <Text className="font-thin text-xl text-[#F52525] text-center font-tajawal">معلومات الحساب</Text>
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
              <Text className="font-thin text-lg mt-2 font-tajawalregular">
                {Fname} {Lname}
              </Text>
            </View>

            <View className="items-end mt-2 pb-32">
              <View style={{ width: '100%' }}>
                <View>
                  <View className='flex items-end justify-end mb-4'>
                    <Text className='font-thin text-l text-[#F52525] text-end font-tajawal'>المعلومات الشخصية</Text>
                  </View>
                  
                    <View>
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
                        <Text className='text-start font-tajawalregular mb-0 text-[#2e752f]'>مجال الشركة</Text>
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
                  <View className='flex-row-reverse justify-between w-full'>
                    <View className='w-[100%] mt-0'>
                      <View className='flex justify-center items-end'>
                        <Text className='text-start font-tajawalregular mb-2 text-[#2e752f]'> رقم الهاتف</Text>
                      </View>
                      <TextInput
                        placeholder=" رقم الهاتف"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        editable={false}
                        placeholderTextColor="#888"
                        className={`border border-[#9ca3af] rounded-lg p-3 text-gray-400 text-right bg-white font-tajawalregular `}
                      />
                    </View>
                  </View>

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
                height:bottomSheetHeight,
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
                  <Text className="text-center text-[#2e752f] text-2xl font-tajawal font-thin" style={styles.FontText}>
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