import { View, Text, Image, ImageBackground, SafeAreaView, StyleSheet } from "react-native";
import HeroImage from "@/assets/images/home.jpg";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import AppGradient from "@/components/ui/AppGradient";
import CustomButton from "@/components/ui/CustomButton";
import { Linking } from 'react-native';

const App = () => {
  const router = useRouter();

  return (
    <View className="flex-1">
      <ImageBackground source={HeroImage} resizeMode="cover" className="flex-1">
        <AppGradient colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.8)"]}>
          <SafeAreaView className="flex-1 mx-5 my-12 justify-between">
            <View className="mt-20">
              
            </View>
            <View>
              <CustomButton
                onPress={() => router.push("register")}
                title="باغي تسجل" textStyles="font-tajawal text-[14] "
              />
              <Text className="text-white text-center mt-3  font-tajawal font-[700]" 
              onPress={()=>router.push('login')}>
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
  text: {
    fontFamily: 'Tajawal'
  }
});

export default App;