import { View, Text, Image, ImageBackground, SafeAreaView, StyleSheet } from "react-native";
import HeroImage from "@/assets/images/register1.jpg";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import AppGradient from "@/components/ui/AppGradient";
import CustomButton from "@/components/ui/CustomButton";
import { useNotification } from "@/context/NotificationContext";
import { useEffect } from "react";

const App = () => {
  const router = useRouter();
  const { notification } = useNotification();

  useEffect(() => {
    if (notification) {
      // alert("You received a notification!");
    }
  }, [notification]);
  
  return (
    <View className="flex-1">
      <ImageBackground source={HeroImage} resizeMode="cover" className="flex-1">
        <AppGradient colors={["rgba(0,0,0,0.0)", "#25000B"]}>
          <SafeAreaView className="flex-1 mx-5 my-12 justify-between">
            <View className="flex-1" />
            
            <View className="mb-8">
              <CustomButton
                onPress={() => router.push("register")}
                title="باغي تسجل" 
                textStyles="font-tajawal text-[14]"
              />
              <Text 
                className="text-white text-center mt-3 font-[700] text-tajawal" 
                onPress={() => router.push('register')}  
                style={styles.textConfig}
              >
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

const styles = StyleSheet.create({
  textConfig: {
    fontFamily: 'TajawalRegular',
  }
});

export default App;