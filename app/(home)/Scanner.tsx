import React, { useState, useRef, useEffect } from "react";
import { CameraView } from "expo-camera";
import { Stack, router } from "expo-router";
import { SafeAreaView, StyleSheet, Alert, View, Text, ActivityIndicator } from "react-native";
import { Audio } from 'expo-av';
import { Overlay } from "./Overlay";
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchOrderByQrCodeOrId, 
  selectOrderLoading, 
  selectOrderError,
  selectCurrentOrder
} from '@/store/slices/OrdersManagment';

export default function Scanner() {
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [hasFlashPermission, setHasFlashPermission] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState(null);
  const cameraRef = useRef(null);
  const sound = useRef(null);
  const dispatch = useDispatch();
  
  const reduxLoading = useSelector(selectOrderLoading);
  const reduxError = useSelector(selectOrderError);
  const currentOrder = useSelector(selectCurrentOrder);
  
  const isDisabled = isProcessing;
  
  useEffect(() => {
    return () => {
      if (sound.current) {
        sound.current.unloadAsync();
      }
    };
  }, []);

  const playSuccessSound = async () => {
    try {
      const { sound: soundObject } = await Audio.Sound.createAsync(
        require('@/assets/sounds/success.mp3'),
        { shouldPlay: true }
      );
      sound.current = soundObject;
      
      // Don't wait for playback completion
      sound.current.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.current.unloadAsync();
        }
      });
    } catch (error) {
      console.log("Error playing sound:", error);
    }
  };

  const toggleFlash = () => {
    setFlashEnabled(prevState => !prevState);
  };

  // Debounce mechanism
  let lastScanTime = 0;
  const DEBOUNCE_TIME = 3000; // 3 seconds

  const handleBarcodeScanned = ({ data }) => {
    // Prevent duplicate scans within the debounce period
    const now = Date.now();
    if (data === lastScannedCode && now - lastScanTime < DEBOUNCE_TIME) {
      return;
    }
    
    console.log("QR Code scanned:", data);
    setLastScannedCode(data);
    lastScanTime = now;
    processScannedData(data);
  };

  const handleManualIdSubmit = (id) => {
    console.log("Manual ID entered:", id);
    processScannedData(id);
  };

  const processScannedData = async (data) => {
    if (isDisabled) {
      console.log("Processing already in progress. Ignoring scan.");
      return;
    }
    
    setIsProcessing(true);
    
    if (!data) {
      Alert.alert("خطأ", "الرمز غير صالح، حاول مرة أخرى");
      setIsProcessing(false);
      return;
    }
    
    try {
      console.log("Dispatching fetchOrderByQrCodeOrId with:", data);
      
      playSuccessSound();
      
      const result = await dispatch(fetchOrderByQrCodeOrId(data));
      
      if (fetchOrderByQrCodeOrId.fulfilled.match(result)) {
        const order = result.payload;
        console.log("Order fetched successfully:", order);
        
        if (order) {
          setTimeout(() => {
            try {
              router.replace({
                pathname: '/DetailsPage',
                params: { 
                  orderId: order._id || order.id, 
                  qrCode: order.qrCode || data 
                }
              });
            } catch (navError) {
              console.log("Navigation error:", navError);
              Alert.alert(
                "خطأ في التنقل",
                "حدث خطأ أثناء الانتقال إلى صفحة التفاصيل",
                [{ text: "حسنًا" }]
              );
            }
          }, 200);
        }
      } else if (reduxError) {
        console.log("Error from Redux:", reduxError);
        Alert.alert(
          "خطأ",
          "لم يتم العثور على الطلب",
          [{ text: "حسنًا" }]
        );
      }
    } catch (error) {
      console.log("Error in processScannedData:", error);
      Alert.alert(
        "خطأ",
        "حدث خطأ أثناء البحث عن الطلب",
        [{ text: "موافق" }]
      );
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
      }, 1000);
    }
  };

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen
        options={{
          title: "مسح الرمز",
          headerShown: false
        }}
      />
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={flashEnabled}
        onBarcodeScanned={isDisabled ? undefined : handleBarcodeScanned}
      />
      <Overlay
        flashEnabled={flashEnabled}
        toggleFlash={toggleFlash}
        hasFlashPermission={hasFlashPermission}
        onManualIdSubmit={isDisabled ? undefined : handleManualIdSubmit}
      />
      
      {isDisabled && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>جاري البحث عن الطلب...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  }
});