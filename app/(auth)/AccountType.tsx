import AppGradient from "@/components/ui/AppGradient";
import { View, Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Color from "@/constants/Colors";
import HeaderWithBack from "@/components/ui/HeaderWithToolTipAndback";
import Whitelogo from "@/assets/images/whiteLogo.png";
import CustomButton from "@/components/ui/CustomButton";
import PersonalInfoScreen from "@/components/ui/PersonalInfoScreen";
import { useDispatch } from 'react-redux';
import { setRole } from "@/store/slices/userSlice";
import React, { useState, useRef, useEffect } from "react";
import BottomSheetComponent from "@/components/ui/BottomSheetComponent";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function AccountnType() {
    const router = useRouter();
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const bottomSheetRef = useRef(null);
    const [selectedAccountType, setSelectedAccountType] = useState('');
    const dispatch = useDispatch();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleInputFocus = (focused) => {
        setIsExpanded(focused);
    };
    
    const handleSheetClose = () => {
        setIsExpanded(false);
    };

    const handleBack = () => {
        setTimeout(() => {
            router.back();
        }, 100);
    };

    const handleAccountTypeSelect = (type: string) => {
        bottomSheetRef.current?.hide();
        setSelectedAccountType(type);
        setIsExpanded(false);
        setTimeout(() => {
            bottomSheetRef.current?.show();
        }, 300);
    };

    useEffect(() => {
        try {
            if (selectedAccountType === "شخص عادي") {
                dispatch(setRole('client'));
            } else {
                dispatch(setRole('company'));
            }
        } catch (e) {
            console.log(e);
        }
    }, [selectedAccountType]);

    return (
    <GestureHandlerRootView style={{ flex: 1 }}>
         <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <AppGradient colors={[Color.red, Color.red]} className="flex-1">
                <TouchableOpacity onPress={handleBack}>
                    <HeaderWithBack
                        onPress={() => router.back()}
                        tooltipVisible={tooltipVisible}
                        setTooltipVisible={setTooltipVisible}
                        content="فهاد الصفحة غدي تختار واش نتا شركة ولا شخص عادي"
                    />
                </TouchableOpacity>
                
                <View style={{
                    flex: 1,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginTop: hp('30%')
                }}>
                    <Image
                        source={Whitelogo}
                        resizeMode="contain"
                        style={{
                            width: wp('40%'),
                            height: hp('20%'),
                            marginBottom: hp('6%')
                        }}
                    />
                    <Text className="text-white font-tajawal text-center mb-2 text-xl px-10">
                        واش نتا شركة ولا شخص عادي؟
                    </Text>
                    <Text className="font-tajawalregular font-thin color-white">
                        تقدر تبدل الوضعية من بعد.
                    </Text>
                </View>
                
                <View style={{ paddingHorizontal: wp('10%') }}>
                    <CustomButton
                        onPress={() => handleAccountTypeSelect('شركة')}
                        title={"شركة"}
                        containerStyles="bg-[#2e752f]"
                        textStyles="text-white font-tajawal text-[15px] pt-0"
                    />
                    <CustomButton
                        onPress={() => handleAccountTypeSelect('شخص عادي')}
                        title={"شخص عادي"}
                        containerStyles="bg-white mt-4"
                        textStyles="text-[#2e752f] font-tajawal text-[15px] pt-0 bg-white"
                    />
                </View>
                <BottomSheetComponent
                    ref={bottomSheetRef}
                    containerStyle={{
                        backgroundColor: "white",
                    }}
                    contentStyle={{
                        backgroundColor: "white",
                        padding: 0
                    }}
                    gestureEnabled={true}
                    customHeight="58%" 
                    closeOnTouchBackdrop={true}
                    closeOnPressBack={true}
                    scrollable={true}
                >
                    <PersonalInfoScreen
                        accountType={selectedAccountType}
                        onInputFocus={() => {}}
                    />
                </BottomSheetComponent>
            </AppGradient>
        </KeyboardAvoidingView>
    </GestureHandlerRootView>
    );
}