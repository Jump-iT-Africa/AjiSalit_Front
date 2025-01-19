import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from 'expo-router'; 
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import AppGradient from "@/components/AppGradient";
import CustomButton from "@/components/CustomButton";
import Logo from "@/assets/images/semiLogo.png";
import { useToast } from "react-native-toast-notifications";

type RoleType = "client" | "company" | "";

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("+212");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<RoleType>("");
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);
  const toast = useToast();


  const handlePhoneChange = (text: string): void => {
    if (text.startsWith("+212")) {
      setPhoneNumber(text);
    } else {
      setPhoneNumber("+212");
    }
  };

  const togglePasswordVisibility = (): void => {
    setPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!username || !phoneNumber || !password || !role) {
        toast.show("حول تعمر كل المعلومات المطلوبة!", {
            type: "danger", 
            placement: "top", 
          });
      return;
    }

    const data = {
      name: username,
      password,
      phoneNumber,
      role,
    };

    try {
      const response = await fetch("http://localhost:3000/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.show(`غادي نرسلو ليك رمز تحقق على  ${phoneNumber}`, {
            type: "green", 
            placement: "top", 
          });
        setTimeout(() => {
            router.push({
                pathname: "/OtpVerification",
                params: { phoneNumber }
              });
        }, 3000);
        console.log(`otp has been sent to ${phoneNumber}`);
      } else {
        toast.show(`${result.message}`, {
            type: "danger", 
            placement: "top", 
          });
      }
    } catch (error) {
        toast.show("وقع مشكل ، حول من بعد", {
            type: "danger", 
            placement: "top", 
          });
      
    }
  };
  return (
    <View className="flex-1">
      <AppGradient colors={["#170738", "#170738", "#7c12b4"]}>
        <View className="flex-1 justify-between">
          {/* Header */}
          <Text className="text-2xl text-white mr-4 mt-4 text-right">
            تسجيل الدخول
          </Text>

          {/* Logo */}
          <View className="items-center my-8">
            <ImageBackground
              source={Logo}
              resizeMode="cover"
              className="w-[150px] h-[70px]"
            />
          </View>

          {/* Form */}
          <View className="px-4 py-6">
            <Text className="text-white mb-2 text-right">اسم المستخدم</Text>
            <TextInput
              className="bg-white rounded px-3 py-4 mb-4"
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
            />

            <Text className="text-white mb-2 text-right">رقم الهاتف</Text>
            <TextInput
              className="bg-white rounded px-3 py-4 mb-4"
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={handlePhoneChange}
            />

            <Text className="text-white mb-2 text-right">كلمة المرور</Text>
            <View className="bg-white rounded px-3 py-4 mb-4 flex-row items-center">
              <TextInput
                className="flex-1"
                placeholder="Enter your password"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Ionicons
                  name={isPasswordVisible ? "eye-off" : "eye"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>

            <Text className="text-white mb-2 text-right">الدور</Text>
            <View className="bg-white rounded mb-4">
              <Picker
                selectedValue={role}
                onValueChange={(itemValue) =>
                  setRole(itemValue as RoleType)
                } // Cast value as RoleType
              >
                <Picker.Item label="اختر دورك" value="" />
                <Picker.Item label="مستخدم" value="client" />
                <Picker.Item label="مشرف" value="company" />
              </Picker>
            </View>

            <CustomButton title="تسجيل" onPress={handleSubmit} />
          </View>
        </View>
      </AppGradient>
      <StatusBar style="light" />
    </View>
  );
};

export default Register;
