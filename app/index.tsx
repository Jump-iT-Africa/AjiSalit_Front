import { View, Text, Image, ImageBackground, SafeAreaView } from "react-native";
import HeroImage from "../assets/images/home.jpg";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import AppGradient from "@/components/AppGradient";
import CustomButton from "@/components/CustomButton";
import { Linking } from 'react-native'; // Import Linking

const App = () => {
  const router = useRouter();
  

  return (
    <View className="flex-1">
      <ImageBackground source={HeroImage} resizeMode="cover" className="flex-1">
        <AppGradient colors={["rgba(0,0,0,0.5), rgba(0,0,0,0.8)"]}>
          <SafeAreaView className="flex-1 mx-5 my-12 justify-between">
            <View className="mt-20">
              <Text className="text-white text-center text-4xl font-bold">
                أجي راه سليت
              </Text>
              <Text className="text-white mx-8 text-center mt-4">
                آجي ساليت هو تطبيق مبتكر يهدف إلى تسهيل الحياة اليومية من خلال
                تقديم خدمات مميزة تساعد المستخدمين على إدارة احتياجاتهم بكفاءة
                وسهولة. 🌟
              </Text>
            </View>
            <View>
              <CustomButton
                onPress={() => router.push("register")}
                title="تسجيل دخول"
              />
              <Text className="text-white text-center mt-3 underline" onPress={()=>router.push('login')}>
              عندي حساب مسبق
              </Text>
            </View>
          </SafeAreaView>
          <StatusBar style="light" />
        </AppGradient>
      </ImageBackground>
    </View>
  );
};

export default App;
