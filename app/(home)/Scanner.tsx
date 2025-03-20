import React, { useState, useRef, useEffect } from "react";
import { CameraView } from "expo-camera";
import { Stack, router } from "expo-router";
import { SafeAreaView, StyleSheet, Alert, View, Text, ActivityIndicator } from "react-native";
import { Audio } from 'expo-av';
import { Overlay } from "./Overlay";
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchOrderByQrCode, 
  selectOrderLoading, 
  selectOrderError,
  selectOrderSuccess,
  selectCurrentOrder
} from '@/store/slices/OrdersOfClient';

export default function Scanner() {
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [hasFlashPermission, setHasFlashPermission] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [navigateParams, setNavigateParams] = useState(null);
  const cameraRef = useRef(null);
  const sound = useRef(null);
  const dispatch = useDispatch();
  
  
  const reduxLoading = useSelector(selectOrderLoading);
  const reduxError = useSelector(selectOrderError);
  const reduxSuccess = useSelector(selectOrderSuccess);
  const currentOrder = useSelector(selectCurrentOrder);
  
  useEffect(() => {
    
    return () => {
      if (sound.current) {
        sound.current.unloadAsync();
      }
    };
  }, []);

  
  useEffect(() => {
    if (shouldNavigate && navigateParams && !isProcessing && !reduxLoading) {
      console.log("Attempting navigation with params:", navigateParams);
      
      try {
        
        setShouldNavigate(false);
        
        router.push(navigateParams);

      } catch (error) {
        console.error("Navigation error:", error);
        Alert.alert(
          "خطأ في التنقل",
          "حدث خطأ أثناء الانتقال إلى صفحة التفاصيل",
          [{ text: "حسنًا" }]
        );
      }
    }
  }, [shouldNavigate, navigateParams, isProcessing, reduxLoading]);

  
  useEffect(() => {
    if (reduxSuccess && currentOrder && !isProcessing && !reduxLoading) {
      console.log("Order found successfully:", currentOrder);
      
      
      const orderId = currentOrder._id || currentOrder.id;
      const qrCodeValue = currentOrder.qrCode || lastScannedCode;
      
      
      setNavigateParams({
        pathname: '/DetailsPage',
        params: { 
          orderId: orderId, 
          qrCode: qrCodeValue 
        }
      });
      setShouldNavigate(true);
    }
  }, [reduxSuccess, currentOrder, isProcessing, reduxLoading, lastScannedCode]);

  const playSuccessSound = async () => {
    try {
      const { sound: soundObject } = await Audio.Sound.createAsync(
        require('@/assets/sounds/success.mp3'),
        { shouldPlay: true }
      );
      sound.current = soundObject;
      
      
      return new Promise((resolve) => {
        sound.current.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            resolve();
          }
        });
      });
    } catch (error) {
      console.error("Error playing sound:", error);
      return Promise.resolve(); 
    }
  };

  const toggleFlash = () => {
    setFlashEnabled(prevState => !prevState);
  };

  let lastScanTime = 0;

  const handleBarcodeScanned = ({ data }) => {
    
    if (data === lastScannedCode && Date.now() - lastScanTime < 3000) {
      return;
    }
    
    console.log("QR Code scanned:", data);
    setLastScannedCode(data);
    lastScanTime = Date.now();
    processScannedData(data);
  };

  const handleManualIdSubmit = (id) => {
    console.log("Manual ID entered:", id);
    processScannedData(id);
  };

  const processScannedData = async (data) => {
    if (isProcessing || reduxLoading) {
      return;
    }
    
    setIsProcessing(true);
    
    if (!data) {
      Alert.alert("خطأ", "الرمز غير صالح، حاول مرة أخرى");
      setIsProcessing(false);
      return;
    }
    
    try {
      console.log("Dispatching fetchOrderByQrCode with:", data);
      await playSuccessSound();
      
      const result = await dispatch(fetchOrderByQrCode(data));
      
      if (fetchOrderByQrCode.fulfilled.match(result)) {
        const order = result.payload;
        console.log("Order fetched directly:", order);
        
        if (order) {
          setTimeout(() => {
            try {
              console.log("order ID", order._id);
              console.log("qrcode", order.qrCode);
              
              // This is the correct way to pass params with expo-router
              router.push({
                pathname: '/DetailsPage',
                params: { 
                  orderId: order._id || order.id, 
                  qrCode: order.qrCode || data 
                }
              });
            } catch (navError) {
              console.error("Direct navigation error:", navError);
            }
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Error in processScannedData:", error);
      Alert.alert(
        "خطأ",
        "حدث خطأ أثناء البحث عن الطلب",
        [{ text: "موافق" }]
      );
    } finally {
      setIsProcessing(false);
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
        onBarcodeScanned={(reduxLoading || isProcessing) ? undefined : handleBarcodeScanned}
      />
      <Overlay
        flashEnabled={flashEnabled}
        toggleFlash={toggleFlash}
        hasFlashPermission={hasFlashPermission}
        onManualIdSubmit={(reduxLoading || isProcessing) ? undefined : handleManualIdSubmit}
      />
      
      {(reduxLoading || isProcessing) && (
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