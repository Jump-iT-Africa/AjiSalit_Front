import { View, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useState } from 'react'
import HeaderWithBack from '@/components/ui/HeaderWithToolTipAndback'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const UpdatePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleUpdate = () => {
    // Implement password update logic here
    console.log('Password update requested')
    // Add validation and API call
  }

  const handleCancel = () => {
    // Go back to previous screen
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

          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label} className='font-bold'>الكود الحالي</Text>
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry={!showCurrent}
                  placeholder="أدخل الكود الحالي"
                  style={styles.input}
                />
                <TouchableOpacity
                  onPress={() => setShowCurrent(!showCurrent)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showCurrent ? 'eye-off' : 'eye'}
                    size={24}
                    color="#7C7C7C"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>الكود الجديد</Text>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNew}
                  placeholder="أدخل الكود الجديد"
                  style={styles.input}
                />
                <TouchableOpacity
                  onPress={() => setShowNew(!showNew)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showNew ? 'eye-off' : 'eye'}
                    size={24}
                    color="#7C7C7C"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>تأكيد الكود الجديد</Text>
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirm}
                  placeholder="أعد إدخال الكود الجديد"
                  style={styles.input}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirm(!showConfirm)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showConfirm ? 'eye-off' : 'eye'}
                    size={24}
                    color="#7C7C7C"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

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
            >
              <Text style={styles.cancelButtonText}>إلغاء</Text>
              <Ionicons name="close-circle" size={20} color="#fff" style={styles.buttonIcon} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={handleUpdate}
            >
              <Text style={styles.confirmButtonText}>تأكيد</Text>
              <Ionicons name="checkmark-circle" size={20} color="#fff" style={styles.buttonIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
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
});

export default UpdatePassword;