import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import Logowhite from "@/assets/images/whiteLogo.png";
import ActionSheetComponent from "../ui/ActionSheet";
import CustomButton from "../ui/CustomButton";
import Colors from "@/constants/Colors";
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import FinishedButton from "./Buttons/FinishedButton";
import PickUpButton from "./Buttons/PickUpButton";

export default function DoneAndPickUp() {
  
  
  
  return (
    <View className="bg-gray-100 border-t border-gray-200 w-full py-5 pb-5 px-4">
      <View className="flex-row justify-between items-center space-x-2">
        <PickUpButton />
        
        <FinishedButton />
      </View>
    </View>
  );
}