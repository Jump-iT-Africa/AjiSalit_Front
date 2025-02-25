import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView
} from "react-native";
import { BlurView } from 'expo-blur'; // Import BlurView
import Colors from "@/constants/Colors";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function AddManuallyTheId({ 
  visible, 
  onClose, 
  onSubmit, 
  containerStyle, 
  useBlur = false, 
  blurIntensity = 50, 
  blurTint = "light" 
}) {
  const [idValue, setIdValue] = useState("");

  const handleSubmit = () => {
    if (idValue.trim()) {
      onSubmit(idValue);
      setIdValue("");
    }
  };

  const Container = useBlur ? BlurView : View;
  const containerProps = useBlur ? 
    { intensity: blurIntensity, tint: blurTint, style: [styles.container, containerStyle] } : 
    { style: [styles.container, containerStyle] };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Container {...containerProps} className={`${containerStyle}`}>
        <TouchableWithoutFeedback onPress={() => {
          Keyboard.dismiss();
          onClose();
        }}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback onPress={(e) => {
              e.stopPropagation();
            }}>
              <KeyboardAvoidingView behavior="padding">
                <View style={styles.modalView}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => {
                      Keyboard.dismiss();
                      onClose();
                    }}
                  >
                    <FontAwesome5 name="times" size={20} color={Colors.green} />
                  </TouchableOpacity>
                  
                  <Text style={styles.headerText}>أدخل رمز الطلب</Text>
                  
                  <Text style={styles.label}>رمز الطلب:</Text>
                  
                  <TextInput
                    style={styles.input}
                    value={idValue}
                    onChangeText={setIdValue}
                    placeholder="أدخل رمز الطلب هنا"
                    keyboardType="default"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />
                  
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.submitButtonText}>حفظ</Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Container>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.green,
    marginBottom: 20,
    textAlign: "center"
  },
  closeButton: {
    position: "absolute",
    left: 15,
    top: 15
  },
  label: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#2e752f",
    borderWidth: 1.2,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    textAlign: "right"
  },
  submitButton: {
    backgroundColor: Colors.green,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 5
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  }
});