import { View, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator, Animated, TouchableWithoutFeedback, Keyboard, Modal } from 'react-native'
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import HeaderWithBack from '@/components/ui/HeaderWithToolTipAndback'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { updatePassword, selectPasswordUpdateLoading, selectPasswordUpdateSuccess, selectPasswordUpdateError, resetPasswordUpdateState } from '@/store/slices/userSlice'
import CustomButton from '@/components/ui/CustomButton'

const Color = {
  green: '#2e752f'
}

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [currentError, setCurrentError] = useState('')
  const [newError, setNewError] = useState('')
  const [confirmError, setConfirmError] = useState('')
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false)

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Animation ref for shaking the password field on error
  const oldPasswordShake = useRef(new Animated.Value(0)).current
  
  // Redux hooks
  const dispatch = useDispatch()
  const loading = useSelector(selectPasswordUpdateLoading)
  const success = useSelector(selectPasswordUpdateSuccess)
  const error = useSelector(selectPasswordUpdateError)

  // Compute if form is valid and complete
  const isFormValid = useMemo(() => {
    // Validate all required fields are filled correctly
    const isOldPasswordValid = oldPassword && oldPassword.length === 6 && /^\d+$/.test(oldPassword);
    const isNewPasswordValid = password && password.length === 6 && /^\d+$/.test(password);
    const isConfirmPasswordValid = confirmPassword && confirmPassword === password;
    
    // All fields must be valid AND there must be no error messages
    return isOldPasswordValid && isNewPasswordValid && isConfirmPasswordValid &&
      !currentError && !newError && !confirmError;
  }, [oldPassword, password, confirmPassword, currentError, newError, confirmError]);

  // Reset Redux state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetPasswordUpdateState())
    }
  }, [dispatch])
  
  // Reset error state when inputs change
  useEffect(() => {
    if (oldPassword) setCurrentError('')
  }, [oldPassword])

  useEffect(() => {
    if (password) setNewError('')
  }, [password])

  useEffect(() => {
    if (confirmPassword) setConfirmError('')
  }, [confirmPassword])

  // Handle success state - show modal
  useEffect(() => {
    console.log('Success status changed:', success)
    if (success) {
      console.log('Showing success modal')
      setIsSuccessModalVisible(true)
      // Reset form
      setOldPassword('')
      setPassword('')
      setConfirmPassword('')
    }
  }, [success])

  // Handle error state with improved error handling
  useEffect(() => {
    if (error) {
      console.log('Received error:', error)
      
      // Check if the error is related to incorrect password (401)
      if (error.message && (error.message.includes('incorrect') || error.message.includes('صحيح') || error.statusCode === 401 || error.field === 'oldPassword')) {
        // Set error message for wrong current password
        setCurrentError(error.message || 'الكود الحالي غير صحيح')
        
        // Shake animation for wrong password
        Animated.sequence([
          Animated.timing(oldPasswordShake, {
            toValue: 10,
            duration: 100,
            useNativeDriver: true
          }),
          Animated.timing(oldPasswordShake, {
            toValue: -10,
            duration: 100,
            useNativeDriver: true
          }),
          Animated.timing(oldPasswordShake, {
            toValue: 10,
            duration: 100,
            useNativeDriver: true
          }),
          Animated.timing(oldPasswordShake, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true
          })
        ]).start()
      } else if (error.field === 'password' || (error.message && error.message.includes('كود جديد'))) {
        setNewError(error.message)
      } else if (error.message) {
        // For any other error with a message, show an alert
        Alert.alert(
          'خطأ', 
          error.message || 'فشل في تغيير الكود'
        )
      }
    }
  }, [error])

  // Validation function for password input
  const validateInput = (text, setter, errorSetter) => {
    // Clear previous errors
    errorSetter('')
    
    // Check if input contains only numbers
    if (!/^\d*$/.test(text)) {
      errorSetter('يجب إدخال أرقام فقط')
      return
    }
    
    // Limit to 6 characters
    if (text.length <= 6) {
      setter(text)
    } else {
      errorSetter('يجب أن لا يتجاوز الكود 6 أرقام')
    }
  }

  const handleUpdate = () => {
    // Clear all previous errors
    setCurrentError('')
    setNewError('')
    setConfirmError('')
    
    // Validate all inputs before updating
    let isValid = true
    
    // Check if current password is provided
    if (!oldPassword) {
      setCurrentError('الرجاء إدخال الكود الحالي')
      isValid = false
    } else if (oldPassword.length < 6) {
      setCurrentError('يجب أن يتكون الكود من 6 أرقام')
      isValid = false
    }
    
    // Check if new password is provided
    if (!password) {
      setNewError('الرجاء إدخال الكود الجديد')
      isValid = false
    } else if (password.length < 6) {
      setNewError('يجب أن يتكون الكود من 6 أرقام')
      isValid = false
    }
    
    // Check if confirm password matches
    if (!confirmPassword) {
      setConfirmError('الرجاء تأكيد الكود الجديد')
      isValid = false
    } else if (confirmPassword !== password) {
      setConfirmError('الكود الجديد غير متطابق')
      isValid = false
    }
    
    if (isValid) {
      console.log('Dispatching update password with:', { oldPassword, password })
      dispatch(updatePassword({
        oldPassword,
        password
      }))
    }
  }

  const handleCancel = () => {
    router.back()
  }

  const closeSuccessModal = () => {
    setIsSuccessModalVisible(false)
    router.back()
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <HeaderWithBack onPress={() => router.back()} />
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>بدل الكود ديالك</Text>
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            <View style={styles.card}>
              <View style={styles.inputContainer}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label} className='font-bold'>الكود الحالي</Text>
                </View>

                <Animated.View 
                  style={[
                    styles.inputWrapper, 
                    { transform: [{ translateX: oldPasswordShake }] }
                  ]}
                >
                  <TextInput
                    value={oldPassword}
                    onChangeText={(text) => validateInput(text, setOldPassword, setCurrentError)}
                    secureTextEntry={!showCurrent}
                    placeholder="أدخل الكود الحالي"
                    style={[styles.input, currentError ? styles.inputError : null]}
                    keyboardType="phone-pad"
                    maxLength={6}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowCurrent(!showCurrent)}
                    style={styles.eyeIcon}
                    disabled={loading}
                  >
                    <Ionicons
                      name={showCurrent ? 'eye-off' : 'eye'}
                      size={24}
                      color="#7C7C7C"
                    />
                  </TouchableOpacity>
                </Animated.View>
                
                {currentError ? 
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={16} color="#F52525" />
                    <Text style={styles.errorText}>{currentError}</Text>
                  </View> 
                  : null
                }
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>الكود الجديد</Text>
                </View>
                <View style={styles.inputWrapper}>
                  <TextInput
                    value={password}
                    onChangeText={(text) => validateInput(text, setPassword, setNewError)}
                    secureTextEntry={!showNew}
                    placeholder="أدخل الكود الجديد"
                    style={[styles.input, newError ? styles.inputError : null]}
                    keyboardType="phone-pad"
                    maxLength={6}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowNew(!showNew)}
                    style={styles.eyeIcon}
                    disabled={loading}
                  >
                    <Ionicons
                      name={showNew ? 'eye-off' : 'eye'}
                      size={24}
                      color="#7C7C7C"
                    />
                  </TouchableOpacity>
                </View>
                {newError ? 
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={16} color="#F52525" />
                    <Text style={styles.errorText}>{newError}</Text>
                  </View> 
                  : null
                }
              </View>

              {/* Confirm Password */}
              <View style={styles.inputContainer}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>تأكيد الكود الجديد</Text>
                </View>

                <View style={styles.inputWrapper}>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={(text) => validateInput(text, setConfirmPassword, setConfirmError)}
                    secureTextEntry={!showConfirm}
                    placeholder="أعد إدخال الكود الجديد"
                    style={[styles.input, confirmError ? styles.inputError : null]}
                    keyboardType="phone-pad"
                    maxLength={6}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirm(!showConfirm)}
                    style={styles.eyeIcon}
                    disabled={loading}
                  >
                    <Ionicons
                      name={showConfirm ? 'eye-off' : 'eye'}
                      size={24}
                      color="#7C7C7C"
                    />
                  </TouchableOpacity>
                </View>
                {confirmError ? 
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={16} color="#F52525" />
                    <Text style={styles.errorText}>{confirmError}</Text>
                  </View> 
                  : null
                }
              </View>
            </View>
          </TouchableWithoutFeedback>

          <View style={styles.mascotContainer}>
            <Image 
              source={require('@/assets/images/LeonEdit.png')} 
              style={styles.mascotImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>إلغاء</Text>
              <Ionicons name="close-circle" size={20} color="#fff" style={styles.buttonIcon} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.confirmButton, 
                (loading || !isFormValid) && styles.disabledButton
              ]}
              onPress={handleUpdate}
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text style={styles.confirmButtonText}>تأكيد</Text>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" style={styles.buttonIcon} />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Success Modal */}
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
                      onPress={closeSuccessModal}
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  titleContainer: {
    marginBottom: 20,
    marginTop:-19,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    color: '#F52525',
    fontFamily: 'Tajawal',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 6,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,  
  },
  inputContainer: {
    width: '100%',
    marginTop: 0,
  },
  labelContainer: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  label: {
    fontFamily: 'Tajawal',
    marginTop:10,
    color: '#2e752f',
    fontSize: 14,
    fontWeight: "bold",
    marginRight:5
  },
  inputWrapper: {
    position: 'relative',
  },
  input:{
    backgroundColor: '#efefef',
    borderRadius: 20,
    paddingVertical: 13,
    paddingHorizontal: 20,
    textAlign: 'right',
    fontFamily: 'TajawalRegular',
    fontSize: 14,
    color: '#000',
    borderWidth: 0,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#F52525',
    backgroundColor: '#FFF8F8', 
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 6,
    paddingHorizontal: 8,
  },
  errorText: {
    color: '#F52525',
    fontSize: 9,
    marginRight: 6,
    textAlign: 'right',
    fontFamily: 'Tajawal',
    flexShrink: 1, 
  },
  eyeIcon:{
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -12 }],
    left: 16,
  },
  mascotContainer:{
    alignItems: 'center',
    marginTop:10,
    marginBottom: 20,
  },
  mascotImage:{
    width:260,
    height: 260,
    objectFit:"contain",
  },
  buttonContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
    gap: 15,
  },
  cancelButton: {
    backgroundColor: '#F52525',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
  },
  confirmButton: {
    backgroundColor: '#2e752f',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
  },
  disabledButton: {
    backgroundColor: '#93b894', 
    opacity: 0.7,
  },
  cancelButtonText: {
    color: '#fff',
    fontFamily: 'Tajawal',
    fontSize: 18,
    marginRight: 5,
  },
  confirmButtonText: {
    color: '#fff',
    fontFamily: 'Tajawal',
    fontSize: 18,
    marginRight: 5,
  },
  buttonIcon: {
    marginLeft: 5,
  },
  FontText: {
    fontFamily: 'Tajawal'
  }
});

export default UpdatePassword;