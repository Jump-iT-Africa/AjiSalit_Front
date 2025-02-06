import { View, TextInput, Text, KeyboardAvoidingView, Platform } from "react-native";
import CustomButton from "../ui/CustomButton";
import Divider from "../ui/Devider";
import { useState, useRef } from "react";
import Color from "@/constants/Colors";
import ActionSheetComponent from "@/components/ui/ActionSheet";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function CompanyDetailsForm({ goToPreviousStep }: { goToPreviousStep: () => void }) {
    const [taxID, setTaxID] = useState('');
    const [fieldOfCompany, setFieldOfCompany] = useState('');
    const [errors, setErrors] = useState({ taxID: '', fieldOfCompany: '' });
    const [referralCode, setReferralCode] = useState('');
    const [dataSaved, setDataSaved] = useState(false);
    const [isSheetVisible, setIsSheetVisible] = useState(false); // ✅ Track sheet visibility

    const actionSheetRef = useRef<ActionSheetRef>(null);

    const validateInputs = () => {
        let valid = true;
        let newErrors = { taxID: "", fieldOfCompany: "" };

        if (!taxID.trim()) {
            newErrors.taxID = "معرف الضريبة مطلوب";
            valid = false;
        }

        if (!fieldOfCompany.trim()) {
            newErrors.fieldOfCompany = "مجال الشركة مطلوب";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = () => {
        try {
            if (validateInputs()) {
                console.log("Submitting company details:", { taxID, fieldOfCompany });
                setDataSaved(true);
                setTimeout(() => {
                    setIsSheetVisible(true); // ✅ Set sheet visibility state
                    actionSheetRef.current?.show();
                }, 300);
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            className={`flex p-4 ${isSheetVisible ? "bg-black opacity-50" : "bg-white"}`} // ✅ Dim background when ActionSheet is visible
        >
            <ActionSheetComponent ref={actionSheetRef} >
                <View className="flex-1 items-center justify-center h-full ">
                    <View>
                        <AntDesign name="checkcircleo" size={190} color="white" />
                    </View>
                    <View>
                        <Text className="text-center text-white text-6xl font-tajawal pt-7 mt-4">مبروك!</Text>
                        <Text className="text-white text-lg font-bold text-center p-4 font-tajawalregular">تم إنشاء حسابك بنجاح.</Text>
                    </View>
                    <View className=" w-full mt-20">
                        <CustomButton 
                            onPress={() => {
                                setIsSheetVisible(false); // ✅ Reset background when closing
                                actionSheetRef.current?.hide();
                            }} 
                            title={"انتقل للصفحة الرئيسية"} 
                            textStyles="text-sm font-tajawal px-2 py-0 text-[#2e752f]"  
                            containerStyles="w-[90%] m-auto bg-white"
                        />
                    </View>
                </View>
            </ActionSheetComponent>

            {!dataSaved ? (
                <>
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
                            value={fieldOfCompany}
                            onChangeText={setFieldOfCompany}
                            className={`border ${errors.fieldOfCompany ? 'border-red-500' : 'border-[#2e752f]'} rounded-lg p-3 text-black text-right bg-white font-tajawalregular`}
                        />
                        {errors.fieldOfCompany ? <Text className="text-red-500 text-right mt-1 font-tajawalregular text-[13px]">{errors.fieldOfCompany}</Text> : null}
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
                    <View className="mb-4 mt-4">
                        <Text className="text-right text-gray-700 mb-2 font-tajawal" style={{ color: Color.green }}>
                            معرف الضريبة: <Text className="text-red-500">*</Text>
                        </Text>
                        <TextInput
                            placeholder="أدخل معرف الضريبة"
                            placeholderTextColor="#888"
                            value={taxID}
                            onChangeText={setTaxID}
                            className={`border ${errors.taxID ? 'border-red-500' : 'border-[#2e752f]'} rounded-lg p-3 text-black text-right bg-white font-tajawalregular`}
                        />
                        {errors.taxID ? <Text className="text-red-500 text-right mt-1 font-tajawalregular text-[13px]">{errors.taxID}</Text> : null}
                    </View>

                    <Divider />

                    <View className="mt-6 flex-row justify-between">
                        <CustomButton
                            title="رجوع"
                            onPress={goToPreviousStep}
                            containerStyles="p-3 bg-gray-500 rounded-full w-1/3"
                            textStyles="text-white text-center font-tajawal text-[15px]"
                        />
                        <CustomButton
                            title="إنشاء حساب"
                            onPress={handleSubmit}
                            containerStyles="p-3 bg-[#2e752f] rounded-full w-1/3"
                            textStyles="text-white text-center font-tajawal text-[15px]"
                        />
                    </View>
                </>
            ) : null}
        </KeyboardAvoidingView>
    );
}
