import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import CustomButton from './CustomButton';
import Color from '@/constants/Colors';
import Divider from "@/components/Devider"; 

export default function PersonalInfoScreen(accountType: any) {
    console.log(accountType);

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

    const handleCreateAccount = () => {
        if (validateInputs()) {
            //code hna back dir account creation
            console.log('Creating account with:', { name, referralCode });
        }
    };

    return (
        <View className="flex p-4">
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
                    كود الإحالة (اختياري):
                </Text>
                <TextInput
                    placeholder="أدخل كود الإحالة (إذا كان متوفر)"
                    placeholderTextColor="#888"
                    value={referralCode}
                    onChangeText={setReferralCode}
                    className="border border-[#2e752f] rounded-lg p-3 text-black text-right bg-white font-tajawalregular"
                />
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
        </View>
    );
}
