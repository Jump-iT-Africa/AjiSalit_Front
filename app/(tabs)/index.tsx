import React, { useEffect } from "react";
import { View, Text, ImageBackground, SafeAreaView, StyleSheet } from "react-native";
import HeroImage from "@/assets/images/home.jpg";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import AppGradient from "@/components/ui/AppGradient";
import CustomButton from "@/components/ui/CustomButton";
import { useNotification } from "@/context/NotificationContext";

const App = () => {
  const router = useRouter();
  const { notification } = useNotification();

  useEffect(() => {
    if (notification) {
      alert("You received a notification!");
    }
  }, [notification]);

  return (
    <View className="flex-1">
      <ImageBackground source={HeroImage} resizeMode="cover" className="flex-1">
        <AppGradient colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.8)"]}>
          <SafeAreaView className="flex-1 mx-5 my-12 justify-between">
            <View className="mt-20">
              {notification && <Text className="text-white">New Notification Received!</Text>}
            </View>
            <View>
              <CustomButton onPress={() => router.push("register")} title="باغي تسجل" textStyles="font-tajawal text-[14]" />
              <Text className="text-white text-center mt-3 font-tajawal font-[700]" onPress={() => router.push("login")}>
                عندي حساب
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
