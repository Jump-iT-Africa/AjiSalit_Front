import React, { useState, useRef, useEffect } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Stack, router } from "expo-router";
import { SafeAreaView, StyleSheet, Alert, View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { Audio } from 'expo-av';
import { Overlay } from "./Overlay";
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchOrderByQrCodeOrId, 
  selectOrderLoading, 
  selectOrderError,
  selectCurrentOrder
} from '@/store/slices/OrdersManagment';
import RestrictedAccessModal from "@/components/AccessNotAllowed/RestrictedAccessModal";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Scanner() {
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  // Add state for the restricted access modal
  const [restrictedModalVisible, setRestrictedModalVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const sound = useRef(null);
  const dispatch = useDispatch();
  
  const reduxLoading = useSelector(selectOrderLoading);
  const reduxError = useSelector(selectOrderError);
  const currentOrder = useSelector(selectCurrentOrder);
  const isNavigatingRef = useRef(false);

  const isDisabled = isProcessing;

  useEffect(() => {
    (async () => {
      if (!permission?.granted) {
        const permissionResult = await requestPermission();
        if (!permissionResult.granted) {
          Alert.alert(
            "خطأ في الإذن",
            "يرجى السماح للتطبيق باستخدام الكاميرا لمسح رمز QR",
            [{ text: "موافق", onPress: () => router.back() }]
          );
        }
      }
    })();
    
    return () => {
      if (sound.current) {
        sound.current.unloadAsync();
      }
    };
  }, []);

  const playSuccessSound = async () => {
    try {
      const { sound: soundObject } = await Audio.Sound.createAsync(
        require('../../assets/sounds/pip.mp3'),
        { shouldPlay: true }
      );
      sound.current = soundObject;
      
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

  const lastScanTimeRef = useRef(0);
  const lastScannedCodeRef = useRef(null);
  const DEBOUNCE_TIME = 5000;

  const handleBarcodeScanned = ({ data }) => {
    const now = Date.now();
    if (data === lastScannedCodeRef.current && now - lastScanTimeRef.current < DEBOUNCE_TIME) {
      return;
    }
    console.log("QR Code scanned:", data);
    lastScannedCodeRef.current = data;
    lastScanTimeRef.current = now;
    processScannedData(data);
  };

  const handleManualIdSubmit = (id) => {
    console.log("Manual ID entered:", id);
    processScannedData(id);
  };
  
  const handleCameraReady = () => {
    console.log("Camera is ready");
    setCameraReady(true);
  };

  const processScannedData = async (data) => {
    if (isProcessing || isNavigatingRef.current) {
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
      await playSuccessSound();
      
      const result = await dispatch(fetchOrderByQrCodeOrId(data));
      
      if (fetchOrderByQrCodeOrId.fulfilled.match(result)) {
        const order = result.payload;
        console.log("Order fetched successfully:", order);
        
        if (order) {
          isNavigatingRef.current = true;
          


          try {
            await AsyncStorage.setItem('REFRESH_ORDERS_ON_RETURN', 'true');
          } catch (storageError) {
            console.log("Error setting refresh flag:", storageError);
          }

          
          setTimeout(() => {
            try {
              router.replace({
                pathname: '/DetailsPage',
                params: { 
                  orderId: order._id || order.id, 
                  qrCode: order.qrCode || data,
                  shouldRefreshOnReturn: true 
                }
              });
            } catch (navError) {
              console.log("Navigation error:", navError);
              Alert.alert(
                "خطأ في التنقل",
                "حدث خطأ أثناء الانتقال إلى صفحة التفاصيل",
                [{ text: "حسنًا" }]
              );
              isNavigatingRef.current = false;
            }
          }, 500); 
        }
      } else if (reduxError) {
        console.log("Error from Redux:", reduxError);
        Alert.alert(
          "خطأ",
          "لم يتم العثور على الطلب",
          [{ text: "حسنًا" }]
        );
        setIsProcessing(false);
      }
      else {
        console.log('naah nta machi client ola mol charika');
        // Show the restricted access modal instead of alert
        setRestrictedModalVisible(true);
        
        // Reset processing state after modal auto-closes
        setTimeout(() => {
          setIsProcessing(false);
        }, 1500); // A bit longer than the modal display time to ensure smooth transition
      }
    } catch (error) {
      console.log("Error in processScannedData:", error);
      Alert.alert(
        "خطأ",
        "حدث خطأ أثناء البحث عن الطلب",
        [{ text: "موافق" }]
      );
      setIsProcessing(false);
    } finally {
      if (!isNavigatingRef.current) {
        setTimeout(() => {
          setIsProcessing(false);
        }, 2000);
      }
    }
  };

  // Handler to close the restricted access modal
  const handleCloseRestrictedModal = () => {
    setRestrictedModalVisible(false);
  };

  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e752f" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>لا يمكن الوصول إلى الكاميرا</Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={() => requestPermission()}>
          <Text style={styles.permissionButtonText}>السماح بالوصول</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
        onCameraReady={handleCameraReady}
        onBarcodeScanned={isDisabled ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'ean13', 'code128'], 
        }}
      />
      <Overlay
        flashEnabled={flashEnabled}
        toggleFlash={toggleFlash}
        hasFlashPermission={true}
        onManualIdSubmit={isDisabled ? undefined : handleManualIdSubmit}
        cameraReady={cameraReady}
      />
      
      {isDisabled && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>جاري البحث عن الطلب...</Text>
        </View>
      )}
      
      {!cameraReady && !isDisabled && (
        <View style={styles.cameraInitOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>جاري تهيئة الكاميرا...</Text>
        </View>
      )}

      {/* Add the RestrictedAccessModal component */}
      <RestrictedAccessModal 
        visible={restrictedModalVisible}
        onClose={handleCloseRestrictedModal}
      />
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
  cameraInitOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2e752f',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2e752f',
    padding: 20,
  },
  permissionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#F52525',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});