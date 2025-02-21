import React, { useState, useRef } from 'react';
import { View, TextInput, Text, KeyboardAvoidingView, Animated, Platform } from 'react-native';
import CustomButton from '../ui/CustomButton';
import Divider from '../ui/Devider';
import Color from '@/constants/Colors';
import ActionSheetComponent from '@/components/ui/ActionSheet';
import { ActionSheetRef } from 'react-native-actions-sheet';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import SuccessActionSheetComponent from '../ui/SuccessActionSheet';
import Colors from '@/constants/Colors';

export default function CombinedCompanyForm() {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        taxID: '',
        fieldOfCompany: '',
        referralCode: ''
    });
    
    const [errors, setErrors] = useState({
        name: '',
        taxID: '',
        fieldOfCompany: ''
    });

    const [step, setStep] = useState(1);
    const [isSheetVisible, setIsSheetVisible] = useState(false);
    const actionSheetRef = useRef(null);
    
    
    const step1Animation = useRef(new Animated.Value(1)).current;
    const step2Animation = useRef(new Animated.Value(0)).current;

    const animateToNextStep = () => {
        
        Animated.parallel([
            Animated.timing(step1Animation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(step2Animation, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setStep(2);
        });
    };

    const animateToPreviousStep = () => {
        
        Animated.parallel([
            Animated.timing(step1Animation, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(step2Animation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setStep(1);
        });
    };

    const validateStep1 = () => {
        let valid = true;
        let newErrors = { ...errors };

        if (!formData.name.trim()) {
            newErrors.name = 'الاسم و اللقب مطلوب';
            valid = false;
        } else {
            newErrors.name = '';
        }

        setErrors(newErrors);
        return valid;
    };

    const validateStep2 = () => {
        let valid = true;
        let newErrors = { ...errors };

        if (!formData.taxID.trim()) {
            newErrors.taxID = 'معرف الضريبة مطلوب';
            valid = false;
        }
        if (!formData.fieldOfCompany.trim()) {
            newErrors.fieldOfCompany = 'مجال الشركة مطلوب';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = () => {
        if (validateStep2()) {
            setIsSheetVisible(true);
            actionSheetRef.current?.show();
        }
    };

    const Step1Form = (
        <Animated.View
            style={{
                opacity: step1Animation,
                transform: [{
                    translateX: step1Animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-300, 0],
                    }),
                }],
                position: 'absolute',
                width: '100%',
            }}
        >
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
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
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
                    value={formData.address}
                    onChangeText={(text) => setFormData({ ...formData, address: text })}
                    className="border border-[#2e752f] rounded-lg p-3 text-black text-right bg-white font-tajawalregular"
                />
            </View>
            
            <Divider />

            <View className="mt-6">
                <CustomButton
                    title="التالي"
                    onPress={() => {
                        if (validateStep1()) {
                            animateToNextStep();
                        }
                    }}
                    containerStyles="p-3 bg-[#2e752f] rounded-full"
                    textStyles="text-white text-center font-tajawal text-[15px]"
                />
            </View>
        </Animated.View>
    );

    const Step2Form = (
        <Animated.View
            style={{
                opacity: step2Animation,
                transform: [{
                    translateX: step2Animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [300, 0],
                    }),
                }],
                position: 'absolute',
                width: '100%',
            }}
        >
            <Text className="text-center text-[#F52525] text-xl font-bold mb-6 font-tajawal">
                أدخل تفاصيل الشركة
            </Text>
            <Divider />
            
            <View className="mt-4 mb-6">
                <Text className="text-right text-gray-700 mb-2 font-tajawal" style={{ color: Color.green }}>
                    مجال الشركة: <Text className="text-red-600">*</Text>
                </Text>
                <TextInput
                    placeholder="أدخل مجال الشركة"
                    placeholderTextColor="#888"
                    value={formData.fieldOfCompany}
                    onChangeText={(text) => setFormData({ ...formData, fieldOfCompany: text })}
                    className={`border ${errors.fieldOfCompany ? 'border-red-500' : 'border-[#2e752f]'} rounded-lg p-3 text-black text-right bg-white font-tajawalregular`}
                />
                {errors.fieldOfCompany ? <Text className="text-red-500 text-right mt-1 font-tajawalregular text-[13px]">{errors.fieldOfCompany}</Text> : null}
            </View>

            <View className="mb-4 mt-4">
                <Text className="text-right text-gray-700 mb-2 font-tajawal" style={{ color: Color.green }}>
                    معرف الضريبة: <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                    placeholder="أدخل معرف الضريبة"
                    placeholderTextColor="#888"
                    value={formData.taxID}
                    onChangeText={(text) => setFormData({ ...formData, taxID: text })}
                    className={`border ${errors.taxID ? 'border-red-500' : 'border-[#2e752f]'} rounded-lg p-3 text-black text-right bg-white font-tajawalregular`}
                />
                {errors.taxID ? <Text className="text-red-500 text-right mt-1 font-tajawalregular text-[13px]">{errors.taxID}</Text> : null}
            </View>

            <View className="mt-4 mb-6">
                <Text className="text-right text-gray-700 mb-2 font-tajawal" style={{ color: Color.green }}>
                    كود الإحالة (اختياري):
                </Text>
                <TextInput
                    placeholder="أدخل كود الإحالة (إذا كان متوفر)"
                    placeholderTextColor="#888"
                    value={formData.referralCode}
                    onChangeText={(text) => setFormData({ ...formData, referralCode: text })}
                    className="border border-[#2e752f] rounded-lg p-3 text-black text-right bg-white font-tajawalregular"
                />
            </View>

            <Divider />

            <View className="mt-6 flex-row justify-between gap">
                <CustomButton
                    title="رجوع"
                    onPress={animateToPreviousStep}
                    containerStyles="p-3 bg-gray-500 rounded-full w-2/4 mr-2"
                    textStyles="text-white text-center font-tajawal text-[15px]"
                />
                <CustomButton
                    title="إنشاء حساب"
                    onPress={handleSubmit}
                    containerStyles="p-3 bg-[#2e752f] rounded-full w-2/4"
                    textStyles="text-white text-center font-tajawal text-[15px]"
                />
            </View>
        </Animated.View>
    );

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className={`flex p-4 ${isSheetVisible ? "opacity-50" : "bg-white"}`}
            style={{ minHeight: 500 }} 
        >
            <ActionSheetComponent ref={actionSheetRef}

            containerStyle={{backgroundColor:Colors.green}}
            contentStyle={{backgroundColor:Colors.green}}
            >
                <View className="flex-1 items-center justify-center h-full ">
                    <View>
                        <AntDesign name="checkcircleo" size={190} color="white" />
                    </View>
                    <View>
                        <Text className="text-center text-white text-6xl font-tajawal pt-7 mt-4">مبروك!</Text>
                        <Text className="text-white text-lg font-bold text-center p-4 font-tajawalregular">
                            تم إنشاء حسابك بنجاح.
                        </Text>
                    </View>
                    <View className="w-full mt-20">
                        <CustomButton 
                            onPress={() => {
                                setIsSheetVisible(false)
                                actionSheetRef.current?.hide();
                                router.replace('(home)')
                            }} 
                            title="انتقل للصفحة الرئيسية"
                            textStyles="text-sm font-tajawal px-2 py-0 text-[#2e752f]"  
                            containerStyles="w-[90%] m-auto bg-white"
                        />
                    </View>
                </View>
            </ActionSheetComponent>
           
                    <View style={{ position: 'relative', height: 500 }}>
                {Step1Form}
                {Step2Form}
            </View>
        </KeyboardAvoidingView>
    );
}