// For userFormActionSheet.js
import { View, TextInput, Text } from "react-native";
import CustomButton from "../ui/CustomButton";
import Divider from "../ui/Devider";
import { useRef, useState } from "react";
import Color from "@/constants/Colors";
import ActionSheetComponent from "../ui/ActionSheet";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import { useDispatch, useSelector } from 'react-redux';
import { setRole } from '@/store/slices/RoleSlice';

export default function userFormActionSheet() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [city, setcity] = useState("");
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const actionSheetRef = useRef(null);

  const [errors, setErrors] = useState({ name: "" });

  const validateInputs = () => {
    let valid = true;

    let newErrors = {
      name: "",
      city: "",
    };

    if (!name.trim()) {
      newErrors.name = "الاسم و اللقب مطلوب";
      valid = false;
    }

    if (!city.trim()) {
      newErrors.city = "المدينة مطلوبة";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleCreateAccount = () => {
    if (validateInputs()) {
        dispatch(setRole('client'));
        setIsSheetVisible(true);
        actionSheetRef.current?.show();
        console.log("Creating account with:", { name, city, role: 'client' });
    }
  };
  

  return (
    <View className="flex p-4">
      <Text className="text-center text-[#F52525] text-xl font-bold mb-6 font-tajawal">
        أدخل معلوماتك الشخصية
      </Text>
      <Divider />

      <View className="mb-4 mt-4">
        <Text
          className="text-right text-gray-700 mb-2 font-tajawal"
          style={{ color: Color.green }}
        >
          الاسم و اللقب: <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          placeholder="أدخل الاسم و اللقب"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
          className={`border ${
            errors.name ? "border-red-500" : "border-[#2e752f]"
          } rounded-lg p-3 text-black text-right bg-white font-tajawalregular`}
        />
        {errors.name ? (
          <Text className="text-red-500 text-right mt-1 font-tajawalregular text-[13px]">
            {errors.name}
          </Text>
        ) : null}
      </View>

      <View className="mt-4 mb-6">
        <Text
          className="text-right text-gray-700 mb-2 font-tajawal"
          style={{ color: Color.green }}
        >
          المدينة :<Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          placeholder="أدخل المدينة"
          placeholderTextColor="#888"
          value={city}
          onChangeText={setcity}
          className={`border ${
            errors.city ? "border-red-500" : "border-[#2e752f]"
          } rounded-lg p-3 text-black text-right bg-white font-tajawalregular`}
        />
        {errors.city ? (
          <Text className="text-red-500 text-right mt-1 font-tajawalregular text-[13px]">
            {errors.city}
          </Text>
        ) : null}
      </View>
      <Divider />

      <View className="mt-6">
        <CustomButton
          title="إنشاء حساب جديد"
          onPress={handleCreateAccount}
          containerStyles="p-3 bg-[#2e752f] rounded-full"
          textStyles="text-white text-center font-tajawal text-[15px]"
        />
      </View>

      <ActionSheetComponent
        ref={actionSheetRef}
        containerStyle={{ backgroundColor: Colors.green }}
        contentStyle={{ backgroundColor: Colors.green }}
      >
        <View className="flex-1 items-center justify-center h-full ">
          <View>
            <AntDesign name="checkcircleo" size={190} color="white" />
          </View>
          <View>
            <Text className="text-center text-white text-6xl font-tajawal pt-7 mt-4">
              مبروك!
            </Text>
            <Text className="text-white text-lg font-bold text-center p-4 font-tajawalregular">
              تم إنشاء حسابك بنجاح.
            </Text>
          </View>
          <View className="w-full mt-20">
            <CustomButton
              onPress={() => {
                setIsSheetVisible(false);
                actionSheetRef.current?.hide();
                router.replace("(home)");
              }}
              title="انتقل للصفحة الرئيسية"
              textStyles="text-sm font-tajawal px-2 py-0 text-[#2e752f]"
              containerStyles="w-[90%] m-auto bg-white"
            />
          </View>
        </View>
      </ActionSheetComponent>
    </View>
  );
}