import { View, TextInput, Text, Animated } from "react-native";
import CustomButton from "../ui/CustomButton";
import Divider from "../ui/Devider";
import { useState } from "react";
import Color from "@/constants/Colors";


export default function CompanyFormActionSheet({ goToNextStep }: { goToNextStep: () => void }) {
    const [name, setName] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [errors, setErrors] = useState({ name: '' });

    const validateInputs = () => {
        let valid = true;
        let newErrors = { name: '' };

        if (!name.trim()) {
            newErrors.name = 'الاسم و اللقب مطلوب';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleNext = () => {
        if (validateInputs()) {
            goToNextStep();
        }
    };

    return (
        <Animated.View className="flex p-4">
            <Text className="text-center text-[#F52525] text-xl font-bold mb-6 font-tajawal">
                أدخل معلوماتك الشخصية
            </Text>

            <Divider />
            
            <View className="mb-4 mt-4">
                <Text className="text-right text-gray-700 mb-2 font-tajawal" style={{ color: Color.green }}>
                    الاسم و اللقب: <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                    placeholder="أدخل الاسم و اللقب"
                    placeholderTextColor="#888"
                    value={name}
                    onChangeText={setName}
                    className={`border ${errors.name ? 'border-red-500' : 'border-[#2e752f]'} rounded-lg p-3 text-black text-right bg-white font-tajawalregular`}
                />
                {errors.name ? <Text className="text-red-500 text-right mt-1 font-tajawalregular text-[13px]">{errors.name}</Text> : null}
            </View>

            <View className="mt-4 mb-6">
                <Text className="text-right text-gray-700 mb-2 font-tajawal" style={{ color: Color.green }}>
                    العنوان و المدينة (الموقع):
                </Text>
                <TextInput
                    placeholder="أدخل العنوان، المدينة"
                    placeholderTextColor="#888"
                    value={referralCode}
                    onChangeText={setReferralCode}
                    className="border border-[#2e752f] rounded-lg p-3 text-black text-right bg-white font-tajawalregular"
                />
            </View>
            <Divider />

            <View className="mt-6">
                <CustomButton
                    title="التالي"
                    onPress={handleNext}
                    containerStyles="p-3 bg-[#2e752f] rounded-full"
                    textStyles="text-white text-center font-tajawal text-[15px]"
                />
            </View>
        </Animated.View>
    );
}
