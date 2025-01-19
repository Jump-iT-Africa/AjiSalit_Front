import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import CustomButton from "@/components/CustomButton";
import AppGradient from "@/components/AppGradient";
import Logo from "@/assets/images/semiLogo.png";
import { useToast } from "react-native-toast-notifications";

const OTP_LENGTH = 6; 

const OtpVerification: React.FC = () => {
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast()
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [otpValues, setOtpValues] = useState<string[]>(Array(OTP_LENGTH).fill(''));

  const handleOtpChange = (text: string, index: number) => {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = text;
    setOtpValues(newOtpValues);

    if (text && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    if (!otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newOtpValues = [...otpValues];
      newOtpValues[index - 1] = '';
      setOtpValues(newOtpValues);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    const otp = otpValues.join('');
    if (otp.length !== OTP_LENGTH) {
        toast.show("حاول دخل الرمز كامل", {
            type: "danger", 
            placement: "top", 
          });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/user/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp, phoneNumber }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.show(`تم أتحقق بنجاح`, {
            type: "success", 
            placement: "top", 
          });
        router.push("/");
      } else {
        toast.show(`${result.message}`, {
            type: "success", 
            placement: "top", 
          });
        
      }
    } catch (error) {
        toast.show("وقع مشكل ، حول من بعد", {
            type: "danger", 
            placement: "top", 
          });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1">
      <AppGradient colors={["#170738", "#170738", "#7c12b4"]}>
      <View className="items-center mb-[-100px] mt-40">
            <ImageBackground
              source={Logo}
              resizeMode="cover"
              className="w-[150px] h-[80px]"
            />
          </View>
        <View className="flex-1 justify-center items-center px-4 py-6">
          <Text className="text-2xl text-white mb-8">أدخل رمز ألتحقق</Text>
          <Text className="text-white mb-4">تم إرسال الرمز إلى {phoneNumber}</Text>

          <View className="flex-row justify-between w-full px-4 mb-8">
            {Array(OTP_LENGTH).fill(0).map((_, index) => (
              <TextInput
                key={index}
                ref={(ref) => inputRefs.current[index] = ref}
                className="bg-white w-12 h-12 rounded-lg text-center text-xl mx-1"
                maxLength={1}
                keyboardType="numeric"
                value={otpValues[index]}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace') {
                    handleBackspace(index);
                  }
                }}
              />
            ))}
          </View>

          <CustomButton
            title={isLoading ? "جاري التحقق..." : "تحقق"}
            onPress={handleSubmit}
            disabled={isLoading}
            containerStyles={`px-20`}
          />

          <StatusBar style="light" />
        </View>
      </AppGradient>
    </View>
  );
};

export default OtpVerification;