import React, { useState, useRef } from "react";
import { CameraView } from "expo-camera";
import { Stack } from "expo-router";
import { SafeAreaView, StyleSheet, Linking, Alert } from "react-native";
import { Overlay } from "./Overlay";

export default function Scanner() {
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [hasFlashPermission, setHasFlashPermission] = useState(true);
  const cameraRef = useRef(null);
  
  const toggleFlash = () => {
    setFlashEnabled(prevState => !prevState);
  };

  const handleBarcodeScanned = ({ data }) => {
    console.log("QR Code scanned:", data);
    processScannedData(data);
  };

  const handleManualIdSubmit = (id) => {
    console.log("Manual ID entered:", id);
    processScannedData(id);
  };

  const processScannedData = (data) => {
    if (!data) {
      Alert.alert("خطأ", "الرمز غير صالح، حاول مرة أخرى");
      return;
    }

    try {
      if (data.startsWith('http') || data.startsWith('https')) {
        Linking.openURL(data);
      } else {
        Alert.alert("نجاح", `تم العثور على الطلب بالرمز: ${data}`);
      }
    } catch (error) {
      console.error("Error processing data:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء معالجة البيانات");
    }
  };

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen
        options={{
          title: "OverView",
          headerShown: false
        }}
      />
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={flashEnabled}
        onBarcodeScanned={handleBarcodeScanned}
      />
      <Overlay 
        flashEnabled={flashEnabled} 
        toggleFlash={toggleFlash} 
        hasFlashPermission={hasFlashPermission}
        onManualIdSubmit={handleManualIdSubmit}
      />
    </SafeAreaView>
  );
}