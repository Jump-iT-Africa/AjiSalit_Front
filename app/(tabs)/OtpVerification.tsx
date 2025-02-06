import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { useToast } from "react-native-toast-notifications";
import RegisterBackImage from "@/assets/images/home.jpg";
import AppGradient from "../../components/ui/AppGradient";
import TooltipComponent from "@/components/ui/TooltipComponent";
import HeaderWithBack from "@/components/ui/HeaderWithToolTipAndback";

const OtpVerification: React.FC = () => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(6);
  const [otpText, setOtpText] = useState('تقدر تطلب كود جديد بعد ');
  const toast = useToast();


  const {phoneNumber} = useLocalSearchParams()
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  useEffect(()=>{
      if(timer === 0)
      {
        setOtpText('طلب كود جديد')
      }
    },[timer])

  const handleResendCode = () => {
    if (timer === 0) {
      setTimer(59);
      toast.show("تم ارسال الكود بنجاح✅", { type: "success" });
    }
  };

  useEffect(()=>{
    try{
      if(otp.length == 6)
        {
          //hna dir login dyal verification dyal app
          toast.show("تم التوتيق بنجاح ✅", { type: "success" });
          setTimeout(() => {
            router.push('/CreatePIN')
          }, 2000);
        }
    }catch(err)
    {
      console.log(err);
      throw err;
    }
  }, [otp])

  return (
  
      <View className="flex-1">
        <ImageBackground
          source={RegisterBackImage}
          resizeMode="cover"
          className="flex-1"
        >
          <AppGradient colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.0)"]}>
            <SafeAreaView className="flex-1">
              {/* Header */}
              <HeaderWithBack 
                        tooltipVisible={tooltipVisible} 
                        setTooltipVisible={setTooltipVisible} 
                        content="فهاد الصفحة غادي تزيد الرقم الي وصلك عبر رسالة نصية✉️"
                        onPress={()=>router.back()}
                        /> 
              <View className="flex-1 items-center mt-0 justify-center -pt-44">
                <Text className="text-white text-xl mb-4 pt-1 font-tajawal">
                  أدخل رمز التأكيد الذي أُرسل إلى
                </Text>
                <Text className="text-white text-lg mb-6 -mt-3 font-tajawal">
                  {phoneNumber}
                </Text>

                <View className="w-[90%]">
                  <TextInput
                    value={otp}
                    onChangeText={(text) => setOtp(text.slice(0, 6))}
                    keyboardType="phone-pad"
                    maxLength={6}
                    className="opacity-0 absolute w-full h-10 z-10"
                    autoFocus
                  />
                  {/* Timer */}
                  <TouchableOpacity
                    onPress={handleResendCode}
                    disabled={timer > 0}
                  >
                    <Text className="text-white/70 text-center mt-[-20]  mb-2 font-tajawal">
                    {otpText} {timer == 0 ? '' : timer < 10 ? `00:0${timer}` : `00:${timer}`}
                    </Text>
                  </TouchableOpacity>
                  {/* OTP Display */}
                  <View className="flex-row justify-center items-center bg-[#ffffff5f] rounded-full px-2 py-4">
                    {[...Array(6)].map((_, index) => (
                      <View key={index} className="w-8 mx-1 items-center">
                        <Text className="text-white text-xl font-medium">
                          {otp[index] || "-"}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </AppGradient>
        </ImageBackground>
        <StatusBar style="light" />
      </View>
  );
};

export default OtpVerification;